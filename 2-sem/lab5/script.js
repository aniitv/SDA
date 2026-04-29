const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const seed = 5311;
const n1 = 5;
const n2 = 3;
const n3 = 1;
const n4 = 1;
const n = 10 + n3;
const k_val = 1.0 - n3 * 0.01 - n4 * 0.005 - 0.15;

const RAD = 20;
const w = canvas.width;
const h = canvas.height;
const centerX = w / 2;
const centerY = h / 2;
const radius = 180;

function genRandNum(seed) {
  const RANDOM_NUMBER = 2147483647;
  let val = seed % RANDOM_NUMBER;
  if (val <= 0) val += RANDOM_NUMBER;
  return function () {
    val = (val * 16807) % RANDOM_NUMBER;
    return (val - 1) / RANDOM_NUMBER;
  };
}

function genDirMatrix(rand, k) {
  const matrix = [];
  for (let i = 0; i < n; i++) {
    const row = [];
    for (let j = 0; j < n; j++) row.push(rand() * 2 * k >= 1 ? 1 : 0);
    matrix.push(row);
  }
  return matrix;
}

const rand = genRandNum(seed);
const dirMatrix = genDirMatrix(rand, k_val);

const nodes = [];
for (let i = 0; i < n; i++) {
  const angle = (i * 2 * Math.PI) / n;
  nodes.push({
    x: centerX + radius * Math.cos(angle),
    y: centerY + radius * Math.sin(angle),
  });
}

let visited = new Set();
let queue = [];
let stack = [];
let treeEdges = [];
let isBFS = false;
let isDFS = false;
let activeNode = null;

function findStartNode() {
  for (let i = 0; i < n; i++) {
    if (
      !visited.has(i) &&
      dirMatrix[i].some((val, j) => val === 1 && i !== j)
    ) {
      return i;
    }
  }
  return -1;
}

function resetState() {
  visited.clear();
  queue = [];
  stack = [];
  treeEdges = [];
  isBFS = false;
  isDFS = false;
  activeNode = null;
}

function bfsStep() {
  if (queue.length === 0) {
    const next = findStartNode();
    if (next === -1) return alert("Обхід завершено");
    queue.push(next);
    visited.add(next);
    activeNode = next;
    return;
  }
  const curr = queue.shift();
  activeNode = curr;
  for (let neighbor = 0; neighbor < n; neighbor++) {
    if (dirMatrix[curr][neighbor] === 1 && !visited.has(neighbor)) {
      visited.add(neighbor);
      queue.push(neighbor);
      treeEdges.push({ from: curr, to: neighbor });
    }
  }
}

function dfsStep() {
  if (stack.length === 0) {
    const next = findStartNode();
    if (next === -1) return alert("Обхід завершено");
    stack.push(next);
    activeNode = next;
    return;
  }
  const curr = stack[stack.length - 1];
  activeNode = curr;
  if (!visited.has(curr)) visited.add(curr);

  let found = false;
  for (let neighbor = 0; neighbor < n; neighbor++) {
    if (dirMatrix[curr][neighbor] === 1 && !visited.has(neighbor)) {
      treeEdges.push({ from: curr, to: neighbor });
      visited.add(neighbor);
      stack.push(neighbor);
      found = true;
      break;
    }
  }
  if (!found) stack.pop();
}

window.startBFS = () => {
  resetState();
  isBFS = true;
  const start = findStartNode();
  if (start !== -1) {
    visited.add(start);
    queue.push(start);
    activeNode = start;
  }
  draw();
};

window.startDFS = () => {
  resetState();
  isDFS = true;
  const start = findStartNode();
  if (start !== -1) {
    stack.push(start);
    activeNode = start;
  }
  draw();
};

window.makeStep = () => {
  if (isBFS) bfsStep();
  if (isDFS) dfsStep();
  draw();
};

function draw() {
  ctx.clearRect(0, 0, w, h);

  dirMatrix.forEach((row, i) => {
    row.forEach((val, j) => {
      if (val === 1) drawEdge(i, j, "#616161", true);
    });
  });

  treeEdges.forEach((edge) => drawEdge(edge.from, edge.to, "red", true, 3));

  nodes.forEach((node, i) => {
    ctx.beginPath();
    ctx.arc(node.x, node.y, RAD, 0, Math.PI * 2);

    if (i === activeNode) ctx.fillStyle = "#6fc1c7";
    else if (visited.has(i)) ctx.fillStyle = "hotpink";
    else ctx.fillStyle = "white";

    ctx.fill();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "black";
    ctx.font = "bold 14px Poppins";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(i + 1, node.x, node.y);
  });
}

function drawEdge(i, j, color, arrowed, width = 1) {
  const n1 = nodes[i];
  const n2 = nodes[j];
  ctx.strokeStyle = color;
  ctx.lineWidth = width;

  if (i === j) {
    ctx.beginPath();
    ctx.arc(n1.x, n1.y - RAD, RAD, Math.PI / 2, Math.PI * 2.5);
    ctx.stroke();
  } else {
    const angle = Math.atan2(n2.y - n1.y, n2.x - n1.x);
    const x1 = n1.x + RAD * Math.cos(angle);
    const y1 = n1.y + RAD * Math.sin(angle);
    const x2 = n2.x - RAD * Math.cos(angle);
    const y2 = n2.y - RAD * Math.sin(angle);

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    if (arrowed) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(
        x2 - 10 * Math.cos(angle - 0.4),
        y2 - 10 * Math.sin(angle - 0.4),
      );
      ctx.lineTo(
        x2 - 10 * Math.cos(angle + 0.4),
        y2 - 10 * Math.sin(angle + 0.4),
      );
      ctx.fill();
    }
  }
}

document.getElementById("btnDirected").onclick = () => {
  resetState();
  draw();
};

document.getElementById("btnBFS").onclick = window.startBFS;
document.getElementById("btnDFS").onclick = window.startDFS;
document.getElementById("btnNextStep").onclick = window.makeStep;

document.getElementById("btnReset").onclick = () => {
  resetState();
  draw();
  console.clear();
};

draw();
