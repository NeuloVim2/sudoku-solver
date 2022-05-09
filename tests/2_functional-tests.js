const chai = require('chai');
const chaiHttp = require('chai-http');

const { assert } = chai;
const server = require('../server');

chai.use(chaiHttp);

const validPuzzleString =
  '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
const puzzleStringWithInvalidCharacter =
  '1.5..2.84..63.12.7F2d.5.!...9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
const puzzleStringWithInvalidCharacterCount =
  '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.';
const unsolvablePuzzle =
  '1.1..2.54..63.12.3.2..5.....9..1....8.2.3674.3.7.2..9.57...8..1..16....926914.37.';
const validPuzzleSolution =
  '135762984946381257728459613694517832812936745357824196473298561581673429269145378';

suite('Functional Tests', () => {
  suite('POST request to /api/solve', () => {
    test('Solve a puzzle with valid puzzle string', () => {
      chai
        .request(server)
        .post('/api/solve')
        .type('form')
        .send({
          puzzle: validPuzzleString,
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.strictEqual(
            validPuzzleSolution,
            res.body.solution,
            'valid puzzle solution should be returned'
          );
        });
    });

    test('Solve a puzzle with missing puzzle string', () => {
      chai
        .request(server)
        .post('/api/solve')
        .type('form')
        .send({
          puzzle: '',
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.propertyVal(
            res.body,
            'error',
            'Required field missing',
            'returned error message invalid'
          );
        });
    });

    test('Solve a puzzle with invalid characters', () => {
      chai
        .request(server)
        .post('/api/solve')
        .type('form')
        .send({
          puzzle: puzzleStringWithInvalidCharacter,
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.propertyVal(
            res.body,
            'error',
            'Invalid characters in puzzle',
            'returned error message invalid'
          );
        });
    });

    test('Solve a puzzle with incorrect length', () => {
      chai
        .request(server)
        .post('/api/solve')
        .type('form')
        .send({
          puzzle: puzzleStringWithInvalidCharacterCount,
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.propertyVal(
            res.body,
            'error',
            'Expected puzzle to be 81 characters long',
            'returned error message invalid'
          );
        });
    });

    test('Solve a puzzle that cannot be solved', () => {
      chai
        .request(server)
        .post('/api/solve')
        .type('form')
        .send({
          puzzle: unsolvablePuzzle,
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.propertyVal(
            res.body,
            'error',
            'Puzzle cannot be solved',
            'returned error message invalid'
          );
        });
    });
  });
  suite('POST request to /api/check', () => {
    test('Check a puzzle placement with all fields', () => {
      chai
        .request(server)
        .post('/api/check')
        .type('form')
        .send({
          puzzle: validPuzzleString,
          coordinate: 'A2',
          value: '3',
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isTrue(res.body.valid, 'returned value should be true');
        });
    });
    test('Check a puzzle placement with single placement conflict', () => {
      chai
        .request(server)
        .post('/api/check')
        .type('form')
        .send({
          puzzle: validPuzzleString,
          coordinate: 'A2',
          value: '4',
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isFalse(res.body.valid, 'returned value should be false');
          assert.isArray(res.body.conflict, 'conflict should be an array');
          assert.isArray(res.body.conflict, 'conflict should be an array');
          assert.strictEqual(
            res.body.conflict.length,
            1,
            'array length should be 1'
          );
          assert.strictEqual(
            res.body.conflict[0],
            'row',
            'row item should be in conflict array'
          );
        });
    });
    test('Check a puzzle placement with multiple placement conflicts', () => {
      chai
        .request(server)
        .post('/api/check')
        .type('form')
        .send({
          puzzle: validPuzzleString,
          coordinate: 'A2',
          value: '1',
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isFalse(res.body.valid, 'returned value should be false');
          assert.isArray(res.body.conflict, 'conflict should be an array');
          assert.strictEqual(
            res.body.conflict.length,
            2,
            'array length should be 1'
          );
          assert.strictEqual(
            res.body.conflict[0],
            'row',
            'row item should be in conflict array'
          );
          assert.strictEqual(
            res.body.conflict[1],
            'region',
            'region item should be in conflict array'
          );
        });
    });
    test('Check a puzzle placement with all placement conflicts', () => {
      chai
        .request(server)
        .post('/api/check')
        .type('form')
        .send({
          puzzle: validPuzzleString,
          coordinate: 'A2',
          value: '2',
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isFalse(res.body.valid, 'returned value should be false');
          assert.isArray(res.body.conflict, 'conflict should be an array');
          assert.strictEqual(
            res.body.conflict.length,
            3,
            'array length should be 1'
          );
          assert.strictEqual(
            res.body.conflict[0],
            'row',
            'row item should be in conflict array'
          );
          assert.strictEqual(
            res.body.conflict[1],
            'column',
            'column item should be in conflict array'
          );
          assert.strictEqual(
            res.body.conflict[2],
            'region',
            'region item should be in conflict array'
          );
        });
    });
    test('Check a puzzle placement with missing required fields', () => {
      chai
        .request(server)
        .post('/api/check')
        .type('form')
        .send({
          puzzle: validPuzzleString,
          coordinate: 'A1',
          value: '',
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.strictEqual(
            res.body.error,
            'Required field(s) missing',
            'error message is invalid'
          );
        });
    });
    test('Check a puzzle placement with invalid characters', () => {
      chai
        .request(server)
        .post('/api/check')
        .type('form')
        .send({
          puzzle: puzzleStringWithInvalidCharacter,
          coordinate: 'A1',
          value: '2',
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.strictEqual(
            res.body.error,
            'Invalid characters in puzzle',
            'error message is invalid'
          );
        });
    });
    test('Check a puzzle placement with incorrect length', () => {
      chai
        .request(server)
        .post('/api/check')
        .type('form')
        .send({
          puzzle: puzzleStringWithInvalidCharacterCount,
          coordinate: 'A1',
          value: '2',
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.strictEqual(
            res.body.error,
            'Expected puzzle to be 81 characters long',
            'error message is invalid'
          );
        });
    });
    test('Check a puzzle placement with invalid placement coordinate', () => {
      chai
        .request(server)
        .post('/api/check')
        .type('form')
        .send({
          puzzle: validPuzzleString,
          coordinate: 'AXS1',
          value: '2',
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.strictEqual(
            res.body.error,
            'Invalid coordinate',
            'error message is invalid'
          );
        });
    });
    test('Check a puzzle placement with invalid placement value', () => {
      chai
        .request(server)
        .post('/api/check')
        .type('form')
        .send({
          puzzle: validPuzzleString,
          coordinate: 'A1',
          value: '0',
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.strictEqual(
            res.body.error,
            'Invalid value',
            'error message is invalid'
          );
        });
    });
  });
});
