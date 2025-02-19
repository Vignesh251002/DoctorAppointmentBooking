CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    authid UUID not null,
    password VARCHAR(200) not null,
    role VARCHAR(25) not null,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);


CREATE TABLE users_contact (
    id SERIAL PRIMARY KEY,
    userid INTEGER REFERENCES users(id) unique,
    email VARCHAR(50) UNIQUE not null,
    contact VARCHAR(10) unique,
    location VARCHAR(50),
    address VARCHAR(200)
);


CREATE TABLE doctor_availability (
    id uuid primary key,
    doctor_id INTEGER references users(id),
    date DATE not null,
    session VARCHAR(20) not null,
    start_time TIME not null,
	end_time TIME not null,
	slot_interval Integer not null,
    CONSTRAINT unique_doctor_availability UNIQUE (doctor_id, date, session)
);


CREATE TABLE usersdetails
(
    id serial primary key,
    user_id integer references users(id) unique not null,
    first_name character varying(100),
    last_name character varying(100),
	date_of_birth date,
	gender character varying(10) not null,
	blood_group character varying(5),
    specialization character varying(100),
    experience integer ,
    consultation_fee integer,
    created_at timestamp DEFAULT now()
);

CREATE TABLE appointments (
    id UUID PRIMARY KEY,
    doctor_id INTEGER references users(id) unique,
    patient_id INTEGER references users(id) unique,
    appointment_date DATE not null,
    appointment_session VARCHAR(15) not null,
    start_time TIME not null,
    end_time TIME not null,
    status VARCHAR(15) default false
);


CREATE TABLE user_otp_verification (
    id SERIAL PRIMARY KEY,
    userid INTEGER unique NOT NULL,
    email VARCHAR(30) NOT NULL,
    otp VARCHAR(6) NOT NULL,
    otp_expiry_time TIMESTAMP WITHOUT TIME ZONE,
    attempts INTEGER DEFAULT 0,
    otp_attempt_time TIMESTAMP WITHOUT TIME ZONE,
    FOREIGN KEY (userid) REFERENCES users(id) 
);



CREATE TABLE canceled_appointments (
    id SERIAL PRIMARY KEY,
    appointment_id uuid references appointments(id) unique,
    patient_id INTEGER references users(id) unique,
    doctor_id INTEGER references users(id) unique,
    cancel_reason VARCHAR(255) not null ,
    cancel_date TIMESTAMP
);


