/*
 * Copyright 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with
 * the License. A copy of the License is located at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions
 * and limitations under the License.
 */

var _ = require("./utils/es6_")

var mapPropValue = require("./utils/mapPropValue")
var mapProperties = require("./utils/mapProperties")
const isValuedProp = require('./utils/isValuedProp');

/**
 * Transforms a dictionary into one with a single value field, by replacing
 * the "value" of each property with the content of the field named after the
 * "valueField" parameter and by removing any other value field based on the
 * platform's "valueTransformFields" option.
 * 
 * Properties that do not set a field named like "valueField" are filtered from
 * the dictionary.
 *
 * @private
 * @param {Object} properties
 * @param {Object} dictionary
 * @param {?String|String[]} valueField - The name of the field to use as a "value"
 *    for each property; if unset, this function does nothing.
 * @param {Object} platform - Used to retrieve "valueTransformFields" and clean
 *   up the dictionary after mapping the "valueField" onto each property's value.
 * @returns {Object} dictionary - A new dictionary containing only the properties
 *   that have a "valueField" defined, with "valueField" renamed to a "value".
*/
function mapDictionaryValue(dictionary, valueField, platform) {
  if (_.isEmpty(valueField)) {
    return dictionary;
  }

  const { valueTransformFields } = platform;
  const mappedDictionary = {};
  const valueFields = [valueField].flat()

  mappedDictionary.allProperties = (dictionary.allProperties || [])
    .filter((prop) => isValuedProp(prop, valueFields))
    .map((prop) => mapPropValue(prop, valueFields, valueTransformFields));

  mappedDictionary.properties = mapProperties(
    dictionary.properties || {},
    (prop, key) => {
      // Don't transform `original`.
      if (key === 'original') {
        return prop
      }

      // Props that don't have a value for any of the names passed
      // to the `valueField` option should not get exported. This
      // allows users to write formats that only export the diff
      // between their general case and edge case (e.g. on Android,
      // redefine texts.xml with only the font families that change
      // for a given alphabet, or in a high-contrast colors.xml,
      // redefine only the tokens that need to be changed).
      if (!isValuedProp(prop, valueFields)) {
        return undefined
      }

      return mapPropValue(prop, valueFields, valueTransformFields);
    },
    valueTransformFields
  )

  return mappedDictionary
}

module.exports = mapDictionaryValue
