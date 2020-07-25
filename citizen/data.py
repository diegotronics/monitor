from django.db.models.functions import ExtractWeek, ExtractYear
from django.db.models import Avg
from .models import Survey, Citizen, User, Area, Municipality, UserLike
from datetime import datetime
from django.core.paginator import Paginator

def pagination(request, surveys):
    surveys_list = []
    for survey in surveys:
        count = survey.survey_likes.all().count()
        if request.user.is_authenticated:
            liked = (UserLike.objects.filter(survey=survey, author=request.user).count() == True)
        else:
            liked = False
        survey_list = list(Survey.objects.filter(id=survey.id).values())
        survey_list[0]['likes'] = {"count": count, "liked": liked}
        survey_list[0]['first_name'] = survey.citizen.user.first_name
        survey_list[0]['last_name'] = survey.citizen.user.last_name
        survey_list[0]['area'] = survey.citizen.area.name
        survey_list[0]['supply'] = survey.supply_time
        survey_list[0]['tanker'] = survey.tanker
        surveys_list.append(survey_list[0])
    
    surveys = surveys_list
    paginator = Paginator(surveys, 10)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    return page_obj


def supplyByWeek(area):
    surveys = Survey.objects.filter(citizen__area=area)
    stats = list(Survey.objects.filter(citizen__area=area)
                 .annotate(year=ExtractYear('date'))
                 .annotate(week=ExtractWeek('date'))
                 .values('year', 'week')
                 .annotate(avg=Avg('supply_time'))
                 .annotate(tank=Avg('tanker'))
                 )

    for i in range(0, len(stats)):
        date = datetime.strptime(
            f"{stats[i]['year']}" + '-' + f"{(stats[i]['week'] - 1)}" + '-1', '%Y-%W-%w')
        stats[i]['date'] = date.strftime("%d/%m/%Y")
    return stats


def getTopten(id):
    try:
        municipality = Municipality.objects.get(id=id)
        areas = municipality.areas.all()
    except:
        areas = []

    stats = []
    for area in areas:
        supply = supplyByWeek(area)
        year, week, weekday = datetime.now().isocalendar()

        this_week = 0
        last_week = 0
        historic = 0
        this_week_tanker = 0
        last_week_tanker = 0
        historic_tanker = 0
        improved = 0
        for s in supply:
            if(s['week'] == week):
                this_week = s['avg']
                this_week_tanker = s['tank']
            if(s['week'] == week - 1):
                last_week = s['avg']
                last_week_tanker = s['tank']
            historic += s['avg']
            historic_tanker = s['tank']
        if len(supply) != 0:
            historic = historic/len(supply)

        if this_week and last_week:
            improved = this_week - last_week

        stats.append({"id":area.id, "area": area.name, "this_week": this_week, "last_week": last_week, "historic": historic, "improved": improved,
                      "this_week_tanker": this_week_tanker, "last_week_tanker": last_week_tanker, "historic_tanker": historic_tanker})

    return stats
