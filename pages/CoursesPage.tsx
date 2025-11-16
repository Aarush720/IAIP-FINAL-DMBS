import React, { useState, useEffect, FormEvent, useCallback } from 'react';
import { Course, Faculty } from '../types';
import * as api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

type NewCourseState = { title: string; code: string; department: string; credits: number; instructor: string; };

const AddCourseModal: React.FC<{
    newCourse: NewCourseState;
    setNewCourse: React.Dispatch<React.SetStateAction<NewCourseState>>;
    onSubmit: (e: FormEvent) => Promise<void>;
    onClose: () => void;
    faculty: Faculty[];
}> = ({ newCourse, setNewCourse, onSubmit, onClose, faculty }) => {
    return (
         <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-stone-100 dark:bg-[#303030] p-8 rounded-lg w-full max-w-md border border-stone-200 dark:border-stone-700">
                <h2 className="text-2xl font-bold mb-6">Add New Course</h2>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-stone-700 dark:text-stone-300">Title</label>
                        <input type="text" id="title" value={newCourse.title} onChange={e => setNewCourse({...newCourse, title: e.target.value})} className="mt-1 w-full bg-stone-200 dark:bg-stone-800 border-stone-300 dark:border-stone-700 rounded-md p-2" required />
                    </div>
                    <div>
                        <label htmlFor="code" className="block text-sm font-medium text-stone-700 dark:text-stone-300">Code</label>
                        <input type="text" id="code" value={newCourse.code} onChange={e => setNewCourse({...newCourse, code: e.target.value})} className="mt-1 w-full bg-stone-200 dark:bg-stone-800 border-stone-300 dark:border-stone-700 rounded-md p-2" required />
                    </div>
                    <div>
                        <label htmlFor="department" className="block text-sm font-medium text-stone-700 dark:text-stone-300">Department</label>
                        <input type="text" id="department" value={newCourse.department} onChange={e => setNewCourse({...newCourse, department: e.target.value})} className="mt-1 w-full bg-stone-200 dark:bg-stone-800 border-stone-300 dark:border-stone-700 rounded-md p-2" required />
                    </div>
                     <div>
                        <label htmlFor="instructor" className="block text-sm font-medium text-stone-700 dark:text-stone-300">Instructor</label>
                        <select
                            id="instructor"
                            value={newCourse.instructor}
                            onChange={e => setNewCourse({...newCourse, instructor: e.target.value})}
                            className="mt-1 w-full bg-stone-200 dark:bg-stone-800 border-stone-300 dark:border-stone-700 rounded-md p-2"
                            required
                        >
                            <option value="" disabled>Select an instructor</option>
                            {faculty.map(f => (
                                <option key={f.id} value={f.name}>{f.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="credits" className="block text-sm font-medium text-stone-700 dark:text-stone-300">Credits</label>
                        <input type="number" id="credits" value={newCourse.credits} onChange={e => setNewCourse({...newCourse, credits: parseInt(e.target.value) || 0})} className="mt-1 w-full bg-stone-200 dark:bg-stone-800 border-stone-300 dark:border-stone-700 rounded-md p-2" required min="1" />
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                         <button type="button" onClick={onClose} className="bg-stone-300 dark:bg-stone-700 text-stone-800 dark:text-white py-2 px-4 rounded-md hover:bg-stone-400 dark:hover:bg-stone-600">Cancel</button>
                         <button type="submit" className="bg-[#CF5256] text-white font-bold py-2 px-4 rounded-md transition-all duration-300 hover:bg-rose-700">Add Course</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const CoursesPage: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [faculty, setFaculty] = useState<Faculty[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const { user } = useAuth();
    const [newCourse, setNewCourse] = useState<NewCourseState>({ title: '', code: '', department: '', credits: 3, instructor: '' });

    const fetchCoursesAndFaculty = useCallback(async () => {
        if (!user) return;
        try {
            setLoading(true);
            let coursesData: Course[] = [];
            if (user.role === 'Student' && user.studentId) {
                coursesData = await api.getCoursesForStudent(user.studentId);
            } else if (user.role === 'Faculty' && user.facultyId) {
                coursesData = await api.getCoursesForFaculty(user.facultyId);
            } else { // Admin or fallback
                coursesData = await api.getCourses();
            }
            
            let facultyData: Faculty[] = [];
            if (user.role === 'Admin') {
                facultyData = await api.getFaculty();
                if (facultyData.length > 0) {
                    setNewCourse(prev => ({ ...prev, instructor: prev.instructor || facultyData[0].name }));
                }
            }
            
            setCourses(coursesData);
            setFaculty(facultyData);
        } catch (err) {
            setError('Failed to load page data.');
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchCoursesAndFaculty();
    }, [fetchCoursesAndFaculty]);

    const handleAddCourse = async (e: FormEvent) => {
        e.preventDefault();
        if (!newCourse.instructor) {
            alert('Please select an instructor.');
            return;
        }
        try {
            await api.addCourse(newCourse);
            setShowModal(false);
            setNewCourse({ title: '', code: '', department: '', credits: 3, instructor: faculty.length > 0 ? faculty[0].name : '' });
            fetchCoursesAndFaculty(); // Refetch courses to show the new one
        } catch (err) {
            alert((err as Error).message);
        }
    };

    const handleRemoveCourse = async (courseId: string) => {
        if (window.confirm('Are you sure you want to remove this course? This action cannot be undone.')) {
            try {
                await api.removeCourse(courseId);
                fetchCoursesAndFaculty(); // Refetch to update list
            } catch (err) {
                alert((err as Error).message);
            }
        }
    };
    
    if (loading) return <div>Loading courses...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold font-heading">
                    {user?.role === 'Student' ? 'My Courses' : user?.role === 'Faculty' ? 'My Taught Courses' : 'All Courses'}
                </h1>
                {user?.role === 'Admin' && (
                    <button 
                        onClick={() => setShowModal(true)}
                        className="bg-[#CF5256] text-white font-bold py-2 px-4 rounded-md transition-all duration-300 hover:bg-rose-700 hover:shadow-lg hover:shadow-[#CF5256]/40"
                    >
                        Add Course
                    </button>
                )}
            </div>

            <div className="overflow-x-auto bg-white dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700/50 rounded-lg">
                <table className="min-w-full divide-y divide-stone-200 dark:divide-stone-700">
                    <thead className="bg-stone-50 dark:bg-stone-800">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">Course Title</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">Code</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">Department</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">Instructor</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">Credits</th>
                            {user?.role === 'Admin' && <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-stone-800/50 divide-y divide-stone-200 dark:divide-stone-700">
                        {courses.map((course) => (
                            <tr key={course.id} className="hover:bg-stone-50 dark:hover:bg-stone-700/50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-stone-900 dark:text-[#FAF4F4]">{course.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-600 dark:text-stone-300">{course.code}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-600 dark:text-stone-300">{course.department}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-600 dark:text-stone-300">{course.instructor}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-stone-600 dark:text-stone-300">{course.credits}</td>
                                {user?.role === 'Admin' && (
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => handleRemoveCourse(course.id)}
                                            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                                        >
                                            Remove
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && <AddCourseModal 
                newCourse={newCourse}
                setNewCourse={setNewCourse}
                onSubmit={handleAddCourse}
                onClose={() => setShowModal(false)}
                faculty={faculty}
            />}
        </div>
    );
};

export default CoursesPage;
