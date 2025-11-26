import { MonthData } from './types';

// Thai fiscal year: October (current year) to September (next year)
export const THAI_MONTHS = [
  'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม', 'มกราคม', 'กุมภาพันธ์', 'มีนาคม',
  'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน'
];

export const THAI_MONTHS_SHORT = [
  'ต.ค.', 'พ.ย.', 'ธ.ค.', 'ม.ค.', 'ก.พ.', 'มี.ค.',
  'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.'
];

// รายชื่อกลุ่มงาน (ล่าสุด ใช้เป็น master list ไม่อ้างอิง CSV เดิม)
export const PROJECT_GROUPS = [
  'ผู้อำนวยการศูนย์',
  'รองผู้อำนวยการศูนย์',
  'ผู้ช่วยผู้อำนวยการศูนย์',
  'กลุ่มอำนวยการ',
  'กลุ่มขับเคลื่อนยุทธศาสตร์',
  'กลุ่มอนามัยแม่และเด็ก',
  'กลุ่มอนามัยวัยเรียน',
  'กลุ่มอนามัยวัยรุ่นและเยาวชน',
  'กลุ่มอนามัยวัยทำงาน',
  'กลุ่มอนามัยผู้สูงอายุ',
  'กลุ่มอนามัยสิ่งแวดล้อม',
  'กลุ่มสุขาภิบาล',
  'กลุ่มประเมินผลกระทบต่อสุขภาพ',
  'โรงพยาบาลศูนย์',
  'กลุ่มพัฒนาทักษะสมองเด็กปฐมวัย : ศูนย์ EF',
  'กลุ่มสื่อสารประชาสัมพันธ์',
  'กลุ่มจัดการความรู้ วิจัย',
  'กลุ่ม Training Center',
  'สำนักงานเลขานุการ',
  'โครงการพระราชดำริฯ'
];

export const PROJECT_STATUSES = ['ยังไม่เริ่ม', 'กำลังดำเนินการ', 'เสร็จสิ้น', 'เสนอโครงการ', 'ขออนุมัติดำเนินกิจกรรม', 'ยื่นยืมเงิน', 'ยื่นบันทึกกับพัสดุ', 'เบิกจ่ายแล้ว'] as const;

export const COLOR_OPTIONS = [
  { name: 'น้ำเงิน', value: 'bg-blue-600', textColor: 'text-white' },
  { name: 'เขียว', value: 'bg-green-600', textColor: 'text-white' },
  { name: 'ม่วง', value: 'bg-purple-600', textColor: 'text-white' },
  { name: 'ส้ม', value: 'bg-orange-600', textColor: 'text-white' },
  { name: 'ชมพู', value: 'bg-pink-600', textColor: 'text-white' },
  { name: 'แดง', value: 'bg-red-600', textColor: 'text-white' },
  { name: 'เหลือง', value: 'bg-yellow-500', textColor: 'text-gray-900' },
  { name: 'ฟ้า', value: 'bg-cyan-600', textColor: 'text-white' },
  { name: 'เทา', value: 'bg-gray-600', textColor: 'text-white' },
  { name: 'น้ำเงินเข้ม', value: 'bg-indigo-600', textColor: 'text-white' },
  { name: 'เขียวมรกต', value: 'bg-emerald-600', textColor: 'text-white' },
  { name: 'เขียวมะนาว', value: 'bg-lime-600', textColor: 'text-white' },
  { name: 'ม่วงอ่อน', value: 'bg-violet-600', textColor: 'text-white' },
  { name: 'ชมพูบานเย็น', value: 'bg-rose-600', textColor: 'text-white' },
  { name: 'น้ำตาล', value: 'bg-amber-700', textColor: 'text-white' },
];

// Cumulative target percentages for each month (Oct to Sep)
export const CUMULATIVE_TARGETS = [
  11, 23, 36, 47, 53, 61, 68, 75, 82, 90, 100, 100
];

export const getCurrentFiscalYear = (): { startYear: number; endYear: number } => {
  const today = new Date();
  const currentMonth = today.getMonth(); // 0-11
  const currentYear = today.getFullYear();
  
  // If current month is Oct-Dec (9-11), fiscal year starts this year
  // If current month is Jan-Sep (0-8), fiscal year started last year
  const startYear = currentMonth >= 9 ? currentYear : currentYear - 1;
  const endYear = startYear + 1;
  
  return { startYear, endYear };
};

export const getFiscalYearMonths = (): MonthData[] => {
  const { startYear, endYear } = getCurrentFiscalYear();
  const thaiStartYear = startYear + 543;
  const thaiEndYear = endYear + 543;
  
  return THAI_MONTHS.map((month, index) => {
    // Oct, Nov, Dec use startYear; Jan-Sep use endYear
    const year = index < 3 ? thaiStartYear : thaiEndYear;
    const yearShort = year.toString().slice(-2);
    
    return {
      month,
      shortMonth: THAI_MONTHS_SHORT[index],
      year: yearShort,
      index
    };
  });
};

export const STORAGE_KEY = 'budgetTrackerProjects';
