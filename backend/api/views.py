from rest_framework import viewsets, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db import transaction
from .models import User, Account, Transaction
from .serializers import UserSerializer, AccountSerializer, TransactionSerializer, TransferSerializer

@api_view(['GET'])
def welcome(request):
    return Response({
        "message": "Welcome to the API!",
        "status": "success"
    })

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

class AccountViewSet(viewsets.ModelViewSet):
    serializer_class = AccountSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Account.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Transaction.objects.filter(
            models.Q(from_account__user=self.request.user) |
            models.Q(to_account__user=self.request.user)
        )

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
@transaction.atomic
def transfer_money(request):
    serializer = TransferSerializer(data=request.data)
    if serializer.is_valid():
        try:
            from_account = Account.objects.get(
                id=serializer.validated_data['from_account_id'],
                user=request.user
            )
            to_account = Account.objects.get(
                id=serializer.validated_data['to_account_id']
            )
            
            from_account.transfer_money(
                to_account,
                serializer.validated_data['amount']
            )
            
            return Response({
                'message': 'Transfer successful',
                'status': 'success'
            }, status=status.HTTP_200_OK)
            
        except Account.DoesNotExist:
            return Response({
                'message': 'Account not found',
                'status': 'error'
            }, status=status.HTTP_404_NOT_FOUND)
        except ValueError as e:
            return Response({
                'message': str(e),
                'status': 'error'
            }, status=status.HTTP_400_BAD_REQUEST)
            
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) 