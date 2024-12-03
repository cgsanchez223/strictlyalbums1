Welcome to StrictlyAlbums
- StrictlyAlbums is my capstone project for the Software Engineer Bootcamp at Stony Brook University.
- This is a tool where users can rate their favorite albums and add them to lists.
- The album data is retrieved from the Spotify API

##########################
Test the Project out here:
https://frontend-n8ea.onrender.com/


##########################
Technologies Used:
- The backend was created using Create React App along with Node.js.
- The frontend was created using the Vite React App and styling from Tailwind
- Database was taken from the Spotift API. For more information on how to setup use: https://developer.spotify.com/
- Local Database was constructed using PostgreSQL and TablePlus
- Deployment was done on Render: https://render.com/


##########################
Schema Diagram: https://imgur.com/a/hajwyMz


##########################
Installation Instructions:
- You should have a Terminal shell such as Ubuntu or GitBash in order to clone git and install packages.
- You should have Node.js install to work with program
- You should have PostgreSQL installed to create database
- After you clone repository, use "npm install" in both backend and frontend folders

-------------------------------------------------------------
Create a .env folder in backend with the following variables:
DB_USER=yourusername
DB_HOST=localhost
DB_NAME=strictlyalbums
DB_PASSWORD=yourpassword
DB_PORT=5432
JWT_SECRET=your_jwt_secret
SPOTIFY_CLIENT_ID=(instructions *)
SPOTIFY_CLIENT_SECRET=(instructions *)
PORT=5007
DB_FORCE_SYNC=false

*Go on https://developer.spotify.com/ and create an app. Under settings you can find a Client ID and Client Secret. 
- Client ID = SPOTIFY_CLIENT_ID
- Client Secret = SPOTIFY_CLIENT_SECRET

-------------------------------------------------------------
Using PostgreSQL:
- createdb strictlyalbums
- Go into strictlyalbums
- view strictlyalbums.sql and paste instructions in PostgreSQL


-------------------------------------------------------------
- Finally after all of the above instructions are met:
- Have both frontend and backend shells open and use "npm run dev" in both
- App should be live in your localhost


##########################
Usage:
The app is very straightforward. After creating an account you will be taken to a dashboard. Click "Search Albums" to be taken to a page where you will be able to search albums that are fetched from the Spotify API. Album artwork will appear, click the album that you would like to rate. This brings up a page featuring many details about the album and the ability to rate the album on a scaled of 1 - 5, provide a description, and add that album to a user created list. After rating, you will be redirected to your profile page, where you will see the album and other albums you have rated. You can also create lists and add albums to those lists.



##########################
Features:
- Connecting to Spotify API
- Being able to search for albums
- Can rate albums on a 1 - 5 star rating scale
- Can create lists for adding albums to



##########################
Contributing:
- Feel free to suggest edits.
- There are a couple of features that need to be re-written.
- The "Lists Created" feature is bugged at the moment, not being able to count the amount of lists created.
- The "Most Active Month" is simply a static feature right now. Not sure how to implement or if I even would like to keep.


##########################
Contact Information:
- Feel free to message/add me on Github
- My email is cgsanchez223@gmail.com
- LinkedIn: www.linkedin.com/in/christopher-sanchez-b69872100
