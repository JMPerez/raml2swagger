'use strict';

var raml2swagger = require('./src/app');
var sourceFile = process.argv[2];
var outputFile = process.argv[3];
var fs = require('fs');
var YAML = require('json2yaml');

raml2swagger.processFile(sourceFile, function(output) {
  fs.writeFileSync(outputFile, YAML.stringify(output, 2));
});
