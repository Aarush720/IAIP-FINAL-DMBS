import React, { useState, useEffect } from 'react';
import * as api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { MarkSheet, Student } from '../types';

const MarkSheetPage: React.FC = () => {
    const { user } = useAuth();
    const [students, setStudents] = useState<Student[]>([]);
    const [selectedStudentId, setSelectedStudentId] = useState<string>('');
    const [semesters, setSemesters] = useState<string[]>([]);
    const [selectedSemester, setSelectedSemester] = useState<string>('');
    const [markSheet, setMarkSheet] = useState<MarkSheet | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const isStudent = user?.role === 'Student';
    const isFacultyOrAdmin = user?.role === 'Faculty' || user?.role === 'Admin';

    // Initial data loading
    useEffect(() => {
        if (isFacultyOrAdmin) {
            api.getStudents().then(setStudents).catch(() => setError('Failed to load students.'));
        } else if (isStudent && user.studentId) {
            setSelectedStudentId(user.studentId);
        }
    }, [user, isStudent, isFacultyOrAdmin]);

    // Fetch semesters when a student is selected
    useEffect(() => {
        if (selectedStudentId) {
            setLoading(true);
            setSemesters([]);
            setSelectedSemester('');
            setMarkSheet(null);
            api.getSemestersForStudent(selectedStudentId)
                .then(data => {
                    setSemesters(data);
                    if (data.length > 0) {
                        setSelectedSemester(data[0]);
                    }
                })
                .catch(() => setError('Failed to load semesters.'))
                .finally(() => setLoading(false));
        }
    }, [selectedStudentId]);

    // Fetch mark sheet when semester is selected
    useEffect(() => {
        if (selectedStudentId && selectedSemester) {
            setLoading(true);
            setError('');
            setMarkSheet(null);
            api.getMarkSheet(selectedStudentId, selectedSemester)
                .then(setMarkSheet)
                .catch(() => setError('Failed to generate mark sheet.'))
                .finally(() => setLoading(false));
        }
    }, [selectedStudentId, selectedSemester]);
    
    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <h1 className="text-3xl font-bold font-heading">Mark Sheet</h1>
            </div>

            {/* --- Controls --- */}
            <div className="bg-white dark:bg-stone-800/50 p-6 rounded-lg border border-stone-200 dark:border-stone-700/50 flex flex-col md:flex-row gap-4 print:hidden">
                {isFacultyOrAdmin && (
                     <div className="flex-1">
                        <label htmlFor="student-select" className="block text-sm font-medium">Select Student</label>
                        <select id="student-select" value={selectedStudentId} onChange={e => setSelectedStudentId(e.target.value)} className="mt-1 w-full bg-stone-100 dark:bg-stone-800 rounded p-2 border border-stone-300 dark:border-stone-600">
                            <option value="" disabled>-- Select a student --</option>
                            {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.id})</option>)}
                        </select>
                    </div>
                )}
                 <div className="flex-1">
                    <label htmlFor="semester-select" className="block text-sm font-medium">Select Semester</label>
                    <select id="semester-select" value={selectedSemester} onChange={e => setSelectedSemester(e.target.value)} disabled={!selectedStudentId || semesters.length === 0} className="mt-1 w-full bg-stone-100 dark:bg-stone-800 rounded p-2 border border-stone-300 dark:border-stone-600">
                         {semesters.length > 0 ? (
                            semesters.map(s => <option key={s} value={s}>{s}</option>)
                        ) : (
                            <option>No semesters available</option>
                        )}
                    </select>
                </div>
            </div>

            {/* --- Mark Sheet Display --- */}
            {loading && <p className="text-center">Loading...</p>}
            {error && <p className="text-red-500 text-center">{error}</p>}
            {markSheet && (
                <div className="bg-white dark:bg-stone-800/50 p-8 rounded-lg border border-stone-200 dark:border-stone-700/50 printable-area dark:print:bg-white dark:print:text-black">
                     <div className="text-center mb-8 border-b-2 border-black pb-4">
                        <h2 className="text-3xl font-bold font-heading">University Mark Sheet</h2>
                        <p className="text-lg">{markSheet.semester}</p>
                    </div>
                     <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
                        <div><strong>Student:</strong> {markSheet.student.name}</div>
                        <div><strong>Roll No:</strong> {markSheet.student.id}</div>
                        <div><strong>Department:</strong> {markSheet.student.department}</div>
                        <div><strong>Email:</strong> {markSheet.student.email}</div>
                    </div>

                    <table className="min-w-full divide-y divide-stone-300 dark:divide-stone-600">
                        <thead className="bg-stone-100 dark:bg-stone-800">
                            <tr>
                                <th className="px-4 py-2 text-left">Course Code</th>
                                <th className="px-4 py-2 text-left">Course Title</th>
                                <th className="px-4 py-2 text-center">Credits</th>
                                <th className="px-4 py-2 text-center">Score</th>
                                <th className="px-4 py-2 text-center">Grade</th>
                                <th className="px-4 py-2 text-center">Grade Points</th>
                            </tr>
                        </thead>
                        <tbody>
                            {markSheet.courses.map(course => (
                                <tr key={course.code} className="border-b border-stone-200 dark:border-stone-700">
                                    <td className="px-4 py-2">{course.code}</td>
                                    <td className="px-4 py-2 font-medium">{course.title}</td>
                                    <td className="px-4 py-2 text-center">{course.credits}</td>
                                    <td className="px-4 py-2 text-center">{course.score} / {course.maxScore}</td>
                                    <td className="px-4 py-2 text-center font-bold">{course.grade.letter}</td>
                                    <td className="px-4 py-2 text-center">{course.grade.points}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="mt-8 flex justify-end">
                        <div className="w-full md:w-1/2 lg:w-1/3 space-y-2 text-lg">
                            <div className="flex justify-between font-bold bg-stone-100 dark:bg-stone-800 p-3 rounded">
                                <span>SGPA:</span>
                                <span>{markSheet.sgpa.toFixed(2)}</span>
                            </div>
                             <div className="flex justify-between font-bold bg-stone-100 dark:bg-stone-800 p-3 rounded">
                                <span>Overall CGPA:</span>
                                <span>{markSheet.cgpa.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {!loading && !markSheet && selectedStudentId && semesters.length > 0 && <p className="text-center p-8">Select a semester to view the mark sheet.</p>}
            {!loading && !markSheet && selectedStudentId && semesters.length === 0 && <p className="text-center p-8">No mark sheet data available for this student.</p>}
        </div>
    );
};

export default MarkSheetPage;
