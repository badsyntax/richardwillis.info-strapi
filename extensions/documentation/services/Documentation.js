"use strict";

/**
 * https://github.com/strapi/strapi/blob/master/packages/strapi-plugin-documentation/services/Documentation.js
 * Override the function generateVerbParameters from the
 * Documentation.js service for the documentation plugin
 *
 * @description: Override generateVerbParameters to avoid issue
 * https://github.com/strapi/strapi/issues/7219 when generating
 * the OpenAPI document
 */

const _ = require("lodash");
const pathToRegexp = require("path-to-regexp");
const parametersOptions = require("strapi-plugin-documentation/services/utils/parametersOptions.json");

module.exports = {
  /**
   * Generate the verb parameters object
   * Refer to https://swagger.io/specification/#pathItemObject
   * @param {Sting} verb
   * @param {String} controllerMethod
   * @param {String} endPoint
   */
  generateVerbParameters: function (verb, controllerMethod, endPoint) {
    const params = pathToRegexp
      .parse(endPoint)
      .filter((token) => _.isObject(token))
      .reduce((acc, current) => {
        const param = {
          name: current.name,
          in: "path",
          description: "",
          deprecated: false,
          required: true,
          schema: { type: "string" },
        };

        return acc.concat(param);
      }, []);

    if (verb === "get" && controllerMethod === "find") {
      // parametersOptions corresponds to this section
      // of the documentation https://strapi.io/documentation/developer-docs/latest/developer-resources/content-api/content-api.html#filters
      const filteredParametersOptions = parametersOptions.filter((option) => {
        return option.name !== "=";
      });
      return [...params, ...filteredParametersOptions];
    }

    return params;
  },

  /**
   * Refer to https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#dataTypes
   * @param {String} type
   * @returns {String}
   */
  getType: (type) => {
    switch (type) {
      case "string":
      case "byte":
      case "binary":
      case "password":
      case "email":
      case "text":
      case "enumeration":
      case "date":
      case "datetime":
      case "time":
      case "richtext":
      case "uid":
        return "string";
      case "float":
      case "decimal":
      case "double":
        return "number";
      case "integer":
      case "biginteger":
      case "long":
        return "integer";
      case "json":
        return "object";
      default:
        return type;
    }
  },

  /**
   * Refer to https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#dataTypes
   * @param {String} type
   * @returns {String}
   */
   getFormat: type => {
    switch (type) {
      case 'uid':
        return 'uid';
      case 'date':
        return 'date';
      case 'datetime':
        return 'date-time';
      case 'password':
        return 'password';
      default:
        return undefined;
    }
  },
};
