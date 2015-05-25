'use strict';

var raml = require('raml-parser');
var url = require('url');
var fs = require('fs');
var YAML = require('json2yaml');

var sourceFile = process.argv[2];
var outputFile = process.argv[3];

var output = null;

var OAUTH2_API_NAME = 'api_auth';

/**
 * Converts the data type
 * Note that RAML doesn't support format, so this would need to be added manually in
 * the output Swagger. For more information about the data types read
 * https://github.com/swagger-api/swagger-spec/blob/master/versions/2.0.md#data-types
 * http://raml.org/spec.html#type
 *
 * @param  {string} type [description]
 * @return {string}      [description]
 */
function convertDataType(type) {
  /*
    string => string
    number => float || double
    integer => integer
    date => date
    boolean => boolean
    file => file
   */
  switch (type) {
    case 'number': return 'float';
    default: return type;
  }
}

function buildParameter(name, where, object) {
  var parameterInfo = {
    name: name,
    in: where,
    description: object.description,
    type: convertDataType(object.type)
  };

  [
    'enum',
    'default',
    'minimum',
    'maximum',
    'minLength',
    'maxLength',
    'pattern',
    'required'
  ].forEach(function(property) {
    if (property in object) {
      parameterInfo[property] = object[property];
    }
  });

  if (where === 'path') {
    parameterInfo.required = true;
  }

  return parameterInfo;
}

function processResource(resource, prefix, parentBaseParameters) {
  output.paths[prefix + resource.relativeUri] = {};

  var baseParameters = parentBaseParameters;
  baseParameters = baseParameters.concat(resource.uriParameters ?
    Object.keys(resource.uriParameters).map(function(key) {
      return buildParameter(key, 'path', resource.uriParameters[key]);
    }) : []);

  if (resource.methods) {
    resource.methods.forEach(function(method) {

      var parameters = baseParameters;
      parameters = parameters.concat(method.queryParameters ?
        Object.keys(method.queryParameters).map(function(key) {
          return buildParameter(key, 'query', method.queryParameters[key]);
        }) : []);

      // add body
      var body = method.body;
      if (body) {
        if (body['application/json']) {
          parameters.push({
            name: 'body',
            in: 'body',
            schema: null  // todo: add this
          });
        } else if (body['application/x-www-form-urlencoded']) {
          var params = body['application/x-www-form-urlencoded']
            .formParameters;
          parameters = parameters.concat(params ?
            Object.keys(params).map(function(key) {
              return buildParameter(key, 'form', params[key]);
            }) : []);
        }
        // todo: add rest of types. See http://raml.org/docs-200.html#body-parameters
      }

      var methodInfo = {
        description: method.description
      };

      if (method.responses) {
        var responseObject = {};
        Object.keys(method.responses).map(function(key) {
          // todo: add schema to responseObject
          responseObject[key] = {
            description: method.responses[key] ? method.responses[key].description : ''
          };
        });
        methodInfo.responses = responseObject;
      }

      if (parameters.length) {
        methodInfo.parameters = parameters;
      }

      if (method.securedBy) {
        method.securedBy.forEach(function(securedBy) {
          if ('oauth_2_0' in securedBy) {
            var methodSecurity = {};
            methodSecurity[OAUTH2_API_NAME] = securedBy.oauth_2_0.scopes || [];
            methodInfo.security = methodInfo.security || [];
            methodInfo.security.push(methodSecurity);
          }
        });
      }

      output.paths[prefix + resource.relativeUri][method.method] = methodInfo;
    });
  }

  if (resource.resources) {
    resource.resources.forEach(function(futureResource) {
      processResource(
        futureResource,
        prefix + resource.relativeUri,
      baseParameters);
    });
  }
}

raml.loadFile(sourceFile).then(function(source) {
  var baseUrl = url.parse(source.baseUri);
  var basePath = baseUrl.pathname.replace('{version}', source.version);
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
    basePath: decodeURIComponent(basePath),
    schemes: [baseUrl.protocol.replace(':', '')],
    consumes: ['application/json'],
    produces: ['application/json']
  };

  if (source.securitySchemes) {
    source.securitySchemes.forEach(function(securityScheme) {
      var key = Object.keys(securityScheme)[0];
      var scheme = securityScheme[key];
      switch (key) {
        case 'oauth_2_0':

          output.securityDefinitions = output.securityDefinitions || {};

          output.securityDefinitions[OAUTH2_API_NAME] = {
            description: scheme.description,
            name: 'Authorization',
            type: 'oauth2',
            in: 'header',
            flow: 'accessCode',
            authorizationUrl: scheme.settings.authorizationUri,
            tokenUrl: scheme.settings.accessTokenUri
          };

          if (scheme.settings) {
            // scopes
            if (scheme.settings.scopes) {
              output.securityDefinitions[OAUTH2_API_NAME].scopes = {};
              output.security = output.security || [];
              var securityGroup = {};
              securityGroup[OAUTH2_API_NAME] = [];
              scheme.settings.scopes.forEach(function(scope) {
                output.securityDefinitions[OAUTH2_API_NAME].scopes[scope] = 'Description for ' + scope;
                securityGroup[OAUTH2_API_NAME].push(scope);
              });
              output.security.push(securityGroup);
            }
          }
          break;

        default:
          break;
      }
    });
  }

  output.paths = {};

  source.resources.forEach(function(resource) {
    processResource(resource, '', []);
  });

  fs.writeFileSync(outputFile, YAML.stringify(output, 2));

}).catch(function(e) {
  console.error(e);
});
