//making schema for a user Notes
const mongoose = require('mongoose');

const Noteschema = new mongoose.Schema({
    //for forgin key we will add some attributes from the user schema and referance form user
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    title: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true,

    },
    tag: {
        type: String,
        require: true,
        default: "general"
    },
    date: {
        type: Date,
        require: true,
        default: Date.now
    },
    name: {
        type: String,
        require: true
    },
    importent : {
        type :Boolean,
        default : false
    },
    seen :{
        type: Boolean,
        default : false
    }


})
module.exports = mongoose.model('Note', Noteschema);
//we eill use this thing in routers