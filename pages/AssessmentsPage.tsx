import React, { useState, useEffect, useMemo, FormEvent } from 'react';
import * as api from '../services/api';
import { Assessment, Course } from '../types';
import { useAuth } from '../contexts/AuthContext';


const AssessmentsPage: React.FC = () => {
    const { user } = useAuth();
    const [assessments, setAssessments] = useState<Assessment[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [newAssessment, setNewAssessment] = useState({ title: '', type: 'Quiz', maxScore: 100 });

    const isFacultyOrAdmin = user?.role === 'Faculty' || user?.role === 'Admin';
    
    const fetchAssessments = (courseId: string) => {
        setLoading(true);
        setError('');
        api.getAssessments(courseId)
            .then(data => {
                setAssessments(data);
            })
            .catch(() => setError(`Failed to load assessments for ${courseId}.`))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        api.getCourses()
            .then(data => {
                setCourses(data);
                if (data.length > 0) {
                    setSelectedCourse(data[0].id);
                }
            })
            .catch(() => setError("Failed to load courses."));
    }, []);

    useEffect(() => {
        if (selectedCourse) {
            fetchAssessments(selectedCourse);
        }
    }, [selectedCourse]);
    
    const handleScoreChange = (assessmentId: number, studentId: string, newScore: string) => {
        if (!isFacultyOrAdmin) return;

        const scoreVal = newScore === '' ? null : parseInt(newScore, 10);
        
        setAssessments(prevAssessments => 
            prevAssessments.map(a => 
                a.id === assessmentId 
                ? { ...a, scores: a.scores.map(s => s.studentId === studentId ? { ...s, score: scoreVal } : s) }
                : a
            )
        );

        api.updateAssessmentScore({ studentId, assessmentId, score: scoreVal })
            .catch(() => {
                setError("Failed to update score. Please try again.");
                // TODO: Revert UI on failure
            });
    };

    const handleAddAssessment = async (e: FormEvent) => {
        e.preventDefault();
        try {
            await api.addAssessment(selectedCourse, newAssessment);
            setShowModal(false);
            setNewAssessment({ title: '', type: 'Quiz', maxScore: 100 });
            fetchAssessments(selectedCourse);
        } catch (err) {
            alert((err as Error).message);
        }
    };

    const courseOptions = useMemo(() => courses.map(c => ({ value: c.id, label: `${c.code} - ${c.title}` })), [courses]);

    const AddAssessmentModal = () => (
         <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-stone-100 dark:bg-[#303030] p-8 rounded-lg w-full max-w-md border border-stone-200 dark:border-stone-700">
                <h2 className="text-2xl font-bold mb-6">Add New Assessment</h2>
                <form onSubmit={handleAddAssessment} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Title</label>
                        <input type="text" value={newAssessment.title} onChange={e => setNewAssessment({...newAssessment, title: e.target.value})} className="mt-1 w-full bg-stone-200 dark:bg-stone-800 border-stone-300 dark:border-stone-700 rounded-md p-2" required />
                    </div>
                     <div>
                        <label className="block text-sm font-medium">Type</label>
                        <select value={newAssessment.type} onChange={e => setNewAssessment({...newAssessment, type: e.target.value})} className="mt-1 w-full bg-stone-200 dark:bg-stone-800 border-stone-300 dark:border-stone-700 rounded-md p-2">
                            <option>Quiz</option>
                            <option>Exam</option>
                            <option>Project</option>
                            <option>Lab</option>
                            <option>Homework</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Max Score</label>
                        <input type="number" value={newAssessment.maxScore} onChange={e => setNewAssessment({...newAssessment, maxScore: Number(e.target.value)})} className="mt-1 w-full bg-stone-200 dark:bg-stone-800 border-stone-300 dark:border-stone-700 rounded-md p-2" required min="1" />
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                         <button type="button" onClick={() => setShowModal(false)} className="bg-stone-300 dark:bg-stone-700 text-stone-800 dark:text-white py-2 px-4 rounded-md hover:bg-stone-400 dark:hover:bg-stone-600">Cancel</button>
                         <button type="submit" className="bg-[#CF5256] text-white font-bold py-2 px-4 rounded-md transition-all duration-300 hover:bg-rose-700">Add Assessment</button>
                    </div>
                </form>
            </div>
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold font-heading">Assessments</h1>
                 {isFacultyOrAdmin && selectedCourse && (
                    <button onClick={() => setShowModal(true)} className="bg-[#CF5256] text-white font-bold py-2 px-4 rounded-md transition-all duration-300 hover:bg-rose-700 hover:shadow-lg hover:shadow-[#CF5256]/40">
                        Add Assessment
                    </button>
                )}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 bg-white dark:bg-stone-800/50 p-6 rounded-lg border border-stone-200 dark:border-stone-700/50 h-fit">
                    <h2 className="text-xl font-bold font-heading mb-4">Select Course</h2>
                     <form className="space-y-4">
                        <div>
                            <label htmlFor="course" className="block text-sm font-medium text-stone-700 dark:text-stone-300">Course</label>
                            <select 
                                id="course" 
                                value={selectedCourse}
                                onChange={e => setSelectedCourse(e.target.value)}
                                className="mt-1 block w-full bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-md py-2 px-3 focus:outline-none focus:ring-[#CF5256] focus:border-[#CF5256]"
                            >
                                {courseOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            </select>
                        </div>
                    </form>
                </div>
                
                <div className="lg:col-span-2 space-y-6">
                    {loading && <p>Loading assessments...</p>}
                    {error && <p className="text-red-500">{error}</p>}
                    {!loading && !error && assessments.map(assessment => (
                        <div key={assessment.id} className="bg-white dark:bg-stone-800/50 p-6 rounded-lg border border-stone-200 dark:border-stone-700/50">
                            <h3 className="text-lg font-bold">{assessment.title} <span className="text-sm font-normal text-stone-500 dark:text-stone-400">({assessment.type}) - Max Score: {assessment.maxScore}</span></h3>
                             <table className="min-w-full divide-y divide-stone-200 dark:divide-stone-700 mt-4">
                                <thead className="bg-white dark:bg-stone-800/50">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-stone-500 dark:text-stone-400 uppercase">Student</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-stone-500 dark:text-stone-400 uppercase">Score</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {assessment.scores.map(score => (
                                        <tr key={score.studentId}>
                                            <td className="px-4 py-2 text-sm text-stone-900 dark:text-[#FAF4F4]">{score.studentName}</td>
                                            <td className="px-4 py-2">
                                                <input 
                                                    type="number"
                                                    value={score.score ?? ''}
                                                    onChange={(e) => handleScoreChange(assessment.id, score.studentId, e.target.value)}
                                                    className="w-24 bg-stone-100 dark:bg-stone-900 border border-stone-300 dark:border-stone-600 rounded-md px-2 py-1 text-center focus:ring-1 focus:ring-[#CF5256] focus:outline-none disabled:bg-stone-200 dark:disabled:bg-stone-800 disabled:cursor-not-allowed"
                                                    placeholder="N/A"
                                                    max={assessment.maxScore}
                                                    min={0}
                                                    disabled={!isFacultyOrAdmin}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ))}
                    {!loading && !error && assessments.length === 0 && selectedCourse && (
                         <div className="bg-white dark:bg-stone-800/50 p-6 rounded-lg border border-stone-200 dark:border-stone-700/50">
                            <p>No assessments found for this course.</p>
                         </div>
                    )}
                </div>
            </div>
            {showModal && <AddAssessmentModal />}
        </div>
    );
};

export default AssessmentsPage;