const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const seed = 5311;
const n1 = 5;
const n2 = 3;
const n3 = 1;
const n4 = 1;

const k = 1 - n3 * 0.02 - n4 * 0.005 - 0.25; //0.725
const n = 10 + n3;

const w = canvas.width;
const h = canvas.height;
const RAD = 20;
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
  const rawMatrix = Array.from({ length: n }, () =>
    Array.from({ length: n }, () => rand() * 2),
  );

  const dirMatrix = rawMatrix.map((row) =>
    row.map((v) => (v * k >= 1 ? 1 : 0)),
  );

  return dirMatrix;
}

function genUndirMatrix(dirMatrix) {
  const undirMatrix = Array.from({ length: n }, () => Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (dirMatrix[i][j] === 1 || dirMatrix[j][i] === 1) {
        undirMatrix[i][j] = 1;
        undirMatrix[j][i] = 1;
      }
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
  //коригування точок з урахуванням радіусу вершини
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const adjustedX1 = x1 + RAD * Math.cos(angle);
  const adjustedY1 = y1 + RAD * Math.sin(angle);
  const adjustedX2 = x2 - RAD * Math.cos(angle);
  const adjustedY2 = y2 - RAD * Math.sin(angle);

  const midX = (adjustedX1 + adjustedX2) / 2;
  const midY = (adjustedY1 + adjustedY2) / 2; // координати для точки вигину

  const dx = adjustedX2 - adjustedX1;
  const dy = adjustedY2 - adjustedY1;
  const len = Math.sqrt(dx * dx + dy * dy); // довжина (як гіпотенуза)

  const nx = -dy / len;
  const ny = dx / len; // вектор перпендикуляра до лінії

  const offset = len * 0.15;
  const controlX = midX + nx * offset;
  const controlY = midY + ny * offset; // зміщення для кривизни

  ctx.beginPath();
  ctx.moveTo(adjustedX1, adjustedY1);
  ctx.quadraticCurveTo(controlX, controlY, adjustedX2, adjustedY2);
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 2;
  ctx.stroke();

  if (arrowed) {
    const arrowAngle = Math.atan2(adjustedY2 - controlY, adjustedX2 - controlX);
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
function printMatrix(matrix, title) {
  console.log(`\n${title}:`);
  matrix.forEach((row) => {
    console.log(row.join(" "));
  });
}

const rand = genRandNum(seed);
const dirMatrix = genDirMatrix(rand, k);
const undirMatrix = genUndirMatrix(dirMatrix);

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
          drawCurve(ctx, node1.x, node1.y, node2.x, node2.y, directed);
        }
      }
    });
  });

  drawNodes(ctx, nodes);
};

printMatrix(dirMatrix, "Directed Matrix");
printMatrix(undirMatrix, "Undirected Matrix");

window.drawDirected = () => drawGraph(dirMatrix, true);
window.drawUndirected = () => drawGraph(undirMatrix, false);
