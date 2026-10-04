from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    ROLES = (('ADMIN', 'Admin'), ('MEMBER', 'Member'))
    role = models.CharField(max_length=10, choices=ROLES, default='MEMBER')
    designation = models.CharField(max_length=100, blank=True) # e.g. Core Team Member, Volunteer
    profile_pic = models.ImageField(upload_to='profiles/', null=True, blank=True)

class Blog(models.Model):
    STATUS = (('PENDING', 'Pending'), ('APPROVED', 'Approved'), ('REJECTED', 'Rejected'))
    title = models.CharField(max_length=255)
    content = models.TextField()
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='blogs')
    status = models.CharField(max_length=10, choices=STATUS, default='PENDING')
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)