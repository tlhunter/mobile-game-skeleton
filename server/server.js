#!/usr/bin/env node

"use strict";

var path = require('path');

var express = require('express');
var app = express();
var server = require('http').createServer(app);

var port = process.env.DRONECORE_PORT || 1337;
var host = process.env.DRONECORE_HOST || '0.0.0.0';

var public_dir = path.normalize(__dirname + '/../public');

server.listen(port, host);

console.log("Listening at " + host + ":" + port);

app.get('/', function (req, res) {
  res.sendFile(public_dir + '/index.html');
});

app.use(express.static(public_dir));
