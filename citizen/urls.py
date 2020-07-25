from django.urls import path, include
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("signup", views.signup_view, name="signup"),
    path("survey", views.survey, name="survey"),
    path("dashboard", views.dashboard, name="dashboard"),
    # API
    path("api/municipality", views.municipality, name="municipality"),
    path("api/municipality/<int:id>", views.area, name="area"),
    path("api/byweek/<int:id>", views.byweek, name="byweek"),
    path("api/topten/<int:id>", views.topten, name="topten"),
    path("api/likes", views.likes, name="likes"),
]