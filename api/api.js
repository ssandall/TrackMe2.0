const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URL);

const Device = require('./models/devices'); 
const User = require('./models/user');

app.use(bodyParser.json());
app.use(express.json());

//SOURCE OF THE ERROR WITH THE POST REQUEST
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-RequestedWith,Content-Type, Accept");
  next();
 });

//POST Endpoint for api/send-command
app.post('/api/send-command',(req, res) => {
  const {command} = req.body
  console.log('Something meaningful')
});

//POST Endpoint for api/authenticate
app.post('/api/authenticate', (req, res) => {
  const { user, passwordInput } = req.body;
  console.log(req.body);
  User.findOne({name: user},(err, found) =>{
      if (err){
          console.log('Not Sending err')
          return res.send(err);
      }
      else if (!found){
        console.log('Req body stuff:')
        console.log(req.body)
        return res.send("User doesnt exist")
      }
      else if (found.password !== passwordInput){
        return res.send("Incorrect Password")
      }
      else {
          return res.json({
              success: true,
              message: 'Authenticated successfully',
              isAdmin: found.isAdmin
             });
      }
  }
  )})

// POST Endpoint for /api/register
app.post('/api/register', (req, res) => {
  const {name, password, isAdmin} = req.body;
  console.log('req.body data from register post endpoint:')
  console.log(req.body);
  console.log(name);
  console.log(password);
  User.findOne({ 'name': name }, function (err, user) {
    if(err!=null){
      console.log('Err section api/register');
      return res.json({
        success: false,
        message: err
      });
    }
    else{
      if(user!=null){
        console.log('user !=null api/register');
         console.log(name);
         console.log(password);
        return res.json({
          success: false,
          message: "user already exists"
        });
      }
      else{
        console.log(req.body);
        console.log("create new user");
        const newUser = new User({
          name,
          password,
          isAdmin
        });

        newUser.save(err => {
          return err
          ? res.send(err)
          : res.json({
            success: true,
            message: 'Created new user'
          });
        });
      }
    }
  });
});

//GET Endpoint for /api/test
app.get('/api/test', (req, res) => {
  res.send('The API is working!');
});

//GET Endpoint for /api/devices
app.get('/api/devices', (req, res) => {
  Device.find({}, (err, devices) => {
    return err
    ? res.send(err)
    : res.send(devices)
  });
});

//GET Endpoint for /api/deices Device History
app.get('/api/devices/:deviceId/device_history', (req, res) => {
  const { deviceId } = req.params;
  console.log("Device Id is: ", deviceId);
  Device.findOne({"_id": deviceId }, (err, devices) => {
    console.log(devices);
    const { sensorData } = devices;
    console.log(sensorData);
    return err
    ? res.send(err)
    : res.send(sensorData);
  });
});

//GET Endpoint for user devices
app.get('/api/users/:user/devices', (req, res) => {
  const { user } = req.params;
  Device.find({ "user": user }, (err, devices) => {
  return err
  ? res.send(err)
  : res.send(devices);
  });
});

//POST Endpoint for api/devices registering new devices.
 app.post('/api/devices', (req, res) => {
  const { name, user, sensorData } = req.body;
  const newDevice = new Device({
    name,
    user,
    sensorData
  });
  newDevice.save(err => {
    return err
    ? res.send(err)
    : res.send('successfully added device and data');
  });
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
