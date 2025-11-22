import { useState, useEffect } from 'react';
import { Plus, Download, RefreshCw, Moon, Sun, Filter, ArrowUpDown, Search, Cloud, CloudOff, CheckCircle, X } from 'lucide-react';
import { Project } from './types';
import { PROJECT_GROUPS } from './constants';
import { ToastContainer } from './components/Toast';
import { createToast, Toast } from './hooks/useToast';
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
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [isOnline, setIsOnline] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Helper function to add toast
  const addToast = (message: string, type: Toast['type']) => {
    const toast = createToast(message, type);
    setToasts(prev => [...prev, toast]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Check online status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      addToast('กลับมาออนไลน์แล้ว', 'success');
    };
    const handleOffline = () => {
      setIsOnline(false);
      addToast('ออฟไลน์ - ใช้ข้อมูลจาก localStorage', 'warning');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setSyncStatus('syncing');
      
      try {
        // Try to load from Google Sheets first
        const googleProjects = await loadFromGoogleSheets();
        
        if (googleProjects && googleProjects.length > 0) {
          setProjects(googleProjects);
          saveToLocalStorage(googleProjects); // Backup to localStorage
          setSyncStatus('success');
          addToast('โหลดข้อมูลจาก Google Sheets สำเร็จ', 'success');
        } else {
          // Fallback to localStorage
          const savedProjects = loadFromLocalStorage();
          if (savedProjects && savedProjects.length > 0) {
            setProjects(savedProjects);
            setSyncStatus('idle');
            addToast('ใช้ข้อมูลจาก localStorage', 'info');
          } else {
            setSyncStatus('idle');
          }
        }
      } catch (error) {
        console.error('Error loading from Google Sheets:', error);
        setSyncStatus('error');
        
        // Fallback to localStorage
        const savedProjects = loadFromLocalStorage();
        if (savedProjects && savedProjects.length > 0) {
          setProjects(savedProjects);
          addToast('ไม่สามารถเชื่อมต่อ Google Sheets - ใช้ข้อมูลจาก localStorage', 'warning');
        } else {
          addToast('ไม่พบข้อมูล', 'error');
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
      
      // Save to Google Sheets asynchronously
      if (isOnline) {
        setSyncStatus('syncing');
        saveToGoogleSheets(projects)
          .then(() => {
            setSyncStatus('success');
            // Auto-hide success status after 2 seconds
            setTimeout(() => setSyncStatus('idle'), 2000);
          })
          .catch(err => {
            console.error('Failed to sync with Google Sheets:', err);
            setSyncStatus('error');
            addToast('ไม่สามารถซิงค์กับ Google Sheets - บันทึกใน localStorage แล้ว', 'warning');
          });
      }
    }
  }, [projects, isLoading, isOnline]);

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
      addToast('แก้ไขโครงการสำเร็จ', 'success');
    } else {
      // Add new
      setProjects(prev => [...prev, project]);
      addToast('เพิ่มโครงการสำเร็จ', 'success');
    }
  };

  const handleDeleteProject = (id: string) => {
    const project = projects.find(p => p.id === id);
    if (window.confirm(`คุณต้องการลบโครงการ "${project?.name}" หรือไม่?`)) {
      setProjects(prev => prev.filter(p => p.id !== id));
      addToast('ลบโครงการสำเร็จ', 'success');
    }
  };

  const handleUpdateProject = (project: Project) => {
    setProjects(prev => prev.map(p => p.id === project.id ? project : p));
  };

  // Reset data
  const handleReset = async () => {
    if (window.confirm('คุณต้องการรีเซ็ตข้อมูลและโหลดจาก Google Sheets ใหม่หรือไม่?')) {
      try {
        setIsLoading(true);
        setSyncStatus('syncing');
        localStorage.removeItem('budgetTrackerProjects');
        const googleProjects = await loadFromGoogleSheets();
        setProjects(googleProjects);
        setSyncStatus('success');
        addToast('รีเซ็ตข้อมูลสำเร็จ', 'success');
        setIsLoading(false);
      } catch (error) {
        console.error('Error resetting data:', error);
        setSyncStatus('error');
        addToast('เกิดข้อผิดพลาดในการโหลดข้อมูลจาก Google Sheets', 'error');
        setIsLoading(false);
      }
    }
  };

  // Export to CSV
  const handleExport = () => {
    downloadCSV(projects, `projects_${new Date().toISOString().split('T')[0]}.csv`);
    addToast('ดาวน์โหลดไฟล์ CSV สำเร็จ', 'success');
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
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-blue-600">
                ตารางกำกับและติดตามโครงการ
              </h1>
              
              {/* Sync Status Indicator */}
              <div className="flex items-center gap-1 text-sm">
                {!isOnline && (
                  <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400" title="ออฟไลน์">
                    <CloudOff size={16} />
                  </div>
                )}
                {isOnline && syncStatus === 'syncing' && (
                  <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400" title="กำลังซิงค์...">
                    <Cloud size={16} className="animate-pulse" />
                  </div>
                )}
                {isOnline && syncStatus === 'success' && (
                  <div className="flex items-center gap-1 text-green-600 dark:text-green-400" title="ซิงค์สำเร็จ">
                    <CheckCircle size={16} />
                  </div>
                )}
                {isOnline && syncStatus === 'error' && (
                  <div className="flex items-center gap-1 text-red-600 dark:text-red-400" title="ซิงค์ล้มเหลว">
                    <CloudOff size={16} />
                  </div>
                )}
              </div>
            </div>
            
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
            {/* Search */}
            <div className="flex items-center gap-2 flex-1">
              <Search size={20} />
              <input
                type="text"
                placeholder="ค้นหาชื่อโครงการ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`flex-1 px-3 py-2 border rounded-lg ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 placeholder-gray-400' 
                    : 'bg-white border-gray-300 placeholder-gray-500'
                } focus:ring-2 focus:ring-blue-500 focus:outline-none`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  title="ล้างการค้นหา"
                >
                  <X size={20} />
                </button>
              )}
            </div>

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
                {searchQuery && (
                  <span className="ml-1 text-blue-600 dark:text-blue-400">
                    (กรอง: {projects.filter(p => 
                      p.name.toLowerCase().includes(searchQuery.toLowerCase())
                    ).length})
                  </span>
                )}
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
            searchQuery={searchQuery}
          />
        </div>
      </main>

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />

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
