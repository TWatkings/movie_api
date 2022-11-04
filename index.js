//Integrating Mongoose 
const mongoose = require('mongoose');
const Models = require('./models.js');
const Movies = Models.Movie;
const Users = Models.User;

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
 const uuid = require('uuid');  
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true }));
const cors = require('cors');
app.use(cors());
const { check, validationResult } = require('express-validator');
let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

mongoose.connect( process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// mongoose.connect('mongodb://localhost:27017/myFlixDB', {useNewUrlParser: true, useUnifiedTopology: true});

app.use(express.static('public'));
app.use(morgan('common'));
app.use(bodyParser.json());

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.js'));
});
app.get('/movies', (req, res) => {
    res.send('MY Fav Movies List')
});
//JTW authentication 
// app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
//   Movies.find()
//     .then((movies) => {
//       res.status(201).json(movies);
//     })
//     .catch((error) => {
//       console.error(error);
//       res.status(500).send('Error: ' + error);
//     });
// });
//Add a user
app.post('/users', 
[
  check('Username', 'Username is required').isLength({min: 5}),
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email does not appear to be valid').isEmail()
], (req, res) => {
  // check the validation object for errors
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  let hashedPassword = Users.hashPassword(req.body.Password); //hashedPassword
  Users.findOne({ Username: req.body.Username }) // Search to see if a user with the requested username already exists
  .then((user) => {
    if(user) {
       //If the user is found, send a response that it already exists
      return res.status(400).send(req.body.Username + 'already exists');
    } else {
      Users 
        .create({
          Username: req.body.Username,
          Password: hashedPassword,
          Email: req.body.Email,
          Birthday: req.body.Birthday
        })
        .then((user) => {res.status(201).json(user)})
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
    }
  })
  .catch((error) => {
    console.error(error);
    res.status(500).send('Error: ' + error);
  });
});
// Get all users
app.get('/users', (req, res) => {
  Users.find()
  .then((users) => {
    res.status(201).json(users);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});
// Get a user by username
app.get('/users/:Username', (req, res) => {
  Users.findOne({Username: req.params.Username })
  .then((user) => {
    res.json(user);
  })
  .catch((err) => {
    console.error(err);
    res.status(500),send('Error: ' + err);
  });
});
// Update a user's info, by username
app.put('/users/:Username', 
[
  check('Username', 'Username is required').isLength({min: 5}),
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email dies not appear to be valid').isEmail()
], (req, res) => {
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  let hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});
// Add a movie to a user's list of favorites
app.post('/users/:Username/movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
     $push: { FavoriteMovies: req.params.MovieID }
   },
   { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

//CREATE with uuid
// app.post('/users', (req, res) => {
//     const newUser = req.body;

//     if (newUser.name) {
//         newUser.id = uuid.v4();
//         users.push(newUser);
//         res.status(201).json(newUser)
//     } else {
//         res.status(400).send('users need names')
//     }
// });

  // Delete a user by username
app.delete('/users/:Username', (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});
//Read
app.get('/movies', (req, res) => {
    res.status(200).json(Movies);
});

//Read

app.get('/movies/:title', (req, res) => {
    const {title} = req.params;
    const movie = movie.find( movie => movie.Title === title );
  
    if (movie) {
      res.status(200).json(movie);
    } else {
      res.status(400).send('Movie not found');
    }
  });
  
  //Read

app.get('/movies/genre/:genreName', (req, res) => {
    const { genreName } = req.params;
    const genre = Movies.find( movie => movie.Genre.Name === genreName).Genre;
  
    if (genre) {
      res.status(200).json(genre);
    } else {
      res.status(400).send('genre not found');
    }
  });

   //Read

app.get('/movies/director/:directorName', (req, res) => {
    const { directorName } = req.params;
    const director = Movies.find( movie => movie.Director.Name === directorName).Director;
  
    if (director) {
      res.status(200).json(director);
    } else {
      res.status(400).send('director not found');
    }
  });

app.use('/Documentation', express.static('public'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("something broke!");
});







const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
    console.log('Listening on port ' + port);
  });



  