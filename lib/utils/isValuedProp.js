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

/**
 * Checks if an arbitrary JS object is likely to be a
 * Style Dictionary property with at least one value
 * field defined among a list of values.
 * 
 * Can be used against the platform's `valueTransformFields`
 * to check if a JS object is a prop, or against a
 * format's `valueField` to check if a JS object or prop
 * has values defined that this format can use.
 * 
 * @private
 * @param {Object} prop - The object to examine.
 * @param {String[]} valueFields - The value field names to check.
 * @returns {Boolean}
 */
function isValuedProp(prop, valueFields) {
  return Object.keys(prop)
    .some((key) => (valueFields.includes(key)))
}

module.exports = isValuedProp;