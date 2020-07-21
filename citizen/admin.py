from django.contrib import admin
from .models import Municipality, Area, Citizen, Survey

# Register your models here.
admin.site.register(Municipality)
admin.site.register(Area)
admin.site.register(Citizen)
admin.site.register(Survey)