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
const mongoose = require('mongoose');
const APIfeatures = require('./../utils/api-features');
const catchAsync = require('./../utils/catch-async');


/**
 * Service class
 */
class Service {
    constructor(model) {
        this.model = model;
        this.getAll = this.getAll.bind(this);
        this.getOne = this.getOne.bind(this);
        this.deleteMany = this.deleteMany.bind(this);
        this.deleteOne = this.deleteOne.bind(this);
        this.insert = this.insert.bind(this);
        this.updateOne = this.updateOne.bind(this);
        this.getSearchResults = this.getSearchResults.bind(this);
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
        let fields = '';
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
        this.model.findOneAndUpdate(query);
    };

    deleteOne = (query) => {
        return this.model.findOneAndDelete(query);
    };

    deleteMany = (query) => {
        this.model.deleteMany(query);
    };

    insert = (data) => {
        return qthis.model.create(data);
    };

};
module.exports = Service;