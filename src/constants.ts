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

export const PROJECT_GROUPS = [
  'กลุ่มอำนวยการ',
  'กลุ่มพัฒนาระบบ',
  'กลุ่มส่งเสริมและพัฒนาการเกษตร',
  'กลุ่มส่งเสริมวิสาหกิจชุมชนและผู้ประกอบการ',
  'กลุ่มส่งเสริมและพัฒนาเกษตรกร',
  'กลุ่มยุทธศาสตร์และสารสนเทศ',
  'กลุ่มส่งเสริมการตลาด',
  'กลุ่มพัฒนาภาค',
  'กลุ่มมาตรฐานการเกษตร'
];

export const PROJECT_STATUSES = ['ยังไม่เริ่ม', 'กำลังดำเนินการ', 'เสร็จสิ้น'] as const;

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
];

// Cumulative target percentages for each month (Oct to Sep)
export const CUMULATIVE_TARGETS = [
  10, 15, 20, 30, 40, 50, 60, 70, 80, 85, 95, 100
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
