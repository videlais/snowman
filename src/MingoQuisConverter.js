/**
 * Utility to convert Mingo (MongoDB-style) queries to Quis DSL expressions
 * for use in Snowman storylet requirements.
 */

/**
 * Converts a Mingo query object to a Quis DSL expression string
 * @param {object} mingoQuery - MongoDB-style query object
 * @returns {string} Quis DSL expression
 */
function convertMingoToQuis(mingoQuery) {
  if (!mingoQuery || typeof mingoQuery !== 'object') {
    throw new Error('Query must be an object');
  }

  // Handle empty object - should match everything
  const keys = Object.keys(mingoQuery);
  if (keys.length === 0) {
    return 'true'; // Empty requirements always match
  }

  // Handle single field
  if (keys.length === 1) {
    const key = keys[0];
    const value = mingoQuery[key];

    // Handle MongoDB logical operators
    if (key === '$and') {
      if (!Array.isArray(value)) {
        throw new TypeError('$and requires an array of conditions');
      }
      const conditions = value.map(cond => convertMingoToQuis(cond));
      return `(${conditions.join(' && ')})`;
    }

    if (key === '$or') {
      if (!Array.isArray(value)) {
        throw new TypeError('$or requires an array of conditions');
      }
      const conditions = value.map(cond => convertMingoToQuis(cond));
      return `(${conditions.join(' || ')})`;
    }

    if (key === '$not') {
      return `!(${convertMingoToQuis(value)})`;
    }

    // Handle field queries
    return convertFieldQuery(key, value);
  }

  // Handle multiple fields (implicit AND)
  const conditions = keys.map(key => {
    return convertFieldQuery(key, mingoQuery[key]);
  });
  return conditions.join(' && ');
}

/**
 * Converts a single field query to Quis expression
 * @param {string} field - Field name
 * @param {*} value - Query value (can be primitive or operator object)
 * @returns {string} Quis expression for the field
 */
function convertFieldQuery(field, value) {
  // Simple equality
  if (typeof value !== 'object' || value === null) {
    return `$${field} == ${JSON.stringify(value)}`;
  }

  // Handle comparison operators
  const operators = Object.keys(value);
  
  // Check if this object contains operators (keys starting with $) or is a plain value object
  const hasOperators = operators.some(key => key.startsWith('$'));
  if (!hasOperators) {
    // This is a plain object being used as a value, treat as equality
    return `$${field} == ${JSON.stringify(value)}`;
  }
  
  if (operators.length === 1) {
    const operator = operators[0];
    const operatorValue = value[operator];

    switch (operator) {
      case '$eq':
        return `$${field} == ${JSON.stringify(operatorValue)}`;
      case '$ne':
        return `$${field} != ${JSON.stringify(operatorValue)}`;
      case '$gt':
        return `$${field} > ${JSON.stringify(operatorValue)}`;
      case '$gte':
        return `$${field} >= ${JSON.stringify(operatorValue)}`;
      case '$lt':
        return `$${field} < ${JSON.stringify(operatorValue)}`;
      case '$lte':
        return `$${field} <= ${JSON.stringify(operatorValue)}`;
      case '$in':
        {
          if (!Array.isArray(operatorValue)) {
            throw new TypeError('$in requires an array');
          }
          const inConditions = operatorValue.map(val => 
            `$${field} == ${JSON.stringify(val)}`
          );
          return `(${inConditions.join(' || ')})`;
        }
      case '$nin':
        {
          if (!Array.isArray(operatorValue)) {
            throw new TypeError('$nin requires an array');
          }
          const ninConditions = operatorValue.map(val => 
            `$${field} != ${JSON.stringify(val)}`
          );
          return `(${ninConditions.join(' && ')})`;
        }
      default:
        throw new Error(`Unsupported operator: ${operator}`);
    }
  } else if (operators.length > 1) {
    // Multiple operators on same field (e.g., {$gt: 10, $lt: 20})
    const conditions = operators.map(op => {
      return convertFieldQuery(field, { [op]: value[op] });
    });
    return `(${conditions.join(' && ')})`;
  }

  // Fallback for complex objects - treat as equality
  return `$${field} == ${JSON.stringify(value)}`;
}

/**
 * Converts storylet requirements from old format to new format
 * Supports both string (new format) and object (old format) requirements
 * @param {string|object} requirements - Requirements in either format
 * @returns {string} Quis DSL expression
 */
function normalizeRequirements(requirements) {
  // If already a string, assume it's the new format
  if (typeof requirements === 'string') {
    return requirements;
  }

  // If object, convert from Mingo to Quis
  if (typeof requirements === 'object' && requirements !== null) {
    return convertMingoToQuis(requirements);
  }

  // Default fallback
  return 'true';
}

module.exports = {
  convertMingoToQuis,
  convertFieldQuery,
  normalizeRequirements
};