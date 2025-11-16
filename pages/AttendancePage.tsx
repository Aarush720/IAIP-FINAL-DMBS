import React, { useState, useEffect, useCallback } from 'react';
import * as api from '../services/api';
import { Course, Student } from '../types';
import { useAuth } from '../contexts/AuthContext';

const SEMESTER_MONTH_DURATION = 4;

type AttendanceStatus = 'Present' | 'Late' | 'Absent' | 'Excused';
const STATUS_CYCLE: AttendanceStatus[] = ['Present', 'Late', 'Absent', 'Excused'];

// --- UI Components --- //

const MonthNavigator: React.FC<{
    currentDate: Date;
    onMonthChange: (offset: number) => void;
}> = ({ currentDate, onMonthChange }) => {
    const today = new Date();
    const semesterStartDate = new Date(today.getFullYear(), today.getMonth() - (SEMESTER_MONTH_DURATION - 1), 1);
    
    const canGoPrevious = currentDate.getFullYear() > semesterStartDate.getFullYear() || 
                          (currentDate.getFullYear() === semesterStartDate.getFullYear() && currentDate.getMonth() > semesterStartDate.getMonth());
    
    const canGoNext = currentDate.getFullYear() < today.getFullYear() ||
                    (currentDate.getFullYear() === today.getFullYear() && currentDate.getMonth() < today.getMonth());

    return (
        <div className="flex justify-between items-center mb-4">
            <button onClick={() => onMonthChange(-1)} disabled={!canGoPrevious} className="bg-stone-200 dark:bg-stone-700 px-4 py-2 rounded-md disabled:opacity-50">
                &lt; Prev
            </button>
            <h2 className="text-xl font-bold font-heading">
                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h2>
            <button onClick={() => onMonthChange(1)} disabled={!canGoNext} className="bg-stone-200 dark:bg-stone-700 px-4 py-2 rounded-md disabled:opacity-50">
                Next &gt;
            </button>
        </div>
    );
};

const AttendanceLegend: React.FC = () => (
    <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-4 gap-y-2 text-sm text-stone-600 dark:text-stone-400 mb-4">
        <span className="font-bold">Legend:</span>
        <span className="flex items-center gap-1.5"><span className="w-4 h-4 rounded-full bg-green-200 dark:bg-green-800 border border-green-400 dark:border-green-600"></span><span>Present (P)</span></span>
        <span className="flex items-center gap-1.5"><span className="w-4 h-4 rounded-full bg-yellow-200 dark:bg-yellow-800 border border-yellow-400 dark:border-yellow-600"></span><span>Late (L)</span></span>
        <span className="flex items-center gap-1.5"><span className="w-4 h-4 rounded-full bg-red-200 dark:bg-red-800 border border-red-400 dark:border-red-600"></span><span>Absent (A)</span></span>
        <span className="flex items-center gap-1.5"><span className="w-4 h-4 rounded-full bg-blue-200 dark:bg-blue-800 border border-blue-400 dark:border-blue-600"></span><span>Excused (E)</span></span>
    </div>
);

const AttendanceCalendarGrid: React.FC<{
    students: Student[];
    attendance: any;
    currentDate: Date;
    isEditable: boolean;
    onStatusChange: (studentId: string, date: string) => void;
}> = ({ students, attendance, currentDate, isEditable, onStatusChange }) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const getStatusStyles = (status?: AttendanceStatus) => {
        switch(status) {
            case 'Present': return 'bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200';
            case 'Late': return 'bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200';
            case 'Absent': return 'bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200';
            case 'Excused': return 'bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200';
            default: return isEditable ? 'bg-stone-100 dark:bg-stone-700 hover:bg-stone-200 dark:hover:bg-stone-600' : 'bg-stone-100 dark:bg-stone-700';
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full text-center text-sm">
                <thead className="sticky top-0 bg-white dark:bg-stone-800">
                    <tr>
                        <th className="p-2 text-left sticky left-0 z-10 bg-white dark:bg-stone-800">Student</th>
                        {[...Array(daysInMonth).keys()].map(i => <th key={i} className="p-2 w-10">{i + 1}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {students.map(student => (
                        <tr key={student.id} className="border-t border-stone-200 dark:border-stone-700">
                            <td className="p-2 text-left whitespace-nowrap sticky left-0 z-10 bg-white dark:bg-stone-800">{student.name}</td>
                            {[...Array(daysInMonth).keys()].map(i => {
                                const day = i + 1;
                                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                const dayOfWeek = new Date(year, month, day).getDay();
                                const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                                const status = attendance[student.id]?.[dateStr];

                                if (isWeekend) {
                                    return <td key={day} className="p-0 bg-stone-50 dark:bg-stone-800/50"></td>;
                                }

                                return (
                                    <td key={day} className="p-0">
                                        <button 
                                            onClick={() => onStatusChange(student.id, dateStr)} 
                                            disabled={!isEditable}
                                            className={`w-8 h-8 rounded-full transition-colors ${getStatusStyles(status)} disabled:cursor-default`}
                                        >
                                            {status?.charAt(0)}
                                        </button>
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// --- Main Page Component --- //

const AttendancePage: React.FC = () => {
    const { user } = useAuth();
    const [isUpdateMode, setIsUpdateMode] = useState(false);
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<string>('');
    const [students, setStudents] = useState<Student[]>([]);
    const [attendance, setAttendance] = useState<any>({});
    const [currentDate, setCurrentDate] = useState(new Date());
    const [loading, setLoading] = useState(false);

    const isFacultyOrAdmin = user?.role === 'Faculty' || user?.role === 'Admin';
    const isEditable = isFacultyOrAdmin && isUpdateMode;

    useEffect(() => {
        api.getCourses().then(data => {
            setCourses(data);
            if (data.length > 0) setSelectedCourse(data[0].id);
        });
    }, []);

    useEffect(() => {
        if (!selectedCourse) return;

        setLoading(true);
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        Promise.all([
            api.getStudentsByCourse(selectedCourse),
            api.getDailyAttendanceForCourse(selectedCourse, year, month)
        ]).then(([studentData, attendanceData]) => {
            if (user?.role === 'Student' && user.studentId) {
                setStudents(studentData.filter(s => s.id === user.studentId));
            } else {
                setStudents(studentData);
            }
            setAttendance(attendanceData);
        }).finally(() => setLoading(false));

    }, [selectedCourse, currentDate, user]);

    const handleMonthChange = (offset: number) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev.getFullYear(), prev.getMonth() + offset, 1);
            return newDate;
        });
    };

    const handleStatusChange = useCallback((studentId: string, date: string) => {
        if (!isEditable) return;

        const currentStatus = attendance[studentId]?.[date];
        const currentIndex = STATUS_CYCLE.indexOf(currentStatus);
        const nextStatus = STATUS_CYCLE[(currentIndex + 1) % STATUS_CYCLE.length];

        // Optimistic UI update
        const newAttendance = JSON.parse(JSON.stringify(attendance));
        if (!newAttendance[studentId]) newAttendance[studentId] = {};
        newAttendance[studentId][date] = nextStatus;
        setAttendance(newAttendance);

        // API call
        api.updateAttendance(selectedCourse, studentId, date, nextStatus)
            .catch(() => {
                alert("Failed to save attendance. Please refresh and try again.");
                // TODO: Revert UI state on failure
            });
    }, [attendance, selectedCourse, isEditable]);

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <h1 className="text-3xl font-bold font-heading">Attendance</h1>
                {isFacultyOrAdmin && (
                    <button onClick={() => setIsUpdateMode(!isUpdateMode)} className="bg-[#CF5256] text-white font-bold py-2 px-4 rounded-md transition-all duration-300 hover:bg-rose-700 w-full sm:w-auto">
                        {isUpdateMode ? 'Switch to View-Only' : 'Update Attendance'}
                    </button>
                )}
            </div>

            <div className="space-y-6">
                <div className="bg-white dark:bg-stone-800/50 p-6 rounded-lg border border-stone-200 dark:border-stone-700/50">
                    <label htmlFor="course-select" className="block text-sm font-medium text-stone-700 dark:text-stone-300">Select Course</label>
                    <select id="course-select" value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)} className="mt-1 block w-full md:w-1/2 bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-md py-2 px-3 focus:outline-none focus:ring-[#CF5256] focus:border-[#CF5256]">
                        {courses.map(c => <option key={c.id} value={c.id}>{c.code} - {c.title}</option>)}
                    </select>
                </div>
                
                <div className="bg-white dark:bg-stone-800/50 p-6 rounded-lg border border-stone-200 dark:border-stone-700/50">
                    <MonthNavigator currentDate={currentDate} onMonthChange={handleMonthChange} />
                    <AttendanceLegend />
                    {loading ? (
                        <div className="text-center p-8">Loading attendance...</div>
                    ) : selectedCourse && students.length > 0 ? (
                        <AttendanceCalendarGrid
                            students={students}
                            attendance={attendance}
                            currentDate={currentDate}
                            isEditable={isEditable}
                            onStatusChange={handleStatusChange}
                        />
                    ) : (
                        <div className="text-center p-8">No students enrolled in this course or no attendance data available.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AttendancePage;
