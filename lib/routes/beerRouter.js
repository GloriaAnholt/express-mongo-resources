/** Created by Gloria Anholt on 11/2/16. **/

const router = require('express').Router();
const bodyParser = require('body-parser').json();
const Beer = require('../models/beer');


router
  .get('/', (req, res, next) => {
    Beer.find()
      .then((results) => {  
        // returns an array of JSON
        res.send(results);
      })
      .catch((err) => {
        console.error('GET /beer error: ', err);
        next(err);
      });
  })
  .get('/:name', (req, res, next) => {
    Beer.findOne({ 'name': req.params.name })
      .then((results) => {
        // returns JSON of beer, if found
        res.send(results);
      })
      .catch((err) => {
        console.error('GET /beer/:name error: ', err);
        next(err);
      });
  })
  .put('/:name', bodyParser, (req, res, next) => {
    // TODO: This routes doesn't actually update the database.
    Beer.findOneAndUpdate(
      { 'name': req.params.name },
      req.body,
      // upsert will create the object if it's not found, new sends back the modified object
      { upsert: true, runValidators: true, setDefaultsOnInsert: true, new: true })
      .then(response => { res.send(`${req.params.name} updated.`); }
      )
      .catch((err) => {
        console.error('PUT /beer/:name error: ', err);
        next(err);
      });
  })
  .post('/', bodyParser, (req, res, next) => {
    const brewery = new Beer(req.body);
    brewery.save()
      .then(res.send(`${brewery.name} added!`))
      .catch((err) => {
        console.error('you got an error: ', err);
        next(err);
      });
  })
  .delete('/:name', (req, res, next) => {
    Beer.remove({ 'name': req.params.name })
      .then(res.send(`${req.params.name} removed.`))
      .catch((err) => {
        console.error('you got an error: ', err);
        next(err);
      });
  });

module.exports = router;