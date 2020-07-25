var municipalities = []
var municipality = 0;
var order;
var type;
var topten_list;
var forcedOrder = false;

document.addEventListener('DOMContentLoaded', function () {
    $('#surveyLimitModal').modal('show');
    get_municipalities();
    document.getElementById('areas').addEventListener('change', function (e) {
        get_area_data(this.value)
    });

    document.getElementById('topten_range').addEventListener('change', get_topten_options);
    document.getElementById('best').addEventListener('click', get_topten_options);
    document.getElementById('worst').addEventListener('click', get_topten_options);

    document.getElementById('map_range').addEventListener('change', get_map_options);

    document.querySelectorAll('.like').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            let survey_id = this.children[0].id.split('-');
            survey_id = survey_id[1];
            data = new FormData();
            data.append('survey_id', survey_id)
            fetch('/api/likes', {
                    method: 'POST',
                    body: data,
                })
                .then(response => response.json())
                .then(result => {
                    // Print result
                    let liked = document.getElementById('liked-' + survey_id);
                    let count = document.getElementById('count-' + survey_id);
                    count.innerHTML = result.count
                    if (result.liked) {
                        liked.classList.remove('text-dark');
                        liked.classList.add('text-primary');
                    } else {
                        liked.classList.remove('text-primary');
                        liked.classList.add('text-dark');
                    }

                });
        });
    });

});

function get_municipalities() {
    fetch('/api/municipality')
        .then(response => response.json())
        .then(res => {
            municipalities = res.municipalities;
            municipality = municipalities[0].id
            get_areas();
            get_topten();
        });
}

function get_areas() {
    fetch('/api/municipality/' + municipality).then(response => response.json())
        .then(res => {
            let areas = res.areas
            let sel = document.getElementById('areas');
            for (let i = 0; i < areas.length; i++) {
                let opt = document.createElement('option');
                opt.appendChild(document.createTextNode(areas[i].name))
                opt.value = areas[i].id;
                sel.appendChild(opt);

                if (i === 0) {
                    get_area_data(areas[i].id)
                }
            }
            sel.disabled = false;
        });
}

function get_area_data(id) {
    fetch('/api/byweek/' + id).then(response => response.json())
        .then(res => {
            let labels = []
            let data = []
            for (let i = 0; i < res.area.length; i++) {
                labels.push(res.area[i].date);
                data.push(res.area[i].avg);
            }
            create_area_chart(labels, data)
        });
}

function get_topten() {
    fetch('/api/topten/' + municipality)
        .then(response => response.json())
        .then(res => {
            topten_list = res.topten;
            summaryWeek()
            get_topten_options();
            get_map_options();
        });
}

function get_topten_options() {
    let option = document.querySelector(".btn-group input:checked").id;
    let range = document.getElementById("topten_range");
    range = range.options[range.selectedIndex].value;
    let topten = sort_topten(topten_list, option, range)
    create_bar_chart(topten.labels, topten.data);
}
function get_map_options() {
    let range = document.getElementById("map_range");
    range = range.options[range.selectedIndex].value;
    create_map(topten_list, range);
}

function sort_topten(topten, option, range) {
    order = (option == "best") ? -1 : 1;
    type = (range == 1) ? "this_week" : (range == 2) ? "last_week" : (range == 3) ? "historic" : null;
    topten.sort(compare)

    let labels = []
    let data = []
    for (let i = 0; i < topten.length; i++) {
        if (topten[i][type]) {
            labels.push(topten[i].area);
            data.push(topten[i][type]);
        }
        if (labels.length >= 10) {
            break;
        }
    }
    return {
        labels,
        data
    }
}

function compare(a, b) {
    const typeA = a[type]
    const typeB = b[type]

    let comparison = 0;
    if (typeA > typeB) {
        comparison = 1;
    } else if (typeA < typeB) {
        comparison = -1;
    }

    if(forcedOrder){
        return comparison * (-1);
    }
    else
        return comparison * order
    
}

function summaryWeek(){
    forcedOrder = true;
    let topten = sort_topten(topten_list, "best", 1)
    forcedOrder = false;

    let improved_area = "";
    let improved = - 9000;

    let tanker = 0;
    for (let i = 0; i < topten_list.length; i++){
        if(improved < topten_list[i].improved && topten_list[i].improved != 0){
            improved = topten_list[i].improved;
            improved_area = topten_list[i].area;
        }
        tanker += topten_list[i].this_week_tanker;
    }
    tanker = parseInt(100 * tanker/topten_list.length)


    document.getElementById("best_area").innerHTML = topten.labels[0];
    document.getElementById("worst_area").innerHTML = topten.labels[topten.labels.length - 1];
    document.getElementById("improved_area").innerHTML = improved_area;
    document.getElementById("tanker").innerHTML = tanker + "%";
    $('.progress-bar').css('width', tanker+'%').attr('aria-valuenow', tanker); 
}