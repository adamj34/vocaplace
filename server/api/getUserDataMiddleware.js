import { decode } from 'jsonwebtoken';

// Middleware to extract user ID and preffered_username from token
function getUserData(req, _res, next) {
    // const token = req.headers.authorization.split(' ')[1]; // Extract the token from the Authorization header
    // const decodedToken = decode(token); // Decode the token
    // req.userId = decodedToken.sub; // Get the user ID and add it to the request object
    // req.username = decodedToken.preferred_username;

    req.userId = '3a84759d-8ea5-40d7-91f7-f22440d2d866'
    next(); 
}


export default getUserData;
