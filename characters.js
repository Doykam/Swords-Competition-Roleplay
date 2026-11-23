
const characterList = document.getElementById('characterList');
const searchInput   = document.getElementById('searchInput');

let allCharacters = [];   // เก็บตัวละครทุกคนไว้ตรงนี้ ใช้ตอนค้นหา


/* -------------------------------------------------------------------------
   1) ดึงข้อมูล
   PapaParse อ่าน CSV แล้วแปลงเป็น array ของ object ให้
   header: true  = ใช้แถวแรกเป็นชื่อ key  เช่น row["ชื่อตัวละคร"], row["STRENGTH"]
------------------------------------------------------------------------- */
const hasRealUrl = SHEET_CSV_URL.startsWith("http");

Papa.parse(hasRealUrl ? SHEET_CSV_URL : SAMPLE_CSV, {
  download: hasRealUrl,            // true = ไปโหลดจากลิงก์  false = อ่านข้อความที่ส่งเข้าไปตรง ๆ
  header: true,
  skipEmptyLines: true,
  transformHeader: function (h) { return h.trim(); },  // ตัดช่องว่างหัวท้ายของชื่อคอลัมน์ กันพิมพ์เกินใน Sheet

  complete: function (results) {
    // เก็บเฉพาะแถวที่มีชื่อตัวละคร (ข้ามแถวที่เผลอเว้นว่างไว้)
    allCharacters = results.data.filter(function (row) {
      return row[NAME_COLUMN] && row[NAME_COLUMN].trim() !== "";
    });
    renderCharacters(allCharacters);
    fillCharacterSelect(allCharacters);   // ฟังก์ชันนี้อยู่ใน dice.js
  },

  error: function () {
    characterList.innerHTML = '<p class="empty">โหลดข้อมูลไม่สำเร็จ ลองเช็คลิงก์ใน sheet-config.js</p>';
  }
});


/* -------------------------------------------------------------------------
   2) สร้างกรอบสเตตัส 1 ใบ (ตัวหนังสือด้านบน / กล่องเลขตรงกลาง / วงรีโชว์โบนัสด้านล่าง)
------------------------------------------------------------------------- */
// formatBonus อยู่ใน dice.js (ใส่เครื่องหมายหน้าเลข เช่น 5 -> "+5")
function buildStatFrame(statName, score) {
  const bonus = getModifier(score);  
  return '' +
    '<div class="stat-frame">' +
      '<div class="stat-title">' + statName + '</div>' +
      '<div class="stat-score">' + score + '</div>' +
      '<div class="stat-bonus">' + formatBonus(bonus) + '</div>' +
    '</div>';
}

// สร้างการ์ดตัวละครทั้งหมดจาก array ที่ส่งเข้ามา
function renderCharacters(list) {
  characterList.innerHTML = "";

  if (list.length === 0) {
    characterList.innerHTML = '<p class="empty">ไม่พบตัวละครที่ค้นหา</p>';
    return;
  }

  list.forEach(function (ch) {
    const card = document.createElement('div');
    card.className = 'character-card';

    // วนตามรายชื่อใน STAT_COLUMNS สร้างกรอบสเตตัสให้ทุกตัว
    const statsHtml = STAT_COLUMNS.map(function (stat) {
      return buildStatFrame(stat, getScore(ch, stat));
    }).join("");

    card.innerHTML =
      '<h3 class="char-name">' + ch[NAME_COLUMN] + '</h3>' +
      '<div class="stat-row">' + statsHtml + '</div>';

    characterList.appendChild(card);
  });
}


/* -------------------------------------------------------------------------
   3) ช่องค้นหา — พิมพ์แล้วกรองเฉพาะตัวละครที่ชื่อมีคำที่พิมพ์
------------------------------------------------------------------------- */
searchInput.addEventListener('input', function () {
  const q = searchInput.value.trim().toLowerCase();
  const filtered = allCharacters.filter(function (ch) {
    return ch[NAME_COLUMN].toLowerCase().includes(q);
  });
  renderCharacters(filtered);
});