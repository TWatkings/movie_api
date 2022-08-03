

const express = require('express');
const morgan = require('morgan');
const { get, endsWith } = require('lodash');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const app = express();

app.use(express.static('public'));
app.use(morgan('common'));
app.use(bodyParser.json());
let users = [
        {
            id:1,
            name:"Tom",
            favoriteMovie:[]
        },
        {
            id:2,
            name:"Bill",
            favoriteMovie:["Fargo"]
        }

]

let movies = [
    {
        "Title": "A Clockwork Orange",
        "Description":"In the future, a sadistic gang leader is imprisoned and volunteers for a conduct-aversion experiment, but it doesn't go as planned.",
        "Genre": {
            "Name":"Crime",
             "Description":"Crime film is a genre that revolves around the action of a criminal mastermind."
        },
        "Director": {
            "Name":"Stanley Kubrick",
            "Birth":"July 26, 1928",
            "Die":"March 7, 1999",
            "Bio": "Born in New York City on July 26, 1928, Stanley Kubrick worked as a photographer for Look magazine before exploring filmmaking in the 1950s. He went on to direct a number of acclaimed films, including Spartacus (1960), Lolita (1962), Dr. Strangelove (1964), A Clockwork Orange (1971), 2001: A Space Odyssey (1968), The Shining (1980), Full Metal Jacket (1987) and Eyes Wide Shut (1999). Kubrick died in England on March 7, 1999."
        },
        "ImageUrl":"https://cdn.britannica.com/61/197661-050-A3F3C598/Movie-poster-A-Clockwork-Orange-Stanley-Kubrick.jpg",
        "Year":"1971"

    },
    {
        "Title": "Fargo",
        "Description":"Minnesota car salesman Jerry Lundegaard's inept crime falls apart due to his and his henchmen's bungling and the persistent police work of the quite pregnant Marge Gunderson.",
        "Genre": {
            "Name":"Crime",
             "Description":"Crime film is a genre that revolves around the action of a criminal mastermind."
        },
        "Director": {
            "Name":"Joel Coen",
            "Birth":"November 29, 1994",
            "Bio": "Joel Daniel Coen is an American filmmaker who regularly collaborates with his younger brother Ethan. They made Raising Arizona, Barton Fink, Fargo, The Big Lebowski, True Grit, O Brother Where Art Thou?, Burn After Reading, A Serious Man, Inside Llewyn Davis, Hail Caesar and other projects. Joel married actress Frances McDormand in 1984 and had an adopted son."
        },
        "ImageUrl":"https://www.tvguide.com/a/img/catalog/provider/1/2/1-172328555.jpg",
        "Year":"1996"
    },
    {
        "Title": "Pulp fiction",
        "Description":"The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
        "Genre": {
            "Name":"Crime",
             "Description":"Crime film is a genre that revolves around the action of a criminal mastermind."
        },
        "Director": {
            "Name":"Quentin Tarantino",
            "Birth":"March 27, 1963",
            "Bio": "Born in Tennessee in 1963, Quentin Tarantino moved to California at age 4. His love of movies led to a job in a video store, during which time he wrote the scripts for True Romance and Natural Born Killers. Tarantino's directorial debut came with 1992's Reservoir Dogs, but he received widespread critical and commercial acclaim with Pulp Fiction (1994), for which he won an Academy Award for best screenplay. Subsequent features included Jackie Brown (1997), Kill Bill: Vol. 1 (2003) and Vol. 2 (2004) and Grindhouse (2007). Tarantino earned several award nominations for Inglourious Basterds (2009) and Django Unchained (2012), the latter garnering him a second Oscar win for best screenplay, and he went on to write and direct The Hateful Eight (2015) and Once Upon a Time... in Hollywood (2019)."
        },
        "ImageUrl":"https://www.miramax.com/assets/Pulp-Fiction1.png",
        "Year":"1994"
    },
    {
        "Title": "Forrest gump",
        "Description":"The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75, whose only desire is to be reunited with his childhood sweetheart.",
        "Genre": {
            "Name":"Comedy-drama",
             "Description":"Comedy drama is a genre of dramatic works that combines elements of comedy and drama."
        },
        "Director": {
            "Name":"Robert Zemeckis",
            "Birth":"May 14, 1951",
            "Bio": "A whiz-kid with special effects, Robert is from the Spielberg camp of film-making. Usually working with writing partner Bob Gale, Robert's earlier films show he has a talent for zany comedy (Romancing the Stone (1984), 1941 (1979)) and special effect vehicles (Who Framed Roger Rabbit (1988) and Back to the Future (1985)). His later films have become more serious, with the hugely successful Tom Hanks vehicle Forrest Gump (1994) and the Jodie Foster film Contact (1997), both critically acclaimed movies. Again, these films incorporate stunning effects. Robert has proved he can work a serious story around great effects."
        },
        "ImageUrl":"https://images.sellbrite.com/production/152272/P286-FR001/2908f46a-efb1-532a-bb20-e0d5ba1b6c45.jpg",
        "Year":"1994"
    },
    {
        "Title": "There will be blood",
        "Description":"A story of family, religion, hatred, oil and madness, focusing on a turn-of-the-century prospector in the early days of the business.",
        "Genre": {
            "Name":"Historical-drama",
             "Description":"A historical drama is a work set in a past time period, usually used in the context of film and television. "
        },
        "Director": {
            "Name":"Paul Thomas Anderson",
            "Birth":"June 26, 1970",
            "Bio": "Paul Thomas Anderson, is an American filmmaker. He developed an interest in filmmaking from a young age. He made his feature-film debut with Hard Eight (1996). He found critical and commercial success with Boogie Nights (1997) and received further accolades with Magnolia (1999) and Punch-Drunk Love (2002), a romantic comedy-drama film."
        },
        "ImageUrl":"https://www.spectatornews.com/wp-content/uploads/2015/11/WEB_there-will-be-blood-641x900.jpg",
        "Year":"2007"
    }
]; 

app.get('movies/', (req, res) => {
    res.send('MY Fav Movies List')
});

//CREATE
app.post('/users', (req, res) => {
    const newUser = req.body;

    if (newUser.name) {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).json(newUser)
    } else {
        res.status(400).send('users need names')
    }
});

//Update
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const updatedUser = req.body;

    let user = users.find(user => user.id == id);

    if (user) {
        user.name = updatedUser.name;
        res.status(200).json(user);
    } else {
        res.status(400).send('no such user')
    }
});
// CREATE
app.post('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;
  
    let user = users.find( user => user.id == id ); //search user by id
  
    if (user) {
      user.favoriteMovie.push(movieTitle);
      res.status(200).send(`${movieTitle} has been added to ${user.name}'s array`);
    } else {
      res.status(400).send('No such user found!');
    }
  });

//DELETE
app.delete('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;
  
    let user = users.find( user => user.id == id );
  
    if (user) {
      user.favoriteMovie = user.favoriteMovie.filter(title => title !== movieTitle);
      res.status(200).send(`${movieTitle} has been removed from ${user.name}'s array`);
    } else {
      res.status(400).send('No such user found!');
    }
  });
  //DELETE
  app.delete('/users/:id/', (req, res) => {
    const { id } = req.params;
  
    let user = users.find( user => user.id == id );
  
    if (user) {
      users = users.filter(user => user.id != id);
      res.status(200).send(`user ${user.name}' has been deleted`)
    } else {
      res.status(400).send('No such user');
    }
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