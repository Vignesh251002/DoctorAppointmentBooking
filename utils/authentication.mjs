import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';


dotenv.config();

const generatetoken = async(userid, email) => {
    return jwt.sign({userid: userid, email: email }, process.env.SECRET_KEY,);  // Add expiry time
};


const verifytoken = (req, res, next) => {
    const authHeader = req.header("Authorization");
    console.log("Authentication Header",authHeader);
    
    if (!authHeader) {
        return res.status(401).json({ message: "Access denied" });
    }
    
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;
    console.log("Encoded Token:", token);

    jwt.verify(token, process.env.SECRET_KEY, (error, decodedmessage) => {
        if (error) {
            console.error("JWT Verification Error:", error);
            return res.status(400).json({ message: "Invalid token" });
        }

        console.log("Decoded Token:", decodedmessage);
        req.user = decodedmessage;
        next();
    });
};

export { generatetoken, verifytoken};

