import React, { useState, useEffect, FormEvent } from 'react';
import { Faculty } from '../types';
import * as api from '../services/api';

type NewFacultyState = { name: string; email: string; department: string; title: string; office: string; };

const AddFacultyModal: React.FC<{
    newFaculty: NewFacultyState;
    setNewFaculty: React.Dispatch<React.SetStateAction<NewFacultyState>>;
    onSubmit: (e: FormEvent) => Promise<void>;
    onClose: () => void;
}> = ({ newFaculty, setNewFaculty, onSubmit, onClose }) => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-stone-100 dark:bg-[#303030] p-8 rounded-lg w-full max-w-md border border-stone-200 dark:border-stone-700">
            <h2 className="text-2xl font-bold mb-6">Add New Faculty</h2>
            <form onSubmit={onSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium">Name</label>
                    <input id="name" type="text" value={newFaculty.name} onChange={e => setNewFaculty({ ...newFaculty, name: e.target.value })} className="mt-1 w-full bg-stone-200 dark:bg-stone-800 rounded-md p-2" required />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium">Email</label>
                    <input id="email" type="email" value={newFaculty.email} onChange={e => setNewFaculty({ ...newFaculty, email: e.target.value })} className="mt-1 w-full bg-stone-200 dark:bg-stone-800 rounded-md p-2" required />
                </div>
                <div>
                    <label htmlFor="department" className="block text-sm font-medium">Department</label>
                    <input id="department" type="text" value={newFaculty.department} onChange={e => setNewFaculty({ ...newFaculty, department: e.target.value })} className="mt-1 w-full bg-stone-200 dark:bg-stone-800 rounded-md p-2" required />
                </div>
                <div>
                    <label htmlFor="title" className="block text-sm font-medium">Title</label>
                    <input id="title" type="text" value={newFaculty.title} onChange={e => setNewFaculty({ ...newFaculty, title: e.target.value })} className="mt-1 w-full bg-stone-200 dark:bg-stone-800 rounded-md p-2" required />
                </div>
                <div>
                    <label htmlFor="office" className="block text-sm font-medium">Office</label>
                    <input id="office" type="text" value={newFaculty.office} onChange={e => setNewFaculty({ ...newFaculty, office: e.target.value })} className="mt-1 w-full bg-stone-200 dark:bg-stone-800 rounded-md p-2" required />
                </div>
                <div className="flex justify-end gap-4 pt-4">
                    <button type="button" onClick={onClose} className="bg-stone-300 dark:bg-stone-700 text-stone-800 dark:text-white py-2 px-4 rounded-md hover:bg-stone-400 dark:hover:bg-stone-600">Cancel</button>
                    <button type="submit" className="bg-[#CF5256] text-white font-bold py-2 px-4 rounded-md transition-all duration-300 hover:bg-rose-700">Add Faculty</button>
                </div>
            </form>
        </div>
    </div>
);

const FacultyPage: React.FC = () => {
    const [faculty, setFaculty] = useState<Faculty[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [newFaculty, setNewFaculty] = useState<NewFacultyState>({ name: '', email: '', department: '', title: '', office: '' });

    const fetchFaculty = () => {
        setLoading(true);
        api.getFaculty()
            .then(data => {
                setFaculty(data);
            })
            .catch(err => {
                setError('Failed to fetch faculty data.');
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchFaculty();
    }, []);

    const handleAddClick = () => {
        setNewFaculty({ name: '', email: '', department: '', title: '', office: '' });
        setShowModal(true);
    };

    const handleAddFaculty = async (e: FormEvent) => {
        e.preventDefault();
        try {
            await api.addFaculty(newFaculty);
            setShowModal(false);
            fetchFaculty();
        } catch (err) {
            alert((err as Error).message);
        }
    };
    
    const handleRemoveFaculty = async (facultyId: number) => {
        if (window.confirm('Are you sure you want to remove this faculty member? This will also remove their user account.')) {
            try {
                await api.removeFaculty(facultyId);
                fetchFaculty();
            } catch (err) {
                alert((err as Error).message);
            }
        }
    };
    
    if (loading) return <div>Loading faculty...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold font-heading">Faculty</h1>
                <button 
                    onClick={handleAddClick}
                    className="bg-[#CF5256] text-white font-bold py-2 px-4 rounded-md transition-all duration-300 hover:bg-rose-700 hover:shadow-lg hover:shadow-[#CF5256]/40"
                >
                    Add Faculty
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {faculty.map(facultyMember => (
                    <div key={facultyMember.id} className="bg-white dark:bg-stone-800/50 p-6 rounded-lg border border-stone-200 dark:border-stone-700/50 text-center flex flex-col justify-between">
                        <div>
                            <img src={facultyMember.avatar} alt={facultyMember.name} className="w-24 h-24 rounded-full mx-auto filter grayscale mb-4" />
                            <h3 className="text-lg font-bold text-stone-900 dark:text-[#FAF4F4]">{facultyMember.name}</h3>
                            <p className="text-sm text-[#CF5256]">{facultyMember.title}</p>
                            <p className="text-sm text-stone-500 dark:text-stone-400 mt-2">{facultyMember.department}</p>
                            <p className="text-xs text-stone-400 dark:text-stone-500">{facultyMember.email}</p>
                        </div>
                        <div className="mt-4">
                            <button
                                onClick={() => handleRemoveFaculty(facultyMember.id)}
                                className="text-xs text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-semibold"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && <AddFacultyModal
                newFaculty={newFaculty}
                setNewFaculty={setNewFaculty}
                onSubmit={handleAddFaculty}
                onClose={() => setShowModal(false)}
            />}
        </div>
    );
};

export default FacultyPage;