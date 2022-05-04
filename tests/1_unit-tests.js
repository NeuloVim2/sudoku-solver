const chai = require('chai');

const { assert } = chai;

const Solver = require('../controllers/sudoku-solver');
const Util = require('../util');

const solver = new Solver();

const validPuzzleString =
  '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
const validPuzzleStringSolution =
  '135762984946381257728459613694517832812936745357824196473298561581673429269145378';
const invalidPuzzleString =
  'LFSD.2.84..63.12.7.2..s___.9..1....8VccdA74.3.].2!!9.Lf...8..1..16....926914.37.';

suite('UnitTests', () => {
  test('Logic handles a valid puzzle string of 81 characters', () => {
    assert.isTrue(
      solver.validate(validPuzzleString, 'puzzle string should be valid')
    );
  });

  test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', () => {
    assert.isFalse(
      solver.validate(invalidPuzzleString, 'puzzle string should be invalid')
    );
  });

  test('Logic handles a puzzle string that is not 81 characters in length', () => {
    assert.isFalse(
      solver.validate(
        '1.5..2.84..63.12.7.2..5.....9...8..1..16....926914.37.',
        'puzzle string should be invalid'
      )
    );
  });

  test('Logic handles a valid row placement', () => {
    assert.isTrue(
      solver.checkRow(Util.stringToMatrix(validPuzzleString), 1, 2, 3),
      'row should be valid'
    );
  });

  test('Logic handles an invalid row placement', () => {
    assert.isFalse(
      solver.checkRow(Util.stringToMatrix(validPuzzleString), 1, 2, 4),
      'row should be invalid'
    );
  });

  test('Logic handles a valid column placement', () => {
    assert.isTrue(
      solver.checkColumn(Util.stringToMatrix(validPuzzleString), 1, 2, 3),
      'column should be valid'
    );
  });

  test('Logic handles an invalid column placement', () => {
    assert.isFalse(
      solver.checkColumn(Util.stringToMatrix(validPuzzleString), 1, 2, 6),
      'column should be invalid'
    );
  });

  test('Logic handles a valid region (3x3 grid) placement', () => {
    assert.isTrue(
      solver.checkRegion(Util.stringToMatrix(validPuzzleString), 1, 2, 3),
      'region should be valid'
    );
  });

  test('Logic handles an invalid region (3x3 grid) placement', () => {
    assert.isFalse(
      solver.checkRegion(Util.stringToMatrix(validPuzzleString), 1, 2, 1),
      'region should be invalid'
    );
  });

  test('Valid puzzle strings pass the solver', () => {
    assert.isTrue(
      Object.keys(solver.solveSudoku(validPuzzleString)).includes('solution'),
      'Valid puzzle strings should pass the solver'
    );
  });

  test('Invalid puzzle strings fail the solver', () => {
    assert.isTrue(
      Object.keys(solver.solveSudoku(invalidPuzzleString)).includes('error'),
      'Valid puzzle strings should fail the solver'
    );
  });

  test('Solver returns the expected solution for an incomplete puzzle', () => {
    assert.equal(
      solver.solveSudoku(validPuzzleString).solution,
      validPuzzleStringSolution,
      'Solver should return the expected solution for incomplete puzzle'
    );
  });
});
