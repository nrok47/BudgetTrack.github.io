import React, { useMemo, useState, useEffect } from 'react';
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
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const fiscalYear = getCurrentFiscalYear();
  
  // Reset selected day when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedDay(null);
    }
  }, [isOpen]);
  const { month: calendarMonth, year: calendarYear } = fiscalMonthToCalendarMonth(monthIndex, fiscalYear);
  
  const monthData = useMemo(() => {
    const daysInMonth = getDaysInMonth(calendarMonth, calendarYear);
    const firstDay = new Date(calendarYear, calendarMonth, 1).getDay();
    
    const days: Array<{
      day: number;
      date: Date;
      hasEvent: boolean;
      projects: Project[];
      isToday: boolean;
    }> = [];
    
    const today = new Date();
    const isCurrentMonth = today.getMonth() === calendarMonth && today.getFullYear() === calendarYear;
    
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
        projects: projectsOnDate,
        isToday: isCurrentMonth && i === today.getDate()
      });
    }
    
    return { days, firstDay, daysInMonth };
  }, [calendarMonth, calendarYear, projects]);

  const projectsStartingThisMonth = useMemo(() => {
    return projects.filter(p => p.startMonth === monthIndex);
  }, [projects, monthIndex]);

  const selectedDayData = useMemo(() => {
    if (selectedDay === null) return null;
    return monthData.days.find(d => d.day === selectedDay);
  }, [selectedDay, monthData]);

  if (!isOpen) return null;

  const bgColor = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-300';
  const thaiYear = calendarYear + 543;

  const weekDays = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];
  
  const formatThaiDate = (date: Date) => {
    const thaiMonths = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 
                        'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    const thaiDays = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
    return `${thaiDays[date.getDay()]}ที่ ${date.getDate()} ${thaiMonths[date.getMonth()]} ${date.getFullYear() + 543}`;
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className={`${bgColor} ${textColor} rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] overflow-hidden flex flex-col`}>
            {/* Header */}
            <div className={`flex items-center justify-between p-6 border-b ${borderColor}`}>
              <div className="flex items-center gap-3">
                <Calendar size={28} className="text-blue-600" />
                <div>
                  <h2 className="text-2xl font-bold">
                    ปฏิทิน{THAI_MONTHS[monthIndex]} {thaiYear}
                  </h2>
                  <p className="text-sm opacity-75 mt-1">
                    {projectsStartingThisMonth.length} โครงการ | งบประมาณ {projectsStartingThisMonth.reduce((sum, p) => sum + p.budget, 0).toLocaleString('th-TH')} บาท
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calendar Grid - Takes 2 columns on large screens */}
                <div className="lg:col-span-2">
                  <div className="mb-4">
                    <h3 className="text-lg font-bold mb-3">ปฏิทินรายวัน</h3>
                    {/* Week days header */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {weekDays.map((day, idx) => (
                        <div 
                          key={day} 
                          className={`text-center font-bold text-sm py-2 ${
                            idx === 0 ? 'text-red-600 dark:text-red-400' : ''
                          } ${idx === 6 ? 'text-blue-600 dark:text-blue-400' : ''}`}
                        >
                          {day}
                        </div>
                      ))}
                    </div>
                    
                    {/* Calendar days */}
                    <div className="grid grid-cols-7 gap-1">
                      {/* Empty cells for days before month starts */}
                      {Array.from({ length: monthData.firstDay }).map((_, i) => (
                        <div key={`empty-${i}`} className="aspect-square" />
                      ))}
                      
                      {/* Calendar days */}
                      {monthData.days.map(({ day, hasEvent, projects: dayProjects, isToday }) => (
                        <button
                          key={day}
                          onClick={() => setSelectedDay(day)}
                          className={`aspect-square border ${borderColor} rounded-lg p-1 transition-all hover:shadow-lg ${
                            selectedDay === day
                              ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900'
                              : hasEvent 
                                ? 'bg-blue-100 dark:bg-blue-900/50 border-blue-500 hover:bg-blue-200 dark:hover:bg-blue-800' 
                                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                          } ${
                            isToday 
                              ? 'ring-2 ring-green-500 font-bold' 
                              : ''
                          }`}
                        >
                          <div className="flex flex-col h-full">
                            <div className={`text-xs sm:text-sm font-semibold ${
                              isToday ? 'text-green-600 dark:text-green-400' : ''
                            }`}>
                              {day}
                            </div>
                            {hasEvent && (
                              <div className="mt-auto space-y-0.5 overflow-hidden">
                                {dayProjects.slice(0, 2).map(p => (
                                  <div
                                    key={p.id}
                                    className={`${p.color} h-1 rounded-full`}
                                    title={p.name}
                                  />
                                ))}
                                {dayProjects.length > 2 && (
                                  <div className="text-[8px] text-center opacity-75">
                                    +{dayProjects.length - 2}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="mt-4 flex flex-wrap gap-4 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-green-500 rounded"></div>
                      <span>วันนี้</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-100 dark:bg-blue-900 border border-blue-500 rounded"></div>
                      <span>มีกิจกรรม</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 ring-2 ring-blue-500 rounded"></div>
                      <span>เลือกอยู่</span>
                    </div>
                  </div>
                </div>

                {/* Selected Day Details - Takes 1 column on large screens */}
                <div className="lg:col-span-1">
                  <div className={`sticky top-0 border ${borderColor} rounded-lg p-4`}>
                    {selectedDayData ? (
                      <>
                        <h3 className="text-lg font-bold mb-3">
                          {formatThaiDate(selectedDayData.date)}
                        </h3>
                        {selectedDayData.projects.length > 0 ? (
                          <div className="space-y-3 max-h-96 overflow-y-auto">
                            {selectedDayData.projects.map(project => (
                              <div
                                key={project.id}
                                className={`border ${borderColor} rounded-lg p-3 hover:shadow-md transition-shadow`}
                              >
                                <div className="flex items-start gap-2 mb-2">
                                  <div className={`${project.color} w-3 h-3 rounded-full flex-shrink-0 mt-1`} />
                                  <div className="flex-1">
                                    <div className="font-semibold text-sm">{project.name}</div>
                                    <div className="text-xs opacity-75">{project.group}</div>
                                  </div>
                                </div>
                                <div className="text-xs space-y-1 ml-5">
                                  <div className="flex items-center justify-between">
                                    <span className="opacity-75">งบประมาณ:</span>
                                    <span className="font-medium">{project.budget.toLocaleString('th-TH')} บาท</span>
                                  </div>
                                  {project.meetingStartDate && project.meetingEndDate && (
                                    <div className="flex items-center justify-between">
                                      <span className="opacity-75">ระยะเวลา:</span>
                                      <span className="font-medium">
                                        {new Date(project.meetingStartDate).getDate()}-
                                        {new Date(project.meetingEndDate).getDate()} {THAI_MONTHS[monthIndex]}
                                      </span>
                                    </div>
                                  )}
                                  <div className="flex items-center justify-between">
                                    <span className="opacity-75">สถานะ:</span>
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                                      project.status === 'เสร็จสิ้น' ? 'bg-green-600 text-white' :
                                      project.status === 'กำลังดำเนินการ' ? 'bg-blue-600 text-white' :
                                      'bg-gray-600 text-white'
                                    }`}>
                                      {project.status}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 opacity-50 text-sm">
                            ไม่มีกิจกรรมในวันนี้
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-8 opacity-50 text-sm">
                        <Calendar className="mx-auto mb-3 opacity-30" size={48} />
                        <p>คลิกที่วันในปฏิทิน</p>
                        <p>เพื่อดูรายละเอียดกิจกรรม</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Projects Summary */}
              <div className={`border-t ${borderColor} pt-6 mt-6`}>
                <h3 className="text-xl font-bold mb-4">โครงการทั้งหมดในเดือนนี้</h3>
                {projectsStartingThisMonth.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {projectsStartingThisMonth.map(project => (
                      <div
                        key={project.id}
                        className={`flex items-start gap-3 p-4 border ${borderColor} rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors`}
                      >
                        <div className={`${project.color} w-4 h-4 rounded-full flex-shrink-0 mt-1`} />
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold truncate">{project.name}</div>
                          <div className="text-sm opacity-75 truncate">{project.group}</div>
                          <div className="text-sm mt-1 flex items-center justify-between">
                            <span>งบประมาณ: {project.budget.toLocaleString('th-TH')} บาท</span>
                          </div>
                          {project.meetingStartDate && project.meetingEndDate && (
                            <div className="text-xs mt-1 opacity-60">
                              ประชุม: {new Date(project.meetingStartDate).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })} - 
                              {new Date(project.meetingEndDate).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}
                            </div>
                          )}
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs flex-shrink-0 ${
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
            <div className={`border-t ${borderColor} p-4 flex justify-between items-center`}>
              <div className="text-sm opacity-75">
                คลิกที่วันในปฏิทินเพื่อดูรายละเอียดกิจกรรม
              </div>
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
