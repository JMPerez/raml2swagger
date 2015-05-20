var raml = require('raml-parser');
var url = require('url');
var fs = require('fs');
var YAML = require('json2yaml');

var sourceFile = process.argv[2];
var outputFile = process.argv[3];

var output = null;

function processResource(resource, prefix, parentBaseParameters) {
  output.paths[prefix + resource.relativeUri] = {};

  var baseParameters = parentBaseParameters;
  baseParameters = baseParameters.concat(resource.uriParameters ? Object.keys(resource.uriParameters).map(function(key) {
    var baseParameter = resource.uriParameters[key];
    var parameterInfo = {
      name: key,
      in: 'path',
      description: baseParameter.description,
      type: baseParameter.type,
      required: true
    };

    ['enum', 'default', 'minimum', 'maximum', 'minLength', 'maxLength', 'pattern'].forEach(function(property) {
      if (property in baseParameter) {
        parameterInfo[property] = baseParameter[property];
      }
    });

    return parameterInfo;
  }) : []);

  if (resource.methods) {
    resource.methods.forEach(function(method) {

      var parameters = baseParameters;
      parameters = parameters.concat(method.queryParameters ? Object.keys(method.queryParameters).map(function(key) {
        var queryParameter = method.queryParameters[key];
        var parameterInfo = {
          name: key,
          in: 'query',
          description: queryParameter.description,
          type: queryParameter.type
        };

        ['enum', 'default', 'minimum', 'maximum', 'minLength', 'maxLength', 'pattern', 'required'].forEach(function(property) {
          if (property in queryParameter) {
            parameterInfo[property] = queryParameter[property];
          }
        });

        return parameterInfo;

      }) : []);

      // add body
      var body = method.body;
      if (body) {
        if (body['application/json']) {
          parameters.push({
            name: 'body',
            in: 'body',
            schema: null  // todo: add this
          })
        } // todo: add rest of types. See http://raml.org/docs-200.html#body-parameters
      }

      var methodInfo = {
        description: method.description
      };

      if (method.responses) {
        var responseObject = {};
        Object.keys(method.responses).map(function(key) {
          responseObject[key] = {
            description: ''
          };
          //todo: add schema to responseObject
        });
        methodInfo.responses = responseObject;
      }

      if (parameters.length) {
        methodInfo.parameters = parameters;
      }

      output.paths[prefix + resource.relativeUri][method.method] = methodInfo;
    });
  }

  if (resource.resources) {
    resource.resources.forEach(function(futureResource) {
      processResource(futureResource, prefix + resource.relativeUri, baseParameters);
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
      basePath: baseUrl.pathname.replace('{version}', source.version),
      schemes: [baseUrl.protocol.replace(':', '')],
      consumes: ['application/json'],
      produces: ['application/json'],
      paths: {}
    };

    source.resources.forEach(function(resource) {
      processResource(resource, '', []);
    });

    fs.writeFileSync(outputFile, YAML.stringify(output, 2));

}).catch(function(e) {
  console.error(e);
});
