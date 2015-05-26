#!/usr/bin/env node

'use strict';

var path = require('path');

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var content = require('./lib/content.js');

var port = process.env.SGOL_PORT || 1337;
var host = process.env.SGOL_HOST || '0.0.0.0';

var public_dir = path.normalize(__dirname + '/../public');

content.load(function(err) {
  if (err) {
    console.log(err);
    process.exit();
  }

  server.listen(port, host);

  console.log("Listening at " + host + ":" + port);
});

app.get('/', function (req, res) {
  console.log('GET /');
  res.sendFile(public_dir + '/index.html');
});

app.get('/data', function (req, res) {
  console.log('GET /data');
  res.send(content);
});

app.get('/data/rebuild', function(req, res) {
  console.log('GET /data/rebuild');
  content.update(function(err) {
    if (err) {
      return res.status(500).send(err);
    }

    res.status(200).send('ok');
  });
});

app.use(express.static(public_dir));
