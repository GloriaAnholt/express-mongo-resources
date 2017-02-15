/** Created by Gloria Anholt on 11/3/16. **/

const assert = require('chai').assert;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const connection = require( '../lib/setup-mongoose' );
const app = require('../lib/app');

describe('the routes and models of breweries', () => {

  const server = chai.request(app);

  before(done => {

    const CONNECTED = 1;
    if (connection.readyState === CONNECTED) setupBeer();
    else connection.on('open', setupBeer);

    function setupBeer() {
      const name = 'beers';
      connection.db
        .listCollections({ name })
        .next((err, collInfo) => {
          if (!collInfo) return done();
          connection.db.dropCollection(name, done);
        });
    }

  });

  it('posts new breweries to the list', done => {

    const Belmont = {
      "name": "Belmont Station",
      "streetAddress": "4500 SE Stark St",
      "zipcode": 97215,
      "phone": 5032328538,
      "brewery": false,
      "bestBeer": null,
      "visited": true
    };
    const Lompoc = {
      "name": "Lompoc 5th Quadrant",
      "streetAddress": "3901 N Williams Ave",
      "zipcode": 97227,
      "phone": 5032883996,
      "brewery": true,
      "bestBeer": "Proletariat Red",
      "visited": true
    };
    const Laurelwood = {
      "name": "Laurelwood Public House & Brewery",
      "streetAddress": "5115 NE Sandy Blvd",
      "zipcode": 97213,
      "phone": 5032820622,
      "brewery": true,
      "bestBeer": "Workhorse IPA",
      "visited": true
    };
    const Deschutes = {
      "name": "Deschutes",
      "phone": 5038675309,
      "brewery": true,
      "visited": true
    };

    server
      .post('/api/beer')
      .send(Belmont)
      .end((err, res) => {
        if (err) return done(err);
        assert.equal(res.text, 'Belmont Station added!');
      });

    server
      .post('/api/beer')
      .send(Lompoc)
      .end((err, res) => {
        if (err) return done(err);
        assert.equal(res.text, 'Lompoc 5th Quadrant added!');
      });

    server
      .post('/api/beer')
      .send(Laurelwood)
      .end((err, res) => {
        if (err) return done(err);
        assert.equal(res.text, 'Laurelwood Public House & Brewery added!');
      });

    server
      .post('/api/beer')
      .send(Deschutes)
      .end((err, res) => {
        if (err) return done(err);
        assert.equal(res.text, 'Deschutes added!');
        done();
      });
  });

  it('queries by a brewery name and gets results', done => {

    const expectedResults = {
      "name": "Belmont Station",
      "streetAddress": "4500 SE Stark St",
      "zipcode": 97215,
      "phone": 5032328538,
      "brewery": false,
      "bestBeer": null,
      "visited": true
    };

    server
      .get('/api/beer/Belmont%20Station') // there's a space in the name
      .end((err, res) => {
        if (err) return done(err);
        let results = JSON.parse(res.text);
        assert.equal(results.name, expectedResults.name);
        assert.equal(results.streetAddress, expectedResults.streetAddress);
        assert.equal(results.zipcode, expectedResults.zipcode);
        assert.equal(results.phone, expectedResults.phone);
        assert.equal(results.brewery, expectedResults.brewery);
        assert.equal(results.bestBeer, expectedResults.bestBeer);
        assert.equal(results.visited, expectedResults.visited);
        done();
      });
  });

  it('updates a valid field in an existing record', done => {

    const update = {"bestBeer":"Mirror Pond"};

    server
      .put('/api/beer/Deschutes')
      .send(update)
      .end((err, res) => {
        if (err) return done(err);
        assert.equal(res.text, 'Deschutes updated.');
      });

    server
      .get('/api/beer/Deschutes')
      .end((err, res) => {
        if (err) return done(err);
        let results = JSON.parse(res.text);
        assert.equal(results.bestBeer, update.bestBeer);
        done();
      });
  });

  it('deletes a record by name', done => {

    server
      .del('/api/beer/Deschutes')
      .end((err, res) => {
        if (err) return done(err);
        assert.equal(res.text, 'Deschutes removed.');
      });

    server
      .get('/api/beer/Deschutes')
      .end((err, res) => {
        if (err) done();
        else done(err);
      });
  });

});
