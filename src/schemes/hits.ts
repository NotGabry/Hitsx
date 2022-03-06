import { Schema, model } from 'mongoose';

const hits = new Schema({
    ID: String,
    BadgeHits: Number,
    Verified: Boolean
})

const baseModel = model('hits', hits)

export { baseModel }
export default baseModel