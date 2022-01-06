const chai = require('chai');

const { assert } = chai;

const Solver = require('../controllers/sudoku-solver');

const solver = new Solver();

suite('UnitTests', () => {
  // Logic handles a valid puzzle string of 81 characters
  assert.isTrue(
    solver.validate(
      '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
      'puzzle string should be valid'
    )
  );

  // Logic handles a puzzle string with invalid characters (not 1-9 or .)
  assert.isFalse(
    solver.validate(
      'LFSD.2.84..63.12.7.2..s___.9..1....8VccdA74.3.].2!!9.Lf...8..1..16....926914.37.',
      'puzzle string should be invalid'
    )
  );

  // Logic handles a puzzle string that is not 81 characters in length
  assert.isFalse(
    solver.validate(
      '1.5..2.84..63.12.7.2..5.....9...8..1..16....926914.37.',
      'puzzle string should be invalid'
    )
  );
});
