var raml = require('raml-parser');
var url = require('url');
var fs = require('fs');
var YAML = require('json2yaml');

var sourceFile = process.argv[2];
var outputFile = process.argv[3];
raml.loadFile(sourceFile).then(function(source) {

  var baseUrl = url.parse(source.baseUri);
    var output = {
      swagger: '2.0',
      info: {
        version: source.version,
        title: source.title,
        description: source.documentation[0].title,
        termsOfService: '',
        contact: {},
        license: {}
      },
      host: baseUrl.host,
      basePath: baseUrl.pathname,
      schemes: [baseUrl.protocol.replace(':', '')],
      consumes: ['application/json'],
      produces: ['application/json'],
      paths: {}
    };

    source.resources.forEach(function(resource) {
      output.paths[resource.relativeUri] = {};

      resource.methods.forEach(function(method) {

        output.paths[resource.relativeUri][method.method] = {
          description: method.description,
          operationId: '',
          parameters: method.queryParameters ? Object.keys(method.queryParameters).map(function(key) {
            return {
              name: key,
              in: 'query',
              description: method.queryParameters[key].description,
              required: method.queryParameters[key].required || false,
              type: method.queryParameters[key].type
            };
          }) : [],
          responses: method.responses ? (function() {
            var responseObject = {};
            Object.keys(method.responses).map(function(key) {
              responseObject[key] = {};
            });
          })() : {}
        }
      });

    });

    fs.writeFileSync(outputFile, YAML.stringify(output, 2));

}).catch(function(e) {
  console.error(e);
});
