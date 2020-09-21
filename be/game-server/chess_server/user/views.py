from rest_framework import generics, authentication, permissions, mixins, viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.views import ObtainAuthToken 
from rest_framework.settings import api_settings
from django.contrib.auth import authenticate, login
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from user.serializers import UserSerializer, AuthTokenSerializer, GameInviteWriteSerializer
from core.models import User, GameInvite
import json

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
        print("in me view")
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
        print(serializer.errors)
        return Response(status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    """View for user login"""
    #permission_classes = (permissions.AllowAny)
    def post(self, request):
        email = request.data.get('email', None)
        password = request.data.get('password', None)
        print(request.data)
        user = authenticate(request, email=email, password=password)
        if user is not None:
            login(request, user)
            serializer = UserSerializer(user) #TODO constants
            return Response(data=serializer.data, status=status.HTTP_200_OK)
        return Response(data={}, status=status.HTTP_200_OK)


class UserSearch(APIView):
    """Endpoint for searching users"""
    def get(self, request, queryStr): 
        users = User.objects.filter(name__startswith=queryStr)
        serializer = UserSerializer(users, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)