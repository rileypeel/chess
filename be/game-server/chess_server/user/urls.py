from django.urls import path
from rest_framework.routers import SimpleRouter
from user import views



app_name = 'user'

urlpatterns = [
	path('create/', views.CreateUserView.as_view(), name='create'),
	path('me/', views.ManageUserView.as_view(), name='me'),
	path('login/', views.LoginView.as_view(), name='login'),
	path('search/<queryStr>', views.UserSearch.as_view(), name='search'),
	path('create-invite/', views.CreateGameInvite.as_view(), name='create_game_invite'),
	path('completed-games/<int:id>', views.GameHistory.as_view(), name='game_history')

]