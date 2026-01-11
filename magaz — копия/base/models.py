import secrets
from django.db import models
from django.urls import reverse
from django.conf import settings 
from django.utils.text import slugify
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AbstractUser
# Create your models here.


class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15, blank=True)

    USERNAME_FIELD = ("email")
    REQUIRED_FIELDS = ["username"]

    def __str__(self):
        return self.email
    

def generate_otp():
    return secrets.token_hex(3)

    
class OtpToken(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="otps")
    otp_code = models.CharField(max_length=6, default=generate_otp)
    tp_created_at = models.DateTimeField(auto_now_add=True)
    otp_expires_at = models.DateTimeField(blank=True, null=True)

class Category(models.Model):
    name = models.CharField(max_length=25)
    slug = models.SlugField(unique=True)

    class Meta:
        ordering = ['name']
        indexes = [
            models.Index(fields=['name']),
        ]
        verbose_name = 'category'
        verbose_name_plural = 'categories'

    def get_absolute_url(self):
        return reverse('base:product_list_by_category', args=[self.slug])
    
    def __str__(self):
        return self.name
    
class Brand(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True)

    class Meta:
        ordering = ['name']
        indexes = [
            models.Index(fields= ['name'])
        ]
        verbose_name = 'brand'
        verbose_name_plural = 'brands'

    def get_absolute_url(self):
        return reverse('base:product_list_by_brand', args=[self.slug])
    
    def __str__(self):
        return self.name
    
class Products(models.Model):
    brand = models.ForeignKey(Brand, on_delete=models.SET_NULL, null=True, blank=True, related_name='products')
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='products/', blank=True, null=True)
    image1 = models.ImageField(upload_to='products/', blank=True, null=True)
    image2 = models.ImageField(upload_to='products/', blank=True, null=True)
    image3 = models.ImageField(upload_to='products/', blank=True, null=True)
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['name']
        indexes = [
            models.Index(fields=['id', 'slug']),
            models.Index(fields=['name']),
            models.Index(fields=['-created_at']),
        ]
        

    def get_all_images(self):
        images = [self.image, self.image1, self.image2, self.image3]
        return [img for  img in images if img]
    
    @property
    def main_image_url(self):
        if self.image and hasattr(self.image, 'url'):
            return self.image.url

    def get_absolute_url(self):
        return reverse('base:product_detail', args=[self.id, self.slug])
    
    def get_default_variant(self):
        """Возвращает предпочтительный вариант для отображения в каталоге."""
        # 1. Ищем вариант с флагом is_default=True
        default = self.variants.filter(is_default=True, stock__gt=0).first()
        if default:
            return default
        # 2. Если нет дефолтного, берем вариант с самой низкой ценой (если в наличии)
        return self.variants.filter(stock__gt=0).order_by('price').first()

    @property
    def default_variant_id(self):
        """ID варианта для отправки в корзину с каталога."""
        variant = self.get_default_variant()
        return variant.id if variant else None

    @property
    def min_available_price(self):
        """Цена для отображения в карточке товара."""
        variant = self.get_default_variant()
        # Используем аннотацию min_price, если метод не нашел вариант
        # Но для безопасности лучше использовать цену дефолтного варианта
        return variant.price if variant else 0.00
    
    def __str__(self):
        return self.name


class ProductVariaty(models.Model):
    product = models.ForeignKey(Products, related_name='variants', on_delete=models.CASCADE)
    ram = models.PositiveBigIntegerField()
    storage = models.PositiveBigIntegerField()
    is_default = models.BooleanField(default=False)
    
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveBigIntegerField(default=0)
    
    def __str__(self):
        return f"{self.product.name} / {self.ram}GB / {self.storage}GB "
    

    
class CartItem(models.Model):
    product = models.ForeignKey(ProductVariaty, on_delete=models.CASCADE)
    quantity = models.PositiveBigIntegerField(default=0)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    date_added = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'product')
    def __str__(self):
        return f"{self.quantity} x {self.product.product.name} ({self.product.ram}/{self.product.storage}) "
    
class WishList(models.Model):
    product = models.ForeignKey(ProductVariaty, on_delete=models.CASCADE)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.product.product.name}"


class ProductReview(models.Model):
    product = models.ForeignKey(Products, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reviews')
    rating = models.PositiveSmallIntegerField(choices=[(i, f'{i} stars') for i in range(1, 6)])
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('product', 'user')
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.rating}★ от {self.user}'
    
class ProductComment(models.Model):
    product = models.ForeignKey(Products, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='comments')
    content = models.TextField()
    parent = models.ForeignKey('self', null=True, blank=True, on_delete=models.CASCADE, related_name='replies')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f'Комментарий от {self.user}'