const mqtt = require('mqtt');
const express = require('express');
const bodyParser = require('body-parser');
const { URL, USERNAME, PASSWORD } = process.env;

const app = express();
const port = process.env.PORT || 5001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
 extended: true
}));

const client = mqtt.connect(URL, {
 username: USERNAME,
 password: PASSWORD
});

client.on('connect', () => {
 console.log('mqtt connected');
});

app.post('/send-command', (req, res) => {
    const { deviceId, command } = req.body;
    const topic = `/command/${deviceId}`;
    client.publish(topic, command, () => {
        res.send('published new message');
    });
})

app.get('/api/test', (req, res) => {
    res.send('mqtt api is here');
});

app.listen(port, () => {
 console.log(`listening on port ${port}`);
});

// client.on('connect', () => { 
//     console.log('connected');
//     const topic = '/test/hello/';
//     const msg = 'Hello MQTT world!';
//     client.publish(topic, msg, () => {
//     console.log('message sent...');
// });
// });