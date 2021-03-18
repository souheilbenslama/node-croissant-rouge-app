const mongoose = require('mongoose');
const AccidentSchema = mongoose.Schema({
    id: {
        type: int,
        required: false,
        unique: true,
    },

    id_temoin: {
        type: int,
        required: true,
    },

    id_secouriste: {
        type: int,
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
    },
    timestamps: true
});
module.exports = Accident = mongoose.model('Accident', AccidentSchema);