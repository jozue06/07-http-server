'use strict';
const url = require('url');
const queryString = require('querystring');

module.exports = (req) => {

  return new Promise( (resolve,reject) => {

    if( !(req || req.url) ) { reject('Invalid Request Object. Cannot Parse!!'); }
    console.log('pre', req.url);
    req.url = url.parse(req.url);
    console.log('post', req.url);

    req.url.query = queryString.parse(req.url.query);

    console.log('url.query', req.url.query);
    
    if(! req.method.match(/POST|PUT|PATCH/) ) {
      resolve(req);
    }

    let text = '';
    // console.log('text 1 ', text);
    req.on('data', (buffer) => {
      text += buffer.toString();
    });
    // console.log('text 2 ', text);
    req.on('end', () => {
      try{
        req.body = text;
        // console.log('text 3 ', req.body);
        resolve(req);
      }
      catch(err) { reject(err); }

    });

    req.on('err', reject);

  });

};