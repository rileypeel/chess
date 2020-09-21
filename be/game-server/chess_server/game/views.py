from rest_framework import mixins, viewsets, authentication, permissions
from core.models import GameInvite, Game
from game.serializers import GameSerializer

class GameViewSet(viewsets.ReadOnlyModelViewSet): 
    """Endpoints for retrieving Game detail and Game list"""
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = GameSerializer
    queryset = Game.objects.all()

    def get_queryset(self):
        queryset = super().get_queryset()
        return queryset.filter(players__id=self.request.user.id)