/* =========================================================================
   sheet-config.js
   ค่าตั้งต้นทั้งหมดของเว็บอยู่ที่ไฟล์นี้ไฟล์เดียว ไม่มี logic ปนเลย
   อยากเปลี่ยนชื่อสเตตัส หรือเปลี่ยนลิงก์ชีต แก้ที่นี่ที่เดียว
   ========================================================================= */


/* 1) ลิงก์ CSV ของ Google Sheet ที่ Publish ไว้แล้ว
      ถ้ายังไม่มีลิงก์ ปล่อยข้อความเดิมไว้ได้เลย
      เว็บจะใช้ "ข้อมูลตัวอย่าง" ด้านล่างแทน จะได้เปิดดูหน้าตาและลองทอยได้ก่อน */
const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQZVLh6BEvGQcaVpDGKpZgZOQZjmQFm-_P0eWuxYl4lK9Geg3u-yzJi1kZY4riFMVf36SMVPnlpvQcv/pub?output=csv";


/* 2) ชื่อหัวคอลัมน์ในชีต (แถวที่ 1)
      ต้องสะกดตรงกับในชีตเป๊ะ ๆ ทุกตัวอักษร ไม่งั้นเว็บจะหาข้อมูลไม่เจอ */
const NAME_COLUMN = "ชื่อตัวละคร";
const STAT_COLUMNS = ["ถี่ลี่", "ชี่", "หลิงหุน"];

const DEFAULT_TAB = "dice-section";

const BONUS_TABLE = [
  { need: 25,  bonus: 1 },    // Lv 1
  { need: 35,  bonus: 2 },    // Lv 2
  { need: 40,  bonus: 3 },    // Lv 3
  { need: 45,  bonus: 4 },    // Lv 4
  { need: 55,  bonus: 5 },    // Lv 5
  { need: 60,  bonus: 6 },    // Lv 6
  { need: 65,  bonus: 7 },    // Lv 7
  { need: 80,  bonus: 8 },    // Lv 8
  { need: 90,  bonus: 9 },    // Lv 9
  { need: 100, bonus: 10 }    // Lv 10
];