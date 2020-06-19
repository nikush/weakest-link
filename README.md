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
- Implement new strongest link logic
  - Create a 'Player' object to contain the logic for score tracking and comparing
- Get rid of the global Game object
- Try to get to the bottom of the NaN bug
- Stop using GitHub pages
- Warn before refreshing the page
- Add a question/answer pool so that the players can read the question
- break down the round cycle component further
- Put in an easter egg when people vote for my name
- Animations! Make it look sleek


## The Strongest Link Logic
> these are determined by how many questions were answered correctly, incorrectly, money banked, and total monetary value of the questions asked

If I'm not mistaken, and from what I've understood from watching the show, the logic for identifying the Strongest Link are:

1) Raw Number of Correct Answers (Highest to Lowest)
2) Raw Number of Incorrect Answers (Lowest to Highest)
3) Money Banked (Highest to Lowest)
4) Value of Questions Asked

So the logic applies (1) first. If there's a tie, then it sticks the tied players through (2). If there's another tie, then the tied users go through (3) etc.
