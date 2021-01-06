export const randomMaze = (grid, start, target) => {
  if (!start || !target) {
    return false;
  }

  let walls = [];
  grid.forEach(row => {
    row.forEach(node => {
      if (
        !(
          (node.row === start.row && node.column === start.column) ||
          (node.row === target.row && node.column === target.column)
        )
      ) {
        if (Math.random() < 0.3) {
          walls.push([node.row, node.column]);
        }
      }
    });
  });
  walls.sort(() => Math.random() - 0.5);
  return walls;
};
