const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
    login: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    message: [{type: Types.ObjectId, ref: 'Message'}]
})

module.exports = model('User', schema)