# Overview
Venezuela has certain regions where the supply of water suffers from an alarming irregularity and scarcity <small>[1](https://www.csis.org/analysis/unraveling-water-crisis-venezuela)</small>. where it is estimated that only 18% of the population has regular access to the service.

This project is a web platform for surveys related to a community's water supply. It will allow the collection of direct information from the neighbors and will serve both to claim the competent authorities and to designate greater resources to the most affected areas.

The **survey** consists of two questions and one textarea for optional comments:
1. **Approximate water supply time this week in hours**
    
    There are three options to choose from:
    1) Less than 6 hours a week
    2) Between 6 and 24 hours a week
    3) More than 24 hours a week
2. **Did you get any tankers this week?**
    1) Yes
    2) No
3. **Comments (optional)**

The whole application is based on the Django framework, which allowed managing user authentication, database models, http requests, static files and the html page rendering.

On the other hand, user interface was designed with bootstrap, along with additional javascript libraries for page and graphics interaction.

The difference between this web application and previous projects is that this application combines and manages data to generate a dashboard, create the graphics and, above all, give useful information to the community. With the potential to include more features in the future with respect to other services such as gas, sanitation and electricity.

# Structure

The web platform is structured as follows
- **Index:** This is a landing page that allows unregistered users to make the decision whether to view the dashboard directly or take the survey.
- **Sign Up:** This is the page where users can register, indicating their first name, last name, email, password and location.
- **Login:** Page to enter the platform indicating email and password.
- **Survey:** On this page the neighbors, who are previously registered users, fill out a two-question survey, which along with the location gives information that is displayed on the dashboard.
- **Dashboard:** Is an interactive page of public access, for both registered and unregistered users. It contains relevant information taken directly from the surveys.
    - **Week Summary:** In this section we name, in a summarized way, which were the areas with better and worse water supply, which was the one that improved the most compared to the previous week and what percentage of neighbors received a cistern.
    - **Supply Time By Area:** It is a line graph representing the average responses of each user in each specific area.
    - **Comments:** This box shows the most recent comments from the surveys conducted, the location and two icons that show what type of response was given. In addition, the registered user has the ability to give like to the comments (inherited from the network project).
    - **Map:** It is a geographical representation of the average responses given by the neighbours, so it graphically illustrates the water supply
    - **Top Ten:** List of the 10 areas of the municipality with the best or worst performance



# Understanding

For demonstration purposes, the municipality of El Hatillo in the state of Miranda in Venezuela was chosen. It has 16 zones where users can indicate their approximate location. ___It is the only region admitted in the database.___

The folder ```citizen``` is an application within the project ```monitor```, for now is the main and only application of the entire web platform, it is the management of information that comes from the registered neighbors. In the future it is planned to create another application called ```iot``` that allows to join the information of the neighbors along with direct data from monitoring devices located in different areas.

## _models.py_
**```citizen/models.py```** has 5 models for the database:
- **Municipality:** Table of all municipalities (only El Hatillo is admitted for demonstration purposes)
- **Area:** zones within municipalities
- **Citizen:** Extension of the user model, which adds the neighbor's area
- **Survey:** Contains all the information related to the survey, the two questions and the comments add 
- **UserLike:** Model that allows you to give likes to other users' comments

## _data.py_
**```citizen/data.py```** contains the functions to extract the data used in the ```dashboard.html```:
- ```pagination(request, surveys)```  used to extract all the comments from the surveys in batches of 10 comments and associate them to a paginator.
- ```supplyByWeek(area)``` is used to group survey data into weekly periods
- ```getTopten(id)``` extracts the information needed to assemble the top ten board inside the dashboard

## Frontend
From this web platform it stands out the use of javascript to obtain an interactive frontend, where the user can inquire into the data shown as he prefers.

For the charts and lists, the [Chart.js](https://www.chartjs.org/) library was used, simply by passing the data and the labels, the desired charts are already shown.

For the map we used the [Leaflet](https://leafletjs.com/) library, together with the online map provider [Mapbox](https://mapbox.com/). To frame all the areas of the municipality Geojson.io was used


