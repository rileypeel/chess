import uuid, random, threading, time, decimal
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.conf import settings
import chess.constants
import core.constants as constants
import game.constants as consumer_cts
import chess.piece
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync


def send(channel_name, message_type, game_id=None, model_id=None):
    """
    Helper for sending messages over channel layer
    """
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.send)(channel_name, {
        consumer_cts.TYPE: consumer_cts.SINGLE_MESSAGE,
        consumer_cts.CONTENT: {
            consumer_cts.TYPE: message_type,
            consumer_cts.GAME_ID: game_id,
            consumer_cts.ID: model_id
        }
    })

def group_send(group_name, message_type, game_id=None, model_id=None):
    """
    Helper for sending messages over channel layer
    """
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(group_name, { 
        consumer_cts.TYPE: consumer_cts.GROUP_MESSAGE,
        consumer_cts.CONTENT: {
            consumer_cts.TYPE: message_type,
            consumer_cts.GAME_ID: game_id,
            consumer_cts.ID: model_id
        }
    })

def dispatch_callbacks(callbacks):
    """
    Helper for calling list of callback functions
    """
    for cb in callbacks:
        cb[constants.FUNCTION](*cb[constants.ARGS] **cb[constants.KWARGS])

def get_opponent_channel_user(me, game):
    """
    Helper method returns channel name of opponent
    """
    player1, player2 = Player.objects.filter(game=game)
    if player1.user.id == me.id:
        return player2.user.channel_name
    return player1.user.channel_name

def get_opponent_channel_colour(my_colour, game):
    """
    Helper to get opponent channel by colour
    """
    player1, player2 = Player.objects.filter(game=game)
    if player1.colour is my_colour:
        return player2.user.channel_name
    return player1.user.channel_name


class UserManager(BaseUserManager):
    """Custom User Manager"""
    def create_user(self, email, password=None, **extra_fields):
        """Creates and saves a new user"""
        if not email:
            raise ValueError('Users must have an email address')
        user = self.model(email=self.normalize_email(email), **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password):
        """Creates and saves new superuser"""
        user = self.create_user(email, password)
        user.is_staff=True
        user.is_superuser=True
        user.save(using = self._db)
        return user

class MoveManager(models.Manager):
    """Custom move manager, adds method to create a move from a move_record dict"""

    def save_move(self, move_item, game):
        """Given a move_item record from a game it adds the move to the db"""
        from_x, from_y = move_item[chess.constants.FROM].to_tuple()
        to_x, to_y = move_item[chess.constants.TO].to_tuple()
        captured_piece = None
        if move_item[chess.constants.CAPTURED]:
            captured_piece = move_item[chess.constants.CAPTURED].SYMBOL
        new_move = Move(
            game=game,
            move_type=move_item[chess.constants.TYPE],
            move_number=move_item[chess.constants.MOVE_NUMBER],
            from_position_x=from_x,
            from_position_y=from_y,
            to_position_x=to_x,
            to_position_y=to_y,
            colour=move_item[chess.constants.COLOUR],
            piece_type=move_item[chess.constants.PIECE].SYMBOL,
            captured_piece_type=captured_piece
        )
        new_move.save()
        new_move.refresh_from_db()
        return new_move


class User(AbstractBaseUser, PermissionsMixin):
    """Custom user model that supports using email instead of username"""
    email = models.EmailField(max_length=255, unique=True)
    name = models.CharField(max_length=255)
    is_guest = models.BooleanField(default=False)
    friends = models.ManyToManyField("self")
    rating = models.IntegerField(default=1200)
    online = models.BooleanField(default=False)
    channel_name = models.CharField(max_length=255, null=True)
    objects = UserManager()
    USERNAME_FIELD = 'email'

    def update_rating(self, game_result, did_win, opponent_rating):
        """Method to update player rating after a game"""
        rating_diff = self.rating - opponent_rating
        win_expectancy = 1 / (1 + pow(10, (rating_diff / -400)))
        k_factor = self.get_k_factor()
        result = 1.0
        if game_result == chess.constants.STALEMATE:
            result = .5
        elif not did_win:
            result = 0
        self.rating = self.rating + (result - win_expectancy) * k_factor

    def get_k_factor(self):
        """Method to determine a players k factor"""
        print("filter in k factor")
        num_games = Game.objects.filter(players__id=self.id).count()
        print("filter in k factor")
        if num_games < 30:
            return 25
        if self.rating < 2400:
            return 15
        return 10

    def save(self, *args, **kwargs):
        print("SAVING USER")
        super().save(*args, **kwargs)

class GameInvite(models.Model):
    """Model for a Game invitaion"""
    timestamp = models.DateTimeField(auto_now_add=True)
    game_id = models.UUIDField(default=uuid.uuid4, editable=False)
    message = models.CharField(max_length=255)
    _accepted = models.BooleanField(default=False)
    _declined = models.BooleanField(default=False)
    from_user = models.ForeignKey('User', related_name='invite_from', on_delete=models.CASCADE)
    to_user = models.ForeignKey('User', related_name='invite_to', on_delete=models.CASCADE)

    @property
    def accepted(self):
        return self._accepted

    @accepted.setter
    def accepted(self, new_value):
        """
        Observe property changes
        """
        self.callback = {
            constants.FUNCTION: send,
            constants.ARGS: (self.from_user.channel_name,
            consumer_cts.INVITE_UPDATE),
            constants.KWARGS: {'model_id': self.id}
        }   
        self._accepted = new_value

    @property
    def declined(self):
        return self._declined

    @declined.setter
    def declined(self, new_value):
        """
        Observe property changes
        """
        self.callback = {
            constants.FUNCTION: send,
            constants.ARGS: (self.from_user.channel_name,
            consumer_cts.INVITE_UPDATE),
            constants.KWARGS: {'model_id': self.id}
        }   
        self._declined = new_value

    def save(self, *args, **kwargs):
        """
        Override save to observe 
        """
        callback = getattr(self, constants.CALLBACK, None)
        if self._state.adding:
            super().save(*args, **kwargs)
            send(self.to_user.channel_name, consumer_cts.INVITE_RECEIVED, model_id=self.id)
        else:
            super().save(*args, **kwargs)
        if callback:
            callback[constants.FUNCTION](*callback[constants.ARGS], **callback[constants.KWARGS])


class Game(models.Model):
    """Model for a Game"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    group_channel_name = models.CharField(max_length=512)
    class GameStatus(models.TextChoices):
        STALEMATE = chess.constants.STALEMATE
        CHECKMATE = chess.constants.CHECKMATE
        IN_PROGRESS = chess.constants.IN_PROGRESS
        RESIGN = constants.RESIGN
        TIMEOUT = constants.TIMEOUT

    players = models.ManyToManyField(
        User, 
        through='Player',
        through_fields=('game', 'user')
    )
    date_played = models.DateField(auto_now_add=True)
    _status = models.CharField(max_length=32, choices=GameStatus.choices, default=GameStatus.IN_PROGRESS)
    _started = models.BooleanField(default=False)

    @property
    def status(self):
        return self._status
    
    @status.setter
    def status(self, new_status):
        """
        Observe property changes, set winner if game is over
        """
        if self._status != new_status and new_status != self.GameStatus.IN_PROGRESS:
            self.set_winner(new_status)
        self._status = new_status
        self.status_callback = {
            constants.FUNCTION: group_send,
            constants.ARGS: (self.group_channel_name, consumer_cts.GAME_STATUS_UPDATE,),
            constants.KWARGS: {'game_id': self.id}
        }
    
    @property
    def started(self):
        return self._started

    @started.setter
    def started(self, new_value):
        """
        Observer property changes to notify when game starts
        """
        if not self._started and new_value:
            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)(self.group_channel_name, {
                consumer_cts.TYPE: consumer_cts.ADD_GAME,
                consumer_cts.GAME_ID: self.id
            })
        self._started = new_value

    def set_winner(self, new_status):
        """
        Helper method sets winner of game and 
        updates ratings
        """
        winning_colour = False
        player1, player2 = Player.objects.filter(game=self)
        winner_loser = (True, False)
        if new_status == self.GameStatus.RESIGN:
            if player1.resigned:
                player2.winner = True
            if player2.resigned:
                player1.winner = True

        elif new_status == self.GameStatus.TIMEOUT:
            if player1.timeout:
                player2.winner = True
            if player2.timeout:
                player1.winner = True

        elif new_status == self.GameStatus.STALEMATE:
            player1.draw, player2.draw = True

        else:
            moves = Move.objects.filter(game=self).order_by(
                '-move_number')
            print("in set winner checking moves")
            print(moves)
            if moves:
                if moves[0].colour is player1.colour:
                    print("setting a winner")
                    player1.winner = True
                else: 
                    print("setting a winner else")
                    player2.winner = True
        print("first save")
        player1.save()
        print("first save done")
        print("second save")
        player2.save()
        print("second save done")
        player1.user.update_rating(new_status, player1.winner, player2.user.rating)
        player2.user.update_rating(new_status, player2.winner, player1.user.rating)
        player1.user.save()
        player2.user.save()
        print("DONE SET WINNER!!!")

    def save(self, *args, **kwargs):
        """
        Override save
        """
        print("GAME SAVE CALLED")
        super().save(*args, **kwargs)
        callback = getattr(self, 'status_callback', None)
        if callback:
            callback[constants.FUNCTION](*callback[constants.ARGS], **callback[constants.KWARGS])

    def __str__(self):
        return str(self.id)


class Player(models.Model):
    """Association object for many to many between players and game"""
    user = models.ForeignKey('User', on_delete=models.CASCADE, related_name='user_to_game')
    game = models.ForeignKey('Game', on_delete=models.CASCADE, related_name='game_to_user')
    time = models.DecimalField(default=180.0, decimal_places=2, max_digits=6)
    _turn = models.BooleanField(default=False)
    colour = models.BooleanField()
    winner = models.BooleanField(default=False)
    draw = models.BooleanField(default=False)
    turn_started_timestamp = models.DecimalField(null=True, decimal_places=2, max_digits=14)
    resigned = models.BooleanField(default=False)
    timeout = models.BooleanField(default=False)


    @property
    def turn(self):
        return self._turn

    @turn.setter
    def turn(self, newValue):
        """
        Set a timer when turn starts
        """
        if newValue:
            self.turn_started_timestamp = decimal.Decimal(round(time.time(), 2))
            send(self.user.channel_name, consumer_cts.GAME_START_TURN, game_id=self.game.id)
        else:
            self.update_time()
        self._turn = newValue

    def update_time(self):
        """
        Helper method to update a player's time
        """
        if self._turn:
            self.refresh_from_db()
            time_now = round(time.time(), 2)
            self.time = round(self.time - decimal.Decimal(time_now) + self.turn_started_timestamp, 2)
            self.turn_started_timestamp = time_now
            if self.time < 0:
                self.time = 0

    def save(self, *args, **kwargs):
        print("before super")
        super().save(*args, **kwargs)
        print("after super")
        print(f"saving player {self.user.name}")
        print(f"player winner {self.winner}")

class Move(models.Model):
    """Model for a move made in a game"""
    class Piece(models.TextChoices):
        ROOK = chess.piece.Rook.SYMBOL
        KNIGHT= chess.piece.Knight.SYMBOL
        BISHOP = chess.piece.Bishop.SYMBOL
        KING = chess.piece.King.SYMBOL
        QUEEN = chess.piece.Queen.SYMBOL
        PAWN = chess.piece.Pawn.SYMBOL

    class MoveType(models.TextChoices):
        CASTLE = chess.constants.CASTLE
        EN_PASSANT = chess.constants.EN_PASSANT
        REGULAR = chess.constants.REGULAR

    objects = MoveManager()
    move_number = models.IntegerField()
    game = models.ForeignKey('Game', related_name='moves', on_delete=models.CASCADE)

    colour = models.BooleanField()
    piece_type = models.CharField(max_length=32, choices=Piece.choices)
    captured_piece_type = models.CharField(max_length=32, choices=Piece.choices, null=True) 
    from_position_x = models.IntegerField()
    from_position_y = models.IntegerField()
    to_position_x = models.IntegerField()
    to_position_y = models.IntegerField()
    move_type = models.CharField(max_length=32, choices=MoveType.choices) 
    notation = models.CharField(max_length=10)

    def get_move(self):
        return (
            (self.from_position_x, self.from_position_y),
            (self.to_position_x, self.to_position_y)
        )

    def get_notation(self):
        """
        Computes string in chess notation for a move
        """
        col_ascii = ord('a')  
        from_row = self.from_position_y + 1
        to_row = self.to_position_y + 1
        from_col = chr(col_ascii + self.from_position_x)
        to_col = chr(col_ascii + self.to_position_x)
        if self.move_type in (self.MoveType.REGULAR, self.MoveType.EN_PASSANT):
            if self.captured_piece_type:
                return f"{self.piece_type}x{to_col}{to_row}"
            return f"{self.piece_type}{to_col}{to_row}"

        if self.move_type == self.MoveType.CASTLE:
            return "0-0"
        return ""

    def save(self, *args, **kwargs):
        """
        Override save to observe when a move is created
        """
        if self._state.adding:
            self.notation = self.get_notation()
            super(*args, **kwargs).save()
            opponent_channel = get_opponent_channel_colour(self.colour, self.game)
            send(opponent_channel, consumer_cts.GAME_OPPONENT_MOVE, model_id=self.id, game_id=self.game.id)
        else:
            super(*args, **kwargs).save()


class ChatMessage(models.Model):
    """
    Model for saving chat messages
    """
    game = models.ForeignKey('Game', related_name='messages', on_delete=models.CASCADE)
    user = models.ForeignKey('User', related_name='messages', on_delete=models.CASCADE)
    message = models.CharField(max_length=4096)
    timestamp = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        """
        Override save to observe when a message is created
        """
        if self._state.adding:
            super().save(*args, **kwargs)
            send(
                get_opponent_channel_user(self.user, self.game),
                consumer_cts.GAME_OPPONENT_MESSAGE,
                game_id=self.game.id,
                model_id=self.id
            )
        else:
            super().save(*args, **kwargs)