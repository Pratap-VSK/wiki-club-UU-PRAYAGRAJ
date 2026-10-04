from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MemberBlogViewSet, AdminBlogViewSet

router = DefaultRouter()
router.register(r'member/blogs', MemberBlogViewSet, basename='member-blogs')
router.register(r'admin/blogs', AdminBlogViewSet, basename='admin-blogs')

urlpatterns = [
    path('', include(router.urls)),
]