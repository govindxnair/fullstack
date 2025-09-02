CREATE DATABASE PatientDatabase1
USE PatientDatabase1


CREATE SCHEMA pat1


CREATE TABLE pat1.Registration(
    ID INT IDENTITY(1,1) UNIQUE,        
    Fullname VARCHAR(200),
    Position VARCHAR(100),
    Email NVARCHAR(255) PRIMARY KEY,     
    Phone_no VARCHAR(20),
    Country VARCHAR(100),
    City VARCHAR(100),
    Gender VARCHAR(20),
    EPassword NVARCHAR(200),
    Confirm_EPassword NVARCHAR(200)
)


INSERT INTO pat1.Registration(Fullname, Position, Email, Phone_no, Country, City, Gender, EPassword, Confirm_EPassword) VALUES
('Aarav Sharma', 'Software Engineer', 'aarav.sharma@example.com', '+919876543210', 'India', 'Bangalore', 'Male', 'Password123!', 'Password123!'),
('Jane Doe', 'Product Manager', 'jane.doe@example.com', '+14155550123', 'USA', 'San Francisco', 'Female', 'Jane@Doe99', 'Jane@Doe99'),
('Priya Patel', 'Data Scientist', 'priya.patel@example.co.in', '+919123456789', 'India', 'Mumbai', 'Female', 'MumbaiRox!', 'MumbaiRox!'),
('Liam Smith', 'UX Designer', 'liam.smith@example.co.uk', '+442079460812', 'UK', 'London', 'Male', 'Design4Life', 'Design4Life'),
('Kenji Tanaka', 'Software Engineer', 'kenji.tanaka@example.com', '+819012345678', 'Japan', 'Tokyo', 'Male', 'KenjiPass78', 'KenjiPass78'),
('Ananya Gupta', 'Product Manager', 'ananya.g@example.com', '+918765432109', 'India', 'Delhi', 'Female', 'ananya!G', 'ananya!G'),
('Alex Chen', 'Data Scientist', 'alex.chen@example.com', '+16475550456', 'Canada', 'Toronto', 'Other', 's3curePa$$', 's3curePa$$'),
('Olivia Taylor', 'UX Designer', 'olivia.t@example.co.uk', '+441614960123', 'UK', 'Manchester', 'Female', 'LivvyT22', 'LivvyT22'),
('Ben Carter', 'Software Engineer', 'ben.carter@example.com.au', '+61491570156', 'Australia', 'Sydney', 'Prefer not to say', 'B3nC@rter', 'B3nC@rter'),
('Rohan Mehta', 'Product Manager', 'rohan.mehta@example.in', '+917654321098', 'India', 'Pune', 'Male', 'pune411007', 'pune411007');

SELECT * FROM pat1.Registration ORDER BY ID;