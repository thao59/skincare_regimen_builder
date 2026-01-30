from rest_framework import serializers 
from ..models import UserProfile

class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    class Meta: 
        model = UserProfile
        fields = ["username", "age", "skintype", "skin_concern", "eye_concern", "pregnant", "products_type", "routine", "active_use", "active_ingre", "advanced_active_use", "no_products"]
