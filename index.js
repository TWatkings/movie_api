//Integrating Mongoose 
const mongoose = require('mongoose');
const Models = require('./models.js');
const Movies = Models.Movie;
const Users = Models.User;

const express = require('express');
const morgan = require('morgan');
const { get, endsWith } = require('lodash');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true }));
let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

mongoose.connect('mongodb://localhost:27017/myFlixDB', {useNewUrlParser: true, useUnifiedTopology: true});

app.use(express.static('public'));
app.use(morgan('common'));
app.use(bodyParser.json());


app.get('movies/', (req, res) => {
    res.send('MY Fav Movies List')
});
//JTW authentication 
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});
//Add a user
/* We’ll expect JSON in this format
{
  ID: Integer,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
}*/
app.post('/users', (req, res) => {
  Users.findOne({Username: req.body.Username })
  .then((user) => {
    if(user) {
      return res.status(400).send(req.body.Username + 'already exists');
    } else {
      Users 

        .create({
          Username: req.body.Username,
          Password: req.body.Password,
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
/* We’ll expect JSON in this format
{
  Username: String,
  (required)
  Password: String,
  (required)
  Email: String,
  (required)
  Birthday: Date
}*/
app.put('/users/:Username', (req, res) => {
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

// CREATE
// app.post('/users/:id/:movieTitle', (req, res) => {
//     const { id, movieTitle } = req.params;
  
//     let user = users.find( user => user.id == id ); 
  
//     if (user) {
//       user.favoriteMovie.push(movieTitle);
//       res.status(200).send(`${movieTitle} has been added to ${user.name}'s array`);
//     } else {
//       res.status(400).send('No such user found!');
//     }
//   });
  //Update
// app.put('/users/:id', (req, res) => {
//   const { id } = req.params;
//   const updatedUser = req.body;

//   let user = users.find(user => user.id == id);

//   if (user) {
//       user.name = updatedUser.name;
//       res.status(200).json(user);
//   } else {
//       res.status(400).send('no such user')
//   }
// });
//DELETE
// app.delete('/users/:id/:movieTitle', (req, res) => {
//     const { id, movieTitle } = req.params;
  
//     let user = users.find( user => user.id == id );
  
//     if (user) {
//       user.favoriteMovie = user.favoriteMovie.filter(title => title !== movieTitle);
//       res.status(200).send(`${movieTitle} has been removed from ${user.name}'s array`);
//     } else {
//       res.status(400).send('No such user found!');
//     }
//   });
//   //DELETE
//   app.delete('/users/:id/', (req, res) => {
//     const { id } = req.params;
  
//     let user = users.find( user => user.id == id );
  
//     if (user) {
//       users = users.filter(user => user.id != id);
//       res.status(200).send(`user ${user.name}' has been deleted`)
//     } else {
//       res.status(400).send('No such user');
//     }
//   });
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
    res.status(200).json(movies);
});

//Read

app.get('/movies/:title', (req, res) => {
    const {title} = req.params;
    const movie = movies.find( movie => movie.Title === title );
  
    if (movie) {
      res.status(200).json(movie);
    } else {
      res.status(400).send('Movie not found');
    }
  });
  
  //Read

app.get('/movies/genre/:genreName', (req, res) => {
    const { genreName } = req.params;
    const genre = movies.find( movie => movie.Genre.Name === genreName).Genre;
  
    if (genre) {
      res.status(200).json(genre);
    } else {
      res.status(400).send('genre not found');
    }
  });

   //Read

app.get('/movies/director/:directorName', (req, res) => {
    const { directorName } = req.params;
    const director = movies.find( movie => movie.Director.Name === directorName).Director;
  
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








app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
  });



  