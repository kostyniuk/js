'use strict';

const express = require('express');
const router = express.Router();

const days = ['Sunday', 'Monday', 'Tuesday',
  'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May',
  'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const infoGeneral = {
  name: 'Alex',
  age: 19,
  country: 'Ukraine'
};

const infoExtend = {
  languages: 'ukrainian, russian, english, svenska(lite)',
  interests: 'football ⚽, music, programming, NBA',
  'e-mail': 'kokos16012000@gmail.com'
};

const date = new Date();

const today = {
  day: date.getDay(),
  date: date.getDate(),
  month: date.getMonth(),
  year: date.getFullYear()
};

// const formQueqe = (from, to) => {
//   const queqe = [];
//   for (let i = from; i < to + 1; i++) {
//     queqe.push(i);
//   }

//   return queqe;
// };

const formDateInput = (day, date, month, year) => {
  return `Today is ${days[day]}, ${date} ${months[month]}, ${year} `;
};

const logger = (req, res, next) => {
  console.log('Just a tiny cozy logger 🥰');
  next();
};

const dateLogger = (req, res, next) => {
  const { day, date, month, year } = today;
  const dayInfo = formDateInput(day, date, month, year);
  res.end(dayInfo);
  next();
};

router.use(logger);

router.use('/day', dateLogger);


router.get('/info/:info', (req, res, next) => {
  console.log(req.params);
  if (req.params.info !== 'general' || !req.params.info) {
    next('route');
  } else next();
}, (req, res) => {
  res.json(infoGeneral);
});

router.get('/info/:info', (req, res) => {
  if (req.params.info === 'extended') res.json(infoExtend);
});

module.exports = router;
