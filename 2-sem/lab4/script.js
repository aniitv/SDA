const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const seed = 5311;
const n1 = 5;
const n2 = 3;
const n3 = 1;
const n4 = 1;

const k1 = 1 - n3 * 0.01 - n4 * 0.01 - 0.3;
const k2 = 1 - n3 * 0.005 - n4 * 0.005 - 0.27;
const n = 10 + n3;

const w = canvas.width;
const h = canvas.height;
const RAD = 20;
const centerX = w / 2;
const centerY = h / 2;
const radius = 180;

function matMul(A, B) {
  const n = A.length;
  const C = Array.from({ length: n }, () => Array(n).fill(0));
  for (let i = 0; i < n; i++)
    for (let k = 0; k < n; k++)
      if (A[i][k]) for (let j = 0; j < n; j++) C[i][j] += A[i][k] * B[k][j];
  return C;
}

function getReachability(matrix) {
  const n = matrix.length;
  const reach = matrix.map((row) => [...row]);
  for (let i = 0; i < n; i++) reach[i][i] = 1;
  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (reach[i][j] === 1 || (reach[i][k] === 1 && reach[k][j] === 1)) {
          reach[i][j] = 1;
        }
      }
    }
  }
  return reach;
}

function strongConnectivityMatrix(array) {
  const n = array.length;
  const result = Array.from({ length: n }, () => Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (array[i][j] == 1 && array[j][i] == 1) result[i][j] = 1;
    }
  }
  return result;
}

function getStrongComponents(matrix) {
  const visited = Array(n).fill(false);
  const components = [];
  for (let i = 0; i < n; i++) {
    if (visited[i]) continue;
    const comp = [];
    for (let j = 0; j < n; j++) {
      if (matrix[i][j] === 1) {
        comp.push(j + 1);
        visited[j] = true;
      }
    }
    if (comp.length > 0) components.push(comp);
  }
  return components;
}

function buildCondensationGraph(A, components) {
  const m = components.length;
  const C = Array.from({ length: m }, () => Array(m).fill(0));
  const v2c = {};
  components.forEach((comp, i) => comp.forEach((v) => (v2c[v - 1] = i)));
  for (let u = 0; u < A.length; u++) {
    for (let v = 0; v < A.length; v++) {
      if (A[u][v]) {
        const cu = v2c[u],
          cv = v2c[v];
        if (cu !== cv) C[cu][cv] = 1;
      }
    }
  }
  return C;
}

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

function genUndirMatrix(dirMatrix) {
  const undirMatrix = dirMatrix.map((row) => [...row]);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (dirMatrix[i][j] === 1) undirMatrix[j][i] = 1;
    }
  }
  return undirMatrix;
}

const drawLoop = (ctx, x, y) => {
  ctx.beginPath();
  ctx.arc(x, y - RAD, RAD, Math.PI / 2, Math.PI * 2.5);
  ctx.stroke();
};

const drawCurve = (ctx, x1, y1, x2, y2, arrowed) => {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const adjustedX1 = x1 + RAD * Math.cos(angle);
  const adjustedY1 = y1 + RAD * Math.sin(angle);
  const adjustedX2 = x2 - RAD * Math.cos(angle);
  const adjustedY2 = y2 - RAD * Math.sin(angle);

  ctx.beginPath();
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 2;
  ctx.moveTo(adjustedX1, adjustedY1);
  ctx.lineTo(adjustedX2, adjustedY2);
  ctx.stroke();

  if (arrowed) {
    const arrowAngle = Math.atan2(
      adjustedY2 - adjustedY1,
      adjustedX2 - adjustedX1,
    );
    ctx.beginPath();
    ctx.moveTo(adjustedX2, adjustedY2);
    ctx.lineTo(
      adjustedX2 - 12 * Math.cos(arrowAngle - Math.PI / 8),
      adjustedY2 - 12 * Math.sin(arrowAngle - Math.PI / 8),
    );
    ctx.lineTo(
      adjustedX2 - 12 * Math.cos(arrowAngle + Math.PI / 8),
      adjustedY2 - 12 * Math.sin(arrowAngle + Math.PI / 8),
    );
    ctx.closePath();
    ctx.fill();
  }
};

const drawNodes = (ctx, nodes) => {
  nodes.forEach((node, i) => {
    ctx.beginPath();
    ctx.arc(node.x, node.y, RAD, 0, Math.PI * 2);
    ctx.fillStyle = "white";
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
};

const nodes = [];
for (let i = 0; i < n; i++) {
  const angle = (i * 2 * Math.PI) / n;
  nodes.push({
    x: centerX + radius * Math.cos(angle),
    y: centerY + radius * Math.sin(angle),
  });
}

const drawGraph = (matrix, directed) => {
  ctx.clearRect(0, 0, w, h);
  matrix.forEach((row, i) => {
    row.forEach((value, j) => {
      if (value === 1) {
        const node1 = nodes[i];
        const node2 = nodes[j];
        if (i === j) {
          drawLoop(ctx, node1.x, node1.y);
        } else {
          if (!directed && i > j) return;
          drawCurve(ctx, node1.x, node1.y, node2.x, node2.y, directed);
        }
      }
    });
  });
  drawNodes(ctx, nodes);
};

const rand = genRandNum(seed);
const dirMatrix = genDirMatrix(rand, k1);
const undirMatrix = genUndirMatrix(dirMatrix);
const modifiedMatrix = genDirMatrix(rand, k2);

const reachMatrix = getReachability(modifiedMatrix);
const strongConnMatrix = strongConnectivityMatrix(reachMatrix);
const components = getStrongComponents(strongConnMatrix);
const condensationMatrix = buildCondensationGraph(modifiedMatrix, components);

console.log("Степені ненапрямленого графу:");
let degrees = new Array(n).fill(0);
for (let i = 0; i < n; i++) {
  for (let j = 0; j < n; j++) {
    if (undirMatrix[i][j] == 1) {
      if (i === j) degrees[i] += 2;
      else degrees[i]++;
    }
  }
  console.log(`вершина ${i + 1}: ${degrees[i]}`);
}

console.log("\nНапівстепені та степені напрямленого графу:");
for (let i = 0; i < n; i++) {
  let degree = { вхід: 0, вихід: 0, всього: 0 };
  for (let j = 0; j < n; j++) {
    if (dirMatrix[i][j] == 1) degree.вихід++;
    if (dirMatrix[j][i] == 1) degree.вхід++;
  }
  degree.всього = degree.вхід + degree.вихід;
  console.log(
    `вершина ${i + 1}: вхід: ${degree.вхід}, вихід: ${degree.вихід}, всього: ${degree.всього}`,
  );
}

let regularGraph = true;
degrees.forEach((degree, i) => {
  if (degree !== degrees[0]) regularGraph = false;
  if (degree === 0) console.log(`вершина ${i + 1} ізольована`);
  if (degree === 1) console.log(`вершина ${i + 1} висяча`);
});
if (regularGraph) console.log(`\nГраф є регулярним зі степенем ${degrees[0]}`);
else console.log("\nГраф не є регулярним");

console.log("\nНапівстепені та степені модифікованого графу:");
for (let i = 0; i < n; i++) {
  let degree = { вхід: 0, вихід: 0, всього: 0 };
  for (let j = 0; j < n; j++) {
    if (modifiedMatrix[i][j] == 1) degree.вихід++;
    if (modifiedMatrix[j][i] == 1) degree.вхід++;
  }
  degree.всього = degree.вхід + degree.вихід;
  console.log(
    `вершина ${i + 1}: вхід: ${degree.вхід}, вихід: ${degree.вихід}, всього: ${degree.всього}`,
  );
}

const A2 = matMul(modifiedMatrix, modifiedMatrix);
const A3 = matMul(A2, modifiedMatrix);

console.log("\nШляхи довжини 2:");
for (let i = 0; i < n; i++)
  for (let j = 0; j < n; j++)
    if (A2[i][j] > 0)
      for (let m = 0; m < n; m++)
        if (modifiedMatrix[i][m] && modifiedMatrix[m][j])
          console.log(`  ${i + 1} → ${m + 1} → ${j + 1}`);

console.log("\nШляхи довжини 3:");
for (let i = 0; i < n; i++)
  for (let j = 0; j < n; j++)
    if (A3[i][j] > 0)
      for (let m = 0; m < n; m++)
        if (modifiedMatrix[i][m])
          for (let p = 0; p < n; p++)
            if (modifiedMatrix[m][p] && modifiedMatrix[p][j])
              console.log(`  ${i + 1} → ${m + 1} → ${p + 1} → ${j + 1}`);

function printMatrix(matrix, title) {
  console.log(`\n${title}:`);
  matrix.forEach((row) => console.log(row.join(" ")));
}

printMatrix(dirMatrix, "Матриця суміжності напрямленого графу");
printMatrix(undirMatrix, "Матриця суміжності ненапрямленого графу");
printMatrix(modifiedMatrix, "Модифікована матриця");
printMatrix(reachMatrix, "Матриця досяжності");
printMatrix(strongConnMatrix, "Матриця сильної зв'язності");

console.log("\nПерелік компонент сильної зв'язності:");
components.forEach((comp, i) => console.log(`K${i + 1}: {${comp.join(", ")}}`));

printMatrix(condensationMatrix, "Матриця суміжності графа конденсації");

window.drawDirected = () => drawGraph(dirMatrix, true);
window.drawUndirected = () => drawGraph(undirMatrix, false);
window.drawModified = () => drawGraph(modifiedMatrix, true);

window.drawCondense = () => {
  const originalNodes = [...nodes];
  const m = components.length;
  nodes.length = 0;
  for (let i = 0; i < m; i++) nodes.push(originalNodes[i]);
  drawGraph(condensationMatrix, true);
  nodes.length = 0;
  originalNodes.forEach((node) => nodes.push(node));
};
