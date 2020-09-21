import uuid, random
import time
import game.constants as constants
from chess.game import InvalidMoveError
from chess.game import Game as ChessEngine
from chess.piece import Position
from chess.constants import WHITE, BLACK, IN_PROGRESS
from channels.layers import get_channel_layer
from core.models import User, GameInvite, Game, Player, Move
from channels.db import database_sync_to_async
from channels.auth import login
from channels.consumer import get_handler_name
from channels.generic.websocket import JsonWebsocketConsumer
from asgiref.sync import async_to_sync


def get_random_colour():
    """Helper method returns random WHITE, or BLACK values"""
    if random.randint(0, 1):
        return WHITE
    return BLACK

def parse_move(move_json):
    """Parse JSON move and return as Position objects"""
    from_position = Position(move_json[constants.MOVE_FROM][0], move_json[constants.MOVE_FROM][1])
    to_position = Position(move_json[constants.MOVE_TO][0], move_json[constants.MOVE_TO][1])
    return (from_position, to_position)


USER_ID_PARAM = 'user_id'


class GameConsumer(JsonWebsocketConsumer):

    def connect(self):
        """Connect to to websocket, Create a Game instance in the db, 
        and a channel group for the game"""
        


        user_id = self.scope['url_route']['kwargs'][USER_ID_PARAM]
        game_id = self.scope['url_route']['kwargs'][constants.GAME_ID_PARAM]
        self.group_name = f"game_{game_id}"
        print(self.group_name)

        try: 
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            print("Error no user mathing query")
            self.disconnect()

        self.accept()
        
        async_to_sync(login)(self.scope, user)
        self.scope["session"].save()

        async_to_sync(self.channel_layer.group_add)(
            self.group_name,
            self.channel_name
        )
        
        try:
            self.game_model = Game.objects.get(id=game_id)
            opponent = Player.objects.get(game=self.game_model)
            self.colour = not opponent.colour
        except Game.DoesNotExist:
            self.game_model = Game.objects.create(id=game_id, status=IN_PROGRESS)
            self.colour = get_random_colour()

        new_player = Player(
            user=self.scope['user'],
            game=self.game_model,
            colour=self.colour,
            winner=False
        )
        new_player.save()

        if len(self.channel_layer.groups[self.group_name]) is 2:
            print("game starting")
            self.game_model.started = True
            self.game_model.save()
            self.get_opponent_channel() 
            async_to_sync(self.channel_layer.send)(
                self.opponent_channel, {
                    constants.MESSAGE_TYPE: constants.MESSAGE_SET_UP,
                    constants.USER: self.scope['user'],
                    constants.CHANNEL_NAME: self.channel_name,
                } 
            )
            async_to_sync(self.channel_layer.group_send)(
                self.group_name, {
                    constants.GROUP_MESSAGE_TYPE: constants.GROUP_MESSAGE_START_GAME
                }
            )
    
    def get_opponent_channel(self):
        """Get the opponents channel name for send data without group_send"""
        for channel in self.channel_layer.groups[self.group_name].keys():
            if channel != self.channel_name:
                self.opponent_channel = channel

    def disconnect(self, close_code):
        """Remove the group, and remove invite from DB, upload game to DB"""
        async_to_sync(self.channel_layer.group_discard)(self.group_name, self.channel_name)
        if not self.game_model.started:
            self.game_model.delete()

    def receive_json(self, content):
        """receive json from the client"""
        message_type = content.get(constants.CLIENT_MESSAGE_TYPE, None)

        if not message_type:
            raise ValueError("could not retrieve type of message")
        print(content)
        if message_type == constants.CLIENT_MESSAGE_PLAYER_MOVE:
            move_values = content[constants.MOVE]
            move_from, move_to = parse_move(move_values)
            try: 
                self.game.player_move(move_from, move_to, colour=self.colour)
            except InvalidMoveError as ex:
                self.send_json({
                    constants.CLIENT_MESSAGE_TYPE: constants.ERROR,
                    constants.ERROR_MSG: ex.msg,
                    constants.MY_TURN: self.game.turn is self.colour
                })
            else:
                Move.objects.save_move(self.game.history[-1], self.game_model)
                self.send_json({
                    constants.CLIENT_MESSAGE_TYPE: constants.CLIENT_MESSAGE_END_TURN,
                    constants.DID_SUCCEED: True
                })
                async_to_sync(self.channel_layer.send)(self.opponent_channel, {
                    constants.MESSAGE_TYPE: constants.MESSAGE_OPPONENT_MOVE_SEND,
                    constants.MOVE: move_values
                })

        elif message_type == constants.CLIENT_MESSAGE_RESIGN:
            self.game_model.status = constants.RESIGNED
            self.game_model.resigned_colour = self.colour
            self.game_model.save()
            async_to_sync(self.channel_layer.group_send)(self.group_name, {
                constants.GROUP_MESSAGE_TYPE: constants.GROUP_MESSAGE_END_GAME,
                constants.DID_RESIGN: True
            })
        elif message_type == constants.CLIENT_MESSAGE_CHAT:
            async_to_sync(self.channel_layer.group_send)(self.group_name, {
                constants.GROUP_MESSAGE_TYPE: constants.GROUP_MESSAGE_CHAT_MESSAGE,
                constants.CONTENT: content[constants.CONTENT],
                constants.SENDER: str(self.scope['user'])
            })
        else:
            self.send_json({
                constants.CLIENT_MESSAGE_TYPE: constants.CLIENT_MESSAGE_ERROR,
                constants.ERROR_MSG: 'invalid message type provided.'
            })

    def group_chat_message(self, content):
        """Handler for chat messages"""
        self.send_json({
            constants.TYPE: constants.CLIENT_MESSAGE_CHAT,
            constants.CONTENT: content[constants.CONTENT],
            constants.SENDER: content[constants.SENDER]
        }) 

    def group_end_game(self, content):
        """Handler for end of game events"""
        self.send_json({
            constants.CLIENT_MESSAGE_TYPE: constants.CLIENT_MESSAGE_END_GAME,
            constants.DID_RESIGN: content[constants.DID_RESIGN],
            constants.GAME_STATUS: self.game.status
        })
        self.disconnect(0)

    def group_start_game(self, content):
        """Start the game"""
        self.game = ChessEngine()
        self.send_json({
            constants.CLIENT_MESSAGE_TYPE: constants.CLIENT_MESSAGE_START_GAME,
            constants.COLOUR: self.colour,
            constants.BOARD: self.game.board.format_board()
        })
        if self.colour is self.game.turn:
            self.send_json({
                constants.CLIENT_MESSAGE_TYPE: constants.CLIENT_MESSAGE_START_TURN,
                constants.VALID_MOVES: self.game.format_moves()
            })


    def message_opponent_move(self, content):
        """Handler for opponent moves"""
        move = content.get(constants.MOVE, None)
        move_from, move_to = parse_move(move)

        # should never fail if everything works correctly
        self.game.player_move(move_from, move_to) 

        if self.game.status != IN_PROGRESS:
            self.game_model.refresh_from_db()
            self.game_model.status = self.game.status
            self.game_model.save()
            async_to_sync(self.channel_layer.group_send)(self.group_name, {
                constants.GROUP_MESSAGE_TYPE: constants.GROUP_MESSAGE_END_GAME,
                constants.DID_RESIGN: False
            })
        
        self.send_json({
            constants.CLIENT_MESSAGE_TYPE: constants.CLIENT_MESSAGE_OPPONENT_MOVE,
            constants.MOVE: move
        })
        self.send_json({
                constants.CLIENT_MESSAGE_TYPE: constants.CLIENT_MESSAGE_START_TURN,
                constants.VALID_MOVES: self.game.format_moves()
            })

    def message_set_up(self, content):
        """set up the game"""
        self.opponent_channel = content[constants.CHANNEL_NAME]
        self.opponent = content[constants.USER] 