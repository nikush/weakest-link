The Weakest Link
================
The Weakest Link game in your browser.

https://nikush.github.io/weakest-link/


# TODO
- Add unit tests
- Stop using the EventBus, there's got to be a better way
- Warn before refreshing the page
- Add a question/answer pool so that the players can read the question
- break down the round cycle component further
- Put in an easter egg when people vote for my name
- Look to compile the js and deploy to GH pages:
  https://medium.com/linagora-engineering/deploying-your-js-app-to-github-pages-the-easy-way-or-not-1ef8c48424b7


# Running Locally
Install dependencies

    docker-compose run --rm node npm install

Start the server

    docker-composer up -d

And visit http://localhost:8081
