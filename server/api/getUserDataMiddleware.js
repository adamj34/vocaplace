import { decode } from 'jsonwebtoken';

// Middleware to extract user ID and preffered_username from token
function getUserData(req, _res, next) {
    const token = req.headers.authorization.split(' ')[1]; // Extract the token from the Authorization header
    const decodedToken = decode(token); // Decode the token
    req.userId = decodedToken.sub; // Get the user ID and add it to the request object
    req.username = decodedToken.preferred_username;

    // req.userId = '533e4a19-be1e-4c5d-8659-83b2234a7bcd'
    // req.username = 'r'

    next(); 
}


export default getUserData;
