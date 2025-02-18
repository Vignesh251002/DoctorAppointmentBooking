import nodemailer from 'nodemailer'

const mailing=(generatedotp,email)=>{
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'vigneshiyyappan2510@gmail.com',
          pass: 'svmf lvzp nqxz hgdz'
        }
    });
     
      var mailOptions = {
        from: 'vigneshiyyappan2510@gmail.com',
        to: email,
        subject: 'Reset password',
        text: generatedotp
      };

      
      transporter.sendMail(mailOptions, (error, details)=>{
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ', details);
        }
      });
}

export default mailing