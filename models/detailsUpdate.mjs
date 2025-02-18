//updateDoctorDetails and updatePatientDetails
const user_getId=(insertvalues)=>{
    const query="select * from users where id=(select userid from users_contact where email=$1)"
    return  pool.query(query,insertvalues)
}

//updateDoctorDetails
const user_updateDoctor=(insertvalues)=>{
    const insertquery= "insert into usersdetails (user_id,first_name,last_name,date_of_birth,gender,blood_group,specialization,experience,consultation_fee,location,contact,address) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) returning*";
     return pool.query(insertquery,insertvalues)
}

//updatePatientDetails
const user_updatePatient=(insertvalues)=>{
    const insertquery= "insert into usersdetails (user_id,first_name,last_name,date_of_birth,gender,blood_group,location,contact,address) values ($1,$2,$3,$4,$5,$6,$7,$8,$9) returning*";
     return pool.query(insertquery,insertvalues)
}
