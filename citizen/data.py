from django.db.models.functions import ExtractWeek, ExtractYear
from django.db.models import Avg
from .models import Survey, Citizen, User, Area
from datetime import datetime

def supplyByWeek(area):
    surveys = Survey.objects.filter(citizen__area=area)
    stats = list(Survey.objects.filter(citizen__area=area)
                 .annotate(year=ExtractYear('date'))
                 .annotate(week=ExtractWeek('date'))
                 .values('year', 'week')
                 .annotate(avg=Avg('supply_time'))
                 )
    
    for i in range(0,len(stats)):
        date=datetime.strptime(f"{stats[i]['year']}" + '-' + f"{stats[i]['week']}" + '-1', '%Y-%W-%w')
        stats[i]['date'] = date.strftime("%d/%m/%Y")
    return stats
