import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// sibling-module.js is a CommonJS module.
const siblingModule = require('./Game.js');
console.log(siblingModule);


//import Game from './Game.js';

console.log(Game.state);
test('adds 1 + 2 to equal 3', () => {
  expect('yo').toBe('yo');
});
