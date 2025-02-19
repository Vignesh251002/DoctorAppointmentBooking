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


//verifyotp functions
const user_otpselect=(insertvalues4)=>{
    const otpselectquery = "select * from user_otp_verification where email=$1"
    return pool.query(otpselectquery,insertvalues4)
}

const user_updateAttempts=(updateValues)=>{
    const updatequery="update user_otp_verification set attempts=$1 ,otp_attempt_time=$2 where email=$3";
    return pool.query(updatequery,updateValues)
}

const user_updateVerify=(updateValues)=>{
    const updatequery="update users set verified=true where id=(select userid from users_contact where email=$1)";
    return pool.query(updatequery,updateValues)
}

//login functions
const user_detailsSelect=(insertvalues5)=>{
    const selectquery = "SELECT * FROM users WHERE id=(select userid from users_contact where email=$1)";
    return pool.query(selectquery, insertvalues5);
}

//updateDoctorDetails
const user_insertDoctor=(insertvalues)=>{
    const insertquery= "insert into usersdetails (user_id,first_name,last_name,date_of_birth,gender,blood_group,specialization,experience,consultation_fee) values ($1,$2,$3,$4,$5,$6,$7,$8,$9) returning*";
     return pool.query(insertquery,insertvalues)
}

const user_updateDoctor=(updatevalues)=>{
    const updatequery="update usersdetails set first_name=$1,last_name=$2,date_of_birth=$3,gender=$4,blood_group=$5,specialization=$6,experience=$7,consultation_fee=$8 where user_id=$9 returning*";
    return pool.query(updatequery,updatevalues)
}

const user_updateDoctorContact=(insertvalues)=>{
    const insertquery="update users_contact set contact=$1,location=$2,address=$3 where userid=$4 returning*";
    return pool.query(insertquery,insertvalues)
}

const user_selectdetails=(selectvalues)=>{
    const selectquery="select * from usersdetails where user_id=$1";
    return pool.query(selectquery,selectvalues)
}


//updatePatientDetails
const user_insertPatient=(insertvalues)=>{
    const insertquery= "insert into usersdetails (user_id,first_name,last_name,date_of_birth,gender,blood_group) values ($1,$2,$3,$4,$5,$6) returning*";
     return pool.query(insertquery,insertvalues)
}

const user_updatePatient=(updatevalues)=>{
    const updatequery="update usersdetails set first_name=$1,last_name=$2,date_of_birth=$3,gender=$4,blood_group=$5 where user_id=$6 returning*";
    return pool.query(updatequery,updatevalues)
}

const user_updatePatientContact=(insertvalues)=>{
    const insertquery="update users_contact set contact=$1,location=$2,address=$3 where userid=$4";
    return pool.query(insertquery,insertvalues)
}



//addAvailability functions
const addAvailability=(addvalues)=>{
    const availabilityQuery = `INSERT INTO doctor_availability ( doctor_id, id, date, session, start_time, end_time, slot_interval)VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;`;
    return pool.query(availabilityQuery, addvalues);
}


//updateDoctorDetails and updatePatientDetails, addAvailability and cancelappointment functions
const user_getId=(insertvalues)=>{
    const query="select * from users where id=(select userid from users_contact where email=$1)"
    return  pool.query(query,insertvalues)
}

//cancelAppointment functions
const user_cancelAppoint=(insertvalues)=>{
    const query="insert into canceled_appointments (appointment_id,patient_id,doctor_id,cancel_reason) values ($1,$2,$3,$4) returning*";
    return pool.query(query,insertvalues)
}

const user_getAppoint=(insertvalues)=>{
    const query="SELECT * FROM appointments WHERE id = $1 AND patient_id = $2 AND doctor_id = $3";
    return pool.query(query,insertvalues)
}

const user_updateAppoint=(insertvalues)=>{
    const query="update appointments set status='canceled' where id=$1";
    return pool.query(query,insertvalues)
}

//update availability funcions
const user_updateAvailability=(insertvalues)=>{
    const query= "SELECT * FROM doctor_availability WHERE id = $1";
    return pool.query(query,insertvalues)
        
}



export {users_signup,users_contact,user_otp,user_otpselect,
    user_updateAttempts,user_updateVerify,user_detailsSelect,
    user_getId,user_insertDoctor,user_insertPatient,
    addAvailability,user_updateDoctorContact,user_updatePatientContact,
    user_cancelAppoint,user_getAppoint,user_updateAppoint,user_updateAvailability,
    user_selectdetails,user_updateDoctor,user_updatePatient}
