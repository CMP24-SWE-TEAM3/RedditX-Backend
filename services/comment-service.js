/**
 * FILE: comment-service
 * description: the services related to comments only
 * created at: 15/11/2022
 * created by: Mohamed Nabil
 * authors: Ahmed Lotfy, Shredan Abdullah, Moaz Mohamed, Mohamed Nabil
 */

const mongoose = require('mongoose');
const Service = require('./service');

class CommentService extends Service {
    constructor(model) {
        super(model);
    }

}

module.exports = CommentService;