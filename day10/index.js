const fs = require('fs');

const TYPE_CMD = 'CMD';
const TYPE_VAL = 'VAL';
const REG_MATCH_CMD = /(\d+).*?(bot|output) (\d+).*?(bot|output) (\d+)/;
const REG_FILTER_CMD = /^bo/;
const REG_MATCH_VAL = /(\d+)/g;
const REG_FILTER_VAL = /^va/;

function matchBot(botStr) {
  const match = botStr.match(REG_MATCH_CMD);
  return match ? match.slice(1) : null;
}

function matchVal(valStr) {
  return valStr.match(REG_MATCH_VAL);
}

function filter(str, type) {
  return str
    .split('\n')
    .filter((value) => {
      if (type === TYPE_CMD) {
        return REG_FILTER_CMD.test(value);
      }
      return REG_FILTER_VAL.test(value);
    });
}

function initBot([id, lowTo, lowValue, highTo, highValue]) {
  return {
    id: +id,
    chips: [],
    lowTo,
    lowValue,
    highTo,
    highValue,
  };
}

function transfer(botMap, id, type) {
  const {
    chips,
    lowTo,
    highTo,
    lowValue,
    highValue,
  } = botMap[id];
  switch (type) {
    case 'LOW':
      return (
        lowTo === 'output'
          ? { [lowValue]: Math.min(...chips) }
          : processChips(botMap, lowValue, Math.min(...chips))
      );
    case 'HIGH':
      return (
        highTo === 'output'
          ? { [highValue]: Math.max(...chips) }
          : processChips(botMap, highValue, Math.max(...chips))
      );
    default:
      return {};
  }
}

function processChips(map, id, chip) {
  const botMap = { ...map };
  if (chip) {
    botMap[id].chips = [...botMap[id].chips, chip];
  }
  if (botMap[id].chips.length === 2) {
    const output = {
      ...transfer(botMap, id, 'LOW'),
      ...transfer(botMap, id, 'HIGH'),
    };
    return output;
  }
  return {};
}

function getBotMap(botMap, bot) {
  return {
    ...botMap,
    [bot.id]: bot,
  };
}

function getChipsMap(chipsMap, [chip, id]) {
  const chips = chipsMap[id] || [];
  return {
    ...chipsMap,
    [+id]: [...chips, +chip],
  };
}

function assignChips(bot, chips) {
  return chips
    ? { ...bot, chips }
    : bot;
}

/**
 * Runs the code for the execrise 10
 * Part 1: 
 * - Filter out the initial chip assignment commands
 * - Parse those commands to get the bot-chip assigment map
 * - Filter out the transfer commands
 * - Parse those commands to get the map of bots with their transfer instructions properties
 * - Start the transfer for the first bot having 2 chips
 * - After all the transfer has been done, we get the output map with chips
 * - Compare the chips in the bots map for finding the bot which compared chip-17 with chip-61
 * - The bot id of that bot is the output for part 1.
 * Part 2:
 * - Multiply the chip values in the output map for output [0], [1] and [2]
 * - The result of multiplication is the output for part 2.
 * @param {string} inputPath path of the input file
 * @param {boolean} shouldPrint should print to terminal
 */
function run(inputPath, shouldPrint) {
  const inputStr = fs.readFileSync(inputPath, { encoding: 'utf8', flag: 'r' });
  const chipsMap = filter(inputStr, TYPE_VAL)
    .map(matchVal)
    .reduce(getChipsMap, {});

  const botMap = filter(inputStr, TYPE_CMD)
    .map(matchBot)
    .map(initBot)
    .map((bot) => assignChips(bot, chipsMap[bot.id]))
    .reduce(getBotMap, {});

  const outputMap = Object
    .keys(botMap)
    .reduce((acc, id) => ({
      ...acc,
      ...processChips(botMap, id),
    }), {});

  const result1 = +Object
    .keys(botMap)
    .find((id) => (
      botMap[id].chips.includes(17)
      && botMap[id].chips.includes(61)
    ));

  const result2 = outputMap[0] * outputMap[1] * outputMap[2];

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
  filter,
  matchBot,
  matchVal,
  run,
  constants: {
    TYPE_CMD,
    TYPE_VAL,
  },
};
