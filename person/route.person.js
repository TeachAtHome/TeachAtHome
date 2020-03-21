class PersonEndpoints {
    getStudent = async (req, res, next) => {
        try {
            const personId = req.params.id
            const person = await req.services.personService.getPerson(personId)

            if (person) {
                res.json(person)
            } else {
                res.sendStatus(404)
            }
        } catch (err) {
            // something could fail unexpectedly...
            // at some point the middleware chain should handle errors
            next(err)
        }
    }
    getAllStudent = async (req, res, next) => {
        try {
            const persons = await req.services.personService.listAllPersons();
            if (persons) {
                res.json(persons)
            } else {
                res.sendStatus(404)
            }
        } catch (err) {
            // something could fail unexpectedly...
            // at some point the middleware chain should handle errors
            next(err)
        }
    }
    postStudent = async (req, res, next) => {
        try {
            var personId = req.body.id;
            try {
                await req.services.personService.addPerson(personId);
                res.sendStatus(201);
            } catch (error) {
                res.send(error).status(400);
            }
        } catch (err) {
            console.log(err);
            // something could fail unexpectedly...
            // at some point the middleware chain should handle errors
            next(err)
        }
    }
}

module.exports = new PersonEndpoints();