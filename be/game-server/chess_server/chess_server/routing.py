from channels.auth import AuthMiddlewareStack
from django.conf.urls import url
from django.urls import re_path
from channels.routing import ProtocolTypeRouter, URLRouter
from game.chess_consumer import ChessConsumer

application = ProtocolTypeRouter({
    # (http->django views is added by default)
    'websocket': AuthMiddlewareStack(
        URLRouter([
            re_path('chess-socket/', ChessConsumer)
        ])
    ),
})