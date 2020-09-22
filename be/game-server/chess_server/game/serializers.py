from rest_framework.serializers import ModelSerializer, StringRelatedField
from core.models import Game, Move, ChatMessage, Player
from user.serializers import UserSerializer

class MoveSerializer(ModelSerializer):
    """Serializer for Move Model"""
    game = StringRelatedField()
    class Meta:
        model = Move
        fields = '__all__'


class PlayerSerializer(ModelSerializer):
    """
    Serializer for Player Model
    """
    user = UserSerializer(read_only=True)
    class Meta:
        model = Player
        exclude = ('game',)


class GameSerializer(ModelSerializer):
    """Serializer for Game Model"""
    #moves = MoveSerializer(many=True, read_only=True)
    class Meta:
        model = Game
        fields = '__all__'
        #exclude = ('moves',)

class ChatMessageSerializer(ModelSerializer):
    """
    Serializer or Message Model
    """
    class Meta:
        model = ChatMessage
        fields = '__all__'