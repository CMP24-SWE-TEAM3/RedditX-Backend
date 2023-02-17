const APIfeatures = require("./../utils/api-features");

/**
 * Service class to handle common database queries.
 * @class Service
 */
class Service {
  constructor(model) {
    this.model = model;
  }

  getAll = (findQuery, query) => {
    const features = new APIfeatures(this.model.find(findQuery), query)
      .sort()
      .filter()
      .paginate()
      .selectFields();
    return features.query;
  };

  getOne = (query) => {
    let fields = "";
    let populate = "";
    if (query.select) {
      fields = query.select;
      delete query.select;
    }
    if (query.populate) {
      populate = query.populate;
      delete query.populate;
    }
    const res = this.model.findOne(query);
    if (populate) {
      res.populate(populate);
    }
    if (fields) {
      const result = res.select(fields);
      return result;
    }
    return res;
  };

  updateOne = (query, update, options = {}) => {
    return this.model
      .findOneAndUpdate(query, update, options, (error, doc) => {
        if (!error) return doc;
        else return null;
        // error: any errors that occurred
        // doc: the document before updates are applied if `new: false`, or after updates if `new = true`
      })
      .clone();
  };

  findById = (id, select) => {
    if (select && select !== "") return this.model.findById(id).select(select);
    else return this.model.findById(id);
  };

  find = (query, select) => {
    if (select && select !== "") return this.model.find(query).select(select);
    else return this.model.find(query);
  };

  findByIdAndUpdate = (id, data, options) => {
    return this.model.findByIdAndUpdate(id, data, options);
  };

  deleteOne = (query) => {
    return this.model.findOneAndDelete(query);
  };

  deleteMany = (query) => {
    this.model.deleteMany(query);
  };

  insert = (data) => {
    return this.model.create(data);
  };
}
module.exports = Service;
