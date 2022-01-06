const chai = require("chai");
const assert = chai.assert;

const Solver = require("../controllers/sudoku-solver.js");
let solver = new Solver();

suite("UnitTests", () => {
  // Logic handles a valid puzzle string of 81 characters
  // Logic handles a puzzle string with invalid characters (not 1-9 or .)
  // Logic handles a puzzle string that is not 81 characters in length
  assert.isTrue(
    solver.validate(
      "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
      "puzzle string should be valid"
    )
  );
});
