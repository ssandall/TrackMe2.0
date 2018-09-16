const API_URL = 'http://127.0.0.1:5000/api';

// $.get(`${API_URL}/devices`)
//     .then(response => {
//         response.forEach(device => {
//             $('#devices tbody').append(`
//             <tr>
//             <td>${device.user}</td>
//             <td>${device.name}</td>
//             </tr>`
//             );
//         });
//     })
//     .catch(error => {
//     console.error(`Error: ${error}`);
// });

// const currentUser = localStorage.getItem('user');

// if (currentUser) {
//     $.get(`${API_URL}/users/${currentUser}/devices`)
//     .then(response => {
//         response.forEach((device) => {
//             $('#devices tbody').append(`
//                 <tr data-device-id=${device._id}>
//                 <td>${device.user}</td>
//                 <td>${device.name}</td>
//                 </tr>`
//             );
//         });
//     })
//     .catch(error => {
//         console.error(`Error: ${error}`);
//     });
// } 
// else {
//     const path = window.location.pathname;
//     if (path !== '/login') {
//         location.href = '/login';
//     }
// }

$('#devices tbody tr').on('click', (e) => {
 const deviceId = e.currentTarget.getAttribute('data-device-id');
 $.get(`${API_URL}/devices/${deviceId}/device-history`)
 .then(response => {
 console.log(response);
 });
});

$('#add-device').on('click', () => {
    const name = $('#name').val();
    const user = $('#user').val();
    const sensorData = [];
    const body = {
            name,
            user,
            sensorData
        };

        $.post('http://localhost:3001/devices', body)
        .then(response => {
        location.href = '/';
        })

        .catch(error => {
        console.error(`Error: ${error}`);
        }); 
});

//LOGIN CLICK HANDLER. Error somewhere here but cannot understand why. 
//TRIED COMMA CHECKING

$('#login').on('click', () => {
    const user = $('#user').val();
    const passwordInput = $('#password').val();
    $.post(`${API_URL}/authenticate`, { user, passwordInput })
    .then((response) =>{
        if (response.success) {
        localStorage.setItem('user', user);
        localStorage.setItem('isAdmin', response.isAdmin);
        localStorage.setItem('isAuthenticated',true);
        location.href = '/';
        } 
        else {
        $('#message').append(`<p class="alert alert-danger">${response}</p>`);
        }
    });
   });

//Logout functionality moved to navbar.html

$('#register-account').on('click', function() { 
    const name = $('#username').val();
    const password = $('#password').val();
    const passwordConfirm = $('#confirm-password').val();
    const body = {
        name,
        password
    }
    //Checking password credentials match
    const confirmedPassword = password == passwordConfirm
    if (!confirmedPassword){
        $('#passwordError').append('<p class="alert alert-danger" style="font-style: italic"> ERROR: Password does not match </p>')
    }
    else 
        $.post(`${API_URL}/register`, body)
            .then(response =>{
                console.log(response);
                if(response.success){
                location.href = "/login"
                // localStorage.setItem('name', name);
                // localStorage.setItem('isAdmin', response.isAdmin);
                }
            })
        .catch(error => {
            console.log(`Error: ${error}`);
        }
)});

$('#send-command').on('click', function() {
    const command = $('#command').val();
    console.log(`command is: ${command}`);
});

$('#navbar').load('navbar.html',function(){
    //console.log('NAVBAR');
});

$('#footer').load('footer.html',function(){
    //console.log('FOOTER');
});

$('#logo').load('logo.html',function(){
    //console.log('LOGO');
});