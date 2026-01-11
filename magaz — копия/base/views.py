from .models import *
from django.db.models import Q
from .forms import RegisterForm
from django.utils import timezone
from django.contrib import messages
from django.core.mail import send_mail
from django.http import HttpResponseRedirect
from django.urls import reverse_lazy, reverse
from django.contrib.auth import get_user_model
from django.views.generic import ListView, View
from django.contrib.auth.models import User, auth
from django.contrib.auth.views import PasswordResetView
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.contrib.messages.views import SuccessMessageMixin
from django.shortcuts import render, redirect, get_object_or_404
from django.core.paginator import Paginator
from .forms import RegisterForm, UserUpdateForm
from django.http import JsonResponse
import json
from django.db.models import Min, Sum, F
# Create your views here.

def home_view(request):
    return render(request, 'index.html')

def product_list(request, category_slug=None):
    category = None
    categories = Category.objects.all()
    brands = Brand.objects.all()
    products = Products.objects.annotate(min_price=Min('variants__price')).filter(variants__stock__gt=0).distinct().order_by('id')

    # Category filtering
    if category_slug:
        category = get_object_or_404(Category, slug=category_slug)
        products = products.filter(category=category)
    
    # Brand filtering
    selected_brands = request.GET.getlist('brand')
    if selected_brands:
        products = products.filter(brand__slug__in=selected_brands)
    
    # Price filtering
    min_price = request.GET.get('min_price')
    max_price = request.GET.get('max_price')
    
    if min_price:
        try:
            min_price = float(min_price)
            products = products.filter(variants__price__gte=min_price)
        except ValueError:
            pass
    
    if max_price:
        try:
            max_price = float(max_price)
            products = products.filter(variants__price__lte=max_price)
        except ValueError:
            pass
    
    # Search functionality
    search_query = request.GET.get('search')
    if search_query:
        products = products.filter(
            Q(name__icontains=search_query) | 
            Q(description__icontains=search_query)
        )



    paginator = Paginator(products, 4)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    context = {
        "categories": categories, 
        "products": products,
        "brands": brands,
        "category": category,
        "selected_brands": selected_brands,
        "page_obj":page_obj,
    }
    return render(request, 'productss.html', context)


@login_required
def product_detail(request, id, slug):
    product = get_object_or_404(Products, id=id, slug=slug)
    variants = product.variants.filter(stock__gt=0)
    selected_variant = (
        variants.filter(is_default=True).first()
        or variants.order_by('price').first()
    )
    similar_products = Products.objects.filter(category=product.category,variants__stock__gt=0 ).exclude(id=product.id).distinct()[:6]

    context = {
        "product": product,
        "variants":variants,
        "selected_variant":selected_variant,
        "similar_products": similar_products
    }
    return render(request, 'aboutt.html', context)

@login_required
def cart_view(request):
    cart_items = CartItem.objects.filter(user=request.user).select_related('product')
    total_price = sum(item.product.price * item.quantity for item in cart_items)

   

    context = {
        "cart_items": cart_items,
        "total_price": total_price
    }
    return render(request, 'cart.html', context)


@login_required
def add_to_cart(request, variant_id):
    if request.method == 'POST':
        quantity = int(request.POST.get('quantity', 1)) 
        product_variant = get_object_or_404(ProductVariaty, id=variant_id)
        if quantity > product_variant.stock:
            return redirect('base:cart') 
            
        cart_item, created = CartItem.objects.get_or_create(
            product=product_variant, 
            user=request.user, 
            defaults={'quantity':0}
        )
        
        if cart_item.quantity + quantity <= product_variant.stock:
            cart_item.quantity += quantity
            cart_item.save()
        else:
            pass
            
        return redirect('base:cart')
    return redirect('base:cart')



def remove_from_cart(request, item_id):
    cart_item = CartItem.objects.get(id=item_id)
    cart_item.delete()
    return redirect('base:cart')

def update_cart_quantity(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        item_id = data.get('item_id')
        action = data.get('action') # 'plus' или 'minus'
        
        try:
            cart_item = CartItem.objects.get(id=item_id, user=request.user)
            
            if action == 'plus':
                cart_item.quantity += 1
            elif action == 'minus' and cart_item.quantity > 1:
                cart_item.quantity -= 1
            
            cart_item.save()
            
            item_total = cart_item.product.price * cart_item.quantity
            
            all_items = CartItem.objects.filter(user=request.user)
            cart_total = sum(item.product.price * item.quantity for item in all_items)
            
            return JsonResponse({
                'success': True,
                'quantity': cart_item.quantity,
                'item_total': float(item_total),
                'cart_total': float(cart_total)
            })
        except CartItem.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Item not found'})
            
    return JsonResponse({'success': False, 'error': 'Invalid request'})

def order_view(request):
    return render(request, 'order.html')
@login_required
def profile(request):
    if request.method == 'POST':
        form = UserUpdateForm(request.POST, instance=request.user)

        if form.is_valid():
            form.save() 
            messages.success(request, 'Ваш профиль был успешно обновлён!')
            return redirect('base:profile') 
        
    else:
        form = UserUpdateForm(instance=request.user)

    context = {'form': form}
    return render(request, 'profile.html', context)

# AUTH

def send_otp_email_helper(user):
    """Генерирует новый OTP, устанавливает срок действия и отправляет письмо пользователю."""
    
    otp = OtpToken.objects.create(
        user=user, 
        otp_expires_at=timezone.now() + timezone.timedelta(minutes=5)
    )
    
    # URL для верификации (используйте полное доменное имя в продакшене)
    verification_url = f"http://127.0.0.1:8000/verify-email/{user.username}" 
    
    # Email body
    subject = "Email Verification"
    message = f"""
        Hi {user.username}, 
        
        Here is your OTP code: {otp.otp_code} 
        
        It expires in 5 minutes.
        
        Use the link below to verify your account:
        {verification_url}
        """
    sender = "lysenkovmahmud@gmail.com"
    receiver = [user.email, ]

    # Отправляем письмо
    send_mail(
        subject,
        message,
        sender,
        receiver,
        fail_silently=False,
    )
    
    return otp.otp_code

# ----------------------------------------------------------------

def home_view(request):
    return render(request, "index.html")

def signup(request):
    form = RegisterForm()
    if request.method == 'POST':
        form = RegisterForm(request.POST)
        if form.is_valid():
            new_user = form.save(commit=False)
            new_user.is_active = False 
            new_user.save()
            
            try:
                send_otp_email_helper(new_user)
                messages.success(request, "Account created successfully! An OTP was sent to your Email")
            except Exception as e:
                messages.error(request, f"Account created, but failed to send OTP: {e}")
                
            return redirect("base:verify-email", username=new_user.username) 
            
    context = {"form": form}
    return render(request, "auth/signup.html", context)


def verify_email(request, username):
    user = get_user_model().objects.get(username=username)
    user_otp = OtpToken.objects.filter(user=user).last()
    
    
    if request.method == 'POST':
        if user_otp.otp_code == request.POST['otp_code']:
            
            if user_otp.otp_expires_at > timezone.now():
                user.is_active=True
                user.save()
                messages.success(request, "Account activated successfully!! You can Login.")
                return redirect("base:signin")
            
            else:
                messages.warning(request, "The OTP has expired, get a new OTP!")
                return redirect("base:verify-email", username=user.username)
        
        
        # invalid otp code
        else:
            messages.warning(request, "Invalid OTP entered, enter a valid OTP!")
            return redirect("base:verify-email", username=user.username)
        
    context = {}
    return render(request, "auth/verify_token.html", context)


def resend_otp(request):
    if request.method == 'POST':
        user_email = request.POST["otp_email"]
        
        if get_user_model().objects.filter(email=user_email).exists():
            user = get_user_model().objects.get(email=user_email)
            
            try:
                send_otp_email_helper(user)
                messages.success(request, "A new OTP has been sent to your email-address")
            except Exception as e:
                messages.error(request, f"Failed to resend OTP: {e}")
            
            return redirect("base:verify-email", username=user.username)

        else:
            messages.warning(request, "This email dosen't exist in the database")
            return redirect("base:resend-otp")
            
    context = {}
    return render(request, "auth/resend_otp.html", context)


def signin(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        
        if user is not None:    
            login(request, user)
            messages.success(request, f"Hi {request.user.username}, you are now logged-in")
            return redirect('/products')
        
        else:
            messages.warning(request, "Invalid credentials")
            return redirect("base:signin")
        
    return render(request, "auth/login.html")



class ResetPasswordView(SuccessMessageMixin, PasswordResetView):
    template_name = 'password_reset.html'
    email_template_name = 'password_reset_subject'
    success_message = "We've emailed you instructions for setting your password, " \
                      "if an account exists with the email you entered. You should receive them shortly." \
                      " If you don't receive an email, " \
                      "please make sure you've entered the address you registered with, and check your spam folder."
    success_url = reverse_lazy('users-home')
    
def custom_logout(request):
    logout(request)
    messages.success(request,"You logged out!")
    return HttpResponseRedirect("/")

