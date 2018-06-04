
'use strict';

const http = require('http');
const fs = require('fs');
const cowsay = require('cowsay');
const parser = require('./lib/parser.js');

const requestHandler = (req,res) => {

  let errPage = (err) => {
    console.log('error!', err);
    res.writeHead(500);
    res.write(err);
    res.end(); 
  };

  parser(req)
    .then( req => {
      
      if ( req.method === 'GET' && req.url.pathname === '/' ) {
        fs.readFile(`${__dirname}/../public/index.html`, (err, data) => {
          if(err) { return errPage();}
          res.setHeader('Content-Type', 'text/html');
          res.statusCode = 200;
          res.statusMessage = 'OK';
          res.write(data.toString());
          res.end();
        });
      }
      else if ( req.method === 'GET' && req.url.pathname === '/cowsay' ) {
        fs.readFile(`${__dirname}/../public/cowsay.html`, (err, data) =>{
          if(err) { return err;}
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
        fs.readFile(`${__dirname}/../public/.html`, (err, data) => {
          if(err) { return err;}
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
    .catch(errPage);
};


const app = http.createServer(requestHandler);

module.exports = {
  start: (port,callback) => app.listen(port,callback),
  stop: (callback) => app.close(callback),
};