from django.contrib import admin
from .models import *
from .models import CustomUser, OtpToken
from django.contrib.auth.admin import UserAdmin
# Register your models here.



@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('name',)}
    list_display = ['id', 'name']
    search_fields = ['name']

@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug':('name',)}
    list_display = ['id', 'name']
    search_fields = ['name']

@admin.register(ProductReview)
class ProductReviewAdmin(admin.ModelAdmin):
    list_display = ['product', 'user', 'rating', 'created_at']
    list_filter = ['rating', 'created_at']
    search_fields = ['user__username', 'product__name']

@admin.register(ProductComment)
class ProductCommentAdmin(admin.ModelAdmin):
    list_display = ['id', 'product', 'user', 'content', 'created_at']
    search_fields = ['user__username', 'product__name', 'content']


class ProductVariatyInline(admin.TabularInline):
    model = ProductVariaty
    extra = 1
    fields = ('ram', 'storage', 'price', 'stock')

@admin.register(Products)
class ProductAdmin(admin.ModelAdmin):
    list_display = [
        'name',
        'slug',
        'created_at',
        'updated_at'
    ]
    list_filter = ['created_at', 'updated_at']
    prepopulated_fields = {'slug': ('name',)}
    inlines = [ProductVariatyInline]


# AUTH

class CustomUserAdmin(UserAdmin):
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'phone', 'password1', 'password2')}
         ),
    )

class OtpTokenAdmin(admin.ModelAdmin):
    list_display = ("user", "otp_code")

admin.site.register(OtpToken, OtpTokenAdmin)
admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(CartItem)

