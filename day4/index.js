const fs = require('fs');

/**
 * Part 1:
 * - Get all the real rooms by filtering out the decoy rooms
 * - Real room is the one having checksum equal to first 5 letter in desending frequency
 * - Once all the real rooms are found, calculate sum of sector IDs
 * - The sum is the output of the part 1
 * @param {array} rooms Array of all rooms
 */
function part1(rooms) {
  return getRealRooms(rooms)
    .reduce((sum, room) => sum + room.sectorId, 0);
}
/**
 * Part 2:
 * - Get all the real rooms by filtering out the decoy rooms
 * - Real room is the one having checksum equal to first 5 letter in desending frequency
 * - Once all the real rooms are found, decrypt their name
 * - Decryption is done using Ceaser Cypher based on sector ID
 * - Find the room used for storing the north pole objects
 * - The sector id of room is the output of part 2
 * @param {array} rooms Array of all rooms
 */
function part2(rooms) {
  const required = 'northpole object storage';
  return getRealRooms(rooms)
    .map(decryptName)
    .filter(({ decrypted }) => decrypted === required)
    .map(({ sectorId }) => sectorId)[0];
}

function parse(inputStr) {
  return inputStr
    .trim()
    .split('\n');
}

function isRealRoom({ checksum, calculated }) {
  return checksum === calculated;
}

function getRealRooms(rooms) {
  return rooms
    .map(parseRoom)
    .map(calculateChecksum)
    .filter(isRealRoom);
}

function decryptLetter(letter, sectorId) {
  return letter !== '-'
    ? String.fromCharCode(((letter.charCodeAt(0) - 97 + sectorId) % 26) + 97)
    : ' ';
}

function decryptName(room) {
  const decrypted = room.name
    .split('')
    .map((letter) => decryptLetter(letter, room.sectorId))
    .join('');
  return {
    ...room,
    decrypted,
  };
}

function sortLettersMap(a, b) {
  return ((b.count - a.count) || a.letter.localeCompare(b.letter));
}

function calculateChecksum(room) {
  const countMap = letterMap(room.name);
  const calculated = Object.keys(countMap)
    .map((letter) => ({ letter, count: countMap[letter] }))
    .sort(sortLettersMap)
    .map(({ letter }) => letter)
    .slice(0, 5)
    .join('');
  return {
    ...room,
    calculated,
  };
}

function letterMap(str) {
  const addToMap = (acc, letter) => {
    if (letter.match(/[a-z]/)) {
      return {
        ...acc,
        [letter]: acc[letter] ? acc[letter] + 1 : 1,
      };
    }
    return acc;
  };
  return str
    .split('')
    .reduce(addToMap, {});
}

function parseRoom(room) {
  const match = room.match(/([a-z-]+)-(\d+)\[([a-z]+)\]/);
  return {
    name: match[1],
    sectorId: parseInt(match[2], 10),
    checksum: match[3],
  };
}

function run(inputPath, shouldPrint) {
  const input = fs.readFileSync(inputPath, { encoding: 'utf8', flag: 'r' });
  const rooms = parse(input);
  const result1 = part1(rooms);
  const result2 = part2(rooms);
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
  part1,
  part2,
  parse,
  parseRoom,
  calculateChecksum,
  letterMap,
  sortLettersMap,
  decryptName,
  decryptLetter,
  isRealRoom,
  getRealRooms,
  run,
};
