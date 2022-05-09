const SudokuSolver = require('../controllers/sudoku-solver');

module.exports = function (app) {
  const solver = new SudokuSolver();

  app.route('/api/check').post((req, res) => {
    const { puzzle, coordinate, value } = req.body;
    res.json(solver.check(puzzle, coordinate, value));
  });

  app.route('/api/solve').post((req, res) => {
    const { puzzle } = req.body;
    res.json(solver.solveSudoku(puzzle));
  });
};
