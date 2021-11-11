from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class Owner(AbstractUser):
    name = models.CharField(max_length=100)
    profile_pic = models.CharField(max_length=300,blank=True,null=True)
    username = models.CharField(max_length=100,unique=True)
    password = models.CharField(max_length=100)
    annon = models.BooleanField(default=False)
    created = models.DateTimeField(auto_now=True)

class Upload(models.Model):
    video = models.CharField(max_length=500)
    title = models.TextField()
    owner = models.CharField(max_length=100)
    like = models.IntegerField(default=0)
    views = models.IntegerField(default=0)
    dislike = models.IntegerField(default=0)
    tags = models.CharField(max_length=300,blank=True,null=True)
    created = models.DateTimeField(auto_now=True)

class Comments(models.Model):
    cmnt = models.CharField(max_length=500)
    cmnt_by = models.CharField(max_length=100)
    cmnt_to = models.ForeignKey(Upload,on_delete=models.CASCADE,related_name='cmnt_to')
    created = models.DateTimeField(auto_now=True)

class Subscribers(models.Model):
    sub_by = models.CharField(max_length=100)
    sub_to = models.CharField(max_length=100)
    created = models.DateTimeField(auto_now=True)
