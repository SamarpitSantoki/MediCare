const mongoose = require('mongoose');

//Category Schema

const categoeySchema = new mongoose.Schema({
    title : {
        type: String,
        required: true
    },
    slug : {
        type: String,
      }
});

const Category = mongoose.model('Category', categoeySchema);

module.exports = Category;