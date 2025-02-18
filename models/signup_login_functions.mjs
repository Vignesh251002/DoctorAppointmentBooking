import pool from '../database/db_conncetion.mjs'

//signup functions
const users_signup =  (insertvalues1)=>{
    const insertQuery = `INSERT INTO users (authId, password, role)  VALUES ($1, $2, $3) RETURNING *`; 
    return pool.query(insertQuery, insertvalues1)      
}

const users_contact = (insertvalues2)=>{
    const insertQuery = `INSERT INTO users_contact (userid,email)
            VALUES ($1,$2) RETURNING *`;
    return pool.query(insertQuery, insertvalues2);
} 

const user_otp= (insertvalues3)=>{
    const otpinsertquery = "INSERT INTO user_otp_verification (userid,email,otp,otp_expiry_time) VALUES ($1,$2,$3,$4) RETURNING*";
    return pool.query(otpinsertquery,insertvalues3);
}

//login functions
const user_detailsSelect=(insertvalues5)=>{
    const selectquery = "SELECT * FROM users WHERE id=(select userid from users_contact where email=$1)";
    return pool.query(selectquery, insertvalues5);
}