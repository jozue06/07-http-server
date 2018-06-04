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

  xit('handles an invalid get request with a 404', () => {

    return superagent.get('http://localhost:3000/foo')
      .then(response => true)
      .catch(response => expect(response.status).toEqual(404));

  });

  xit('handles a valid get request', () => {

    return superagent.get('http://localhost:3000/')
      .then(response => {
        expect(response.statusCode).toEqual(200);
        expect(response.text).toEqual(expect.stringContaining('h1'));
      })
      .catch(console.err);

  });

  xit('handles a get request with a query string', () => {

    return superagent.get('http://localhost:3000/cowsay?text=here')
      .then(response => {
        expect(response.statusCode).toEqual(200);
        expect(response.text).toEqual(expect.stringContaining('here'));
      })
      .catch(console.err);

  });

  xit('handles a good post request', () => {
    let obj = {text: 'hello'};
    let expected = JSON.stringify(obj);
    return superagent.post('http://localhost:3000/')
      .send(obj)
      .then(response => {
        expect(response.text).toBe(expected);
      })
      .catch(console.err);
  });

});