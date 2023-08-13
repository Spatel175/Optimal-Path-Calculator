const express = require('express');
const bodyParser = require('body-parser');
const spawn = require('child_process').spawn;
const cors = require('cors'); // Import the cors package

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Use the cors middleware
app.use(cors());app.get('/', (req, res) => {
  res.send('Server is up and running'); // text to render on server page
});

// bodyParser is used as a formatter to parse the request from client side(app.js)
app.post('/', bodyParser.json(), (req, res) => {
  const {startState, goalState} = req.body;
  console.log('Received data:', startState, goalState);
  const pythonProcess = spawn('python3', ['search_Algorithms2.py', startState, goalState]);
  var d = '';
  var e = '';

  pythonProcess.stdout.on('data', data => {
    //append the data (result) from the script
    d += data;
  });

  pythonProcess.stderr.on('data', data => {
    //catch stderr from kernal for basic stream errors such as input or file.
    e += data;
  });

  pythonProcess.on('close', code => {
    //render and send the RESULT from the executed script from the terminal as JSON object. 
    res.json({ data: d, error: e });
  });
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
