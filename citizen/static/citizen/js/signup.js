document.addEventListener('DOMContentLoaded', function () {
    get_municipalities()
});

function get_municipalities() {
    fetch('/api/municipality')
        .then(response => response.json())
        .then(res => {
            let sel = document.getElementById('inputMunicipality');
            let mun = res.municipalities
            for (let i = 0; i < mun.length; i++) {
                let opt = document.createElement('option');
                opt.appendChild(document.createTextNode(mun[i].name))
                opt.value = mun[i].id;
                sel.appendChild(opt);
            }
        });

    document.getElementById('inputMunicipality').addEventListener('change', function (e) {
        let id = this.value
        let sel = document.getElementById('inputArea');
        for (let i = sel.options.length; i > 0; i--) {
            sel.remove(i);
        }
        if (id == "") {
            sel.disabled = true;
        } else {
            fetch('/api/municipality/' + id).then(response => response.json())
                .then(res => {
                    let areas = res.areas
                    for (let i = 0; i < areas.length; i++) {
                        let opt = document.createElement('option');
                        opt.appendChild(document.createTextNode(areas[i].name))
                        opt.value = areas[i].id;
                        sel.appendChild(opt);
                    }
                    sel.disabled = false;
                });
        }
    });
}