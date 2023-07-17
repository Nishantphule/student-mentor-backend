const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// create a schema
const mentorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    students: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student'
        }
    ]
});

mentorSchema.plugin(uniqueValidator); 

mentorSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

const Mentor = mongoose.model('Mentor', mentorSchema);

module.exports = Mentor;