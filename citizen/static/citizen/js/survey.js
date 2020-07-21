document.addEventListener('DOMContentLoaded', function () {
    validation()
});

function validation() {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.getElementsByClassName('needs-validation');
    // Loop over them and prevent submission
    var validation = Array.prototype.filter.call(forms, function (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            event.stopPropagation();
            if (form.checkValidity() != false) {
                send_survey()
            }
        }, false);
    });
}

function send_survey() {
    let survey = document.getElementById('survey');
    survey = new FormData(survey);
    fetch('/survey', {
            method: 'POST',
            body: survey,
        })
        .then(response => {
            if(response.status === 200){
                $('#SuccessModal').modal('show');
            }
            else{
                $('#ErrorModal').modal('show');
            }
        }).catch((e) => {
            $('#ErrorModal').modal('show');
        });
}