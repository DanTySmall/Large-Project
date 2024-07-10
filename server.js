const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const PORT = process.env.PORT || 5000;
const {connectDatabase, closeDatabase} = require('./database');

const app = express();
app.set('port', (process.env.PORT || 5000));

app.use(cors());
app.use(bodyParser.json());

const userAPI = require('./API/user');
const beerAPI = require('./API/beer'); // Import beer API
app.use('/api', userAPI); // Mount user APIs
app.use('/api', beerAPI); // Mount beer API

// CORS Middleware
app.use((req, res, next) => 
{
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS' //May need to potentially update.
  );
  next();
});

// Wrapper that connects to MongoDB using connectDatabase() import
connectDatabase().then(() => {
  try{
    //app.listen(5000); // Starts server on port 5000
    app.listen(PORT, () =>
    {
      console.log('Server listening on port ' + PORT);
    });
    // Add the following for the correct retrieval path -
    // For Heroku deployment
    // Server static assets if in production
    if (process.env.NODE_ENV === 'production')
    {
      // Set static folder
      app.use(express.static('frontend/build'));
      app.get('*', (req, res) =>
      {
        res.sendFile(path.resolve(__dirname, 'frontend', 'build','index.html'));
      });
    }
  }
  catch(error){
    console.log("Server not started...");
  }
})
