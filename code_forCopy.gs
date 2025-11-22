/**
 * Google Apps Script สำหรับ Budget Tracker
 * Sheet ID: 137hNk46s2dfyN6SAQmZnOzRJ-zO032yW4AS2LvLxboc
 * Sheet Name: plans
 */

// ตั้งค่า CORS และ headers
function doGet(e) {
  try {
    const action = e.parameter.action || 'getProjects';
    
    if (action === 'getProjects') {
      return getProjects();
    } else if (action === 'saveProjects') {
      return saveProjects(e);
    }
    
    return createResponse({ error: 'Invalid action' }, 400);
  } catch (error) {
    return createResponse({ error: error.toString() }, 500);
  }
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    return saveProjects(data);
  } catch (error) {
    return createResponse({ error: error.toString() }, 500);
  }
}

// ดึงข้อมูลโครงการทั้งหมด
function getProjects() {
  const sheetId = '137hNk46s2dfyN6SAQmZnOzRJ-zO032yW4AS2LvLxboc';
  const sheetName = 'plans';
  
  try {
    const sheet = SpreadsheetApp.openById(sheetId).getSheetByName(sheetName);
    
    if (!sheet) {
      return createResponse({ error: 'Sheet not found' }, 404);
    }
    
    const data = sheet.getDataRange().getValues();
    
    if (data.length === 0) {
      return createResponse({ projects: [] }, 200);
    }
    
    // Header row
    const headers = data[0];
    
    // แปลงข้อมูลเป็น JSON
    const projects = [];
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      
      // ข้าม row ว่าง
      if (!row[0] && !row[1]) continue;
      
      const project = {
        id: row[0]?.toString() || '',
        name: row[1]?.toString() || '',
        group: row[2]?.toString() || '',
        budget: parseFloat(row[3]) || 0,
        startMonth: parseInt(row[4]) || 0,
        color: row[5]?.toString() || 'bg-blue-600',
        status: row[6]?.toString() || 'ยังไม่เริ่ม',
        meetingStartDate: row[7] ? formatDate(row[7]) : undefined,
        meetingEndDate: row[8] ? formatDate(row[8]) : undefined
      };
      
      projects.push(project);
    }
    
    return createResponse({ projects: projects }, 200);
    
  } catch (error) {
    Logger.log('Error in getProjects: ' + error.toString());
    return createResponse({ error: error.toString() }, 500);
  }
}

// บันทึกข้อมูลโครงการ
function saveProjects(data) {
  const sheetId = '137hNk46s2dfyN6SAQmZnOzRJ-zO032yW4AS2LvLxboc';
  const sheetName = 'plans';
  
  try {
    const sheet = SpreadsheetApp.openById(sheetId).getSheetByName(sheetName);
    
    if (!sheet) {
      return createResponse({ error: 'Sheet not found' }, 404);
    }
    
    const projects = data.projects || [];
    
    // ล้างข้อมูลเก่า (เก็บ header)
    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      sheet.deleteRows(2, lastRow - 1);
    }
    
    // เขียนข้อมูลใหม่
    const rows = projects.map(p => [
      p.id,
      p.name,
      p.group,
      p.budget,
      p.startMonth,
      p.color,
      p.status,
      p.meetingStartDate || '',
      p.meetingEndDate || ''
    ]);
    
    if (rows.length > 0) {
      sheet.getRange(2, 1, rows.length, 9).setValues(rows);
    }
    
    return createResponse({ success: true, count: projects.length }, 200);
    
  } catch (error) {
    Logger.log('Error in saveProjects: ' + error.toString());
    return createResponse({ error: error.toString() }, 500);
  }
}

// Helper: แปลง Date เป็น ISO string
function formatDate(date) {
  if (!date) return undefined;
  
  try {
    if (typeof date === 'string') return date;
    
    const d = new Date(date);
    if (isNaN(d.getTime())) return undefined;
    
    // Format: YYYY-MM-DD
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  } catch (error) {
    return undefined;
  }
}

// Helper: สร้าง Response
function createResponse(data, statusCode) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  
  // เพิ่ม CORS headers
  if (statusCode !== 200) {
    Logger.log('Error response: ' + JSON.stringify(data));
  }
  
  return output;
}

// ทดสอบการทำงาน
function testGetProjects() {
  const result = getProjects();
  Logger.log(result.getContent());
}

function testSaveProjects() {
  const testData = {
    projects: [
      {
        id: 'test1',
        name: 'โครงการทดสอบ',
        group: 'กลุ่มทดสอบ',
        budget: 100000,
        startMonth: 0,
        color: 'bg-blue-600',
        status: 'ยังไม่เริ่ม',
        meetingStartDate: '2024-10-15',
        meetingEndDate: '2024-10-20'
      }
    ]
  };
  
  const result = saveProjects(testData);
  Logger.log(result.getContent());
}
