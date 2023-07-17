// import the express Router
const mentorsRouter = require('express').Router();

// import the model
const Mentor = require('../models/mentor');

// endpoint to get all the mentors
mentorsRouter.get('/', async (request, response) => {
    const mentors = await Mentor.find({}, {}).populate('students', { name: 1 });
    response.json(mentors);
});

// fetches a single resource
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

// creates a new resource based on the request data
mentorsRouter.post('/', async (request, response) => {
    const mentor = new Mentor(request.body);

    const savedMentor = await mentor.save()
    response.status(201).json({ message: 'mentor created successfully', Mentor: savedMentor });

});

// deletes a single resource
mentorsRouter.delete('/:id', (request, response) => {
    const id = request.params.id;

    Mentor.findByIdAndDelete(id)
        .then((deletedmentor) => {
            if (!deletedmentor) {
                return response.status(404).json({ error: 'Mentor not found' });
            }
            response.status(204).json({ message: 'Mentor deleted successfully' });
        })
        .catch((error) => {
            response.status(500).json({ error: 'Internal server error' });
        });
});

// patch request to update the identified resource with the request data
mentorsRouter.patch('/:id', (request, response) => {
    const id = request.params.id;
    const MentorToPatch = request.body;

    Mentor.findByIdAndUpdate(id, MentorToPatch)
        .then((updatedMentor) => {
            if (!updatedMentor) {
                return response.status(404).json({ error: 'Mentor not found' });
            }
            response.json(updatedMentor);
        })
        .catch((error) => {
            response.status(500).json({ error: 'Internal server error' });
        });
});

// put request to replace the entire identified resource with the request data
mentorsRouter.put('/:id', (request, response) => {
    const id = request.params.id;
    const mentorToPut = request.body;

    Mentor.findByIdAndUpdate(id, mentorToPut)
        .then((updatedMentor) => {
            if (!updatedMentor) {
                return response.status(404).json({ error: 'Mentor not found' });
            }
            response.json(updatedMentor);
        })
        .catch((error) => {
            response.status(500).json({ error: 'Internal server error' });
        });
});

module.exports = mentorsRouter;