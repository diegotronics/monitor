from django.contrib.auth.models import User
from django.db import models



class Municipality(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.name}"

class Area(models.Model):
    name = models.CharField(max_length=100)
    municipality = models.ForeignKey(Municipality, related_name="areas", on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.name}. From {self.municipality.name}"

class Citizen(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    area = models.ForeignKey(Area, on_delete=models.CASCADE)
    
    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name} from {self.area.name}"

class Survey(models.Model):
    SUPPLY_CHOICES = ((0, 'Less than 6 Hours per week'), (1, 'More than 6 hours but less than 24 hours this week'), (2, 'More than 24 hours this week'))
    TANKER_CHOICES = ((0, 'No'), (1, 'Yes'))

    date = models.DateTimeField(auto_now_add=True)
    citizen = models.ForeignKey(Citizen, on_delete=models.CASCADE)
    supply_time = models.IntegerField(choices=SUPPLY_CHOICES)
    tanker = models.IntegerField(choices=TANKER_CHOICES)
    comment = models.CharField(max_length=240, blank=True)

    def __str__(self):
        date = self.date.strftime("%d/%m/%Y")
        return f"{date}: {self.citizen.user.first_name} {self.citizen.user.last_name} from {self.citizen.area.name}"