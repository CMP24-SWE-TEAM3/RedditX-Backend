/**
 * FILE: service.js
 * description: the service class that obtains the common services between controllers
 * created at: 15/11/2022
 * created by: Mohamed Nabil
 * authors: Ahmed Lotfy, Moaz Mohamed, Shredan Abdullah, Mohamed Nabil
 */

/**
 * INCLUDES
 */
const APIfeatures = require("./../utils/api-features");

/**
 * Service class
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
    if (query.select) {
      fields = query.select;
      delete query.select;
    }
    const res = this.model.findOne(query);
    if (fields) {
      const result = res.select(fields);
      return result;
    }
    return res;
  };

  updateOne = (query) => {
    return this.model.findOneAndUpdate(query);
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
