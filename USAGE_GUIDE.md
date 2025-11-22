# Project Budget Tracker - Usage Guide

## Overview

The Project Budget Tracker is a comprehensive web application designed to manage and track project budgets throughout the Thai Fiscal Year (October to September). It provides an intuitive Gantt-chart-style interface with powerful features for budget management.

## Key Features

### 1. **Fiscal Year Timeline (Gantt Chart)**
- Visual representation of all projects across 12 months (Oct-Sep)
- Each row represents a project with its details
- Each column represents a month in the fiscal year
- Colored bars indicate when projects start

### 2. **Drag & Drop Functionality**
- **How to use**: Click and hold on a project bar (colored box in a month cell)
- Drag it to a different month column
- Release to update the project's start month
- Changes are automatically saved

### 3. **Project Management (CRUD)**

#### Adding a New Project
1. Click the **"เพิ่ม"** (Add) button in the top-right corner
2. Fill in the form:
   - **ชื่อโครงการ** (Project Name): Enter the project name
   - **กลุ่ม** (Group): Select the department/group from dropdown
   - **งบประมาณ** (Budget): Enter budget amount in Baht
   - **วันเริ่มประชุม** (Meeting Start Date): Optional - select start date
   - **วันสิ้นสุดประชุม** (Meeting End Date): Optional - select end date
   - **เดือนที่เริ่ม** (Start Month): Select month (auto-locked if meeting date provided)
   - **สถานะ** (Status): Choose from ยังไม่เริ่ม, กำลังดำเนินการ, เสร็จสิ้น
   - **สี** (Color): Pick a color for the project bar
3. Click **"เพิ่มโครงการ"** to save

#### Editing a Project
1. Find the project in the table
2. Click the **Edit** (pencil) icon next to the project name
3. Modify the fields in the modal
4. Click **"บันทึก"** (Save) to update

#### Deleting a Project
1. Find the project in the table
2. Click the **Delete** (trash) icon
3. Confirm the deletion in the popup dialog

### 4. **Smart Date Handling**
- When you select a **Meeting Start Date**, the system automatically:
  - Calculates which fiscal month the date falls in
  - Locks the "Start Month" dropdown to that month
  - Prevents accidental changes to the start month
- To unlock: Clear the meeting start date

### 5. **Interactive Calendar View**
- **How to access**: Click on any month header (e.g., "ต.ค. 68")
- **What you'll see**:
  - Full calendar grid for that month
  - Days highlighted in blue if they have project meetings
  - Color-coded bars showing which projects have meetings on each day
  - Summary list of all projects starting that month at the bottom
- **To close**: Click the "ปิด" button

### 6. **Budget Tracking**

The footer shows three important rows:

#### **งบประมาณรายเดือน** (Monthly Budget)
- Shows total budget for projects starting in each month
- Helps identify budget distribution across the year

#### **เป้าหมายสะสม (%)** (Cumulative Target %)
- Hardcoded target percentages for each month
- Example: Oct=10%, Nov=15%, ..., Sep=100%
- Represents expected budget utilization by end of each month

#### **ผลสะสมจริง (%)** (Cumulative Actual %)
- Shows actual cumulative budget percentage used up to each month
- **Green text**: On track (≥ target)
- **Red text**: Behind schedule (< target)
- Formula: (Sum of budgets up to this month / Total budget) × 100

### 7. **Filtering & Sorting**

#### **Filter by Group**
- Use the dropdown with filter icon (🔍)
- Select "ทุกกลุ่ม" to show all projects
- Select a specific group to show only projects from that department

#### **Sort Projects**
- Use the dropdown with sort icon (⇅)
- Options:
  - **เรียงตามเดือน**: Sort by start month
  - **เรียงตามชื่อ**: Sort alphabetically by project name
  - **เรียงตามงบประมาณ**: Sort by budget (highest first)
  - **เรียงตามสถานะ**: Sort by status

### 8. **Dark Mode**
- Click the **Moon/Sun** icon in the top-right corner
- Toggle between light and dark themes
- Preference is saved and persists across sessions

### 9. **Data Management**

#### **Auto-Save**
- All changes are automatically saved to your browser's localStorage
- No need to manually save
- Data persists even after closing the browser

#### **Export to CSV**
- Click the **"ดาวน์โหลด"** (Download) button
- Downloads current projects as a CSV file
- Filename includes the current date
- Can be opened in Excel or imported elsewhere

#### **Reset Data**
- Click the **"รีเซ็ต"** (Reset) button
- Confirms before proceeding
- Clears localStorage and reloads original CSV data
- Use this to start fresh or recover from mistakes

### 10. **Unsaved Changes Warning**
- When editing a project, if you try to close the modal without saving
- A warning popup appears: "มีการเปลี่ยนแปลงที่ยังไม่ได้บันทึก"
- Options:
  - **ยกเลิก**: Return to editing
  - **ปิดโดยไม่บันทึก**: Close and discard changes

## Tips & Best Practices

1. **Use Meeting Dates**: When you know the exact meeting dates, enter them to automatically lock the correct start month

2. **Color Coding**: Assign different colors to different project types or priorities for easy visual scanning

3. **Regular Exports**: Periodically export your data as CSV for backup purposes

4. **Budget Monitoring**: Check the cumulative actual % row regularly to ensure you're on track with targets

5. **Group Filtering**: Use group filters to focus on specific departments during reviews

6. **Status Updates**: Keep project statuses up-to-date for accurate progress tracking

## Keyboard Shortcuts

- **Esc**: Close any open modal (if unsaved changes, shows warning)

## Browser Compatibility

Works best on modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari

## Data Privacy

- All data is stored locally in your browser
- No data is sent to external servers
- Clearing browser data will delete all projects (use export first!)

## Troubleshooting

**Problem**: Projects disappeared after clearing browser data
**Solution**: Use the Reset button to reload from CSV, or import your last export

**Problem**: Can't change start month
**Solution**: Meeting start date is set - clear it first to unlock the month dropdown

**Problem**: Dark mode doesn't persist
**Solution**: Check if your browser allows localStorage. Some privacy modes may block it.

## Support

For issues or questions, please refer to the project repository or contact your system administrator.
