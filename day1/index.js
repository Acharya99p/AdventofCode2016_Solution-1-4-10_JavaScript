const fs = require('fs');

const HEADING = Object.freeze({
  NORTH: 0,
  EAST: 1,
  SOUTH: 2,
  WEST: 3,
});
const OFFSET = Object.freeze({
  [HEADING.NORTH]: [0, 1],
  [HEADING.EAST]: [1, 0],
  [HEADING.SOUTH]: [0, -1],
  [HEADING.WEST]: [-1, 0],
});

/**
 * Get the initial position of the person
 */
function getStart() {
  return {
    x: 0,
    y: 0,
    h: HEADING.NORTH,
  };
}

/**
 * Part 1: 
 * - For each token, move the person to new position
 * - When all the tokens are processed, the persona has reached its destination
 * - Calculate the distance of destination from start using street-grid algo
 * - The calculated distance is the number of blocks to Easter Bunny HQ
 * @param {array} Input data as array of tokens
 */
function part1(data) {
  const end = data
    .reduce((pos, token) => move(pos, token), getStart());
  return distance(end);
}
/**
 * Part 2:
 * - Create a logger to log all the places he has visited twice
 * - For each token, move the person to new position
 * - When all the tokens are processed, find the first intersection
 * - The first interection is the actual Easter Bunny HQ
 * @param {array} Input data as array of tokens
 */
function part2(data) {
  const log = [];
  const logger = createLogger(log);
  data.reduce((pos, token) => move(pos, token, logger), getStart());
  return distance(log[0]);
}

/**
 * Calculate the distance between position and start using street-grid algorithm
 * @param {object} position Position on the coordinate system
 */
function distance({ x, y }) {
  return Math.abs(x) + Math.abs(y);
}
/**
 * Re-align the heading direction to rotate 360 degrees
 * @param {integer} heading Current heading direction
 */
function rotate(heading) {
  if (heading < HEADING.NORTH) {
    return HEADING.WEST;
  }
  if (heading > HEADING.WEST) {
    return HEADING.NORTH;
  }
  return heading;
}
/**
 * Update the heading location as per turning command
 * @param {integer} heading Current heading
 * @param {R|L} direction Command 'L' to turn Left and 'R' to turn right
 */
function turn(heading, direction) {
  switch (direction) {
    case 'R':
      return rotate(heading + 1);
    case 'L':
      return rotate(heading - 1);
    default:
      return heading;
  }
}
/**
 * Parse the instructions string into array of tokens
 * @param {string} input Input string of instructions
 */
function parse(input) {
  return input
    .trim()
    .split(', ')
    .map((token) => [token[0], +token.slice(1)]);
}
/**
 * Move the person from one position to other as per Token ibput
 * @param {object} position Current position object
 * @param {array} token token array
 * @param {function} callback Callback function after each step
 */
function move(position, token, callback) {
  const h = turn(position.h, token[0]);
  return walk({ ...position, h }, token[1], callback);
}
/**
 * Creator function to create a callback for logging the steps
 * @param {array} log Logger array
 */
function createLogger(log) {
  const map = {};
  return function loggerFn(pos) {
    if (map[`${pos.x},${pos.y}`]) {
      log.push(pos);
    }
    map[`${pos.x},${pos.y}`] = pos;
  };
}
/**
 * Walk a number of steps in the current heading
 * @param {object} pos Current position
 * @param {integer} steps Number of steps to walk
 * @param {function} callback Callback function after each step
 */
function walk(pos, steps, callback) {
  return Array(steps)
    .fill()
    .reduce((current) => {
      const next = step(current, 1);
      if (typeof callback === 'function') {
        callback(next);
      }
      return next;
    }, pos);
}
/**
 * Single step in current heading
 * @param {object} pos Current position
 * @param {integer} stepLength Delta for each step
 */
function step(pos, stepLength) {
  return {
    ...pos,
    x: pos.x + OFFSET[pos.h][0] * stepLength,
    y: pos.y + OFFSET[pos.h][1] * stepLength,
  };
}
/**
 * Boilerplate code to read input and run the exercise
 * @param {path} inputPath Path of input file
 * @param {boolean} shouldPrint Should print to terminal
 */
function run(inputPath, shouldPrint) {
  const input = fs.readFileSync(inputPath, { encoding: 'utf8', flag: 'r' });
  const data = parse(input);
  const result1 = part1(data);
  const result2 = part2(data);
  if (shouldPrint) {
    print(result1, result2);
  }
  return {
    result1,
    result2,
  };
}
/**
 * Boilerplate code to print the result
 * @param {number} result1 Result of part 1
 * @param {number} result2 Result of part 2
 */
function print(result1, result2) {
  process.stdout.write(`Part 1: ${result1} `);
  process.stdout.write('\n');
  process.stdout.write(`Part 2: ${result2} `);
  process.stdout.write('\n');
}

if (!module.parent) {
  run(`${__dirname}/input.txt`, true);
}

module.exports = {
  distance,
  rotate,
  parse,
  walk,
  turn,
  step,
  move,
  getStart,
  part1,
  run,
  HEADING,
  OFFSET,
};
