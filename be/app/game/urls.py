from rest_framework import routers
from game.views import GameViewSet

router = routers.SimpleRouter()
router.register(f'games', GameViewSet)

urlpatterns = router.urls