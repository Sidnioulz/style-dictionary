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

const _transform = require('lodash/transform');
const _ = require("./es6_");

const isValuedProp = require('./isValuedProp');

/**
 * Transforms every property in a dictionary, using Lodash
 * transform to emulate a recursive mapValues.
 * 
 * The `mapper` parameter function receives three arguments:
 * - the property to transform
 * - its key in its parent object
 * - the direct parent object (with sibling properties)
 * 
 * If `mapper` returns undefined, the value will not be copied
 * to the new object, unless they were already undefined in the
 * original object. Empty object subpaths, with no properties,
 * are also not copied, unless they were also originally empty.
 * 
 * @private
 * @param {Object} obj - The dictionary to map.
 * @param {Function} mapper - The function that maps every prop.
 * @returns {Object}
 */
function mapProperties(obj, mapper, valueTransformFields) {
  return _transform(obj, (result, prop, key) => {
    if (isValuedProp(prop, valueTransformFields)) {
      const mappedProp = mapper(prop, key, obj)
      if (mappedProp !== undefined || prop === undefined) {
        result[key] = mappedProp
      }
    } else if(_.isObject(prop)) {
      const newObject = mapProperties(prop, mapper, valueTransformFields)
      if (Object.keys(newObject).length !== 0 || Object.keys(prop).length === 0) {
        result[key] = newObject
      }
    }
  })
}

module.exports = mapProperties;