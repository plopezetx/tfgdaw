import type { ProjectFile } from "../types/projects";

export type ProjectTemplate = {
  id: string;
  name: string;
  icon: string;
  description: string;
  files: ProjectFile[];
};

// ─── Plantilla 1: Juego de la serpiente (Snake) ──────────────────────────────

const snakeTemplate: ProjectTemplate = {
  id: "snake",
  name: "Juego: Snake",
  icon: "🐍",
  description: "Clásico juego de la serpiente con canvas y teclado.",
  files: [
    {
      name: "index.html",
      path: "/index.html",
      language: "html",
      content: `<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Snake</title>
    <link rel="stylesheet" href="/src/styles.css" />
  </head>
  <body>
    <div class="game">
      <h1>🐍 Snake</h1>
      <p class="score">Puntos: <span id="score">0</span></p>
      <canvas id="board" width="400" height="400"></canvas>
      <p class="hint">Usa las flechas del teclado para moverte.</p>
    </div>
    <script src="/src/main.js"></script>
  </body>
</html>`,
    },
    {
      name: "main.js",
      path: "/src/main.js",
      language: "javascript",
      content: `const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");

const CELL = 20;
const COLS = canvas.width / CELL;
const ROWS = canvas.height / CELL;

let snake, dir, food, score, gameOver, started;

function randomFood() {
  return {
    x: Math.floor(Math.random() * COLS),
    y: Math.floor(Math.random() * ROWS),
  };
}

function reset() {
  snake = [{ x: 8, y: 10 }];
  dir = { x: 0, y: 0 };
  food = randomFood();
  score = 0;
  gameOver = false;
  started = false;
  scoreEl.textContent = "0";
}

reset();

// Escuchamos en window y bloqueamos el scroll de las flechas.
window.addEventListener("keydown", (e) => {
  const keys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
  if (keys.includes(e.key)) e.preventDefault();

  if (gameOver) {
    if (e.key === "Enter") reset();
    return;
  }

  if (e.key === "ArrowUp" && dir.y === 0) { dir = { x: 0, y: -1 }; started = true; }
  if (e.key === "ArrowDown" && dir.y === 0) { dir = { x: 0, y: 1 }; started = true; }
  if (e.key === "ArrowLeft" && dir.x === 0) { dir = { x: -1, y: 0 }; started = true; }
  if (e.key === "ArrowRight" && dir.x === 0) { dir = { x: 1, y: 0 }; started = true; }
});

function update() {
  if (gameOver || !started) return;

  const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

  // Choque con paredes o consigo misma
  if (
    head.x < 0 || head.x >= COLS ||
    head.y < 0 || head.y >= ROWS ||
    snake.some((s) => s.x === head.x && s.y === head.y)
  ) {
    gameOver = true;
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score += 10;
    scoreEl.textContent = score;
    food = randomFood();
  } else {
    snake.pop();
  }
}

function drawCenteredText(lines) {
  ctx.fillStyle = "rgba(2, 6, 23, 0.75)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.font = "26px Arial";
  ctx.fillText(lines[0], canvas.width / 2, canvas.height / 2 - 6);
  ctx.font = "15px Arial";
  ctx.fillStyle = "#94a3b8";
  ctx.fillText(lines[1], canvas.width / 2, canvas.height / 2 + 24);
}

function draw() {
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#ef4444";
  ctx.fillRect(food.x * CELL, food.y * CELL, CELL - 2, CELL - 2);

  ctx.fillStyle = "#22c55e";
  snake.forEach((s) => {
    ctx.fillRect(s.x * CELL, s.y * CELL, CELL - 2, CELL - 2);
  });

  if (gameOver) {
    drawCenteredText(["Game Over - " + score + " pts", "Pulsa Enter para reiniciar"]);
  } else if (!started) {
    drawCenteredText(["🐍 Snake", "Pulsa una flecha para empezar"]);
  }
}

function loop() {
  update();
  draw();
}

setInterval(loop, 120);`,
    },
    {
      name: "styles.css",
      path: "/src/styles.css",
      language: "css",
      content: `* { box-sizing: border-box; }

body {
  margin: 0;
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: #020617;
  color: #e5e7eb;
  font-family: Arial, sans-serif;
}

.game {
  text-align: center;
}

h1 { margin: 0 0 8px; }

.score {
  font-size: 18px;
  color: #94a3b8;
}

canvas {
  border: 2px solid #1f2937;
  border-radius: 8px;
}

.hint {
  color: #64748b;
  font-size: 14px;
}`,
    },
  ],
};

// ─── Plantilla 2: Página de login ────────────────────────────────────────────

const loginTemplate: ProjectTemplate = {
  id: "login",
  name: "Página de login",
  icon: "🔐",
  description: "Formulario de acceso con validación y mostrar contraseña.",
  files: [
    {
      name: "index.html",
      path: "/index.html",
      language: "html",
      content: `<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Iniciar sesión</title>
    <link rel="stylesheet" href="/src/styles.css" />
  </head>
  <body>
    <form class="login-card" id="form">
      <h1>Iniciar sesión</h1>

      <label>
        Correo
        <input type="email" id="email" placeholder="tu@email.com" required />
      </label>

      <label>
        Contraseña
        <div class="password-row">
          <input type="password" id="password" placeholder="••••••••" required />
          <button type="button" id="toggle" class="toggle">👁</button>
        </div>
      </label>

      <p class="error" id="error"></p>

      <button type="submit" class="submit">Entrar</button>

      <p class="hint">Prueba: admin@demo.com / 123456</p>
    </form>
    <script src="/src/main.js"></script>
  </body>
</html>`,
    },
    {
      name: "main.js",
      path: "/src/main.js",
      language: "javascript",
      content: `const form = document.getElementById("form");
const email = document.getElementById("email");
const password = document.getElementById("password");
const error = document.getElementById("error");
const toggle = document.getElementById("toggle");

// Mostrar / ocultar contraseña
toggle.addEventListener("click", () => {
  password.type = password.type === "password" ? "text" : "password";
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  error.textContent = "";

  if (password.value.length < 6) {
    error.textContent = "La contraseña debe tener al menos 6 caracteres.";
    return;
  }

  // Credenciales de demostración
  if (email.value === "admin@demo.com" && password.value === "123456") {
    document.body.innerHTML =
      '<div class="welcome"><h1>¡Bienvenido! 🎉</h1><p>Has iniciado sesión correctamente.</p></div>';
  } else {
    error.textContent = "Correo o contraseña incorrectos.";
  }
});`,
    },
    {
      name: "styles.css",
      path: "/src/styles.css",
      language: "css",
      content: `* { box-sizing: border-box; }

body {
  margin: 0;
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #1e3a8a, #0f172a);
  color: #e5e7eb;
  font-family: Arial, sans-serif;
}

.login-card {
  width: 320px;
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 14px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

h1 { margin: 0; font-size: 22px; }

label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  color: #94a3b8;
}

input {
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 8px;
  padding: 10px 12px;
  color: #e5e7eb;
  font-size: 14px;
  outline: none;
  width: 100%;
}

input:focus { border-color: #3b82f6; }

.password-row {
  display: flex;
  gap: 6px;
}

.toggle {
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 8px;
  cursor: pointer;
  padding: 0 12px;
}

.submit {
  background: #2563eb;
  color: white;
  border: 0;
  border-radius: 8px;
  padding: 11px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
}

.submit:hover { background: #1d4ed8; }

.error {
  color: #f87171;
  font-size: 13px;
  margin: 0;
  min-height: 18px;
}

.hint {
  color: #64748b;
  font-size: 12px;
  text-align: center;
  margin: 0;
}

.welcome {
  text-align: center;
}`,
    },
  ],
};

// ─── Plantilla 3: Lista de tareas (To-Do) ────────────────────────────────────

const todoTemplate: ProjectTemplate = {
  id: "todo",
  name: "Lista de tareas",
  icon: "✅",
  description: "App de tareas: añadir, completar y borrar (guarda en el navegador).",
  files: [
    {
      name: "index.html",
      path: "/index.html",
      language: "html",
      content: `<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Lista de tareas</title>
    <link rel="stylesheet" href="/src/styles.css" />
  </head>
  <body>
    <main class="app">
      <h1>📝 Mis tareas</h1>

      <form id="form" class="add-row">
        <input id="input" placeholder="Nueva tarea..." autocomplete="off" />
        <button type="submit">Añadir</button>
      </form>

      <ul id="list" class="list"></ul>
      <p id="empty" class="empty">No hay tareas todavía.</p>
    </main>
    <script src="/src/main.js"></script>
  </body>
</html>`,
    },
    {
      name: "main.js",
      path: "/src/main.js",
      language: "javascript",
      content: `const form = document.getElementById("form");
const input = document.getElementById("input");
const list = document.getElementById("list");
const empty = document.getElementById("empty");

let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");

function save() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function render() {
  list.innerHTML = "";
  empty.style.display = tasks.length === 0 ? "block" : "none";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = "item" + (task.done ? " done" : "");

    const span = document.createElement("span");
    span.textContent = task.text;
    span.addEventListener("click", () => {
      tasks[index].done = !tasks[index].done;
      save();
      render();
    });

    const del = document.createElement("button");
    del.textContent = "✕";
    del.className = "del";
    del.addEventListener("click", () => {
      tasks.splice(index, 1);
      save();
      render();
    });

    li.appendChild(span);
    li.appendChild(del);
    list.appendChild(li);
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  tasks.push({ text, done: false });
  input.value = "";
  save();
  render();
});

render();`,
    },
    {
      name: "styles.css",
      path: "/src/styles.css",
      language: "css",
      content: `* { box-sizing: border-box; }

body {
  margin: 0;
  min-height: 100vh;
  display: grid;
  place-items: start center;
  padding-top: 60px;
  background: #0f172a;
  color: #e5e7eb;
  font-family: Arial, sans-serif;
}

.app {
  width: 360px;
}

h1 { font-size: 22px; }

.add-row {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.add-row input {
  flex: 1;
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 8px;
  padding: 10px;
  color: #e5e7eb;
  outline: none;
}

.add-row input:focus { border-color: #3b82f6; }

.add-row button {
  background: #2563eb;
  color: white;
  border: 0;
  border-radius: 8px;
  padding: 0 16px;
  font-weight: 600;
  cursor: pointer;
}

.list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 8px;
  padding: 10px 12px;
}

.item span {
  cursor: pointer;
  flex: 1;
}

.item.done span {
  text-decoration: line-through;
  color: #64748b;
}

.del {
  background: transparent;
  border: 0;
  color: #f87171;
  cursor: pointer;
  font-size: 16px;
}

.empty {
  color: #64748b;
  text-align: center;
}`,
    },
  ],
};

// ─── Plantilla 4: Calculadora ────────────────────────────────────────────────

const calculatorTemplate: ProjectTemplate = {
  id: "calculator",
  name: "Calculadora",
  icon: "🧮",
  description: "Calculadora funcional con teclado de botones.",
  files: [
    {
      name: "index.html",
      path: "/index.html",
      language: "html",
      content: `<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Calculadora</title>
    <link rel="stylesheet" href="/src/styles.css" />
  </head>
  <body>
    <div class="calc">
      <div class="display" id="display">0</div>
      <div class="keys">
        <button class="key key-clear" data-action="clear">C</button>
        <button class="key" data-action="del">⌫</button>
        <button class="key key-op" data-op="/">÷</button>
        <button class="key key-op" data-op="*">×</button>

        <button class="key" data-num="7">7</button>
        <button class="key" data-num="8">8</button>
        <button class="key" data-num="9">9</button>
        <button class="key key-op" data-op="-">−</button>

        <button class="key" data-num="4">4</button>
        <button class="key" data-num="5">5</button>
        <button class="key" data-num="6">6</button>
        <button class="key key-op" data-op="+">+</button>

        <button class="key" data-num="1">1</button>
        <button class="key" data-num="2">2</button>
        <button class="key" data-num="3">3</button>
        <button class="key key-equals" data-action="equals">=</button>

        <button class="key key-zero" data-num="0">0</button>
        <button class="key" data-num=".">.</button>
      </div>
    </div>
    <script src="/src/main.js"></script>
  </body>
</html>`,
    },
    {
      name: "main.js",
      path: "/src/main.js",
      language: "javascript",
      content: `const display = document.getElementById("display");
let expression = "";

function render() {
  display.textContent = expression || "0";
}

document.querySelectorAll(".key").forEach((key) => {
  key.addEventListener("click", () => {
    const { num, op, action } = key.dataset;

    if (num !== undefined) expression += num;
    if (op !== undefined) expression += op;

    if (action === "clear") expression = "";
    if (action === "del") expression = expression.slice(0, -1);
    if (action === "equals") {
      try {
        // Evaluación simple de la expresión introducida
        expression = String(eval(expression));
      } catch {
        expression = "Error";
      }
    }

    render();
  });
});

render();`,
    },
    {
      name: "styles.css",
      path: "/src/styles.css",
      language: "css",
      content: `* { box-sizing: border-box; }

body {
  margin: 0;
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: #0f172a;
  font-family: Arial, sans-serif;
}

.calc {
  width: 280px;
  background: #1e293b;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

.display {
  background: #020617;
  color: #e5e7eb;
  font-size: 32px;
  text-align: right;
  padding: 18px;
  border-radius: 10px;
  margin-bottom: 12px;
  overflow: hidden;
}

.keys {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.key {
  padding: 16px;
  font-size: 18px;
  border: 0;
  border-radius: 10px;
  background: #334155;
  color: #e5e7eb;
  cursor: pointer;
}

.key:hover { background: #475569; }
.key-op { background: #2563eb; }
.key-op:hover { background: #1d4ed8; }
.key-clear { background: #b91c1c; }
.key-equals { background: #16a34a; grid-row: span 2; }
.key-zero { grid-column: span 2; }`,
    },
  ],
};

// ─── Plantilla 5: Reloj digital ──────────────────────────────────────────────

const clockTemplate: ProjectTemplate = {
  id: "clock",
  name: "Reloj digital",
  icon: "🕒",
  description: "Reloj con fecha que se actualiza en tiempo real.",
  files: [
    {
      name: "index.html",
      path: "/index.html",
      language: "html",
      content: `<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Reloj</title>
    <link rel="stylesheet" href="/src/styles.css" />
  </head>
  <body>
    <div class="clock">
      <div class="time" id="time">00:00:00</div>
      <div class="date" id="date">—</div>
    </div>
    <script src="/src/main.js"></script>
  </body>
</html>`,
    },
    {
      name: "main.js",
      path: "/src/main.js",
      language: "javascript",
      content: `const timeEl = document.getElementById("time");
const dateEl = document.getElementById("date");

const DIAS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

function pad(n) {
  return String(n).padStart(2, "0");
}

function update() {
  const now = new Date();
  timeEl.textContent = pad(now.getHours()) + ":" + pad(now.getMinutes()) + ":" + pad(now.getSeconds());
  dateEl.textContent = DIAS[now.getDay()] + ", " + now.getDate() + " de " + MESES[now.getMonth()];
}

update();
setInterval(update, 1000);`,
    },
    {
      name: "styles.css",
      path: "/src/styles.css",
      language: "css",
      content: `body {
  margin: 0;
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: radial-gradient(circle at 50% 30%, #1e293b, #020617);
  color: white;
  font-family: "Segoe UI", Arial, sans-serif;
}

.clock {
  text-align: center;
}

.time {
  font-size: 72px;
  font-weight: 700;
  letter-spacing: 4px;
  text-shadow: 0 0 30px rgba(59, 130, 246, 0.6);
}

.date {
  font-size: 20px;
  color: #94a3b8;
  margin-top: 8px;
  text-transform: capitalize;
}`,
    },
  ],
};

// ─── Plantilla 6: Lienzo de dibujo ───────────────────────────────────────────

const paintTemplate: ProjectTemplate = {
  id: "paint",
  name: "Lienzo de dibujo",
  icon: "🎨",
  description: "Dibuja con el ratón; elige color y grosor.",
  files: [
    {
      name: "index.html",
      path: "/index.html",
      language: "html",
      content: `<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Dibujo</title>
    <link rel="stylesheet" href="/src/styles.css" />
  </head>
  <body>
    <div class="toolbar">
      <input type="color" id="color" value="#3b82f6" />
      <input type="range" id="size" min="1" max="30" value="5" />
      <button id="clear">Limpiar</button>
    </div>
    <canvas id="board" width="600" height="400"></canvas>
    <script src="/src/main.js"></script>
  </body>
</html>`,
    },
    {
      name: "main.js",
      path: "/src/main.js",
      language: "javascript",
      content: `const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");
const colorInput = document.getElementById("color");
const sizeInput = document.getElementById("size");
const clearBtn = document.getElementById("clear");

let drawing = false;

function pos(e) {
  const rect = canvas.getBoundingClientRect();
  return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}

canvas.addEventListener("mousedown", (e) => {
  drawing = true;
  const p = pos(e);
  ctx.beginPath();
  ctx.moveTo(p.x, p.y);
});

canvas.addEventListener("mousemove", (e) => {
  if (!drawing) return;
  const p = pos(e);
  ctx.lineTo(p.x, p.y);
  ctx.strokeStyle = colorInput.value;
  ctx.lineWidth = sizeInput.value;
  ctx.lineCap = "round";
  ctx.stroke();
});

window.addEventListener("mouseup", () => { drawing = false; });

clearBtn.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});`,
    },
    {
      name: "styles.css",
      path: "/src/styles.css",
      language: "css",
      content: `body {
  margin: 0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: #0f172a;
  font-family: Arial, sans-serif;
}

.toolbar {
  display: flex;
  gap: 12px;
  align-items: center;
  background: #1e293b;
  padding: 10px 16px;
  border-radius: 10px;
}

.toolbar input[type="color"] {
  width: 40px;
  height: 32px;
  border: 0;
  background: none;
  cursor: pointer;
}

.toolbar button {
  background: #b91c1c;
  color: white;
  border: 0;
  border-radius: 8px;
  padding: 8px 14px;
  cursor: pointer;
}

canvas {
  background: white;
  border-radius: 10px;
  cursor: crosshair;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}`,
    },
  ],
};

export const projectTemplates: ProjectTemplate[] = [
  snakeTemplate,
  loginTemplate,
  todoTemplate,
  calculatorTemplate,
  clockTemplate,
  paintTemplate,
];
