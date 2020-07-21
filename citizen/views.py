from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, redirect, reverse
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse

from django.contrib.auth.models import User
from .models import Citizen, Municipality, Area, Survey
from .data import supplyByWeek
survey_flag = False

def index(request):
    if request.user.is_authenticated:
        return HttpResponseRedirect(reverse("dashboard"))
    else:
        return render(request, "citizen/index.html")

def login_view(request):
    if request.method == "POST":
        email = request.POST.get('email')
        password = request.POST.get('password')
        user = authenticate(request, username=email, password=password)
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            context = {"error": "Incorrect email or password"}
            return render(request, "citizen/login.html", context)
        
    return render(request, "citizen/login.html")

def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))

def signup_view(request):
    if request.method == "POST":
        first_name = (request.POST["first_name"]).title()
        last_name = (request.POST["last_name"]).title()
        email = request.POST["email"]
        password = request.POST["password"]

        municipality_id = int(request.POST["municipality"])
        area_id = int(request.POST["area"])

        # Attempt to create new user
        if User.objects.filter(username=email).exists():
            error = "It looks like there's already an account with " + email
            return render(request, "citizen/signup.html", {
                "error": error
            })
        else:
            try:
                user = User.objects.create_user(username=email, email=email, password=password, first_name=first_name, last_name=last_name)
                area = Area.objects.get(id=area_id)
                user.save()
                citizen = Citizen(user=user, area=area)
                citizen.save()
            except:
                error = "Oops, something went wrong! Try again"
                return render(request, "citizen/signup.html", {
                    "error": error
                })
        
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        context={}
        global survey_flag
        if survey_flag:
            context['survey'] = survey_flag
            survey_flag = False
        return render(request, "citizen/signup.html", context)

def survey(request):
    if request.user.is_authenticated:
        if request.method == "POST" :
            supply_time = int(request.POST.get('supply_time'))
            tanker = int(request.POST.get('tanker'))
            comment = request.POST.get('comment')
            try:
                citizen = Citizen.objects.get(user=request.user)
                survey = Survey(citizen=citizen, supply_time=supply_time, tanker=tanker, comment=comment)
                survey.save()
                return HttpResponse(status=200)
            except:
                return HttpResponse(status=500)
            
        else:
            return render(request, "citizen/survey.html")
    else:
        global survey_flag
        survey_flag = True
        return HttpResponseRedirect(reverse("signup"))

def profile(request):
    return HttpResponseRedirect(reverse("index"))

def dashboard(request):
    return render(request, "citizen/dashboard.html")




# API

def municipality(request):
    municipalities = list(Municipality.objects.values())
    return JsonResponse({"municipalities" : municipalities})

def area(request, id):
    try:
        municipality = Municipality.objects.get(id=id)
        areas = list(municipality.areas.values())
    except:
        areas = []
    return JsonResponse({"areas" : areas})

def byweek(request, id):
    try:
        area = Area.objects.get(id=id)
    except:
        return HttpResponse(status=404)
    supply = supplyByWeek(area)
    return JsonResponse({"area" : supply})