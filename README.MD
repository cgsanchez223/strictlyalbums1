strictlyalbums
This will be my capstone for SBU. Project Proposal can be found here: https://docs.google.com/document/d/1LQl8UXuypL95N_y-f1PEVzCBTWsSF8hxAffGFB1Sqo4/edit?usp=sharing

Welcome to StrictlyAlbums! Users will be able to connect to the Spotify API in order to search their favorite music albums. Users can rate the albums out of a 5 star rating system. Users can create lists with their favorite albums.

I used Create React App and Node.Js for the backend server. Vite React for the frontend. Tailwind as a complimentary tool for the styling.

To get the app running:

Use "npm i" in the terminal in both frontend and backend folders to download all of the packages

An env file should be created in the backend folder. It contains the following variables: DB_USER=yourusername DB_HOST=localhost DB_NAME=strictlyalbums DB_PASSWORD=yourpassword DB_PORT=5432 JWT_SECRET=jwtpassword SPOTIFY_CLIENT_ID= SPOTIFY_CLIENT_SECRET= PORT=5007 DB_FORCE_SYNC=false

SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET can be found by going on https://developer.spotify.com/ Create an app. You will be given a client_id and client_secret. Add your localhost to the whitelist

To create tables for the database: in psql createdb strictlyalbums Go into strictlyalbums in psql Paste the following: CREATE TABLE Users ( id SERIAL PRIMARY KEY, username VARCHAR(255) NOT NULL UNIQUE, email VARCHAR(255) NOT NULL UNIQUE, password_hash VARCHAR(255) NOT NULL, avatar_url VARCHAR(255), description TEXT, location VARCHAR(255), favorite_genres TEXT[] DEFAULT ARRAY[]::TEXT[], social_links JSONB DEFAULT '{}'::JSONB, createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP );

To start the server use "npm run dev" in your Terminal in both frontend and backend.