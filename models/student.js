const mongoose = require('mongoose');

// create a schema
const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    prevMentor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mentor'
    },
    mentor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mentor'
    }
});

studentSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.studentId = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

module.exports = mongoose.model('Student', studentSchema);