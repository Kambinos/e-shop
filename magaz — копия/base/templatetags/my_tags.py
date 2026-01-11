from django import template
register = template.Library()

@register.simple_tag(takes_context=True)
def param_replace(context, **kwargs):
    """
    Возвращает текущие параметры URL, заменяя указанные в kwargs.
    Пример использования: {% param_replace page=page_obj.next_page_number %}
    """
    d = context['request'].GET.copy()
    for k, v in kwargs.items():
        d[k] = v
    for k in [k for k, v in d.items() if not v]:
        del d[k]
    return d.urlencode()