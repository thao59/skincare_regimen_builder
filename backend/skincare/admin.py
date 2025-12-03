from django.contrib import admin
from .models import User, UserProfile, UserImage, Products, UserProduct, Conversation, Message

# Register your models here.
admin.site.register(User), 
admin.site.register(UserProfile), 
admin.site.register(UserImage),
admin.site.register(Products),
admin.site.register(UserProduct),
admin.site.register(Conversation), 
admin.site.register(Message),