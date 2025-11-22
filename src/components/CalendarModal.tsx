import React, { useMemo } from 'react';
import { X, Calendar } from 'lucide-react';
import { Project } from '../types';
import { getCurrentFiscalYear, THAI_MONTHS } from '../constants';
import { fiscalMonthToCalendarMonth, getDaysInMonth, isDateInRange } from '../utils';

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  monthIndex: number;
  projects: Project[];
  isDarkMode: boolean;
}

export const CalendarModal: React.FC<CalendarModalProps> = ({
  isOpen,
  onClose,
  monthIndex,
  projects,
  isDarkMode
}) => {
  const fiscalYear = getCurrentFiscalYear();
  const { month: calendarMonth, year: calendarYear } = fiscalMonthToCalendarMonth(monthIndex, fiscalYear);
  
  const monthData = useMemo(() => {
    const daysInMonth = getDaysInMonth(calendarMonth, calendarYear);
    const firstDay = new Date(calendarYear, calendarMonth, 1).getDay();
    
    const days: Array<{
      day: number;
      date: Date;
      hasEvent: boolean;
      projects: Project[];
    }> = [];
    
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(calendarYear, calendarMonth, i);
      const projectsOnDate = projects.filter(p => {
        if (!p.meetingStartDate || !p.meetingEndDate) return false;
        return isDateInRange(date, p.meetingStartDate, p.meetingEndDate);
      });
      
      days.push({
        day: i,
        date,
        hasEvent: projectsOnDate.length > 0,
        projects: projectsOnDate
      });
    }
    
    return { days, firstDay, daysInMonth };
  }, [calendarMonth, calendarYear, projects]);

  const projectsStartingThisMonth = useMemo(() => {
    return projects.filter(p => p.startMonth === monthIndex);
  }, [projects, monthIndex]);

  if (!isOpen) return null;

  const bgColor = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-300';
  const thaiYear = calendarYear + 543;

  const weekDays = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className={`${bgColor} ${textColor} rounded-lg shadow-xl max-w-4xl w-full`}>
            {/* Header */}
            <div className={`flex items-center justify-between p-6 border-b ${borderColor}`}>
              <div className="flex items-center gap-3">
                <Calendar size={28} className="text-blue-600" />
                <h2 className="text-2xl font-bold">
                  {THAI_MONTHS[monthIndex]} {thaiYear}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              {/* Calendar Grid */}
              <div className="mb-6">
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {weekDays.map(day => (
                    <div key={day} className="text-center font-bold text-sm py-2">
                      {day}
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-2">
                  {/* Empty cells for days before month starts */}
                  {Array.from({ length: monthData.firstDay }).map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square" />
                  ))}
                  
                  {/* Calendar days */}
                  {monthData.days.map(({ day, hasEvent, projects: dayProjects }) => (
                    <div
                      key={day}
                      className={`aspect-square border ${borderColor} rounded-lg p-2 ${
                        hasEvent 
                          ? 'bg-blue-100 dark:bg-blue-900 border-blue-500' 
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <div className="text-sm font-semibold">{day}</div>
                      {hasEvent && (
                        <div className="mt-1">
                          {dayProjects.map(p => (
                            <div
                              key={p.id}
                              className={`${p.color} h-1 rounded-full mb-1`}
                              title={p.name}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Projects Summary */}
              <div className={`border-t ${borderColor} pt-6`}>
                <h3 className="text-xl font-bold mb-4">โครงการที่เริ่มในเดือนนี้</h3>
                {projectsStartingThisMonth.length > 0 ? (
                  <div className="space-y-3">
                    {projectsStartingThisMonth.map(project => (
                      <div
                        key={project.id}
                        className={`flex items-start gap-3 p-4 border ${borderColor} rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700`}
                      >
                        <div className={`${project.color} w-4 h-4 rounded-full flex-shrink-0 mt-1`} />
                        <div className="flex-1">
                          <div className="font-semibold">{project.name}</div>
                          <div className="text-sm opacity-75">{project.group}</div>
                          <div className="text-sm mt-1">
                            งบประมาณ: {project.budget.toLocaleString('th-TH')} บาท
                          </div>
                          {project.meetingStartDate && project.meetingEndDate && (
                            <div className="text-xs mt-1 opacity-60">
                              ประชุม: {new Date(project.meetingStartDate).toLocaleDateString('th-TH')} - {new Date(project.meetingEndDate).toLocaleDateString('th-TH')}
                            </div>
                          )}
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs ${
                          project.status === 'เสร็จสิ้น' ? 'bg-green-600 text-white' :
                          project.status === 'กำลังดำเนินการ' ? 'bg-blue-600 text-white' :
                          'bg-gray-600 text-white'
                        }`}>
                          {project.status}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 opacity-50">
                    ไม่มีโครงการที่เริ่มในเดือนนี้
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className={`border-t ${borderColor} p-6 flex justify-end`}>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
