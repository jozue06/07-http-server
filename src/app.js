
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
      else if ( req.method === 'GET' && req.url.pathname === '/api/cowsay' ) {
        fs.readFile(`${__dirname}/../public/cowsay.html`, (err, data) =>{
          if(err) { return errPage();}
          let html = data.toString();
          let text = cowsay.say({text: req.url.query.text});
          res.setHeader('Content-Type', 'text/html');
          res.statusCode = 200;
          res.statusMessage = 'OK';
          res.write(html.replace('{{cowsay}}',text));
          res.end();
        });
      }
      else if ( req.method === 'POST' && req.url.pathname === '/api/cowsay' ) {
        fs.readFile(`${__dirname}/../public/cowsay.html`, (err, data) => {
          if(err) { return errPage();}
          let content = data;
          if(!req.body ) { content = 'Erorrs';}
          else if (req.body) 
            content = req.body;
          
          else{ content = 'Erorrss';}

          let obj = {content : content};
          res.setHeader('Content-Type', 'text/json');
          res.statusCode = 200;
          res.statusMessage = 'OK';
          res.write( JSON.stringify(obj));
          console.log(obj);
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