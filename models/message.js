const { Schema, model, Types } = require('mongoose')

const schema = new Schema({
    owner: { type: Types.ObjectId, ref: 'User' },
    text: { type: String },
    login: { type: String },
    likeCount: {
        type: Number,
        default: 0
    }

})

module.exports = model('Message', schema)