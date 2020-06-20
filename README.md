The Weakest Link
================
The Weakest Link game in your browser.

https://wonderful-payne-6f127a.netlify.app/


## Running Locally
Install dependencies

    docker-compose run --rm node npm install

Start the server

    docker-composer up -d

And visit http://localhost:8081

Run the tests

    docker-compose exec node npm run test


## TODO
- Break down the round cycle component further
- Get history working with new PlayerList class
- Move styles into their respective components and reduce the size of app.css
- Stop using GitHub pages
- Show the time on the clock before the round starts
- Animations! Make it look sleek
- Warn before refreshing the page
- Try to get to the bottom of the NaN bug
- Add a question/answer pool so that the players can read the question
- Put in an easter egg when people vote for my name
