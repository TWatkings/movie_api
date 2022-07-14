const express = require('express');
      morgan = require('morgan');
const { get } = require('lodash');
const app = express();

app.use(morgan('common'));

let topMovies = [
    {
        movie: 'A clockwork orange'
    },
    {
        movie: 'fargo'
    },
    {
        movie: 'Pulp fiction'
    },
    {
        movie: 'Forrest Gump'
    },
    {
        movie: 'There will be blood'
    }
]; 

app.get('/', (req, res) => {
    res.send('MY Fav Movies List')
});

app.get('/movies', (req, res) => {
    res.json(topMovies);
});

app.use('/Documentation', express.static('public'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("something broke!");
});








app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
  });