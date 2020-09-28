import pytest, json
import game.consumers as consumers
from channels.testing import WebsocketCommunicator
from chess_server.routing import application
from chess.constants import WHITE, BLACK
from chess.game import Game
from core.models import User
from asgiref.sync import sync_to_async

#TODO 
# test start game 
# test a move 
# test a game ending move
# test resign 
# test chat message
# HAVING lots of trouble with these test so for now just test by hand

GAME_URL = 'test/fake_game_id/'

@pytest.fixture
async def set_up_communicators(autouse=True):
    """pytest fixture to set up and teardown app communicators"""
    test_user1 = await sync_to_async(User.objects.create)(
        email='test_user@email.ca',
        password='password'
    )
    test_user2 = await sync_to_async(User.objects.create)(
        email='test_user2@email.ca',
        password='password'
    )
    communicator1 = WebsocketCommunicator(application, GAME_URL)
    communicator2 = WebsocketCommunicator(application, GAME_URL)
    communicator1.scope['user'] = test_user1
    communicator2.scope['user'] = test_user2
    yield communicator1, communicator2
    await sync_to_async(test_user1.delete)()
    await sync_to_async(test_user2.delete)()
    await communicator1.disconnect()
    await communicator2.disconnect()

@pytest.mark.django_db
@pytest.mark.asyncio
async def test_start_game(set_up_communicators):
    """Test that upon connection of two players the game is started, Black and White sides
    are assigned and white is prompted to move"""
    player1, player2 = set_up_communicators
    connected, subprotocol = await player1.connect()
    assert connected
    connected, subprotocol = await player2.connect()
    assert connected
    colours = []
    for player in (player1, player2):
        message_string = await player.receive_from()
        message_dict = json.loads(message_string)
        assert message_dict['type'] == 'start_game'
        colours.append(message_dict['my_colour'])
        if message_dict['my_colour'] is WHITE:
            message_string = await player.receive_from()
            message_dict = json.loads(message_string)
            assert message_dict['type'] == 'start_turn'
    assert colours[0] == (not colours[1])
    await player1.disconnect() 
    await player2.disconnect()

@pytest.mark.django_db
@pytest.mark.asyncio
async def test_consumer_move_success(set_up_communicators, monkeypatch):
    """Test making a successful move"""
    def return_white():
        return WHITE
    monkeypatch.setattr(consumers, "get_random_colour", return_white)
    player1, player2 = set_up_communicators
    connected, subprotocol = await player1.connect()
    assert connected
    connected, subprotocol = await player2.connect()
    assert connected
    message = await player2.receive_from()
    message = await player1.receive_from()