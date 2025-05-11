from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'accounts', views.AccountViewSet, basename='account')
router.register(r'transactions', views.TransactionViewSet, basename='transaction')

urlpatterns = [
    path('', views.welcome, name='welcome'),
    path('', include(router.urls)),
    path('transfer/', views.transfer_money, name='transfer_money'),
] 