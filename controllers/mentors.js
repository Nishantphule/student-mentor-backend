// import the express Router
const mentorsRouter = require('express').Router();

// import the model
const Mentor = require('../models/mentor');
const Student = require('../models/student');

// endpoint to get all the mentors
mentorsRouter.get('/', async (request, response) => {
    const mentors = await Mentor.find({}, {}).populate('students', { name: 1 });
    response.json(mentors);
});

// get students for a particular mentor
// get all mentors
mentorsRouter.get('/:id', (request, response, next) => {
    const id = request.params.id;
    Mentor.findById(id).populate('students', { name: 1 })
        .then((mentor) => {
            if (!mentor) {
                return response.status(404).json({ error: 'Mentor not found' });
            }
            response.json(mentor);
        })
        .catch(error => next(error));
});

// creates a new mentor
mentorsRouter.post('/', async (request, response) => {

    try {
        const mentor = new Mentor(request.body);
        const savedMentor = await mentor.save()

        response.status(201).json({ message: 'mentor created successfully', Mentor: savedMentor });
    } catch (error) {
        response.status(500).json({ message: error })
    }

});

// assign mentor to multiple students
mentorsRouter.post('/assignMentor', async (request, response) => {
    try {
        const { studentIds, mentorId } = request.body;

        studentIds.forEach(async (studentId) => {
            const student = await Student.findById(studentId);

            student.mentor = mentorId;

            await student.save();
        })

        const mentor = await Mentor.findById(mentorId);

        mentor.students = mentor.students.concat(...studentIds);

        await mentor.save();

        response.status(201).json({ message: 'Mentor assigned successfully' });

    } catch (error) {
        response.status(500).json({ message: error })
    }

});

module.exports = mentorsRouter;