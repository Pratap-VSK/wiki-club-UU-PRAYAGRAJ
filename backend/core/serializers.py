from rest_framework import serializers
from .models import CustomUser, Blog

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'role', 'profile_pic', 'designation']

class BlogSerializer(serializers.ModelSerializer):
    author_name = serializers.ReadOnlyField(source='author.username')

    class Meta:
        model = Blog
        fields = ['id', 'title', 'content', 'author', 'author_name', 'status', 'is_featured', 'created_at']
        read_only_fields = ['author', 'status', 'is_featured'] 