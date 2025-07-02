-- Create the database
CREATE DATABASE IF NOT EXISTS jeevansetu;
USE jeevansetu;

-- Users table (for authentication)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- Health profiles table (linked to users)
CREATE TABLE IF NOT EXISTS health_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    jeevansetu_id VARCHAR(20) NOT NULL UNIQUE,
    blood_group VARCHAR(10),
    allergies VARCHAR(255),
    conditions VARCHAR(255),
    emergency_name VARCHAR(255),
    emergency_phone VARCHAR(20),
    medications VARCHAR(255),
    doctor VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Optional: Add an index for faster lookups by JeevanSetu ID
CREATE INDEX idx_jeevansetu_id ON health_profiles(jeevansetu_id);

-- Add full_name column to health_profiles table
ALTER TABLE health_profiles ADD COLUMN full_name VARCHAR(255);