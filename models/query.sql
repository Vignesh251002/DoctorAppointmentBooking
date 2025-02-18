CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    authid UUID,
    password VARCHAR(200),
    role VARCHAR(25),
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);


CREATE TABLE users_contact (
    id SERIAL PRIMARY KEY,
    userid INTEGER REFERENCES users(id) ON DELETE CASCADE,
    email VARCHAR(50) UNIQUE ,
    contact VARCHAR(10) unique,
    location VARCHAR(50),
    address VARCHAR(200)
);


CREATE TABLE doctor_availability (
    id uuid primary key,
    doctor_id INTEGER references users(id),
    date DATE,
    session VARCHAR(20),
    start_time TIME,
	end_time TIME,
	slot_interval Integer,
    CONSTRAINT unique_doctor_availability UNIQUE (doctor_id, date, session)
);


CREATE TABLE usersdetails
(
    id serial primary key,
    user_id integer references users(id),
    first_name character varying(100),
    last_name character varying(100),
	date_of_birth date,
	gender character varying(10),
	blood_group character varying(5),
    specialization character varying(100),
    experience integer,
    consultation_fee integer,
    created_at timestamp DEFAULT now()
);

CREATE TABLE appointments (
    id UUID PRIMARY KEY,
    doctor_id INTEGER references users(id),
    patient_id INTEGER references users(id),
    appointment_date DATE,
    appointment_session VARCHAR(15),
    start_time TIME,
    end_time TIME,
    status VARCHAR(15) default false
);


CREATE TABLE user_otp_verification (
    id SERIAL PRIMARY KEY,
    userid INTEGER NOT NULL,
    email VARCHAR(30) NOT NULL,
    otp VARCHAR(6) NOT NULL,
    otp_expiry_time TIMESTAMP WITHOUT TIME ZONE,
    attempts INTEGER DEFAULT 0,
    otp_attempt_time TIMESTAMP WITHOUT TIME ZONE,
    FOREIGN KEY (userid) REFERENCES users(id) ON DELETE CASCADE
);



CREATE TABLE canceled_appointments (
    id SERIAL PRIMARY KEY,
    appointment_id uuid references appointments(id),
    patient_id INTEGER references users(id),
    doctor_id INTEGER references users(id),
    cancel_reason VARCHAR(255),
    cancel_date TIMESTAMP
);
