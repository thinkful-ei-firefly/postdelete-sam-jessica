/* eslint-disable strict */
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const uuid = require('uuid/v4');

const app = express();
const { NODE_ENV } = require('./config')

const morganOption = (NODE_ENV === 'production') ? 'tiny' : 'common';

const users = [
  {
  "id": "3c8da4d5-1597-46e7-baa1-e402aed70d80",
  "username": "sallyStudent",
  "password": "c00d1ng1sc00l",
  "favoriteClub": "Cache Valley Stone Society",
  "newsLetter": "true"
  },
  {
  "id": "ce20079c-2326-4f17-8ac4-f617bfd28b7f",
  "username": "johnBlocton",
  "password": "veryg00dpassw0rd",
  "favoriteClub": "Salt City Curling Club",
  "newsLetter": "false"
  }
]

const clubs = [
  'Cache Valley Stone Society',
  'Ogden Curling Club',
  'Park City Curling Club',
  'Salt City Curling Club',
  'Utah Olympic Oval Curling Club'
];

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());
app.use(express.json());


app.get('/users', (req, res) => {
  return res.json(users)
})


app.post('/users', (req, res) => {
  const {username, password, favoriteClub, newsLetter=false} = req.body;

  if (!username) {
    return res
      .status(400)
      .send('Must provide valid username')
  }

  if (!password) {
    return res
      .status(400)
      .send('Must provide valid password')
  }

  if (!clubs.includes(favoriteClub)) {
    return res
      .status(400)
      .send('Must provide valid club')
  }

  if (username.length < 6 || username.length > 20) {
    return res
      .status(400)
      .send('Username must be between 6 and 20 characters')
  }

  if (password.length < 6 || password.length > 20) {
    return res
      .status(400)
      .send('Password must be between 6 and 20 characters')
  }

  const newUser = {id: uuid(), username, password, favoriteClub, newsLetter}
  users.push(newUser);

  return res
    .status(201)
    .json(newUser.id);
});


app.delete('/users/:userid', (req, res) => {
  
  const userindex = users.findIndex( user => user.id === req.params.userid);

  if (userindex >= 0) {
    users.splice(userindex, 1);
    return res
      .status(204)
      .json(users);
  }

  return res 
    .status(400)
    .send('User id does not exist');

});


app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } };
  } else {
    console.error(error);
    response = {message: error.message, error };
  }
  res.status(500).json(response);
})

module.exports = app