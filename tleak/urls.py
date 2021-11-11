from django.urls import path
from . import views
from django.conf.urls.static import static
from django.conf import settings
urlpatterns = [
        path('', views.tube ,name='tube'),
        path('home/', views.home ,name='home'),
        path('login/', views.logn ,name='login'),
        path('ansign/', views.anon_logn ,name='ansignup'),
        path('logout/',views.logut, name='logout'),
        path('signup/', views.signup ,name='signup'),
        path('clipon/', views.clipon, name='clipon'),
        path('clip/<rid>/',views.clips , name='clip'),
        path('search/',views.search , name='search'),
        path('trending/', views.trends, name='trends'),
        path('<str:profname>/',views.profile, name='profile'),
        path('<str:profile_sub>/subs/',views.subscribers, name='subscribers'),
        path('<str:profile_unsub>/unsubs/',views.unsubscribe, name='unsubscribe'),
        path('<str:profile_img>/pix/',views.prof_img,name='image_upload'),
        path('clip/<int:cid>/cmnt/',views.comment,name='cmnt'),
]
