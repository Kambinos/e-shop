from django import forms 
from django.contrib.auth.forms import UserCreationForm, PasswordResetForm
from django.contrib.auth import get_user_model

class RegisterForm(UserCreationForm):
    email = forms.CharField(widget=forms.EmailInput(attrs={"placeholder": "Enter email-address", "class":"form-control"}))
    username = forms.CharField(widget=forms.TextInput(attrs={"placeholder":"Enter email-username", "class":"form-control"}))
    first_name = forms.CharField(widget=forms.TextInput(attrs={"placeholder":"Enter first-name","class":"form-control"}))
    last_name = forms.CharField(widget=forms.TextInput(attrs={"placeholder":"Enter last-name","class":"form-control"}))
    phone = forms.CharField(widget=forms.TextInput(attrs={"placeholder":"Enter phone-number", "class":"form-control"}))
    password1 = forms.CharField(label="Password", widget=forms.PasswordInput(attrs={"placeholder":"Enter password","class":'form-control'})) 
    password2 = forms.CharField(label="Password", widget=forms.PasswordInput(attrs={"placeholder":"Confirm password","class":'form-control'})) 

    class Meta:
        model = get_user_model()
        fields = ["email", "username", "phone", "password1", "password2", "first_name", "last_name",]

class CustomPasswordResetForm(PasswordResetForm):
    email = forms.EmailField(
        label = "Email",
        max_length=254, 
        widget=forms.EmailInput
        (attrs={"class":"form-control", "placeholder": "Ваш email"})
    )

class UserUpdateForm(forms.ModelForm):
    username = forms.CharField(widget=forms.TextInput(attrs={"placeholder":"Enter email-username", "class":"form-control"}))
    phone = forms.CharField(widget=forms.TextInput(attrs={"placeholder":"Enter phone-number", "class":"form-control"}))
    first_name = forms.CharField(widget=forms.TextInput(attrs={"placeholder":"Enter first-name","class":"form-control"}))
    last_name = forms.CharField(widget=forms.TextInput(attrs={"placeholder":"Enter last-name","class":"form-control"}))

    class Meta:
        model = get_user_model()
        fields = ['username', 'phone', 'first_name', 'last_name']