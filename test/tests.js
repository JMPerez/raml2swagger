require('should');
var raml2swagger = require('../src/app');

describe('Basic tests', function() {
  it('should work with basic fixture', function(done) {
    raml2swagger.processFile('./test/fixtures/example01.raml', function(output) {
      var expected = {
        "swagger": "2.0",
        "info": {
          "version": "42",
          "title": "Test API",
          "description": "",
          "termsOfService": "",
          "contact": {},
          "license": {}
        },
        "host": "example.com",
        "basePath": "/",
        "schemes": [
          "http"
        ],
        "consumes": [
          "application/json"
        ],
        "produces": [
          "application/json"
        ],
        "paths": {
          "/foo": {
            "get": {},
            "post": {}
          },
          "/foo/foo1": {
            "post": {
              "responses": {
                "200": {}
              },
              "parameters": [{
                "name": "body",
                "in": "body",
                "schema": null
              }]
            },
            "delete": {
              "description": "delete foo1"
            }
          },
          "/foo/foo2": {
            "get": {
              "description": "get foo2",
              "parameters": [{
                "name": "filter",
                "in": "query",
                "description": "value to filter by",
                "type": "string",
                "required": false
              }]
            }
          },
          "/bar": {
            "post": {
              "description": "create bar"
            }
          },
          "/baz": {
            "put": {}
          }
        }
      };
      JSON.stringify(output).should.eql(JSON.stringify(expected));
      done();
    });
  });

  it('should work with another fixture', function(done) {
    raml2swagger.processFile('./test/fixtures/example02.raml', function(output) {
      var expected = {
        "swagger": "2.0",
        "info": {
          "version": "1",
          "title": "default Title",
          "description": "",
          "termsOfService": "",
          "contact": {},
          "license": {}
        },
        "host": "example.com",
        "basePath": "/",
        "schemes": ["http"],
        "consumes": ["application/json"],
        "produces": ["application/json"],
        "paths": {
          "/ad": {},
          "/ad/conditionalDnsForwarder": {
            "post": {
              "description": "createConditionalDnsForwarder",
              "responses": {
                "200": {}
              },
              "parameters": [{
                "name": "vmName",
                "in": "query",
                "description": "vmName",
                "type": "string",
                "required": true
              }, {
                "name": "guestUid",
                "in": "query",
                "description": "guestUid",
                "type": "string",
                "required": true
              }, {
                "name": "guestPwd",
                "in": "query",
                "description": "guestPwd",
                "type": "string",
                "required": true
              }, {
                "name": "sync",
                "in": "query",
                "description": "sync",
                "type": "boolean",
                "required": false
              }, {
                "name": "body",
                "in": "body",
                "schema": null
              }]
            },
            "get": {
              "description": "listConditionalDnsForwarders",
              "responses": {
                "200": {}
              },
              "parameters": [{
                "name": "vmName",
                "in": "query",
                "description": "vmName",
                "type": "string",
                "required": true
              }, {
                "name": "guestUid",
                "in": "query",
                "description": "guestUid",
                "type": "string",
                "required": true
              }, {
                "name": "guestPwd",
                "in": "query",
                "description": "guestPwd",
                "type": "string",
                "required": true
              }]
            }
          },
          "/ad/conditionalDnsForwarder/{remoteDomainName}": {
            "delete": {
              "description": "removeConditionalDnsForwarder",
              "responses": {
                "200": {}
              },
              "parameters": [{
                "name": "remoteDomainName",
                "in": "path",
                "type": "string",
                "required": true
              }, {
                "name": "vmName",
                "in": "query",
                "description": "vmName",
                "type": "string",
                "required": true
              }, {
                "name": "guestUid",
                "in": "query",
                "description": "guestUid",
                "type": "string",
                "required": true
              }, {
                "name": "guestPwd",
                "in": "query",
                "description": "guestPwd",
                "type": "string",
                "required": true
              }, {
                "name": "sync",
                "in": "query",
                "description": "sync",
                "type": "boolean",
                "required": false
              }]
            }
          },
          "/ad/domain": {},
          "/ad/domain/{domain}": {},
          "/ad/domain/{domain}/pc": {
            "post": {
              "description": "addPcToDomain",
              "responses": {
                "200": {}
              },
              "parameters": [{
                "name": "domain",
                "in": "path",
                "type": "string",
                "required": true
              }, {
                "name": "vmName",
                "in": "query",
                "description": "vmName",
                "type": "string",
                "required": true
              }, {
                "name": "guestUid",
                "in": "query",
                "description": "guestUid",
                "type": "string",
                "required": true
              }, {
                "name": "guestPwd",
                "in": "query",
                "description": "guestPwd",
                "type": "string",
                "required": true
              }, {
                "name": "username",
                "in": "query",
                "description": "username",
                "type": "string",
                "required": true
              }, {
                "name": "password",
                "in": "query",
                "description": "password",
                "type": "string",
                "required": true
              }]
            }
          },
          "/ad/domain/passwordPolicy": {
            "get": {
              "description": "getPasswordPolicy",
              "responses": {
                "200": {}
              },
              "parameters": [{
                "name": "vmName",
                "in": "query",
                "description": "vmName",
                "type": "string",
                "required": true
              }, {
                "name": "guestUid",
                "in": "query",
                "description": "guestUid",
                "type": "string",
                "required": true
              }, {
                "name": "guestPwd",
                "in": "query",
                "description": "guestPwd",
                "type": "string",
                "required": true
              }]
            }
          },
          "/ad/join": {
            "post": {
              "description": "joinAd",
              "parameters": [{
                "name": "vmName",
                "in": "query",
                "description": "vmName",
                "type": "string",
                "required": true
              }, {
                "name": "guestUid",
                "in": "query",
                "description": "guestUid",
                "type": "string",
                "required": true
              }, {
                "name": "serverName",
                "in": "query",
                "description": "serverName",
                "type": "string",
                "required": true
              }, {
                "name": "guestPwd",
                "in": "query",
                "description": "guestPwd",
                "type": "string",
                "required": true
              }, {
                "name": "domain",
                "in": "query",
                "description": "domain",
                "type": "string",
                "required": true
              }, {
                "name": "domainPwd",
                "in": "query",
                "description": "domainPwd",
                "type": "string",
                "required": true
              }]
            }
          },
          "/ad/group": {},
          "/ad/group/{groupName}": {},
          "/ad/group/{groupName}/member": {
            "delete": {
              "description": "removeGroupMember",
              "responses": {
                "200": {}
              },
              "parameters": [{
                "name": "groupName",
                "in": "path",
                "type": "string",
                "required": true
              }, {
                "name": "vmName",
                "in": "query",
                "description": "vmName",
                "type": "string",
                "required": true
              }, {
                "name": "guestUid",
                "in": "query",
                "description": "guestUid",
                "type": "string",
                "required": true
              }, {
                "name": "guestPwd",
                "in": "query",
                "description": "guestPwd",
                "type": "string",
                "required": true
              }, {
                "name": "memberNames",
                "in": "query",
                "description": "memberNames",
                "type": "string",
                "required": true
              }]
            }
          },
          "/vdi": {},
          "/vdi/ad": {
            "put": {
              "description": "customizeAD",
              "parameters": [{
                "name": "vmName",
                "in": "query",
                "description": "vmName",
                "type": "string",
                "required": true
              }, {
                "name": "guestUid",
                "in": "query",
                "description": "guestUid",
                "type": "string",
                "required": true
              }, {
                "name": "guestPwd",
                "in": "query",
                "description": "guestPwd",
                "type": "string",
                "required": true
              }, {
                "name": "desktopOUName",
                "in": "query",
                "description": "desktopOUName",
                "type": "string",
                "required": false
              }, {
                "name": "vdiAdminOU",
                "in": "query",
                "description": "vdiAdminOU",
                "type": "string",
                "required": false
              }, {
                "name": "vdiUsersGroup",
                "in": "query",
                "description": "vdiUsersGroup",
                "type": "string",
                "required": false
              }, {
                "name": "vdiUsersOU",
                "in": "query",
                "description": "vdiUsersOU",
                "type": "string",
                "required": false
              }, {
                "name": "logDir",
                "in": "query",
                "description": "logDir",
                "type": "string",
                "required": false
              }, {
                "name": "log",
                "in": "query",
                "description": "log",
                "type": "string",
                "required": false
              }, {
                "name": "scriptPath",
                "in": "query",
                "description": "scriptPath",
                "type": "string",
                "required": false
              }, {
                "name": "servicePassword",
                "in": "query",
                "description": "servicePassword",
                "type": "string",
                "required": false
              }]
            },
            "delete": {
              "description": "removeAD",
              "parameters": [{
                "name": "vmName",
                "in": "query",
                "description": "vmName",
                "type": "string",
                "required": true
              }, {
                "name": "guestUid",
                "in": "query",
                "description": "guestUid",
                "type": "string",
                "required": true
              }, {
                "name": "guestPwd",
                "in": "query",
                "description": "guestPwd",
                "type": "string",
                "required": true
              }, {
                "name": "adminPwd",
                "in": "query",
                "description": "adminPwd",
                "type": "string",
                "required": true
              }]
            },
            "post": {
              "description": "installAD",
              "parameters": [{
                "name": "vmName",
                "in": "query",
                "description": "vmName",
                "type": "string",
                "required": true
              }, {
                "name": "guestUid",
                "in": "query",
                "description": "guestUid",
                "type": "string",
                "required": true
              }, {
                "name": "guestPwd",
                "in": "query",
                "description": "guestPwd",
                "type": "string",
                "required": true
              }, {
                "name": "domainName",
                "in": "query",
                "description": "domainName",
                "type": "string",
                "required": true
              }, {
                "name": "siteName",
                "in": "query",
                "description": "siteName",
                "type": "string",
                "required": false
              }, {
                "name": "localAdminPassword",
                "in": "query",
                "description": "localAdminPassword",
                "type": "string",
                "required": false
              }, {
                "name": "safePassword",
                "in": "query",
                "description": "safePassword",
                "type": "string",
                "required": true
              }, {
                "name": "forestLevel",
                "in": "query",
                "description": "forestLevel",
                "type": "string",
                "required": false
              }, {
                "name": "domainLevel",
                "in": "query",
                "description": "domainLevel",
                "type": "string",
                "required": false
              }, {
                "name": "databasePath",
                "in": "query",
                "description": "databasePath",
                "type": "string",
                "required": false
              }, {
                "name": "logPath",
                "in": "query",
                "description": "logPath",
                "type": "string",
                "required": false
              }, {
                "name": "sysVolPath",
                "in": "query",
                "description": "sysVolPath",
                "type": "string",
                "required": false
              }, {
                "name": "unattendedFile",
                "in": "query",
                "description": "unattendedFile",
                "type": "string",
                "required": false
              }]
            }
          },
          "/vdi/ad/dhcpscope": {
            "post": {
              "description": "installADDesktopDHCPScope",
              "parameters": [{
                "name": "vmName",
                "in": "query",
                "description": "vmName",
                "type": "string",
                "required": true
              }, {
                "name": "guestUid",
                "in": "query",
                "description": "guestUid",
                "type": "string",
                "required": true
              }, {
                "name": "guestPwd",
                "in": "query",
                "description": "guestPwd",
                "type": "string",
                "required": true
              }]
            },
            "delete": {
              "description": "destroyADDesktopDHCPScope",
              "parameters": [{
                "name": "vmName",
                "in": "query",
                "description": "vmName",
                "type": "string",
                "required": true
              }, {
                "name": "guestUid",
                "in": "query",
                "description": "guestUid",
                "type": "string",
                "required": true
              }, {
                "name": "guestPwd",
                "in": "query",
                "description": "guestPwd",
                "type": "string",
                "required": true
              }]
            },
            "put": {
              "description": "createADDesktopDHCPScope",
              "parameters": [{
                "name": "vmName",
                "in": "query",
                "description": "vmName",
                "type": "string",
                "required": true
              }, {
                "name": "guestUid",
                "in": "query",
                "description": "guestUid",
                "type": "string",
                "required": true
              }, {
                "name": "guestPwd",
                "in": "query",
                "description": "guestPwd",
                "type": "string",
                "required": true
              }, {
                "name": "scope",
                "in": "query",
                "description": "scope",
                "type": "string",
                "required": true
              }, {
                "name": "mask",
                "in": "query",
                "description": "mask",
                "type": "string",
                "required": true
              }, {
                "name": "ipStart",
                "in": "query",
                "description": "ipStart",
                "type": "string",
                "required": true
              }, {
                "name": "ipStop",
                "in": "query",
                "description": "ipStop",
                "type": "string",
                "required": true
              }, {
                "name": "gateway",
                "in": "query",
                "description": "gateway",
                "type": "string",
                "required": true
              }, {
                "name": "fqdn",
                "in": "query",
                "description": "fqdn",
                "type": "string",
                "required": true
              }, {
                "name": "serverIp",
                "in": "query",
                "description": "serverIp",
                "type": "string",
                "required": true
              }, {
                "name": "desktopOU",
                "in": "query",
                "description": "desktopOU",
                "type": "string",
                "required": true
              }, {
                "name": "inAddrApraZone",
                "in": "query",
                "description": "inAddrApraZone",
                "type": "string",
                "required": true
              }, {
                "name": "domainName",
                "in": "query",
                "description": "domainName",
                "type": "string",
                "required": true
              }]
            }
          },
          "/vdi/ad_cert_service": {
            "post": {
              "description": "installAdCertificateService",
              "parameters": [{
                "name": "vmName",
                "in": "query",
                "description": "vmName",
                "type": "string",
                "required": true
              }, {
                "name": "guestUid",
                "in": "query",
                "description": "guestUid",
                "type": "string",
                "required": true
              }, {
                "name": "guestPwd",
                "in": "query",
                "description": "guestPwd",
                "type": "string",
                "required": true
              }, {
                "name": "caName",
                "in": "query",
                "description": "caName",
                "type": "string",
                "required": false
              }, {
                "name": "cadnSuffix",
                "in": "query",
                "description": "cadnSuffix",
                "type": "string",
                "required": false
              }, {
                "name": "caType",
                "in": "query",
                "description": "caType",
                "type": "string",
                "required": false
              }, {
                "name": "parentCA",
                "in": "query",
                "description": "parentCA",
                "type": "string",
                "required": false
              }, {
                "name": "csp",
                "in": "query",
                "description": "csp",
                "type": "string",
                "required": false
              }, {
                "name": "keyLength",
                "in": "query",
                "description": "keyLength",
                "type": "string",
                "required": false
              }, {
                "name": "hashAlgorithm",
                "in": "query",
                "description": "hashAlgorithm",
                "type": "string",
                "required": false
              }, {
                "name": "validForYears",
                "in": "query",
                "description": "validForYears",
                "type": "string",
                "required": false
              }, {
                "name": "requestFileName",
                "in": "query",
                "description": "requestFileName",
                "type": "string",
                "required": false
              }, {
                "name": "caCertFile",
                "in": "query",
                "description": "caCertFile",
                "type": "string",
                "required": false
              }, {
                "name": "password",
                "in": "query",
                "description": "password",
                "type": "string",
                "required": false
              }, {
                "name": "thumbprint",
                "in": "query",
                "description": "thumbprint",
                "type": "string",
                "required": false
              }, {
                "name": "dbDirectory",
                "in": "query",
                "description": "dbDirectory",
                "type": "string",
                "required": false
              }, {
                "name": "logDirectory",
                "in": "query",
                "description": "logDirectory",
                "type": "string",
                "required": false
              }, {
                "name": "overwriteExisting",
                "in": "query",
                "description": "overwriteExisting",
                "type": "string",
                "required": false
              }, {
                "name": "allowCSPInteraction",
                "in": "query",
                "description": "allowCSPInteraction",
                "type": "string",
                "required": false
              }, {
                "name": "force",
                "in": "query",
                "description": "force",
                "type": "string",
                "required": false
              }, {
                "name": "logDir",
                "in": "query",
                "description": "logDir",
                "type": "string",
                "required": false
              }]
            }
          }
        }
      };
      JSON.stringify(output).should.eql(JSON.stringify(expected));
      done();
    });
  });
});
