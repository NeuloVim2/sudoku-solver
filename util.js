class Util {
  static stringToMatrix(str) {
    const matrix = new Array(9);

    const strToArray = str.includes('.')
      ? str.replace(/\./g, '0').split('')
      : str.split('');

    for (let i = 0; i < 9; i += 1) {
      matrix[i] = strToArray.splice(0, 9).map((e) => parseInt(e, 10));
    }
    return matrix;
  }
}

module.exports = Util;
