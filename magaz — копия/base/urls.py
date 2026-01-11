from .import views 
from .views import *
from .forms import *
from django.urls import path
from django.contrib.auth import views as auth_views

app_name = 'base'

urlpatterns = [
    path("", views.home_view, name='home'),
    path('products/', views.product_list, name='product_list'),
    path('category/<slug:category_slug>/', views.product_list, name='product_list_by_category'),
    path('brand/<slug:brand_slug>/', views.product_list, name='product_list_by_brand'),
    path('product/<int:id>/<slug:slug>/', views.product_detail, name='product_detail'),
    
    
    path('cart/', views.cart_view, name='cart'),
    path('add/<int:variant_id>', views.add_to_cart, name='add_to_cart'),
    path('update-cart-quantity/', views.update_cart_quantity, name='update_cart_quantity'),
    path('remove/<int:item_id>', views.remove_from_cart, name='remove_from_cart'),

    path('order/', views.order_view, name='odering_view'),
    path('profile/', views.profile, name='profile'),
  
    # authentication urls  
    path("register", views.signup, name="register"),
    path("verify-email/<slug:username>", views.verify_email, name="verify-email"),
    path("resend-otp", views.resend_otp, name="resend-otp"),
    path("login", views.signin, name="signin"),
    path('logout/', views.custom_logout, name="logout"),

    path('password_reset/', auth_views.PasswordResetView.as_view(
            template_name='auth/password_reset.html', # Используйте 'registration/...'
            email_template_name='auth/password_reset_email.html',
            subject_template_name='auth/password_reset_subject.txt', 
            form_class=CustomPasswordResetForm # Используем вашу кастомную форму
        ), name='password_reset'),

    # Sending email verification
    path('password_reset/done/', auth_views.PasswordResetDoneView.as_view(
        template_name='auth/password_reset_done.html'
    ), name='password_reset_done'),

    # Updating the password
    path('reset/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(
        template_name='auth/password_reset_confirm.html',
        # set_password_form=MySetPasswordForm, # Если вы ее используете
    ), name='password_reset_confirm'),

    # Finishing the password
    path('reset/done/', auth_views.PasswordResetCompleteView.as_view(
        template_name='auth/password_reset_complete.html' # ИСПРАВЛЕННЫЙ ПУТЬ
    ), name='password_reset_complete'),
]
