# raml2swagger

[![Tests](https://travis-ci.org/JMPerez/raml2swagger.svg?branch=master)](https://travis-ci.org/JMPerez/raml2swagger)
[![Coverage Status](https://coveralls.io/repos/JMPerez/raml2swagger/badge.svg)](https://coveralls.io/r/JMPerez/raml2swagger)

**raml2swagger** is a converter from [RAML 0.8](http://raml.org/) to [Swagger 2.0](https://github.com/swagger-api/swagger-spec/blob/master/versions/2.0.md) API modeling language. Note that it's under heavy development and lots of features haven't been implemented.

## How to run it

Install npm packages:

`npm install`

Then run the script:

`node command.js <raml_file> <output_file>`

## JSON Schemas

Note that [APIKit doesn't have support for JSON Schema Draft 0.4](http://forums.raml.org/t/support-for-json-schema-draft-04-required-properties-and-date-time-validation/278), and Swagger won't validate when using JSON Schema 0.3. You will need to [convert the Schema to 0.4](http://stackoverflow.com/questions/17205260/json-schema-draft4-vs-json-schema-draft3).

## TODO
- [x] Methods (almost implemented)
- [x] Parameters (almost implemented)
- [ ] OAuth
- [ ] Schemas
