//Configuring Mongoose
const mongoose = require('mongoose');
//bcrypt Hashing
const bcrypt = require('bcrypt');
//Defining the Schema
let movieSchema = mongoose.Schema({
    Title: {type: String, require: true}, // Required schema
    Description: {type: String, require: true},
    Genre: {
        Name: String,
        Description: String
    },
    // Subdocuments schema
    Director: {
        Name: String,
        Bio: String
    },
    Actors: [String], //Arrays schema
    ImagePath: String // Data Type Schema
});

let userSchema = mongoose.Schema({
    Username: {type: String, require: true}, // Required schema
    Password: {type: String, require: true},
    Email: {type: String, require: true},
    Birthday: Date, // Data Type Schema
    FavoriteMovies: [{type: mongoose.Schema.Types.ObjectId,ref: 'Movie'}] //Reference schema
});
// Hash Password
userSchema.statics.hashPassword = (Password) => {
    return bcrypt.hashSync(Password, 10);
};
//Compares Hash Password
userSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.Password);
};
// Creation of the Models
let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);
//Exporting the Models
module.exports.Movie = Movie;
module.exports.User = User;
