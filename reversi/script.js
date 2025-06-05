const board = document.getElementById("board");
const SIZE = 8;
let cells = [];  // 盤面の状態（2次元配列）
let current = "black";  // 現在のプレイヤー

// 空の盤面を生成
for (let y = 0; y < SIZE; y++) {
  const row = board.insertRow();
  cells[y] = [];
  for (let x = 0; x < SIZE; x++) {
    const cell = row.insertCell();
    cell.dataset.x = x;
    cell.dataset.y = y;
    cell.onclick = handleClick;
    cells[y][x] = null;
  }
}

// 初期配置（中央4マス）
placeDisc(3, 3, "white");
placeDisc(4, 4, "white");
placeDisc(3, 4, "black");
placeDisc(4, 3, "black");

function placeDisc(x, y, color) {
  const cell = board.rows[y].cells[x];
  cell.innerHTML = "";
  const disc = document.createElement("div");
  disc.className = color;
  cell.appendChild(disc);
  cells[y][x] = color;
}

function handleClick(e) {
  const x = parseInt(this.dataset.x);
  const y = parseInt(this.dataset.y);

  if (cells[y][x]) return;  // すでに石がある

  const flipped = getFlippedDiscs(x, y, current);
  if (flipped.length === 0) return; // 裏返せない＝無効

  placeDisc(x, y, current);
  for (const [fx, fy] of flipped) {
    placeDisc(fx, fy, current);
  }

  current = current === "black" ? "white" : "black";
  document.getElementById("turn").textContent = `現在の手番：${current === "black" ? "黒" : "白"}`;
}

// 石がひっくり返せるかを8方向調べる
function getFlippedDiscs(x, y, color) {
  const opponent = color === "black" ? "white" : "black";
  const directions = [
    [0, -1], [1, -1], [1, 0], [1, 1],
    [0, 1], [-1, 1], [-1, 0], [-1, -1]
  ];
  const flipped = [];

  for (const [dx, dy] of directions) {
    let nx = x + dx;
    let ny = y + dy;
    const temp = [];

    while (nx >= 0 && nx < SIZE && ny >= 0 && ny < SIZE) {
      if (cells[ny][nx] === opponent) {
        temp.push([nx, ny]);
      } else if (cells[ny][nx] === color) {
        flipped.push(...temp);
        break;
      } else {
        break;
      }
      nx += dx;
      ny += dy;
    }
  }

  return flipped;
}
