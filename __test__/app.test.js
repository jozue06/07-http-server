'use strict';

const superagent = require('superagent');
const app = require('../src/app.js');

describe('Simple Web Server', () => {

  beforeAll( () => {
    app.start();
  });

  afterAll( () => {
    app.stop();
  });

  it('handles an invalid get request with a 404', () => {

    return superagent.get('http://localhost:3000/foo')
      .then(response => true)
      .catch(response => expect(response.status).toEqual(404));

  });

  it('handles a valid get request', () => {

    return superagent.get('http://localhost:3000/')
      .then(response => {
        expect(response.statusCode).toEqual(200);
        expect(response.text).toEqual(expect.stringContaining('h1'));
      })
      .catch(console.err);

  });

  it('handles a get request with a query string', () => {

    return superagent.get('http://localhost:3000/api/cowsay?text=here')
      .then(response => {
        expect(response.statusCode).toEqual(200);
        expect(response.text).toEqual(expect.stringContaining('here'));
      })
      .catch(console.err);

  });

  it('handles a good post request', () => {
    let obj = {text: 'Fred'};
    let expected = JSON.stringify(obj);
    console.log(obj);
    console.log(expected);
    return superagent.post('http://localhost:3000/api/cowsay')
      .send(obj)
      .then(response => {
        expect(response.text).toBe(expected);
      })
      .catch(console.err);
  });

});