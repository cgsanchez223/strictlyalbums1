Capstone Proposal Ideas - Christopher Sanchez (cgsanchez223)

Original Link: https://docs.google.com/document/d/1vt7WBGOjc7gx5DGSN-IuZ-r4ACknwX27r4PMyMVEoKI/edit?usp=sharing

1 -
I want to have an inspirational motivation type of app. The idea is that in order to receive awards, you have to work on yourself first. 
- Maybe keep a "bookshelf" with a small amount of rewards.
- The user will essentially create a profile with the ability to add a Todo type list.
- The user will add tasks/goals that they would like to complete.
- When the user completes the tasks they can submit and it will take them to a reward
- maybe find an API that can open up the trailer to that movie.
Netflix roulette picks a movie for you. Could use that as a reward.

Anime:
- https://myanimelist.net/clubs.php?cid=13727&ref=public_apis

Movies:
- https://rapidapi.com/collection/movie-apis
- https://rapidapi.com/SAdrian/api/moviesdatabase/playground/apiendpoint_91a7a21e-0f07-4cdf-90c0-b970384bc2e2
- https://rapidapi.com/movie-of-the-night-movie-of-the-night-default/api/streaming-availability/playground/-apiendpoint_14b2f4b9-8801-499a-bcb7-698e550f9253
- https://apilist.fun/api/omdb
- https://apilist.fun/api/netflix-roulette

Hockey:
- https://rapidapi.com/api-sports/api/api-hockey/playground/apiendpoint_ddb0c34f-f463-4e17-8efc-b59887a62368



Quotable - API that generates quotes from famous people. Idea is that everytime you complete a task or open the app, you will be greeted by an inspirational quote.
- https://github.com/lukePeavey/quotable?tab=readme-ov-file
- https://www.postman.com/quotable/quotable/overview
- https://web.postman.co/workspace/My-Workspace~d9211f66-a0a4-49cd-837b-5f9e9e338007/overview

- https://github.com/bmumz/inspirational-quotes-api?tab=readme-ov-file
- https://github.com/bmumz/inspirational-quotes-api/blob/main/db.json

- https://www.starterstory.com/api-slogans

Layout:
- “/” - Homepage. - Contains description of website.
- Allows users to create a profile

NavBar Contains
- About: Contains description of website
- Login/Signup: Allows users to create an account
- Profile: Will replace “Login/Signup”
- (Task List) - Will link to task list

“/user:username” - Links to profile.
- Contains information such as name, age, gender
- Contains link to tasks list
- Profile picture (or could use API to automatically generate profile pictures)

“/tasklists” - contains links to task lists

“/addTask” - Form for starting project, adding tasks
- Brings up form for adding a task you would like to work on.
- Task - Name of task
- Description - Explain what the task is
- Goal - How many times do you want to complete this task before achieving reward?
- Submit - Will add Todo list to an array list
- (Can have multiple lists with different rewards. Encouraged to put lists with long term tasks, paired with more rewarding/longer rewards).

“/addReward” - Form for adding rewards
- Name - Name of reward
- Description - description of reward
- Ability to upload picture
- Ability to link to award
- Submit - will add to reward array list. Programmed with classes to show whether award is unlocked or not.

“/library” - Will contain list of possible rewards
- Ideally, I would want this list hidden until certain criterias are met.
- (Add reward) button -> “/addReward”
     -  The information would be hidden with the exception of the title (maybe something like a blacked out icon with a ? in the middle).
     - When an reward is achieved through submitting forms, it will unlock a reward. The reward would then be revealed to the user - showing an image of the reward and something such as  a trailer for a movie reward.

There would be 2 ways of completing tasks. 
- The first is a checkbox. Each Todo form will have a list of tasks. Next to each task contains a checkbox. The checkbox can be checked once the task is completed for the day. When submitting a task, it will ask you how many times do you want this checkbox checked before completing an award. When that number is reached, a reward is unlocked.
- Second is clicking on the name of the task will cross the task out. Hitting submit form will remove the task from the list.

Overall, this is a very complex idea, but at the level of programmer I am, I did not decide to go along with it.

—-----------------------------------------------------------------------------------------------------
2 -
Something with food. Maybe put ingredients you have in your fridge into a list. The list then connects to an API with possible recipes
- https://www.kaggle.com/datasets/shuyangli94/food-com-recipes-and-user-interactions/data
- https://apilist.fun/api/food-api
- https://apilist.fun/api/us-restaurant-menus
- https://apilist.fun/api/chomp-food-nutrition-database-api
- https://apilist.fun/api/spoonacular-food-api

Layout:
“/” Homepage - Layout looks like a book or piece of notebook paper.
“Click Add Ingredients to make your recipe”
- Add Ingredients allows you to add items to a list.
- Using the API lists can link to possible food dishes you can make

“/recipes” - Blog style. There would be a list of recipes that are featured on the site.

“/recipes/id:1” - Takes you to the recipe from the recipe list.
- The page would contain the title (name of dish), an image of the recipe underneath.
- In a word box that is styled to look like a notebook page there will be the ingredients for the dish.
- Contains nutrition details from API


Brief idea. Not really sure about it.

—-----------------------------------------------------------------------------------------------------
3 -
Music. Music buddy finding app. 
	- Something like facebook but music focused. 
	- Find people in your neighborhood to go to shows with. 
	- Document your record collection. Can possibly be used for trading/selling

Spotify:
- https://developer.spotify.com/
- https://developer.spotify.com/documentation/web-api
- https://developer.spotify.com/documentation/web-api/howtos/web-app-profile
- https://apilist.fun/api/spotify-web
- https://apilist.fun/api/lastfm-api

Bandsintown:
- https://app.swaggerhub.com/apis/Bandsintown/PublicAPI/3.0.0?ref=public_apis
- https://rapidapi.com/s.mahmoud97/api/concerts-artists-events-tracker/playground/apiendpoint_c0f45ab6-dc2e-4388-a7e3-e4d98be17d24
- https://apilist.fun/api/ticketmaster
- https://apilist.fun/api/upcomingorg-api
- https://apilist.fun/api/eventbrite

Radio
- https://api.radio-browser.info/?ref=public_apis
- https://rapidapi.com/dpthapaliya19/api/radio-world-75-000-worldwide-fm-radio-stations/playground/apiendpoint_ba19d5ed-1b16-48a7-bc12-743b1489e966

Discogs:
- https://www.discogs.com/developers?ref=public_apis

Soundcloud:
- https://developers.soundcloud.com/docs/api/guide?ref=public_apis
- https://apilist.fun/api/soundcloud-api

Shazam
- https://rapidapi.com/diyorbekkanal/api/shazam-api6/playground/apiendpoint_9051865e-e5be-41be-bc70-44f677990f38

Genius
- https://rapidapi.com/Glavier/api/genius-song-lyrics1/playground/apiendpoint_470601f9-d5c5-457a-914f-a96497307033

- https://apilist.fun/api/audio-db
- https://apilist.fun/api/blogcast
- https://apilist.fun/api/houndify
- https://apilist.fun/api/musixmatch

Layout:
 "/" - Homepage - (I will try to get a logo, if not just the name in a pretty font)
	- Undecided on the name at the moment.
	- Has descriptions on website and examples of what profiles look like
	- (If I can find a music news API, maybe generate articles)
	- Has a signup form
		- Signup form has fields [ name, username, password ]. Submit button to create profile.
	- Need to create an admin profile that can make changes throughout site.
	- Other user profiles will only be able to edit there own page. No interference with other user pages (ex - can only access their own "user/inbox" page, cannot access others.


"/user:username" - User Profile Page
	- Looks like a facebook style page. Will contain box where a profile image, About Me description, Location, Favorite bands and music genres. Maybe be able to link songs from a playlist
	- Maybe have a section for concerts, both past and upcoming concerts. Maybe can write concert reviews for previous concerts.
	- Have a friend request button for other users to add -> leads to that user receiving a friend request on their "user/friendrequest page"
	- Page will have a section for a list of friends.
	- Page will have section for playlists and songs
	- Can share songs to feed
	- Can share concerts to feed


"/user/inbox" - Messages
		- Can send message to other users.


"music" - (Rough idea) - I want users to be able to see album covers, be able to link to songs. 
		- The songs can be played by Spotify.
		- The songs can be added to playlists (Each user also has links to their playlists on their profile)
		- Maybe have a rating ability out of 5 stars. Give users the option to rate songs and albums. Other users can also see this. Maybe can do top rated tracks and albums page.



Overall this 3rd idea is the best and is ultimately the one I decided to go with, although very scaled back to my programming level.