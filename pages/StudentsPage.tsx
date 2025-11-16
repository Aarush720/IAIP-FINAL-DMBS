import React, { useState, useMemo, useEffect } from 'react';
import { Student } from '../types';
import * as api from '../services/api';

const StudentDetailPanel: React.FC<{ student: Student; onClose: () => void }> = ({ student, onClose }) => {
    return (
        <div className="fixed top-0 right-0 h-full w-full md:w-1/3 bg-stone-100 dark:bg-[#303030] shadow-2xl z-50 transform transition-transform duration-300 ease-in-out translate-x-0 border-l-2 border-stone-200 dark:border-stone-700 print:hidden">
             <div className="p-6 h-full flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold font-heading">Student Profile</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div className="flex-grow overflow-y-auto">
                    <div className="text-center mb-6">
                        <img src={student.avatar} alt={student.name} className="w-32 h-32 rounded-full mx-auto filter grayscale mb-4" />
                        <h3 className="text-xl font-bold">{student.name}</h3>
                        <p className="text-sm text-stone-500 dark:text-stone-400">{student.id}</p>
                    </div>
                    <div className="space-y-4">
                        <div><strong className="text-stone-500 dark:text-stone-400 w-28 inline-block">Email:</strong> {student.email}</div>
                        <div><strong className="text-stone-500 dark:text-stone-400 w-28 inline-block">Department:</strong> {student.department}</div>
                        <div><strong className="text-stone-500 dark:text-stone-400 w-28 inline-block">CGPA:</strong> <span className="text-[#CF5256] font-bold">{student.cgpa.toFixed(2)} / 10</span></div>
                        <div><strong className="text-stone-500 dark:text-stone-400 w-28 inline-block">Enrolled:</strong> {new Date(student.enrollmentDate).toLocaleDateString()}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};


const StudentsPage: React.FC = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

    useEffect(() => {
        api.getStudents()
            .then(data => {
                setStudents(data);
                setLoading(false);
            })
            .catch(err => {
                setError('Failed to fetch students.');
                setLoading(false);
                console.error(err);
            });
    }, []);

    const filteredStudents = useMemo(() => {
        return students.filter(student =>
            student.name.toLowerCase().includes(search.toLowerCase()) ||
            student.email.toLowerCase().includes(search.toLowerCase()) ||
            student.department.toLowerCase().includes(search.toLowerCase())
        );
    }, [search, students]);

    if (loading) return <div>Loading students...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold font-heading">Students</h1>
                <input
                    type="text"
                    placeholder="Search students..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-1/3 bg-stone-200 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-md px-4 py-2 focus:ring-2 focus:ring-[#CF5256] focus:outline-none"
                />
            </div>
            
            <div className="overflow-x-auto bg-white dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700/50 rounded-lg">
                <table className="min-w-full divide-y divide-stone-200 dark:divide-stone-700">
                    <thead className="bg-stone-50 dark:bg-stone-800">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">Department</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">CGPA</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">Email</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-stone-800/50 divide-y divide-stone-200 dark:divide-stone-700">
                        {filteredStudents.map((student) => (
                            <tr key={student.id} onClick={() => setSelectedStudent(student)} className="hover:bg-stone-50 dark:hover:bg-stone-700/50 cursor-pointer transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            <img className="h-10 w-10 rounded-full filter grayscale" src={student.avatar} alt={student.name} />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-stone-900 dark:text-[#FAF4F4]">{student.name}</div>
                                            <div className="text-sm text-stone-500 dark:text-stone-400">{student.id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-600 dark:text-stone-300">{student.department}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-stone-900 dark:text-[#FAF4F4]">{student.cgpa.toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-600 dark:text-stone-300">{student.email}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {selectedStudent && <StudentDetailPanel student={selectedStudent} onClose={() => setSelectedStudent(null)} />}
        </div>
    );
};

export default StudentsPage;