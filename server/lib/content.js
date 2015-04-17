'use strict';

var Grille = require('grille');

var storage = new Grille.RedisGrilleStorage({
  current: 'sgol-current',
  collection: 'sgol-collection'
});

var content = new Grille('17S3OSkl4jsjxlkoVU_Aa7YpiNn1fLqgEhFj1ojFsinE', storage);

module.exports = content;
