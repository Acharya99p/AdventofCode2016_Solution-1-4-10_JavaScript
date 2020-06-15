require('mocha-testcheck').install();
const { expect } = require('chai');
const { check, gen } = require('mocha-testcheck');
const {
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
} = require('./index');

/**
 * Property generators
 */
const genPosition = gen.object({
  x: gen.int,
  y: gen.int,
  h: gen.oneOf([
    HEADING.NORTH,
    HEADING.EAST,
    HEADING.SOUTH,
    HEADING.WEST,
  ]),
});
const genSteps = gen.sPosInt;
const genToken = gen.object({ h: gen.oneOf(['R', 'L']), s: genSteps }).then((token) => `${token.h}${token.s}`);
const genInvalidToken = gen.object({ h: gen.oneOf(['R', 'L', 'X']), s: genSteps }).then((token) => `${token.h}${token.s}`);
const genInput = gen.array(genToken, { minSize: 10, maxSize: 500 }).then((arr) => arr.join(', '));

describe('Day 1: No time for taxicab', () => {
  it('should be facing north', () => {
    const pos = getStart();
    expect(pos.x).to.equal(0);
    expect(pos.y).to.equal(0);
    expect(pos.h).to.equal(HEADING.NORTH);
  });

  check.it('should calculate distance to the given position on street grid', genPosition, (position) => {
    const result = distance(position);
    const expected = Math.abs(position.x) + Math.abs(position.y);
    expect(result).to.equal(expected);
  });

  check.it('should parse and return token array', genInput, (inputStr) => {
    const tokens = parse(inputStr);
    tokens.forEach((token) => {
      expect(token[0]).to.oneOf(['R', 'L']);
      expect(token[1]).to.be.an('number');
    });
  });

  check.it('should rotate correctly in a 360° manner', gen.int, (heading) => {
    const result = rotate(heading);
    if (heading < HEADING.NORTH) {
      expect(result).to.equal(HEADING.WEST);
    } else if (heading > HEADING.WEST) {
      expect(result).to.equal(HEADING.NORTH);
    } else {
      expect(result).to.equal(heading);
    }
  });

  check.it('should turn the position heading as per the token', genPosition, genInvalidToken, (position, token) => {
    const { h } = position;
    const [dir] = parse(token)[0];
    const result = turn(h, dir);
    if (h === HEADING.NORTH && dir === 'L') {
      expect(result).to.equal(HEADING.WEST);
    } else if (h === HEADING.WEST && dir === 'R') {
      expect(result).to.equal(HEADING.NORTH);
    } else if (dir === 'L') {
      expect(result).to.equal(h - 1);
    } else if (dir === 'R') {
      expect(result).to.equal(h + 1);
    }
  });

  check.it('should change position single step in the current heading', genPosition, gen.int, (position, stepLength) => {
    const result = step(position, stepLength);
    const [offsetX, offsetY] = OFFSET[position.h];
    expect(result.h).to.equal(position.h);
    expect(result.x - position.x).to.equal(offsetX * stepLength);
    expect(result.y - position.y).to.equal(offsetY * stepLength);
  });

  check.it('should walk to the destination as per token', genPosition, genSteps, (position, steps) => {
    const result = walk(position, steps);
    const [offsetX, offsetY] = OFFSET[position.h];
    expect(result.h).to.equal(position.h);
    expect(result.x - position.x).to.equal(offsetX * steps);
    expect(result.y - position.y).to.equal(offsetY * steps);
  });

  check.it('should be able to move to the destination for single token', genPosition, genToken, (start, tokenStr) => {
    const token = parse(tokenStr)[0];
    const [dir, steps] = token;
    const result = move(start, token);
    const expHeading = turn(start.h, dir);
    const [offsetX, offsetY] = OFFSET[expHeading];
    expect(result.h).to.equal(expHeading);
    expect(result.x - start.x).to.equal(offsetX * steps);
    expect(result.y - start.y).to.equal(offsetY * steps);
  });

  check.it('should be able to move to the destination for muliple tokens', genInput, (inputStr) => {
    const tokens = parse(inputStr);
    const result = part1(tokens);
    expect(result).to.be.an('number');
  });

  it('should provide correct result for puzzle input', () => {
    const { result1, result2 } = run(`${__dirname}/input.txt`);
    expect(result1).to.equal(307);
    expect(result2).to.equal(165);
  });
});
