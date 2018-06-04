'use strict';

// 1st Party library
const http = require('http');
const fs = require('fs');
// Local Libraries
// parser will tear the URL apart and give us back an object with things like path, query params, etc.
// it will also deal with POST data and append JSON to req.body if sent
const parser = require('./lib/parser');

const requestHandler = (req,res) => {

  // Take a look here if you're interested to see what some parts of the request object are.
  // console.log(req.method);
  // console.log(req.headers);
  // console.log(req.url);

  // In all cases, parse the URL
  parser(req)
    .then( req => {

      /* The "if" statements below are our "routes" and do the same things that express does (below) but 100% manually
           app.get('/', (req,res) => res.send('Hello From the Gutter'));
           app.get('/foo/bar/baz', (req,res) => res.send('Hello From the Gutter'));
      */
      if ( req.method === 'GET' && req.url.pathname === '/' ) {
        fs.readFile(`${__dirname}/../public/index.html`,(err,data) => {
          if(err) {return console.log(err ,'err');}
          res.setHeader('Content-Type', 'text/html');
          res.statusCode = 200;
          res.statusMessage = 'OK';
          res.write(data.toString());
          res.end();
        });
      }
      // else if ( req.method === 'GET' && req.url.pathname === '/cowsay' ) {
      //   fs.readFile('../public/cowsay.html', (err, data) =>{
      //     if(err) { return errorPage();}
      //     let html = data.toString();
      //     let text = cowsay.say({text: req.url.query.text});
      //     res.setHeader('Content-Type', 'text/html');
      //     res.statusCode = 200;
      //     res.statusMessage = 'OK';
      //     res.write(html.replace('{{cowsay}}',text));
      //     res.end();
      //   });
      // }

      // Here, we have a "POST" request which will always return a JSON object.  That object will either be
      // the JSON that you posted in (just spitting it back out), or an error object, formatted to look like JSON
      else if ( req.method === 'POST' && req.url.pathname === '/data' ) {
        res.setHeader('Content-Type', 'text/json');
        res.statusCode = 200;
        res.statusMessage = 'OK';
        res.write( JSON.stringify(req.body) );
        res.end();
        return;
      }

      else {
        res.setHeader('Content-Type', 'text/html');
        res.statusCode = 404;
        res.statusMessage = 'Not Found';
        res.write('Resource Not Found');
        res.end();
      }

    }) // closes the "then" of the parser promise
    .catch(err => {
      res.writeHead(500);
      res.write(err);
      res.end();
    });
};

// Server callback
const app = http.createServer(requestHandler);

// Expose the start and stop methods.  index.js will call on these.
module.exports = {
  start: (port,callback) => app.listen(port,callback),
  stop: (callback) => app.close(callback),
};