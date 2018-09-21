const mqtt = require('mqtt');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const randomCoordinates = require('random-coordinates');
const rand = require('random-int');

const { URL, USERNAME, PASSWORD } = process.env;
const Device = require('./models/device'); 

const app = express();
const port = process.env.PORT || 5001;

app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect(process.env.MONGO_URL,{ useNewUrlParser: true });

const client = mqtt.connect(URL, {
    username: USERNAME,
    password: PASSWORD
});

client.on('connect', () => {
    console.log('mqtt connected');
    client.subscribe('/sensorData');
    console.log('Client Subscribed to sensorData');
});

client.on('message', (topic, message) => {
    if (topic == '/sensorData') {

        const data = JSON.parse(message);

        Device.findOne({"name": data.deviceId }, (err, device) => {
            if (err) {
                console.log(err);
            }
            const { sensorData } = device;
            const { ts, loc, temp } = data;

            sensorData.push({ ts, loc, temp });
            device.sensorData = sensorData;

            device.save(err => {
                if (err) {
                    console.log(err);
                }
            });
        });
    }
});

//PUT /sensor-data endpoint
app.put('/sensor-data', (req, res) => {

    const { deviceId } = req.body;

    const [lat, lon] = randomCoordinates().split(", ");
    const ts = new Date().getTime();
    const loc = { lat, lon };
    const temp = rand(20, 50);

    const topic = `/sensorData`;
    const message = JSON.stringify({ deviceId, ts, loc, temp });

    client.publish(topic, message, () => {
        res.send('published new message');
    });
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