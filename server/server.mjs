import express from 'express';
import dotenv from 'dotenv';
import slotAvailabilityroute from '../routes/slotAvailability.mjs'
import appointmentBookingroute from '../routes/appointmentBooking.mjs'
import appointmentBookcheckroute from '../../supportfiles/appointmentBookcheck.mjs'
import addAvailabilityroute from '../routes/addAvailability.mjs'
import doctorsProfileroute from '../routes/updateDoctorDetails.mjs'
import patientsProfileroute from '../routes/updatePatientDetails.mjs'
import cancelAppointmentroute from '../routes/cancelAppointment.mjs'
import updateAvailabilitySlotroute from '../routes/updateAvailabilitySlots.mjs'
import deleteAvailabilitySlotroute from '../routes/removeAvailabilitySlots.mjs'
import viewDoctorProfileroute from '../routes/viewDoctorProfile.mjs'
import signuproute from '../routes/signup.mjs'
import verifyotproute from '../routes/verifyotp.mjs'
import loginroute from "../routes/login.mjs"
dotenv.config()

const app=express()

app.use(express.json())



app.use('/signup',signuproute)
app.use('/verifyotp',verifyotproute)
app.use('/login',loginroute)
app.use('/available-slots',slotAvailabilityroute)
app.use('/appointment',appointmentBookingroute)
app.use('/appointmentcheck',appointmentBookcheckroute)
app.use('/add-availability',addAvailabilityroute)
app.use('/doctorsProfile', doctorsProfileroute)
app.use('/patientProfile',patientsProfileroute)
app.use('/cancel-appointment',cancelAppointmentroute)
app.use('/update-availability',updateAvailabilitySlotroute)
app.use('/delete-availability',deleteAvailabilitySlotroute)
app.use('/view-doctorProfile',viewDoctorProfileroute)

app.listen(3000, () => {
    console.log("Server running on port 3000");
});