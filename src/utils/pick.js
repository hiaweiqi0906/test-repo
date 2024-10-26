/**
 * Parses string values into appropriate data types (numbers, arrays, booleans).
 * @param {string} value - The value to parse
 * @returns {any} Parsed value
 */
const parseValue = (value) => {
  if (value === 'true' || value === 'false') return value === 'true'; // Boolean
  if (!isNaN(value)) return parseFloat(value); // Number
  if (value.startsWith('[') && value.endsWith(']')) {
    return value
      .slice(1, -1)
      .split(',')
      .map((v) => parseValue(v)); // Array of values
  }
  return value; // String
};

/**
 * Create an object composed of the picked object properties
 * @param {Object} object
 * @param {string[]} keys
 * @returns {Object}
 */
const pick = (object, keys) => {
  return keys.reduce((obj, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      let operatorMatches = [];
      if (typeof object[key] === 'string' && object[key].includes('____')) {
        // Split by '|' to handle multiple filters
        operatorMatches = object[key].split('|').map(filter => filter.split('____'));
      }

      if (operatorMatches.length > 0) {
        // Build the filter object with multiple conditions
        obj[key] = operatorMatches.reduce((acc, [operator, val]) => {
          if (operator && val) {
            acc[`${operator}`] = isNaN(val) ? val : Number(val);
          }
          return acc;
        }, {});
      } else {
        obj[key] = object[key];
      }
    }
    return obj;
  }, {});
};

module.exports = pick;
