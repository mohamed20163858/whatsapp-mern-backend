import mongoose from "mongoose";
const whatsappSchema = mongoose.Schema({
    message: String,
    name: String,
    received: Boolean,
}, { timestamps: true });

export default  mongoose.model('messagecontent', whatsappSchema);