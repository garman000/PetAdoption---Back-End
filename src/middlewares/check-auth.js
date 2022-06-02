import jwt from "jsonwebtoken";
import HttpError from "../models/http-error";


const tokenRoutes = (req, res, next) => {
    if(req.method === "OPTIONS") {
        next()
    }

    try{
    const token = req.headers.authorization.split(' ')[1]
    if(!token) {
        throw new Error('Authentication Failed');
    } 

    const authenticatedUser = jwt.verify(token, process.env.JWT_SECRET)
    req.user = authenticatedUser
    next()
} catch (err) {
    throw new Error('Authentication has failed!', 401)
    return next (error)
}
}

export default tokenRoutes;



//nir

// // function authenticated(req, res, next) {
// //   try {
// //     const token = req.headers.authorization
// //       ? req.headers.authorization.replace("Bearer", "")
// //       : null;
// //     const authenticatedUser = jwt.verify(token, process.env.JWT_SECRET);
// //     console.log('jwttest2', token)
// //     req.user = authenticatedUser;
// //     next();
// //   } catch (error) {
// //     res.status(401).send("");
// //   }
// // }

// // export default authenticated;

