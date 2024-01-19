import { decode } from 'jsonwebtoken';

// Middleware to extract user ID and preffered_username from token
function getUserData(req, _res, next) {
    const token = req.headers.authorization.split(' ')[1]; // Extract the token from the Authorization header
    const decodedToken = decode(token); // Decode the token
    req.userId = decodedToken.sub; // Get the user ID and add it to the request object
    req.username = decodedToken.preferred_username;

    // req.userId = '8a697eb1-786d-4b9d-8df8-dd891901284d'
    // req.username = 'x'
    next(); 
}


export default getUserData;
