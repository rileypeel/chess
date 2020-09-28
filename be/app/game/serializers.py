from rest_framework.serializers import ModelSerializer, StringRelatedField, SlugRelatedField
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
    class Meta:
        model = Game
        fields = '__all__'


class ChatMessageSerializer(ModelSerializer):
    """
    Serializer or Message Model
    """
    user = SlugRelatedField(read_only=True, slug_field='name')
    game = StringRelatedField(read_only=True)
    class Meta:
        model = ChatMessage
        fields = '__all__'


class GameSerializerPlayer(ModelSerializer):
    game_to_user = PlayerSerializer(many=True)
    class Meta:
        model = Game
        fields = '__all__'