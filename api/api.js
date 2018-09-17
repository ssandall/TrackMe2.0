const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URL);

const Device = require('./models/devices'); 
const User = require('./models/user');

app.use(express.static(`${__dirname}/public`));
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
/**
* @api {post} /api/authenticate User Authentication
* @apiGroup User
* @apiSuccessExample {json} Success-Response:
*
*   {
*    success: true,
*    message: 'Authenticated successfully'
*   }
* @apiErrorExample {json} Error-Response:
*   {
*     success: false,
*      message: User doesn't exist
*   }
* @apiErrorExample {json} Error-Response:
*   {
*     success: false,
*     message: Incorrect Password
*   }
*
*/
app.post('/api/authenticate', (req, res) => {
  const { user, passwordInput } = req.body;
  // console.log(req.body);
  User.findOne({name: user},(err, found) =>{
      if (err){
          // console.log('Not Sending err')
          return res.send(err);
      }
      else if (!found){
        // console.log('Req body stuff:')
        // console.log(req.body)
        return res.json({
            success: false,
            message: 'User doesn\'t exist'
        });
      }
      else if (found.password !== passwordInput){
        return res.json({
            success:false,
            message: 'Incorrect Password'
        });
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

/**
* @api {post} /api/register Registering a user
* @apiGroup User
* @apiSuccessExample {json} Success-Response:
* [
*   {
*    success: true,
*    message: 'Created new user'
*   }
* ]
* @apiErrorExample {json} Error-Response:
*   {
*     success: false,
*     message: err
*   }
* @apiErrorExample {json} Error-Response:
*   {
*     success: false,
*      message: "user already exists"
*   }
*
*/
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


/**
* @api {get} /api/devices All Devices in database
* @apiGroup Device
* @apiSuccessExample {json} Success-Response:
* [
  * {
  * "_id": "dsohsdohsdofhsofhosfhsofh",
  * "name": "Mary's iPhone",
  * "user": "mary",
  * "sensorData": [
  * {
  * "ts": "1529542230",
  * "temp": 12,
  * "loc": {
  * "lat": -37.84674,
  * "lon": 145.115113
  * }
  * },
  * {
  * "ts": "1529572230",
  * "temp": 17,
  * "loc": {
  * "lat": -37.850026,
  * "lon": 145.117683
  * }
  * }
  * ]
  * }
  * ]
  * @apiErrorExample {json} Error-Response:
  * {
  * "User does not exist"
  * }
  */
app.get('/api/devices', (req, res) => {
  Device.find({}, (err, devices) => {
    return err
    ? res.send(err)
    : res.send(devices)
  });
});

//GET Endpoint for /api/devices Device History
/**
* @api {get} /api/devices/:deviceId/device_history Device History data for associated user
* @apiGroup Device
* @apiSuccessExample {json} Success-Response:
[
* {
    "ts": "1529542743",
    "temp": 14,
    "loc": {
      "lat": 33.812092,
      "lon": -117.918974
    }
  }
* @apiErrorExample {json} Error-Response:
  {
    err
  }
*/
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
/**
* @api {get} /api/users/:user/devices Retrieves all devices associated with user
* @apiGroup Device
* @apiSuccessExample {json} Success-Response:
* {
    "sensorData": [
        {
            "ts": "1529545935",
            "temp": 14,
            "loc": {
                "lat": -37.839587,
                "lon": 145.101386
            }
        }
    ],
    "_id": "5b9b98c3b3455d1ae97de275",
    "name": "DEVICE FORMAT",
    "user": "admin",
    "__v": 0
  }
* @apiErrorExample {json} Error-Response:
  {
    err
  }
*/
app.get('/api/users/:user/devices', (req, res) => {
  const { user } = req.params;
  Device.find({ "user": user }, (err, devices) => {
  return err
  ? res.send(err)
  : res.send(devices);
  });
});

//POST Endpoint for api/devices registering new devices.
/**
* @api {post} /api/devices Creating new devices and add to mongoDB
* @apiGroup Device
* @apiSuccessExample {json} Success-Response:
*   {
*    success: true,
*    message: 'successfully added device and data'
*   }
* @apiErrorExample {json} Error-Response:
*   {
      err
*   }
*/
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

//GET Endpoint for APIDOC
app.get('/docs', (req, res) => {
  res.sendFile(`${__dirname}/public/generated-docs/index.html`);
 });

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
