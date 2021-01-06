let walls;

export const recursiveDivision = (grid, start, target) => {
  walls = [];
  if (!start || !target) {
    return;
  }

  let vertical = range(grid[0].length);
  let horizontal = range(grid.length);

  getWalls(vertical, horizontal, grid, start, target);
  return walls;
};

const range = len => {
  const result = [];
  for (let i = 0; i < len; i++) {
    result.push(i);
  }
  return result;
};

const getWalls = (vertical, horizontal, grid, start, target) => {
  if (vertical.length < 2 || horizontal.length < 2) {
    return;
  }
  let direction;
  let number;
  if (vertical.length > horizontal.length) {
    direction = 0;
    number = generateOddNum(vertical);
  }
  if (vertical.length <= horizontal.length) {
    direction = 1;
    number = generateOddNum(horizontal);
  }
  if (direction === 0) {
    addWall(direction, number, vertical, horizontal, start, target);
    getWalls(
      vertical.slice(0, vertical.indexOf(number)),
      horizontal,
      grid,
      start,
      target
    );
    getWalls(
      vertical.slice(vertical.indexOf(number) + 1),
      horizontal,
      grid,
      start,
      target
    );
  } else {
    addWall(direction, number, vertical, horizontal, start, target);
    getWalls(
      vertical,
      horizontal.slice(0, horizontal.indexOf(number)),
      grid,
      start,
      target
    );
    getWalls(
      vertical,
      horizontal.slice(horizontal.indexOf(number) + 1),
      grid,
      start,
      target
    );
  }
};

const addWall = (direction, number, vertical, horizontal, start, target) => {
  let isStartFinish = false;
  const temporaryWalls = [];
  if (direction === 0) {
    if (horizontal.length === 2) return;
    for (let temporary of horizontal) {
      if (
        (temporary === start.row && number === start.column) ||
        (temporary === target.row && number === target.column)
      ) {
        isStartFinish = true;
        continue;
      }
      temporaryWalls.push([temporary, number]);
    }
  } else {
    if (vertical.length === 2) return;
    for (let temporary of vertical) {
      if (
        (number === start.row && temporary === start.column) ||
        (number === target.row && temporary === target.column)
      ) {
        isStartFinish = true;
        continue;
      }
      temporaryWalls.push([number, temporary]);
    }
  }
  if (!isStartFinish) {
    temporaryWalls.splice(generateEvenNum(temporaryWalls.length), 1);
  }
  for (let wall of temporaryWalls) {
    walls.push(wall);
  }
};

const generateOddNum = array => {
  const maxNum = array.length - 1;
  let randomNum =
    Math.floor(Math.random() * (maxNum / 2)) +
    Math.floor(Math.random() * (maxNum / 2));
  if (randomNum % 2 === 0) {
    if (randomNum === maxNum) {
      randomNum--;
    } else {
      randomNum++;
    }
  }
  return array[randomNum];
};

const generateEvenNum = max => {
  let randomNum =
    Math.floor(Math.random() * (max / 2)) +
    Math.floor(Math.random() * (max / 2));
  if (randomNum % 2 !== 0) {
    if (randomNum === max) {
      randomNum--;
    } else {
      randomNum++;
    }
  }
  return randomNum;
};
