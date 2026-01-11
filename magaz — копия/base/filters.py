import django_filters
from .models import *


# brands filter 

class BrandFilter(django_filters.FilterSet):
    brand = django_filters.ModelMultipleChoiceFilter(
        queryset=Brand.objects.all(),
        field_name='brand'
    )

    class Meta:
        model = Products
        fields = ['brand']
        