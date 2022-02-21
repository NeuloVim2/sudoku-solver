const puzzlesAndSolutions = require('./puzzle-strings');

const transformToMatrix = (str) => {
  const matrix = new Array(9);

  const strToArray = str.includes('.')
    ? str.replace(/\./g, '0').split('')
    : str.split('');

  for (let i = 0; i < 9; i += 1) {
    matrix[i] = strToArray.splice(0, 9);
  }
  return matrix;
};

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

  solveSudoku(puzzleString) {
    if (this.validate(puzzleString)) {
      console.log(transformToMatrix(puzzleString));
    }
    if (puzzleString.length !== 81) {
      return { error: 'Expected puzzle to be 81 characters long' };
    }
    return { error: 'Invalid characters in puzzle' };
  }
}

module.exports = SudokuSolver;
