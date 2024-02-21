import { decode } from 'jsonwebtoken';

// Middleware to extract user ID and preffered_username from token
function getUserData(req, _res, next) {
    const token = req.headers.authorization.split(' ')[1]; // Extract the token from the Authorization header
    const decodedToken = decode(token); // Decode the token
    req.userId = decodedToken.sub; // Get the user ID and add it to the request object
    req.username = decodedToken.preferred_username;

    next(); 
}

// function getUserData(req, _res, next) {

//     req.userId = '3a3607d7-cd34-4929-bad9-13edf65440ac'
//     // req.userId = '85bd406b-1ec1-47a9-ae9a-599d53d2b46b'
//     // req.userId = '85bd406b-1ec1-47a9-ae9a-599d53d2b46b'
//     req.username = 'd';  
 
//     next();  
// }


export default getUserData;
