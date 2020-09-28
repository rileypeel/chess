from django.core.management.base import BaseCommand
import core.models as m 

class Command(BaseCommand):
    """Django command to pause execution until database is available"""
    def handle(self, *args, **options):
        user = m.User.objects.get(id=18)
        user2 = m.User.objects.get(id=19)
        players = m.Player.objects.filter(user=user)
        for p in players:
            p.game.delete()
            p.delete()
        players = m.Player.objects.filter(user=user2)
        for p in players:
            p.game.delete()
            p.delete()