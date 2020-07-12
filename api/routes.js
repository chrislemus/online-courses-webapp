'use strict'

const express = require('express');
const {check, validationResult} = require('express-validator');
const dataMW = require('./dataMW') // database Middleware
const bcryptjs = require('bcryptjs');
const { models } = require('./db');

// Construct a router instance.
const router = express.Router();

// Get references to our models.
const { User, Course } = models;

/* Handler function to wrap each route. */
function asyncHandler(cb) {
    return async (req, res, next) => {
        try {
            await cb(req, res, next)
        } catch (error) {
            next(error)
        }
    }
}



// Route that returns a list of users.
router.get('/users', dataMW.authenticateUser, asyncHandler(async(req, res) => {
    const user = req.currentUser

    res.json({
        Id: user.id,
        Name: `${user.firstName} ${user.lastName}`,
        Email: user.emailAddress,
    });
}));

router.post('/users', [
    check('firstName')
        .exists()
        .withMessage("Please provide value for 'firstName'"),
    check('lastName')
        .exists()
        .withMessage("Please provide value for 'lastName'"),
    check('emailAddress')
        .exists()
        .withMessage("Please provide value for 'emailAddress'"),
    check('password')
        .exists()
        .withMessage("Please provide value for 'password'")
],asyncHandler( async(req, res) => { 
    try {
        // Attempt to get the validation result from the Request object.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // Use the Array `map()` method to get a list of error messages.
            const errorMessages = errors.array().map(error => error.msg);
    
            // Return the validation errors to the client.
            console.log(errorMessages)
            return res.status(400).json({ errors: [errorMessages ]}).end();
        }

        // Get the user from the request body.
        const user = req.body;

        //validate wether or not email address has already been used or if its unique
        const uniqueEmail = await dataMW.isUniqueEmail(user)
        if(!uniqueEmail) {
            return res.status(400).json({ errors: ["Email already in use. please provide a unique email."] });
        }

        //has new user's password
        user.password = bcryptjs.hashSync(user.password);

        // Add the user to the `User` database.
        const newUser = await User.create(user);

        // Set the status to 201 Created and end the response.
        res.status(201).location(`/`).end();
    } catch (error) {
        
        if (error.name === 'SequelizeValidationError') {
            res.status(400).location('/').json({errors: [error.errors[0].message]})
        } else {
            throw error
        }
    }
        
}));

// Returns a list of courses (including the user that owns each course)
router.get("/courses", asyncHandler(async (req, res) => {
    const courses = await Course.findAll({
        include: {
            model: User,
            as: "user",
            attributes: ["id", "firstName", "lastName", "emailAddress"]
        },
        attributes: ["id", "title", "description", "estimatedTime", "materialsNeeded"]
    });
    res.json(courses);
}))


router.get("/courses/:id", asyncHandler(async(req, res) => {
    const courseId = req.params.id;
    const course = await Course.findByPk(courseId, {
        include: {
            model: User,
            as: "user",
            attributes: ["id", "firstName", "lastName", "emailAddress"]
        },
        attributes: ["id", "title", "description", "estimatedTime", "materialsNeeded"]
    })

    if (course) {
        res.json(course)
    } else {
        res.status(404).json({message: "couldn't find course by id provided"})
    }
}))

router.post("/courses", [
    check("title")
        .exists()
        .withMessage("Please provide value from 'title'"),
    check("description")
        .exists()
        .withMessage("Please provide value for 'description'"),
    check("userId")
        .exists()
        .withMessage("Please provide value for 'userId'")
], dataMW.authenticateUser, asyncHandler(async(req, res) => {
    // Attempt to get the validation result from the Request object.
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // Use the Array `map()` method to get a list of error messages.
        const errorMessages = errors.array().map(error => error.msg);

        // Return the validation errors to the client.
        return res.status(400).json({ errors: errorMessages });
    }

    const course = req.body;

    // Add the course to the `Course` database.
    const newCourse = await Course.create(course);
    const courseId = newCourse.dataValues.id

    // Set the status to 201 Created and end the response.
    res.status(201).location(`/courses/${courseId}`).end();

}));

router.put("/courses/:id", dataMW.authenticateUser, asyncHandler(async(req, res) => {

    //ensure json is not empty
    if(dataMW.isEmpty(req.body)) {
        return res.status(400).json({message: "json data cannot be empty"})
    }

    const userId = req.currentUser.dataValues.id
    const courseId = req.params.id;
    const course = await Course.findByPk(courseId)
    //continues if course has been found
    if (course) {
        const courseOwnerId = course.dataValues.userId
        //make sure only course owner can make changes to course
        if(userId === courseOwnerId) {
            await course.update(req.body)
            res.status(204).end()
        } else {
            res.status(403).json({message: "you are not authorized to make changes to this course."})
        }
        
    } else {
        res.status(401).json({message: "no course found"})
    }
}))

router.delete("/courses/:id", dataMW.authenticateUser, asyncHandler(async(req, res) => {
    const userId = req.currentUser.dataValues.id

    const courseId = req.params.id;
    const course = await Course.findByPk(courseId)
    //continues if course has been found
    if (course) {
        const courseOwnerId = course.dataValues.userId
        //make sure only course owner can make changes to course
        if (userId === courseOwnerId) {
            await course.destroy()
            res.status(204).end()
        } else {
            res.status(403).json({message: "you are not authorized to make changes to this course."})
        }
    } else {
        res.status(401).json({message: "no course found"})
    }
}))

module.exports = router;