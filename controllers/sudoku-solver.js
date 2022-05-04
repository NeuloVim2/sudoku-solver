const Util = require('../util');

const coordToRow = {
  A: 1,
  B: 2,
  C: 3,
  D: 4,
  E: 5,
  F: 6,
  G: 7,
  H: 8,
  I: 9,
};

class SudokuSolver {
  validate(puzzleString) {
    return /^[0-9.]{81}$/.test(puzzleString);
  }

  #solveUtil(board, n) {
    let row = -1;
    let col = -1;
    let isEmpty = true;

    for (let i = 0; i < n; i += 1) {
      for (let j = 0; j < n; j += 1) {
        if (board[i][j] === 0) {
          row = i;
          col = j;

          isEmpty = false;
          break;
        }
      }
      if (!isEmpty) {
        break;
      }
    }

    if (isEmpty) {
      return true;
    }

    for (let num = 1; num <= n; num += 1) {
      if (this.#checkIfNumIsSafe(board, row, col, num)) {
        board[row][col] = num;

        if (this.#solveUtil(board, n)) {
          return true;
        }
        board[row][col] = 0;
      }
    }
    return false;
  }

  #checkIfNumIsSafe(grid, row, col, num) {
    // Row has the unique (row-clash)
    for (let d = 0; d < grid.length; d += 1) {
      // Check if the number we are trying to
      // place is already present in
      // that row, return false;
      if (grid[row][d] === num) {
        return false;
      }
    }

    // Column has the unique numbers (column-clash)
    for (let r = 0; r < grid.length; r += 1) {
      // Check if the number
      // we are trying to
      // place is already present in
      // that column, return false;
      if (grid[r][col] === num) {
        return false;
      }
    }

    // Corresponding square has
    // unique number (box-clash)
    const sqrt = Math.floor(Math.sqrt(grid.length));
    const boxRowStart = row - (row % sqrt);
    const boxColStart = col - (col % sqrt);

    for (let r = boxRowStart; r < boxRowStart + sqrt; r += 1) {
      for (let d = boxColStart; d < boxColStart + sqrt; d += 1) {
        if (grid[r][d] === num) {
          return false;
        }
      }
    }

    // If there is no clash, it's safe
    return true;
  }

  checkRow(matrix, row, col, value) {
    if (matrix[row - 1][col - 1] !== 0) {
      return false;
    }

    // Row has the unique (row-clash)
    for (let d = 0; d < matrix.length; d += 1) {
      // Check if the number we are trying to
      // place is already present in
      // that row, return false;
      if (matrix[row - 1][d] === value) {
        return false;
      }
    }

    return true;
  }

  checkColumn(matrix, row, col, value) {
    if (matrix[row - 1][col - 1] !== 0) {
      return false;
    }

    // Column has the unique numbers (column-clash)
    for (let r = 0; r < matrix.length; r += 1) {
      // Check if the number
      // we are trying to
      // place is already present in
      // that column, return false;
      if (matrix[r][col - 1] === value) {
        return false;
      }
    }

    return true;
  }

  checkRegion(matrix, row, col, value) {
    if (matrix[row - 1][col - 1] !== 0) {
      return false;
    }

    // Corresponding square has
    // unique number (box-clash)
    const sqrt = Math.floor(Math.sqrt(matrix.length));
    const boxRowStart = row - (row % sqrt);
    const boxColStart = col - (col % sqrt);

    for (let r = boxRowStart; r < boxRowStart + sqrt; r += 1) {
      for (let d = boxColStart; d < boxColStart + sqrt; d += 1) {
        if (matrix[r][d] === value) {
          return false;
        }
      }
    }

    return true;
  }

  check(puzzle, coordinate, valueStr) {
    if (!puzzle || !coordinate || !valueStr) {
      return { error: 'Required field(s) missing' };
    }

    const matrix = Util.stringToMatrix(puzzle);
    const row = coordToRow[`${coordinate.split('')[0]}`];
    const col = coordinate.split('')[1];
    const value = parseInt(valueStr, 10);

    const result = {
      status: true,
      conflict: [],
    };

    if (!this.checkRow(matrix, row, col, value)) {
      result.conflict.push('row');
      result.status = false;
    }

    if (!this.checkColumn(matrix, row, col, value)) {
      result.conflict.push('col');
      result.status = false;
    }

    if (!this.checkRegion(matrix, row, col, value)) {
      result.conflict.push('region');
      result.status = false;
    }

    if (result.conflict.length === 0) {
      return { status: result.status };
    }
    return { status: result.status, conflict: result.conflict };
  }

  solveSudoku(puzzleString) {
    if (this.validate(puzzleString)) {
      const matrix = Util.stringToMatrix(puzzleString);
      if (this.#solveUtil(matrix, 9)) {
        const solution = matrix.map((e) => e.join('')).join('');
        return {
          solution: `${solution}`,
        };
      }
      return { error: 'Puzzle cannot be solved' };
    }

    if (!puzzleString) return { error: 'Required field(s) missing' };

    if (puzzleString.length !== 81) {
      return { error: 'Expected puzzle to be 81 characters long' };
    }

    return { error: 'Invalid characters in puzzle' };
  }
}

module.exports = SudokuSolver;
