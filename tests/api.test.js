const dotenv = require('dotenv');
const axios = require('axios');
dotenv.config();
const { API_URL } = process.env;

test('test device array', () => {
    expect.assertions(1);
    return axios.get(`${API_URL}/devices`)
    .then(resp => resp.data)
    .then(resp => {
        // console.log(resp[0]);
        expect(resp[0].user).toEqual('mary123');
        // expect(resp[0].user).toEqual('notaus');
    });
});

test('Test Authentication Endpoint', () => {
    const auth = 0;
    // expect.assertions(1);
    axios.post(`${API_URL}/authenticate`, {
        user: 'admin',
        passwordInput: 'password'
    })
    .then((response) =>{
        if (response.success) {
            auth + 1;
            console.log(auth);
            expect(auth).toEqual(1);
        }
    })
});
