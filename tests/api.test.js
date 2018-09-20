const dotenv = require('dotenv');
const axios = require('axios');
dotenv.config();
const { API_URL } = process.env;

test('test device array', () => {
    expect.assertions(1);
    return axios.get(`${API_URL}/devices`)
    .then(resp => resp.data)
    .then(resp => {
        expect(resp[0].user).toEqual('mary123');
    });
});

test('Test Authentication Endpoint', () => {
    expect.assertions(1);
    return axios.post(`${API_URL}/authenticate`, {
        user: 'admin',
        passwordInput: 'password'
    })
    .then(resp => {
        data = JSON.stringify(resp.data)
        expect(data).toContain('Authenticated successfully');
    })
    .catch(function (error) {
        console.log(error);
    })
});

test('Register: User Already Exists', () => {
    expect.assertions(1);
    return axios.post(`${API_URL}/register`, {
        name: 'admin',
    })
    .then(resp => {
        data = JSON.stringify(resp.data)
        expect(data).toContain('user already exists');
    })
    .catch(function (error) {
        console.log(error);
    })
});

test('Device History Test', () => {
    expect.assertions(1);
    return axios.get(`${API_URL}/devices/5b8132c9a389134a73b7f234/device_history`)
    .then(resp => {
        data = JSON.stringify(resp.data)
        expect(data).toContain('1529542743');
    })
    .catch(function (error) {
        console.log(error);
    })
});

test('User Allocated Devices', () => {
    expect.assertions(1);
    return axios.get(`${API_URL}/users/admin/devices`)
    .then(resp => {
        data = JSON.stringify(resp.data)
        expect(data).toContain('5b9b98c3b3455d1ae97de275');
    })
    .catch(function (error) {
        console.log(error);
    })
});

//NEED TO MAKE DELETE ENDPOINT
// test('Register Endpoint', () => {
//     expect.assertions(1);
//     return axios.post(`${API_URL}/register`, {
//         name: 'test',
//         password: 'password'
//     })
//     .then(resp => {
//         data = JSON.stringify(resp.data)
//         expect(data).toContain('Created new user');
//         axios.delete(`${API_URL}/users/test`);
//     })
//     .catch(function (error) {
//         console.log(error);
//     })
// });