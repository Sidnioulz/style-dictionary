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

var _cloneDeep = require("lodash/cloneDeep")

/**
 * Creates a copy of a prop, except for all its value fields.
 * The copy receives a single value field on the key `value`,
 * which contains the value of the original prop on the key
 * defined by the `valueField` param (or if `valueField` is
 * an array, the first key for which the prop has a value).

 * @example mapPropValue(
 *  {
 *    name: 'textColor',
 *    value: '#222',
 *    value_darkMode: '#ddd',
 *    value_hiContrast: '#000',
 *  },
 *  ['value_darkMode'],
 *  ['value', 'value_darkMode', 'value_hiContrast'],
 * )
 * // Output uses the dark mode value: { name: 'textColor', value: '#ddd' }
 * 
 * @example mapPropValue(
 *  {
 *    name: 'textColor',
 *    value: '#222',
 *  },
 *  ['value_hiContrast', 'value'],
 *  ['value', 'value_darkMode', 'value_hiContrast'],
 * )
 * // Output uses the fallback value: { name: 'textColor', value: '#222' }
 * 
 * @private
 * @param {Object} prop - The prop to transform so that it uses
 *   a different value field. It's your responsibility to ensure
 *   it contains at least one of the fields defined in `valueField`.
 * @param {String[]} valueFields - The name of the properties
 *   to read a value from in the original prop.
 * @param {String[]} valueTransformFields - The list of defined value fields.
 * @returns 
 */
function mapPropValue(prop, valueFields, valueTransformFields) {
  
  const firstDefinedValue = valueFields.find(
    (valueField) => Object.hasOwn(prop, valueField)
  )
  
  const copy = {
    value: prop[firstDefinedValue],
  }
  Object.keys(prop)
    .filter((key) => !(valueTransformFields.includes(key)))
    .forEach((key) => {
      if (key === 'original') {
        copy[key] = prop[key]
      } else {
        copy[key] = _cloneDeep(prop[key])
      }
    })

  return copy
}

module.exports = mapPropValue
