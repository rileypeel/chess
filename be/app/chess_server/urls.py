from django.contrib import admin
from django.conf.urls import url
from django.urls import path, include
from rest_framework import routers

urlpatterns = [
    path('admin/', admin.site.urls),
    path('user/', include('user.urls')),
    path('game/', include('game.urls')),
]