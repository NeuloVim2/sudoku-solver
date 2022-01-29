const puzzlesAndSolutions = require('./puzzle-strings');

class SudokuSolver {
  validate(puzzleString) {
    return /^[0-9.]{81}$/.test(puzzleString);
  }

  checkRowPlacement(puzzleString, row, column, value) {
    if (this.validate(puzzleString)) {
      puzzleString.split();
    }
  }

  checkColPlacement(puzzleString, row, column, value) {}

  checkRegionPlacement(puzzleString, row, column, value) {}

  solve(puzzleString) {
    if (this.validate(puzzleString)) {
      const puzzleFilltred = puzzlesAndSolutions.filter((e) =>
        e.includes(puzzleString)
      );
      if (!puzzleFilltred) {
        return { error: 'Puzzle cannot be solved' };
      }
      console.log(puzzlesAndSolutions.filter((e) => e.includes(puzzleString)));
      return {
        solution: `${
          puzzlesAndSolutions.filter((e) => e.includes(puzzleString))[1]
        }`,
      };
    }
    if (puzzleString.length !== 81) {
      return { error: 'Expected puzzle to be 81 characters long' };
    }
    return { error: 'Invalid characters in puzzle' };
  }
}

module.exports = SudokuSolver;
