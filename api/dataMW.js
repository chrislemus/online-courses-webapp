const auth = require('basic-auth')
const bcryptjs = require('bcryptjs');
const { models } = require('./db');

// Get references to our models.
const { User } = models;

/**
 * 
 * @param {object} req.body - new user json data provided by client 
 */
const isUniqueEmail = async(user) => {
    const users = await User.findAll({attributes: ["emailAddress"], raw: true});
    const userEmails = users.map(user => user.emailAddress)
    const uniqueEmail = userEmails.find(email => email === user.emailAddress)
    if (uniqueEmail) {
        return false
    } else {
        return true
    }
}

const authenticateUser = async(req, res, next) => {
    try {
        let message = null;

        // Parse user credentials from Authorization header
        const credentials = auth(req)
            
        // If the user's credentials are available...
        if (credentials) {
            // Attempt to retrieve the user from the data store
            // by their email address (i.e. the user's "key"
            // from the Authorization header).
            const user =  await User.findOne({
                where: {emailAddress: credentials.name}
            })

        
            // If a user was successfully retrieved from the data store...
            if (user) {
                // Use the bcryptjs npm package to compare the user's password
                // (from the Authorization header) to the user's password
                // that was retrieved from the data store.
                const authenticated = bcryptjs
                    .compareSync(credentials.pass, user.password)
                
                // If the passwords match...
                if (authenticated) {
                    console.log("autheticated")
                    // Then store the retrieved user object on the request object
                    // so any middleware functions that follow this middleware function
                    // will have access to the user's information. 
                    req.currentUser = user;  
                } else {
                    message = `Authentication failure for user: ${User.emailAddress}` ;
                }
            } else {
                message = `User not found by email: ${credentials.name}`;
            }
        } else {
            message = 'Auth header not found';
        }
    
    
        // If user authentication failed...
        if (message) {
            console.warn(message)
            // Return a response with a 401 Unauthorized HTTP status code.
            res.status(401).json({ message: "Access Denied" })
        } else {
            // Or if user authentication succeeded...
            // Call the next() method.
            next();
        }  
    } catch (error) {
        throw error
    }
}

function isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }

    return true;
}



module.exports = { authenticateUser, isUniqueEmail, isEmpty }