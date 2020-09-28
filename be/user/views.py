from rest_framework import generics, authentication, permissions, mixins, viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.views import ObtainAuthToken 
from rest_framework.settings import api_settings
from django.contrib.auth import authenticate, login, get_user_model, logout
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from user.serializers import UserSerializer, AuthTokenSerializer, GameInviteWriteSerializer
from game.serializers import GameSerializer, GameSerializerPlayer
from core.models import User, GameInvite, Game
from django.db.utils import IntegrityError
from game.constants import RESULTS, WINS, GAMES_PLAYED
import json, random


class CreateUserView(generics.CreateAPIView):
    """Create a new user in the system"""
    serializer_class = UserSerializer

class CreateTokenView(ObtainAuthToken):
    """Create a new auth token for user"""
    serializer_class = AuthTokenSerializer
    renderer_classes = api_settings.DEFAULT_RENDERER_CLASSES

class ManageUserView(generics.RetrieveUpdateAPIView):
    """Manage the authenticated user"""
    serializer_class = UserSerializer
    authentication_classes = (authentication.SessionAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)
    def get_object(self):
        """Retrieve and return authenticated user"""
        
        return self.request.user


class CreateGameInvite(APIView):
    """View for creating game invites"""
    authentication_classes = (authentication.SessionAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)
    def post(self, request):
        serializer = GameInviteWriteSerializer(data=request.data)
        try:
            to_user = User.objects.get(id=request.data['to_user'])
        except User.DoesNotExist:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        
        return Response(status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    """
    View for user logout
    """
    authentication_classes = (authentication.SessionAuthentication,)
    def get(self, request):
        logout(request)
        
        return Response(status=status.HTTP_200_OK)
        

class LoginView(APIView):
    """View for user login"""

    def post(self, request):
        email = request.data.get('email', None)
        password = request.data.get('password', None)
        
        
        
        
        user = authenticate(request, email=email, password=password)
        if user is not None:
            
            login(request, user)
            serializer = UserSerializer(user) 
            return Response(data=serializer.data, status=status.HTTP_200_OK)
        
        return Response(data={}, status=status.HTTP_200_OK)


class UserSearch(APIView):
    """Endpoint for searching users"""
    authentication_classes = (authentication.SessionAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)
    def get(self, request, queryStr): 
        users = User.objects.filter(name__startswith=queryStr)
        serializer = UserSerializer(users, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)


class GameHistory(APIView):
    """
    Endpoint for game history for a user
    """
    authentication_classes = (authentication.SessionAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)
    def get(self, request, id):
        """
        Grab all finished games for user with given id
        """
        try:
            user = User.objects.get(id=id)
        except User.DoesNotExist:
            
            return Response(status=status.HTTP_400_BAD_REQUEST)

        finished_games = Game.objects.filter(
            game_to_user__user=user
        ).exclude(
            _status=Game.GameStatus.IN_PROGRESS
        )
        games_played = finished_games.count()
        num_won_games = finished_games.filter(game_to_user__user=user, game_to_user__winner=True).count()
        serializer = GameSerializerPlayer(finished_games.order_by('date_played')[0:10], many=True)
        data = { RESULTS: serializer.data, WINS: num_won_games,  GAMES_PLAYED: games_played }
        return Response(data=data, status=status.HTTP_200_OK)

class CreateGuest(APIView):
    """
    Endpoint for creating a guest account
    """
    def get(self, request):
        password = "fakepassword123"
        while True:
            random_num = random.randint(0, 10000)
            email = f"fakeemail{random_num}@email.ca"
            try:
                get_user_model().objects.create_user(
                    is_guest=True,
                    name=f"Guest{random_num}",
                    email=email,
                    password=password
                )
            except IntegrityError as ex:
                print(f"Integrity Error: {ex}")
            else:
                break
        return Response(
            status=status.HTTP_200_OK,
            data={
                'email': email,
                'password': password
            }
        )
                