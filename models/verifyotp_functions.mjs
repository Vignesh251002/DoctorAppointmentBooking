const user_otpselect=(insertvalues4)=>{
    const otpselectquery = "select * from user_otp_verification where email=$1"
    return pool.query(otpselectquery,insertvalues4)
}

const User_select=(insertvalues5)=>{
    const selectquery = "SELECT * FROM users_contact WHERE email=$1";
    return pool.query(selectquery, insertvalues5);
}

const user_updateAttempts=(updateValues)=>{
    const updatequery="update user_otp_verification set attempts=$1 ,otp_attempt_time=$2 where email=$3";
    return pool.query(updatequery,updateValues)
}

const user_updateVerify=(updateValues)=>{
    const updatequery="update users set verified=true where id=(select userid from users_contact where email=$1)";
    return pool.query(updatequery,updateValues)
}
