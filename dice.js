
const characterSelect = document.getElementById('characterSelect');
const modeButtons     = document.querySelectorAll('.mode-btn');
const rollButtonsBox  = document.getElementById('rollButtons');
const resultBox       = document.getElementById('rollResult');

let currentMode = "normal";     // "normal" | "advantage" | "disadvantage"
let selectedCharacter = null;   // ตัวละครที่เลือกอยู่ (null = ยังไม่ได้เลือก)
let rollableCharacters = [];    // รายชื่อตัวละครทั้งหมดที่ให้เลือกได้
let statButtons = [];           // ปุ่มทอยตามสเตตัส เก็บไว้ใช้เปิด/ปิดทีหลัง


/* -------------------------------------------------------------------------
   ฟังก์ชันตัวช่วยเรื่องตัวเลข (characters.js เรียกใช้ด้วย)
------------------------------------------------------------------------- */

// อ่านเลขสเตตัสจากแถวตัวละคร ข้อมูลจากชีตมาเป็น "ข้อความ" เสมอ ต้องแปลงเป็นตัวเลขก่อน
// Number("16") ได้ 16   Number("") ได้ 0   Number("abc") ได้ NaN แล้ว "|| 0" จะเปลี่ยน NaN เป็น 0
function getScore(character, statName) {
  return Number(character[statName]) || 0;
}

function getModifier(score) {
  let bonus = 0;                        
  BONUS_TABLE.forEach(function (row) {   
    if (score >= row.need) {            
      bonus = row.bonus;                 
    }
  });
  return bonus;
}

// เอาเลขมาใส่เครื่องหมายหน้าให้อ่านง่าย  3 -> "+3"   -1 -> "-1"
function formatBonus(n) {
  return n >= 0 ? "+" + n : String(n);
}


/* -------------------------------------------------------------------------
   หัวใจของการทอย
------------------------------------------------------------------------- */

// ทอย d20 หนึ่งลูก
// Math.random() ได้เลขทศนิยม 0 ถึงไม่ถึง 1   x 20 ได้ 0 ถึงไม่ถึง 20
// Math.floor ตัดทศนิยมทิ้งได้ 0-19   แล้ว +1 เป็น 1-20
function rollD20() {
  return Math.floor(Math.random() * 20) + 1;
}

// ทอยตามโหมด คืนค่ากลับเป็น object 2 อย่าง:
//   rolls = ลูกเต๋าที่ทอยได้ทั้งหมด (1 ลูกหรือ 2 ลูก)
//   used  = ลูกที่ถูกเลือกไปใช้จริง
function rollWithMode(mode) {
  if (mode === "normal") {
    const only = rollD20();
    return { rolls: [only], used: only };
  }

  // advantage / disadvantage ทอย 2 ลูกเสมอ
  const a = rollD20();
  const b = rollD20();
  const used = (mode === "advantage") ? Math.max(a, b)   // advantage: เอาลูกที่สูงกว่า
  : Math.min(a, b);  // disadvantage: เอาลูกที่ต่ำกว่า
  return { rolls: [a, b], used: used };
}


function doRoll(label, bonus) {
  const r = rollWithMode(currentMode);
  const total = r.used + bonus;
  showResult(label, r, bonus, total);
}


/* -------------------------------------------------------------------------
   แสดงผลลัพธ์บนหน้าเว็บ
------------------------------------------------------------------------- */
function showResult(label, r, bonus, total) {
  const modeNames = { normal: "ปกติ", advantage: "Advantage", disadvantage: "Disadvantage" };

  
  const diceText = (r.rolls.length === 1)
    ? String(r.used)
    : r.rolls.join("  ,  ") + "  ใช้ " + r.used;

  let note = "";
  if (r.used === 20) note = '<div class="crit good">Natural 20</div>';
  if (r.used === 1)  note = '<div class="crit bad">Natural 1</div>';

  const who = selectedCharacter ? selectedCharacter[NAME_COLUMN] + " ทอย " : "ทอย ";

  resultBox.innerHTML =
    '<div class="result-label">' + who + label + ' (' + modeNames[currentMode] + ')</div>' +
    '<div class="result-total">' + total + '</div>' +
    '<div class="result-detail">ลูกเต๋า ' + diceText + '  โบนัส ' + formatBonus(bonus) + '</div>' +
    note;
}


/* -------------------------------------------------------------------------
   ปุ่มเลือกโหมด (ปกติ / advantage / disadvantage)
------------------------------------------------------------------------- */
modeButtons.forEach(function (btn) {
  btn.addEventListener('click', function () {
    currentMode = btn.dataset.mode;   
    modeButtons.forEach(function (b) {
      b.classList.toggle('active', b === btn);  
    });
  });
});

const plainBtn = document.createElement('button');
plainBtn.textContent = "ทอย d20";
plainBtn.addEventListener('click', function () {
  doRoll("d20", 0);
});
rollButtonsBox.appendChild(plainBtn);

STAT_COLUMNS.forEach(function (stat) {
  const btn = document.createElement('button');
  btn.textContent = stat;
  btn.dataset.stat = stat;
  btn.disabled = true;               
  btn.addEventListener('click', function () {
    const bonus = getModifier(getScore(selectedCharacter, stat));
    doRoll(stat, bonus);
  });
  rollButtonsBox.appendChild(btn);
  statButtons.push(btn);
});


function fillCharacterSelect(list) {
  rollableCharacters = list;
  characterSelect.innerHTML = '<option value="">ไม่เลือกตัวละคร</option>';
  list.forEach(function (ch) {
    const option = document.createElement('option');
    option.value = ch[NAME_COLUMN];
    option.textContent = ch[NAME_COLUMN];
    characterSelect.appendChild(option);
  });
}

characterSelect.addEventListener('change', function () {
  selectedCharacter = rollableCharacters.find(function (ch) {
    return ch[NAME_COLUMN] === characterSelect.value;
  }) || null;
  updateStatButtons();
});


function updateStatButtons() {
  statButtons.forEach(function (btn) {
    const stat = btn.dataset.stat;
    if (!selectedCharacter) {
      btn.disabled = true;
      btn.textContent = stat;
      return;
    }
    const bonus = getModifier(getScore(selectedCharacter, stat)); 
    btn.disabled = false;
    btn.textContent = stat + " (" + formatBonus(bonus) + ")";
  });
}


const diceCountInput   = document.getElementById('diceCount');
const diceSidesSelect  = document.getElementById('diceSides');
const customSidesInput = document.getElementById('customSides');
const diceBonusInput   = document.getElementById('diceBonus');
const customRollBtn    = document.getElementById('customRollBtn');
const customPreview    = document.getElementById('customPreview');

// ทอยเต๋า 1 ลูกที่มี sides หน้า  ได้ 1 ถึง sides
function rollDie(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

// แปลงค่าจากช่องกรอกเป็นเลขจำนวนเต็ม แล้วบีบให้อยู่ในช่วง min-max (กรอกมั่วก็ไม่พัง)
function readInt(input, min, max, fallback) {
  let n = parseInt(input.value, 10);
  if (isNaN(n)) n = fallback;
  n = Math.min(max, Math.max(min, n));
  input.value = n;               // เขียนค่าที่ถูกปรับแล้วกลับไปให้ผู้ใช้เห็น
  return n;
}

// อ่านค่าทั้งหมดจากฟอร์ม -> { count, sides, bonus }
function readCustomDice() {
  const count = readInt(diceCountInput, 1, 50, 1);
  const sides = (diceSidesSelect.value === "custom")
    ? readInt(customSidesInput, 2, 1000, 6)
    : Number(diceSidesSelect.value);
  const bonus = readInt(diceBonusInput, -100, 100, 0);
  return { count: count, sides: sides, bonus: bonus };
}

// สร้างข้อความสูตร เช่น "2d6+3"
function diceFormula(count, sides, bonus) {
  return count + "d" + sides + (bonus === 0 ? "" : formatBonus(bonus));
}

function updateCustomPreview() {
  const d = readCustomDice();
  customPreview.textContent = diceFormula(d.count, d.sides, d.bonus);
}

function doCustomRoll() {
  const d = readCustomDice();
  const rolls = [];
  let sum = 0;
  for (let i = 0; i < d.count; i++) {
    const v = rollDie(d.sides);
    rolls.push(v);
    sum += v;
  }
  const total = sum + d.bonus;
  const formula = diceFormula(d.count, d.sides, d.bonus);
  const who = selectedCharacter ? selectedCharacter[NAME_COLUMN] + " ทอย " : "ทอย ";

  // ทอยลูกเดียว ไม่ต้องโชว์ผลรวมซ้ำ  ทอยหลายลูกโชว์ทุกลูก + ผลรวมเต๋า
  const diceText = (d.count === 1)
    ? String(rolls[0])
    : rolls.join(" + ") + " = " + sum;

  // Natural 20 / Natural 1 เฉพาะกรณีทอย d20 ลูกเดียว
  let note = "";
  if (d.count === 1 && d.sides === 20) {
    if (rolls[0] === 20) note = '<div class="crit good">Natural 20</div>';
    if (rolls[0] === 1)  note = '<div class="crit bad">Natural 1</div>';
  }

  resultBox.innerHTML =
    '<div class="result-label">' + who + formula + '</div>' +
    '<div class="result-total">' + total + '</div>' +
    '<div class="result-detail">ลูกเต๋า ' + diceText + '  โบนัส ' + formatBonus(d.bonus) + '</div>' +
    note;
}

// เลือก "อื่น ๆ" แล้วค่อยโชว์ช่องกรอกจำนวนหน้าเอง
diceSidesSelect.addEventListener('change', function () {
  customSidesInput.hidden = (diceSidesSelect.value !== "custom");
  updateCustomPreview();
});

[diceCountInput, customSidesInput, diceBonusInput].forEach(function (input) {
  input.addEventListener('input', updateCustomPreview);
  // กด Enter ในช่องกรอกแล้วทอยเลย
  input.addEventListener('keydown', function (e) {
    if (e.key === "Enter") doCustomRoll();
  });
});

customRollBtn.addEventListener('click', doCustomRoll);
updateCustomPreview();