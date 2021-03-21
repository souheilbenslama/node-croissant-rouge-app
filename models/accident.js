const mongoose = require('mongoose');
const AccidentSchema = mongoose.Schema({
    id: {
        type: String,
        required: false,
        unique: true,
    },

    id_temoin: {
        type: String,
        required: true,
    },

    id_secouriste: {
        type: String,
        required: false,
    },

    protectionDesc: {
        type: String,
        required: true,
    },

    respirationDesc: {
        type: String,
        required: true,
    },

    hemorragieDesc: {
        type: String,
        required: true,
    },

    conscienceDesc: {
        type: String,
        required: true,
    },

    status: {
        type: String,
        required: true,
        default: "in progress"
    },

    location: {
        type: [String],
        required: true,
    },},
    {timestamps: true }
);
module.exports = Accident = mongoose.model('Accident', AccidentSchema);