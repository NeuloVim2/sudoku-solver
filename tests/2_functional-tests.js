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
            'Required field(s) missing',
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
});
