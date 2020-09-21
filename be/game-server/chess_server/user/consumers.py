from uuid import uuid4
from channels.db import database_sync_to_async
from channels.consumer import get_handler_name
from channels.generic.websocket import JsonWebsocketConsumer
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from channels.auth import login
from core.models import User, GameInvite
from user.serializers import GameInviteSerializer, UserSerializer

TYPE = 'type'
GAME_INVITE = 'game_invite'
ACCEPT_INVITE = 'accept_invite'
DECLINE_INVITE = 'invite_declined'
LOGIN = "login"

class UserConsumer(JsonWebsocketConsumer):

    def connect(self):
        self.accept()
        self.send_json({
            TYPE: 'connection_response',
            'status': 'success'
        })
        print(self.scope['user'])
    def disconnect(self, code):
        self.scope['user'].online = False
        self.scope['user'].save()

    def receive_json(self, message):
        
        if message[TYPE] == LOGIN:
            user = User.objects.get(email=message['email'])
            async_to_sync(login)(self.scope, user)
            self.scope["session"].save()
            user.channel_name = self.channel_name
            user.online = True
            user.save()
            self.send_json({
                TYPE: 'login_success'
            })
            

            

        elif message[TYPE] == ACCEPT_INVITE or message[TYPE] == DECLINE_INVITE:
            channel_layer = get_channel_layer()
            try:
                game_invite = GameInvite.objects.get(id=message['invite_id'])
            except GameInvite.DoesNotExist:
                print("Error: game invite not found")
            
            opponent = game_invite.from_user
            if opponent.online:
                if message[TYPE] == ACCEPT_INVITE:
                    async_to_sync(channel_layer.send)(opponent.channel_name, {
                        "type": "game.started",
                        "game_id": str(game_invite.game_id),
                        "opponent": UserSerializer(self.scope['user']).data
                    })
                    self.game_started({
                        "game_id": str(game_invite.game_id),
                        "opponent": UserSerializer(opponent).data
                    })

                else:
                    async_to_sync(channel_layer.send)(opponent.channel_name, {
                    "type": "invite.declined",
                    "invite_id": game_invite.id,
                    "to_user": game_invite.to_user
                })
                
    def receive_invite(self, message):
        
        try:
            game_invite = GameInvite.objects.get(id=message['invite_id'])
        except GameInvite.DoesNotExist:
            print("Error: game invite not found")
        
        user_serializer = UserSerializer(game_invite.from_user)
        serializer = GameInviteSerializer(game_invite)
        self.send_json({
            "type": "invite_received",
            "invite": serializer.data,
            "from": user_serializer.data
        })

    def game_started(self, message):
        self.send_json({
            "type": "game_started",
            "game_id": message["game_id"],
            "opponent": message["opponent"]
        })

    def invite_declined(self, message):
        print("sending down invite declined...")
        serializer = UserSerializer(message['to_user'])
        self.send_json({
            "type": "invite_declined",
            "invite_id": message["invite_id"],
            "user": serializer.data

        })