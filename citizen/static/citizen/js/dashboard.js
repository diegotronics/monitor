var municipalities = []

document.addEventListener('DOMContentLoaded', function () {
    get_municipalities();
    document.getElementById('areas').addEventListener('change', function (e) {
        get_area_data(this.value)
    });
    
    create_map()
});

function get_municipalities() {
    fetch('/api/municipality')
        .then(response => response.json())
        .then(res => {
            municipalities = res.municipalities
            get_areas(municipalities[0].id);
            // When more than one municipality exists, another select is added within the dashboard
        });
}

function get_areas(id) {
    fetch('/api/municipality/' + id).then(response => response.json())
        .then(res => {
            let areas = res.areas
            let sel = document.getElementById('areas');
            for (let i = 0; i < areas.length; i++) {
                let opt = document.createElement('option');
                opt.appendChild(document.createTextNode(areas[i].name))
                opt.value = areas[i].id;
                sel.appendChild(opt);

                if (i === 0){
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