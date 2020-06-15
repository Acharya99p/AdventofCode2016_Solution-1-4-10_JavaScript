require('mocha-testcheck').install();
const { expect } = require('chai');
const { check, gen } = require('mocha-testcheck');
const {
  parse,
  parseRoom,
  calculateChecksum,
  letterMap,
  decryptName,
  getRealRooms,
  decryptLetter,
  run,
} = require('./index');

const ROOM_TYPES = {
  REAL: 'real',
  DECOY: 'decoy',
};
const genLetter = gen.alphaNumChar;
const genSectorId = gen.sPosInt;
const singleRoom = gen.oneOf([{
  sectorId: 123,
  name: 'aaaaa-bbb-z-y-x-123[abxyz]',
  type: ROOM_TYPES.REAL,
  checksum: 'abxyz',
},
{
  sectorId: 987,
  name: 'a-b-c-d-e-f-g-h-987[abcde]',
  type: ROOM_TYPES.REAL,
  checksum: 'abcde',
},
{
  sectorId: 404,
  name: 'not-a-real-room-404[oarel]',
  type: ROOM_TYPES.REAL,
  checksum: 'oarel',
},
{
  sectorId: 200,
  name: 'totally-real-room-200[decoy]',
  type: ROOM_TYPES.DECOY,
  checksum: 'decoy',
}]);

const multipleRooms = gen.sized((size) => gen.array(singleRoom, { size }));
const genInputStr = gen.sized((size) => gen.array(singleRoom, { size })).then((arr) => arr.join('\n'));

describe('Day 4: Security Through Obscurity', () => {
  check.it('should convert the input into array of encrypted rooms names', genInputStr, (inputStr) => {
    const result = parse(inputStr);
    expect(result).to.be.an('array');
    expect(result.length).to.not.equal(0);
  });

  check.it('should extract the room name, sector id, checksum from the decrypted room name', singleRoom, (room) => {
    const result = parseRoom(room.name);
    expect(result.sectorId).to.equal(room.sectorId);
    expect(result.name).to.equal(room.name.slice(0, room.name.lastIndexOf('-')));
    expect(result.checksum).to.equal(room.checksum);
  });

  check.it('should convert the room name into a hashmap with each letter\'s count', singleRoom, (room) => {
    const result = letterMap(room.name);
    const keys = Object.keys(result);
    expect(result).to.be.an('object');
    expect(keys.length).to.not.equal(0);
    expect(result['-']).to.equal(undefined);
    keys.forEach((k) => {
      expect(result[k]).to.be.an('number');
      expect(result[k]).to.not.equal(0);
    });
  });

  check.it('should decrypt single letter', genLetter, genSectorId, (letter, sectorId) => {
    if (letter.charCodeAt(0) >= 97 && letter.charCodeAt(0) <= 122) {
      const result = decryptLetter(letter, sectorId);
      expect(result.charCodeAt(0)).to.be.greaterThan(96);
      expect(result.charCodeAt(0)).to.be.lessThan(123);
    }
  });

  check.it('should decrypt complete encrypted room name', singleRoom, (room) => {
    const result = decryptName(parseRoom(room.name));
    expect(result.decrypted).to.be.an('string');
    expect(result.decrypted.includes('-')).to.equal(false);
    expect(result.decrypted.includes(' ')).to.equal(true);
  });

  it('should decrypt a given room name based on sector Id', () => {
    const result = decryptName({ name: 'qzmt-zixmtkozy-ivhz', sectorId: 343 });
    expect(result.decrypted).to.equal('very encrypted name');
  });

  check.it('should calculate checksum based on the letter count', singleRoom, (room) => {
    const result = calculateChecksum(room);
    if (room.type === ROOM_TYPES.REAL) {
      expect(result.calculated).to.equal(room.checksum);
    } else {
      expect(result.calculated).to.not.equal(room.checksum);
    }
  });

  check.it('should filter out decoy rooms and return array of the real rooms', multipleRooms, (rooms) => {
    const result = getRealRooms(rooms.map((r) => r.name));
    expect(result.filter((r) => r.type === ROOM_TYPES.DECOY).length).to.equal(0);
  });

  it('should provide correct result for puzzle input', () => {
    const { result1, result2 } = run(`${__dirname}/input.txt`);
    expect(result1).to.equal(137896);
    expect(result2).to.equal(501);
  });
});
