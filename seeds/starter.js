// starter project
const dotenv = require("dotenv");
const mongoose = require('mongoose');
const express = require('express');
const fs = require('fs');

const Post = require('../models/post-model');
const dbConnect = require("../db-connection/connection");

dotenv.config({ path: "./.env" });


const posts = JSON.parse(fs.readFileSync(`${__dirname}/../data/sample-posts.json`, 'utf-8'));
dbConnect();


const importData = async () => {
    try {
        await Post.create(posts);
        console.log('Data successfully loaded!');
    } catch (err) {
        console.log(err);
    }
    process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
    try {
        await Post.deleteMany();
        console.log('Data successfully deleted!');
    } catch (err) {
        console.log(err);
    }
    process.exit();
};

if (process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete') {
    deleteData();
}

