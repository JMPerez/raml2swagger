var raml = require('raml-parser');
var url = require('url');
var fs = require('fs');
var YAML = require('json2yaml');

var sourceFile = process.argv[2];
var outputFile = process.argv[3];

var output = null;

function processResource(resource, prefix) {
  output.paths[prefix + resource.relativeUri] = {};
  if (resource.methods) {
    resource.methods.forEach(function(method) {
      var parameters = method.queryParameters ? Object.keys(method.queryParameters).map(function(key) {

        var parameterInfo = {
          name: key,
          in: 'query',
          description: method.queryParameters[key].description,
          type: method.queryParameters[key].type
        };

        if (method.queryParameters[key].required) {
          parameterInfo.required = true;
        }
        return parameterInfo;

      }) : [];

      var responses = null;
      if (method.responses) {
        var responseObject = {};
        Object.keys(method.responses).map(function(key) {
          responseObject[key] = {};
        });
      }

      var methodInfo = {
        description: method.description
      };

      if (parameters.length) {
        methodInfo.parameters = parameters;
      }

      if (responses !== null) {
        methodInfo.responses = responses;
      }

      output.paths[prefix + resource.relativeUri][method.method] = methodInfo;
    });
  }

  if (resource.resources) {
    resource.resources.forEach(function(futureResource) {
      processResource(futureResource, prefix + resource.relativeUri);
    });
  }
}

raml.loadFile(sourceFile).then(function(source) {
  var baseUrl = url.parse(source.baseUri);
    output = {
      swagger: '2.0',
      info: {
        version: source.version,
        title: source.title,
        description: source.documentation ? source.documentation[0].title : '',
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
      processResource(resource, '');
    });

    fs.writeFileSync(outputFile, YAML.stringify(output, 2));

}).catch(function(e) {
  console.error(e);
});
