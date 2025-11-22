import { useState, useEffect } from 'react';
import { Plus, Download, RefreshCw, Moon, Sun, Filter, ArrowUpDown } from 'lucide-react';
import { Project } from './types';
import { PROJECT_GROUPS } from './constants';
import { 
  loadFromGoogleSheets, 
  saveToGoogleSheets, 
  loadFromLocalStorage, 
  saveToLocalStorage, 
  downloadCSV 
} from './utils-googlesheets';
import { ProjectGanttChart } from './components/ProjectGanttChart';
import { ProjectModal } from './components/ProjectModal';
import { CalendarModal } from './components/CalendarModal';

function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | undefined>();
  const [selectedMonth, setSelectedMonth] = useState<number>(0);
  const [filterGroup, setFilterGroup] = useState<string>('ทั้งหมด');
  const [sortBy, setSortBy] = useState<'name' | 'budget' | 'startMonth' | 'status'>('startMonth');
  const [isLoading, setIsLoading] = useState(true);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      try {
        // Try to load from Google Sheets first
        const googleProjects = await loadFromGoogleSheets();
        
        if (googleProjects && googleProjects.length > 0) {
          setProjects(googleProjects);
          saveToLocalStorage(googleProjects); // Backup to localStorage
        } else {
          // Fallback to localStorage
          const savedProjects = loadFromLocalStorage();
          if (savedProjects && savedProjects.length > 0) {
            setProjects(savedProjects);
          }
        }
      } catch (error) {
        console.error('Error loading from Google Sheets:', error);
        
        // Fallback to localStorage
        const savedProjects = loadFromLocalStorage();
        if (savedProjects && savedProjects.length > 0) {
          setProjects(savedProjects);
        }
      }
      
      setIsLoading(false);
    };
    
    loadData();
  }, []);

  // Auto-save to both localStorage and Google Sheets whenever projects change
  useEffect(() => {
    if (!isLoading && projects.length > 0) {
      saveToLocalStorage(projects);
      // Save to Google Sheets asynchronously (don't wait)
      saveToGoogleSheets(projects).catch(err => {
        console.error('Failed to sync with Google Sheets:', err);
      });
    }
  }, [projects, isLoading]);

  // Load dark mode preference
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedDarkMode);
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const newValue = !prev;
      localStorage.setItem('darkMode', String(newValue));
      return newValue;
    });
  };

  // CRUD operations
  const handleAddProject = () => {
    setSelectedProject(undefined);
    setIsModalOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleSaveProject = (project: Project) => {
    if (selectedProject) {
      // Update existing
      setProjects(prev => prev.map(p => p.id === project.id ? project : p));
    } else {
      // Add new
      setProjects(prev => [...prev, project]);
    }
  };

  const handleDeleteProject = (id: string) => {
    if (confirm('คุณต้องการลบโครงการนี้หรือไม่?')) {
      setProjects(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleUpdateProject = (project: Project) => {
    setProjects(prev => prev.map(p => p.id === project.id ? project : p));
  };

  // Reset data
  const handleReset = async () => {
    if (confirm('คุณต้องการรีเซ็ตข้อมูลและโหลดจาก Google Sheets ใหม่หรือไม่?')) {
      try {
        setIsLoading(true);
        localStorage.removeItem('budgetTrackerProjects');
        const googleProjects = await loadFromGoogleSheets();
        setProjects(googleProjects);
        setIsLoading(false);
      } catch (error) {
        console.error('Error resetting data:', error);
        alert('เกิดข้อผิดพลาดในการโหลดข้อมูลจาก Google Sheets');
        setIsLoading(false);
      }
    }
  };

  // Export to CSV
  const handleExport = () => {
    downloadCSV(projects, `projects_${new Date().toISOString().split('T')[0]}.csv`);
  };

  // Open calendar
  const handleMonthClick = (monthIndex: number) => {
    setSelectedMonth(monthIndex);
    setIsCalendarOpen(true);
  };

  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-gray-50';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const cardBg = isDarkMode ? 'bg-gray-800' : 'bg-white';

  if (isLoading) {
    return (
      <div className={`min-h-screen ${bgColor} ${textColor} flex items-center justify-center`}>
        <div className="text-xl">กำลังโหลดข้อมูล...</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bgColor} ${textColor}`}>
      {/* Header */}
      <header className={`${cardBg} shadow-lg sticky top-0 z-20`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-blue-600">
              ตารางกำกับและติดตามโครงการ
            </h1>
            
            <div className="flex flex-wrap items-center gap-2">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                title={isDarkMode ? 'เปลี่ยนเป็นโหมดสว่าง' : 'เปลี่ยนเป็นโหมดมืด'}
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {/* Add Project */}
              <button
                onClick={handleAddProject}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Plus size={20} />
                <span className="hidden sm:inline">เพิ่ม</span>
              </button>

              {/* Download CSV */}
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Download size={20} />
                <span className="hidden sm:inline">ดาวน์โหลด</span>
              </button>

              {/* Reset */}
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <RefreshCw size={20} />
                <span className="hidden sm:inline">รีเซ็ต</span>
              </button>
            </div>
          </div>

          {/* Filters and Sort */}
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            {/* Group Filter */}
            <div className="flex items-center gap-2">
              <Filter size={20} />
              <select
                value={filterGroup}
                onChange={(e) => setFilterGroup(e.target.value)}
                className={`px-3 py-2 border rounded-lg ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600' 
                    : 'bg-white border-gray-300'
                } focus:ring-2 focus:ring-blue-500`}
              >
                <option value="ทั้งหมด">ทุกกลุ่ม</option>
                {PROJECT_GROUPS.map(group => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <ArrowUpDown size={20} />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className={`px-3 py-2 border rounded-lg ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600' 
                    : 'bg-white border-gray-300'
                } focus:ring-2 focus:ring-blue-500`}
              >
                <option value="startMonth">เรียงตามเดือน</option>
                <option value="name">เรียงตามชื่อ</option>
                <option value="budget">เรียงตามงบประมาณ</option>
                <option value="status">เรียงตามสถานะ</option>
              </select>
            </div>

            {/* Summary */}
            <div className="flex-1 flex items-center justify-end gap-4 text-sm">
              <div>
                โครงการทั้งหมด: <span className="font-bold">{projects.length}</span>
              </div>
              <div>
                งบประมาณรวม: <span className="font-bold">
                  {projects.reduce((sum, p) => sum + p.budget, 0).toLocaleString('th-TH')} บาท
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className={`${cardBg} rounded-lg shadow-lg overflow-hidden`}>
          <ProjectGanttChart
            projects={projects}
            onEdit={handleEditProject}
            onDelete={handleDeleteProject}
            onUpdateProject={handleUpdateProject}
            onMonthClick={handleMonthClick}
            isDarkMode={isDarkMode}
            filterGroup={filterGroup}
            sortBy={sortBy}
          />
        </div>
      </main>

      {/* Modals */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProject}
        project={selectedProject}
        isDarkMode={isDarkMode}
      />

      <CalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        monthIndex={selectedMonth}
        projects={projects}
        isDarkMode={isDarkMode}
      />

      {/* Footer */}
      <footer className="mt-8 pb-6 text-center text-sm opacity-75">
        <p>ปีงบประมาณ 2569 (ต.ค. 68 - ก.ย. 69) | ระบบติดตามงบประมาณโครงการ</p>
      </footer>
    </div>
  );
}

export default App;
