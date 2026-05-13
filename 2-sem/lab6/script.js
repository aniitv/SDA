const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const seed = 5311;
const n1 = 5,
  n2 = 3,
  n3 = 1,
  n4 = 1;
const n = 10 + n3;
const k = 1.0 - n3 * 0.01 - n4 * 0.005 - 0.05;

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

const rand = genRandNum(seed);

const adjMatrix = Array.from({ length: n }, () =>
  Array.from({ length: n }, () => (rand() * 2.0 * k >= 1.0 ? 1 : 0)),
);

const undirAdj = adjMatrix.map((row, i) =>
  row.map((val, j) => (val === 1 || adjMatrix[j][i] === 1 ? 1 : 0)),
);

const weightRand = genRandNum(seed);
const matrixB = Array.from({ length: n }, () =>
  Array.from({ length: n }, () => weightRand() * 2.0),
);
const matrixC = matrixB.map((row, i) =>
  row.map((b, j) => Math.ceil(b * 100 * undirAdj[i][j])),
);
const matrixD = matrixC.map((row) => row.map((c) => (c > 0 ? 1 : 0)));
const matrixH = matrixD.map((row, i) =>
  row.map((d, j) => (d !== matrixD[j][i] ? 1 : 0)),
);
const matrixTr = Array.from({ length: n }, (_, i) =>
  Array.from({ length: n }, (__, j) => (i < j ? 1 : 0)),
);
const matrixW = matrixD.map((row, i) =>
  row.map((d, j) => (d + matrixH[i][j] * matrixTr[i][j]) * matrixC[i][j]),
);

for (let i = 0; i < n; i++) {
  for (let j = 0; j < i; j++) matrixW[i][j] = matrixW[j][i];
}

function convertToAdjList(wMatrix) {
  const list = [];
  for (let i = 0; i < n; i++) {
    const neighbors = [];
    for (let j = 0; j < n; j++) {
      if (wMatrix[i][j] > 0) {
        neighbors.push({ node: j, weight: wMatrix[i][j] });
      }
    }
    list.push({ id: i, edges: neighbors });
  }
  return list;
}

const adjList = convertToAdjList(matrixW);

const nodes = [];
for (let i = 0; i < n; i++) {
  const angle = (i * 2 * Math.PI) / n;
  nodes.push({
    x: centerX + radius * Math.cos(angle),
    y: centerY + radius * Math.sin(angle),
  });
}

let visited = new Set();
let treeEdges = [];
let activeNode = null;
let orderOfVisit = [];

function resetState() {
  visited.clear();
  treeEdges = [];
  activeNode = null;
  orderOfVisit = [];
  console.clear();
}

window.startPrim = () => {
  resetState();
  const start = 0;
  visited.add(start);
  activeNode = start;
  orderOfVisit.push(start);
  draw();
  console.log("Алгоритм Пріма розпочато з вершини 1");
};

window.makeStep = () => {
  if (visited.size === 0) return;

  if (visited.size === n) {
    alert("Обхід вже було завершено.");
    return;
  }

  let minWeight = Infinity;
  let nextEdge = null;

  for (let iId of visited) {
    const vertex = adjList[iId];
    for (let edge of vertex.edges) {
      if (!visited.has(edge.node)) {
        if (edge.weight < minWeight) {
          minWeight = edge.weight;
          nextEdge = { from: iId, to: edge.node, weight: edge.weight };
        }
      }
    }
  }

  if (nextEdge) {
    visited.add(nextEdge.to);
    treeEdges.push(nextEdge);
    activeNode = nextEdge.to;
    orderOfVisit.push(nextEdge.to);
    console.log(
      `Додано ребро ${nextEdge.from + 1}-${nextEdge.to + 1} (вага: ${nextEdge.weight})`,
    );
    draw();

    if (visited.size === n) {
      alert("Обхід завершено!");
      logResults();
    }
  } else {
    alert("Граф незв'язний, побудову MST зупинено.");
    logResults();
  }
};

function drawEdge(i, j, weight, color, width = 1) {
  const n1 = nodes[i],
    n2 = nodes[j];
  const angle = Math.atan2(n2.y - n1.y, n2.x - n1.x);
  const x1 = n1.x + RAD * Math.cos(angle),
    y1 = n1.y + RAD * Math.sin(angle);
  const x2 = n2.x - RAD * Math.cos(angle),
    y2 = n2.y - RAD * Math.sin(angle);

  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();

  const mx = (x1 + x2) / 2,
    my = (y1 + y2) / 2;
  ctx.fillStyle = "red";
  ctx.font = "bold 12px Arial";
  ctx.fillText(weight, mx + 10, my - 5);
}

function draw() {
  ctx.clearRect(0, 0, w, h);
  for (let i = 0; i < n; i++) {
    adjList[i].edges.forEach((e) => {
      if (i < e.node) drawEdge(i, e.node, e.weight, "#616161", 1);
    });
  }
  treeEdges.forEach((e) => drawEdge(e.from, e.to, e.weight, "black", 3));
  nodes.forEach((node, i) => {
    ctx.beginPath();
    ctx.arc(node.x, node.y, RAD, 0, Math.PI * 2);
    ctx.fillStyle =
      i === activeNode ? "#6fc1c7" : visited.has(i) ? "hotpink" : "white";
    ctx.fill();
    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.fillStyle = "black";
    ctx.font = "bold 14px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(i + 1, node.x, node.y);
  });
}

function logResults() {
  const treeM = Array.from({ length: n }, () => Array(n).fill(0));
  treeEdges.forEach((e) => {
    treeM[e.from][e.to] = 1;
    treeM[e.to][e.from] = 1;
  });

  console.log("Матриця суміжності напрямленого графа (A_dir):");
  adjMatrix.forEach((row) => console.log(row.join(" ")));

  console.log("\nМатриця суміжності дерева обходу:");
  treeM.forEach((row) => console.log(row.join(" ")));

  console.log("\nНова нумерація вершин (черговість додавання):");
  orderOfVisit.forEach((oldId, newId) => {
    console.log(`Вершина ${oldId + 1} -> Новий номер: ${newId + 1}`);
  });

  const totalWeight = treeEdges.reduce((sum, e) => sum + e.weight, 0);
  console.log("\nЗагальна вага MST (сума ваг усіх ребер):", totalWeight);
}

document.getElementById("btnNextStep").onclick = window.makeStep;
document.getElementById("btnReset").onclick = window.startPrim;
window.drawDirected = window.startPrim;
window.startPrim();
