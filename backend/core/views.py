from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Blog
from .serializers import BlogSerializer
from .permissions import IsAdminRole, IsOwnerOrAdmin

# Member Panel: Create & Manage Own Blogs
class MemberBlogViewSet(viewsets.ModelViewSet):
    serializer_class = BlogSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]

    def get_queryset(self):
        return Blog.objects.filter(author=self.request.user)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user, status='PENDING')

# Admin Panel: Moderate All Blogs
class AdminBlogViewSet(viewsets.ModelViewSet):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer
    permission_classes = [IsAdminRole]

    @action(detail=True, methods=['patch'])
    def moderate_blog(self, request, pk=None):
        blog = self.get_object()
        status = request.data.get('status')
        is_featured = request.data.get('is_featured')

        if status in ['PENDING', 'APPROVED', 'REJECTED']:
            blog.status = status
        if is_featured is not None:
            blog.is_featured = is_featured
            
        blog.save()
        return Response({'message': 'Blog updated successfully', 'status': blog.status, 'is_featured': blog.is_featured})