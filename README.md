The Weakest Link
================
The Weakest Link game in your browser.

https://wonderful-payne-6f127a.netlify.app/


## Running Locally
Install dependencies

    docker-compose run --rm node npm install

Start the server

    docker-compose up -d

And visit http://localhost:8081

Run the tests

    docker-compose exec node npm run test


## TODO
- Get history working with new PlayerList class
- Organise/restructure/rename files
- Address todos
- Swap out webpack for rollup
- Look at https://uidesigndaily.com/ to improve on the UI
- Animations! Make it look sleek
- Warn before refreshing the page
- Move styles into their respective components and reduce the size of app.css
- Add a question/answer pool so that the players can read the question
- Put in an easter egg when people vote for my name
