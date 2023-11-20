import { decode } from 'jsonwebtoken';

// Middleware to extract user ID from token
function getUserId(req, _res, next) {
    const token = req.headers.authorization.split(' ')[1]; // Extract the token from the Authorization header
    const decodedToken = decode(token); // Decode the token
    req.userId = decodedToken.sub; // Get the user ID and add it to the request object

    next(); // Call the next middleware function
}


export default getUserId;
