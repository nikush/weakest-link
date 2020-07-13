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
- Animations! Make it look sleek
- Get history working again
- Address todos
- Swap out webpack for rollup
- Look at https://uidesigndaily.com/ to improve on the UI
- Bring in tailwind

### Nice to haves
- Preload audio to avoid delays during playback
- Use constants for store mutations and actions
- Warn before refreshing the page
- Add a question/answer pool so that the players can read the question
- Put in an easter egg when people vote for my name
