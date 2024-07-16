const mongoose = require('mongoose');

const { Schema } = mongoose;

const companiesSchema = new Schema({
    email:{
        type: String,
        required : true,
        // unique: true
    },
    companyName:{
        type: String,
        required: true

    },
    date: {
        type: Date,
        default: Date.now
    },
})

const companyData = mongoose.model('companiesSchema', companiesSchema)
module.exports = companyData;