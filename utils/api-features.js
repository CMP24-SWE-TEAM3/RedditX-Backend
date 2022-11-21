/**
 * @namespace APIFeatures
 */
class APIFeatures {
  /**
   * @constructor
   * @param {object} query
   * @param {object} queryString
   */

  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  /**
   * Replaces operators with operators that are valid in mongodb
   * @returns {APIFeatures} this
   */

  filter() {
    const queryObj = { ...this.queryString };
    const exclude = ["page", "sort", "limit", "fields", "type"]; //  type is related to notifications, we need to exclude it
    exclude.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  /**
   * Sorts with given fields
   * @returns {APIFeatures} this
   */

  sort() {
    let sortBy;
    if (this.queryString.sort) {
      sortBy = this.queryString.sort.replace(",", " ");
    }
    this.query = this.query.sort(sortBy);
    return this;
  }

  /**
   * Selects some given fields
   * @returns {APIFeatures} this
   */

  selectFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else this.query = this.query.select("-__v"); // Don't include version
    return this;
  }

  /**
   * Makes pagination
   * @returns {APIFeatures} this
   */

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;
