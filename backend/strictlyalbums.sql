DROP DATABASE IF EXISTS strictlyalbums;

CREATE DATABASE strictlyalbums;

\c strictlyalbums



CREATE TABLE Users 
( 
    id SERIAL PRIMARY KEY, 
    username VARCHAR(255) NOT NULL UNIQUE, 
    email VARCHAR(255) NOT NULL UNIQUE, 
    password_hash VARCHAR(255) NOT NULL, 
    avatar_url VARCHAR(255), 
    description TEXT, 
    location VARCHAR(255), 
    favorite_genres TEXT[] DEFAULT ARRAY[]::TEXT[], 
    social_links JSONB DEFAULT '{}'::JSONB, 
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP );