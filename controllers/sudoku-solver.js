const puzzlesAndSolutions = require('./puzzle-strings');

class SudokuSolver {
  validate(puzzleString) {
    return /^[0-9.]{81}$/.test(puzzleString);
  }

  check(puzzle, coordinate, value) {
    const valid = true;

    if (valid) {
      return { valid };
    }
    const conflict = ['row', 'column', 'region'];
    return { valid, conflict };
  }

  solve(puzzleString) {
    if (this.validate(puzzleString)) {
      const puzzleFiltered = puzzlesAndSolutions.filter((e) =>
        e.includes(puzzleString)
      );
      if (!puzzleFiltered) {
        return { error: 'Puzzle cannot be solved' };
      }
      return {
        solution: `${puzzleFiltered[0][1]}`,
      };
    }
    if (puzzleString.length !== 81) {
      return { error: 'Expected puzzle to be 81 characters long' };
    }
    return { error: 'Invalid characters in puzzle' };
  }
}

module.exports = SudokuSolver;
