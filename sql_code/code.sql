CREATE Database if not exists blood_donation;

use blood_donation;

create table blood(
blood_id INT auto_increment primary key,
blood_group varchar(3) unique not null);

CREATE TABLE donor_details (
    donor_id INT AUTO_INCREMENT PRIMARY KEY,
    donor_name VARCHAR(50) NOT NULL,
    donor_number VARCHAR(10) UNIQUE NOT NULL,
    donor_mail VARCHAR(50) UNIQUE,
    donor_age INT NOT NULL CHECK (donor_age >= 18),
    donor_gender ENUM('Male','Female','Other') NOT NULL,
    blood_id INT,
    donor_address VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (blood_id) REFERENCES blood(blood_id)
);

CREATE TABLE admin_info (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    admin_name VARCHAR(50) NOT NULL,
    admin_username VARCHAR(50) UNIQUE NOT NULL,
    admin_password VARCHAR(255) NOT NULL
);

CREATE TABLE contact_query (
    query_id INT AUTO_INCREMENT PRIMARY KEY,
    query_name VARCHAR(100) NOT NULL,
    query_mail VARCHAR(120) NOT NULL,
    query_number CHAR(11) NOT NULL,
    query_message TEXT NOT NULL,
    query_status ENUM('Pending','Read') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE donation_log (
    donation_id INT AUTO_INCREMENT PRIMARY KEY,
    donor_id INT,
    donation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (donor_id) REFERENCES donor_details(donor_id)
);


DELIMITER $$
CREATE TRIGGER after_donor_insert
AFTER INSERT ON donor_details
FOR EACH ROW
BEGIN
    INSERT INTO donation_log (donor_id)
    VALUES (NEW.donor_id);
END $$


DELIMITER ;
DELIMITER $$

CREATE TRIGGER check_age
BEFORE INSERT ON donor_details
FOR EACH ROW
BEGIN
    IF NEW.donor_age < 18 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Donor must be at least 18 years old';
    END IF;
END $$

DELIMITER ;
DELIMITER $$

CREATE TRIGGER default_query_status
BEFORE INSERT ON contact_query
FOR EACH ROW
BEGIN
    IF NEW.query_status IS NULL THEN
        SET NEW.query_status = 'Pending';
    END IF;
END $$

DELIMITER ;
