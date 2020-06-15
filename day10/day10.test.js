require('mocha-testcheck').install();
const { expect } = require('chai');
const { check, gen } = require('mocha-testcheck');
const {
  filter,
  matchBot,
  matchVal,
  run,
  constants,
} = require('./index');

const times = { times: 50 };
// Property generaators
const genBotOrOutput = gen.oneOf(['bot', 'output']);
const genBotStr = gen.object({
  bins: gen.array(genBotOrOutput, { size: 2 }),
  ids: gen.uniqueArray(gen.sPosInt, { size: 3 }),
}).then((obj) => `bot ${obj.ids[0]} gives low to ${obj.bins[0]} ${obj.ids[1]} and high to ${obj.bins[1]} ${obj.ids[2]}`);
const genValStr = gen.uniqueArray(gen.sPosInt, { size: 2 }).then((arr) => `value ${arr[0]} goes to bot ${arr[1]}`);
const genRandomStr = gen.oneOf([genBotStr, genValStr]);
const genInputStr = gen.uniqueArray(genRandomStr, { minSize: 10, maxSize: 500 }).then((arr) => arr.join('\n'));

describe('Day 10: Balance Bots', () => {
  check.it('should return the array of bot strings', times, genInputStr, (inputStr) => {
    const arr = filter(inputStr, constants.TYPE_CMD);
    expect(arr.filter((str) => /^bot/.test(str)).length).to.equal(arr.length);
    expect(arr.filter((str) => !/^bot/.test(str)).length).to.equal(0);
  });

  check.it('should return the array of value strings', times, genInputStr, (inputStr) => {
    const arr = filter(inputStr, constants.TYPE_VAL);
    expect(arr.filter((str) => /^value/.test(str)).length).to.equal(arr.length);
    expect(arr.filter((str) => !/^value/.test(str)).length).to.equal(0);
  });

  check.it('should process the bot command string correctly', times, genBotStr, (botStr) => {
    const botArr = matchBot(botStr);
    expect(+botArr[0]).to.be.an('number');
    expect(botArr[1]).to.oneOf(['bot', 'output']);
    expect(+botArr[2]).to.be.an('number');
    expect(botArr[3]).to.oneOf(['bot', 'output']);
    expect(+botArr[4]).to.be.an('number');
  });

  check.it('should process the value allocation command correctly', times, genValStr, (valStr) => {
    const valArr = matchVal(valStr);
    expect(+valArr[0]).to.be.an('number');
    expect(+valArr[1]).to.be.an('number');
  });

  it('should provide correct result for puzzle input', () => {
    const { result1, result2 } = run(`${__dirname}/input.txt`);
    expect(result1).to.equal(141);
    expect(result2).to.equal(1209);
  });
});
