'use strict';

const isInCoordinate = (coordinate, compare, range=8) => {
  if(
    coordinate[0] < compare[0] - range ||
    coordinate[0] > compare[0] + range
  ) return false;
  if(
    coordinate[1] < compare[1] - range ||
    coordinate[1] > compare[1] + range
  ) return false;
  return true;
}

module.exports = {
  isInCoordinate
}
