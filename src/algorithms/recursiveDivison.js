export const recursiveDivision = (
  grid,
  startRow,
  endRow,
  startColumn,
  endColumn,
  calculatedRows,
  calculatedColumns,
  surroundingWalls
) => {
  if (endRow < startRow || endColumn < startColumn) {
    return;
  }
  const wallsToAnimate = [];
  const nodes = getAllNodes(grid);
  if (!surroundingWalls) {
    let relevantNodes = nodes.filter(
      node => node.status === 'start' || node.status === 'target'
    );
    nodes.forEach(node => {
      if (!relevantNodes.includes(node)) {
        let row = node.row;
        let column = node.column;
        if (
          row === 0 ||
          column === 0 ||
          row === calculatedRows - 1 ||
          column === calculatedColumns - 1
        ) {
          wallsToAnimate.push(node);

          node.status = 'wall';
        }
      }
    });
    surroundingWalls = true;
  }

  let possibleRows = [];
  for (let number = startRow; number <= endRow; number += 2) {
    possibleRows.push(number);
  }
  let possibleColumns = [];
  for (let number = startColumn; number <= endColumn; number += 2) {
    possibleColumns.push(number);
  }
  let randomRowIndex = Math.floor(Math.random() * possibleRows.length);
  let randomColumnIndex = Math.floor(Math.random() * possibleColumns.length);
  let currentRow = possibleRows[randomRowIndex];
  let columnRandom = possibleColumns[randomColumnIndex];
  nodes.forEach(node => {
    let row = node.row;
    let column = node.column;
    if (
      row === currentRow &&
      column !== columnRandom &&
      column >= startColumn - 1 &&
      column <= endColumn + 1
    ) {
      if (
        node.status !== 'start' &&
        node.status !== 'target' &&
        node.status !== 'wall'
      ) {
        wallsToAnimate.push(node);

        node.status = 'wall';
      }
    }
  });
  if (currentRow - 2 - startRow > endColumn - startColumn) {
    recursiveDivision(
      grid,
      startRow,
      currentRow - 2,
      startColumn,
      endColumn,
      surroundingWalls
    );
  }
  if (endRow - (currentRow + 2) > endColumn - startColumn) {
    recursiveDivision(
      grid,
      currentRow + 2,
      endRow,
      startColumn,
      endColumn,
      surroundingWalls
    );
  }

  // console.log(wallsToAnimate);
  return wallsToAnimate;
};

const getAllNodes = grid => {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
};
