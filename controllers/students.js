// import the express Router
const studentsRouter = require('express').Router();

// import the model
const Student = require('../models/student');
const Mentor = require('../models/mentor');

// endpoint to get all the Students
studentsRouter.get('/', async (request, response) => {
    try {
        await Student.find({}, {}).populate('mentor', { name: 1 }).populate("prevMentor", { name: 1 })
            .then((students) => {
                response.status(200).json(students);
            });
    } catch (error) {
        response.status(500).json({ message: error })
    }
});


// get previous assigned mentor for a student
studentsRouter.get('/:id', (request, response, next) => {
    const id = request.params.id;
    Student.findById(id).populate('mentor', { name: 1 }).populate("prevMentor", { name: 1 })
        .then((student) => {
            if (!student) {
                return response.status(404).json({ error: 'Student not found' });
            }
            response.json({ Name: student.name, previousMentor: student.prevMentor });
        })
        .catch(error => next(error));
});


// creates a new student
studentsRouter.post('/', async (request, response, next) => {
    try {
        const student = new Student(request.body);

        const savedStudent = await student.save();

        response.status(201).json({ message: 'Student created successfully', student: savedStudent });
    } catch (error) {
        response.status(500).json({ message: error })
    }
});


// change mentor for a particular student
studentsRouter.post('/changeMentor', async (request, response) => {
    try {

        const { studentId, mentorId } = request.body;

        // change student mentor
        const student = await Student.findById(studentId);

        if (!student.mentor) {

            student.mentor = mentorId;

            const savedStudent = await student.save();

            // add student in newly assigned mentors list
            const newMentor = await Mentor.findById(savedStudent.mentor)

            newMentor.students = newMentor.students.concat(studentId);

            await newMentor.save();

            response.status(200).json({ message: "Mentor Assigned successfully!" })

        }
        else if (student.mentor.toString() === mentorId) {
            // if mentor you are trying to assign is already there
            response.status(200).json({ message: "Mentor you are trying to change is already assigned!" })
        }
        else {
            student.prevMentor = student.mentor;
            student.mentor = mentorId;

            const savedStudent = await student.save();


            // change students list of previous mentor
            const mentor = await Mentor.findById(savedStudent.prevMentor);
            mentor.students = mentor.students.filter((student) => {
                return student.toString() !== studentId;
            })
            await mentor.save();

            // add student in newly assigned mentors list
            const newMentor = await Mentor.findById(savedStudent.mentor)

            newMentor.students = newMentor.students.concat(studentId);

            await newMentor.save();

            response.status(200).json({ message: "Mentor Changed successfully!" })
        }


    } catch (error) {
        response.status(500).json({ message: error })
    }

});

module.exports = studentsRouter;