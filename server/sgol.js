#!/usr/bin/env node

'use strict';

var path = require('path');

var express = require('express');
var compression = require('compression');

var app = express();
var server = require('http').createServer(app);
var content = require('./lib/content.js');

app.use(compression());

var port = process.env.SGOL_PORT || 1337;
var host = process.env.SGOL_HOST || '0.0.0.0';

console.log("Remember to run `gulp prebuild-web` beforehand!");

// Technically this should point to ../platforms/web/build, but then gulp watch is useless
var public_dir = path.normalize(__dirname + '/../www');

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

app.get('/manifest.webapp', function(req, res) {
  console.log('GET /manifest.webapp');
  res.type('application/x-web-app-manifest+json');
  res.sendFile(public_dir + '/manifest.webapp');
});

app.get('/data', function (req, res) {
  console.log('GET /data');
  res.header("Access-Control-Allow-Origin", "*");
  res.send(content);
});

app.get('/data/rebuild', function(req, res) {
  console.log('GET /data/rebuild');
  content.update(function(err) {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }

    console.log(content.version);
    res.status(200).send(content.version);
  });
});

app.use(express.static(public_dir));
