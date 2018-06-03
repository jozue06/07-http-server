
'use strict';

const cowsay = require('cowsay');
const fs = require('fs');
const http = require('http');
const parser = require('../src/lib/parser.js');

const requestHandler = (req,res) => {
  let errorPage = (err) => {

    console.log('error!', err);
    res.writeHead(500);
    res.write(err.message);
    res.end();
  };
  parser(req)
    .then( req => {
      
      if ( req.method === 'GET' && req.url.pathname === '/' ) {
        fs.readFile('../index.html', (err, data) =>{
          if(err) { return errorPage();}
          res.setHeader('Content-Type', 'text/html');
          res.statusCode = 200;
          res.statusMessage = 'OK';
          res.write(data.toString());
          res.end();
        });
      }

      else if ( req.method === 'GET' && req.url.pathname === '/cowsay' ) {
        fs.readFile('../cowsay.html', (err, data) =>{
          if(err) { return errorPage();}
          let html = data.toString();
          let text = cowsay.say({text: req.url.query.text});
          res.setHeader('Content-Type', 'text/html');
          res.statusCode = 200;
          res.statusMessage = 'OK';
          res.write(html.replace('{{cowsay}}',text));
          res.end();
        });
      }

      else if ( req.method === 'POST' && req.url.pathname === '/cowsay' ) {
        fs.readFile('../cowsay.html', (err, data) => { // *** data might need to be placed on line 49 instead of .text
          if(err) { return errorPage();}
          let content = '';
          if(!req.body) { content = 'Erorr';}
          else if (req.body.text) {content = cowsay.say({text: req.url.query.text});}
          else{ content = 'Erorr';}

          let obj = {content: content};
          res.setHeader('Content-Type', 'text/json');
          res.statusCode = 200;
          res.statusMessage = 'OK';
          res.write( JSON.stringify(obj) );
          res.end();
        });       
      }

      else {
        res.setHeader('Content-Type', 'text/html');
        res.statusCode = 404;
        res.statusMessage = 'Not Found';
        res.write('Resource Not Found');
        res.end();
      }

    })
    .catch(errorPage);
};


const app = http.createServer(requestHandler);

// Expose the start and stop methods.  index.js will call on these.
module.exports = {
  start: (port,callback) => app.listen(port,callback),
  stop: (callback) => app.close(callback),
};