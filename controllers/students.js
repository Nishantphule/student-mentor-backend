// import the express Router
const studentsRouter = require('express').Router();

// import the model
const Student = require('../models/student');
const Mentor = require('../models/mentor');

// endpoint to get all the Students
studentsRouter.get('/', async (request, response) => {
    await Student.find({}, {}).populate('mentor', { name: 1 })
        .then((students) => {
            response.json(students);
        });
});

// fetches a single resource
studentsRouter.get('/:id', (request, response, next) => {
    const id = request.params.id;
    Student.findById(id)
        .then((student) => {
            if (!student) {
                return response.status(404).json({ error: 'Student not found' });
            }
            response.json(student);
        })
        .catch(error => next(error));
});

// creates a new resource based on the request data
studentsRouter.post('/', async (request, response, next) => {
    const body = request.body;
    
    const mentor = await Mentor.findById(body.mentor);

    const student = new Student({
        ...body,
        mentor:mentor.id
    });

    const savedStudent = await student.save();

    mentor.students = mentor.students.concat(savedStudent._id)
    await mentor.save();

    response.status(201).json({ message: 'Student created successfully', student: savedStudent });
});

// deletes a single resource
studentsRouter.delete('/:id', (request, response) => {
    const id = request.params.id;

    Student.findByIdAndDelete(id)
        .then((deletedStudent) => {
            if (!deletedStudent) {
                return response.status(404).json({ error: 'Student not found' });
            }
            response.status(204).json({ message: 'Student deleted successfully' });
        })
        .catch((error) => {
            response.status(500).json({ error: 'Internal server error' });
        });
});

// patch request to update the identified resource with the request data
studentsRouter.patch('/:id', (request, response) => {
    const id = request.params.id;
    const studentToPatch = request.body;

    Student.findByIdAndUpdate(id, studentToPatch)
        .then((updatedStudent) => {
            if (!updatedStudent) {
                return response.status(404).json({ error: 'Student not found' });
            }
            response.json(updatedStudent);
        })
        .catch((error) => {
            response.status(500).json({ error: 'Internal server error' });
        });
});

// put request to replace the entire identified resource with the request data
studentsRouter.put('/:id', (request, response) => {
    const id = request.params.id;
    const StudentToPut = request.body;

    Student.findByIdAndUpdate(id, StudentToPut)
        .then((updatedStudent) => {
            if (!updatedStudent) {
                return response.status(404).json({ error: 'Student not found' });
            }
            response.json(updatedStudent);
        })
        .catch((error) => {
            response.status(500).json({ error: 'Internal server error' });
        });
});

module.exports = studentsRouter;