const API_URL = 'http://127.0.0.1:5000/api';

//Device Display according to logged in user
const currentUser = localStorage.getItem('user');
if (currentUser) {
    $.get(`${API_URL}/users/${currentUser}/devices`)
	.then(response => {
		response.forEach((device) => {
			$('#devices tbody').append(`
            <tr data-device-id=${device._id}>
            <td>${device.user}</td>
            <td>${device.name}</td>
            </tr>`
			);
        });
		$('#devices tbody tr').on('click', (e) => {
            const deviceId = e.currentTarget.getAttribute('data-device-id');
            console.log(deviceId);
			$.get(`${API_URL}/devices/${deviceId}/device_history`)
			.then(response => {
				response.map(sensorData => {
					$('#historyContent').append(`
                        <tr>
                            <td>${sensorData.ts}</td>
                            <td>${sensorData.temp}</td>
                            <td>${sensorData.loc.lat}</td>
                            <td>${sensorData.loc.lon}</td>
                        </tr>
                    `);
                });
				$('#historyModal').modal('show');
            });
        });
    })
    .catch(error => {
        console.error(`Error: ${error}`);
    });
}   
 
else {
    const path = window.location.pathname;
    if (path !== '/login') {
        location.href = '/login';
    }
}

//Register/Add Device
$('#add-device').on('click', () => {
    const name = $('#name').val();
    const user = $('#user').val();
    const sensorData = [];
    const body = {
            name,
            user,
            sensorData
        };

        $.post(`${API_URL}/devices`, body)
        .then(response => {
            if(response.success){
                location.href = '/'; 
            }
        })

        .catch(error => {
        console.error(`Error: ${error}`);
        }); 
});

//Loging Click Handler
$('#login').on('click', () => {
    const user = $('#user').val();
    const passwordInput = $('#password').val();
    console.log(user);
    console.log(passwordInput);
    $.post(`${API_URL}/authenticate`, { user, passwordInput })
    .then((response) =>{
        if (response.success) {
        console.log(response);
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

//Account registration click handler
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