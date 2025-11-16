import { User, Course, Assessment, AttendanceSummary, Student, Faculty, AttendanceRecord, MarkSheet } from '../types';
import * as mock from './mockData';

// Simulate async operations by adding a random delay
// Also, deep copy the data to prevent components from mutating the mock data store directly
const simulateDelay = <T>(data: T): Promise<T> =>
    new Promise(resolve => setTimeout(() => resolve(JSON.parse(JSON.stringify(data))), 200 + Math.random() * 300));

// --- AUTH ---

export const login = (email: string, password: string): Promise<{ token: string, user: User }> => {
    const user = mock.users.find(u => u.email === email);
    if (user) {
        // Mock password check is always true for simplicity
        const token = `mock-token-for-${user.id}-${user.role}`;
        return simulateDelay({ token, user });
    }
    // Using Promise.reject to simulate a failed API call
    return new Promise((_, reject) => setTimeout(() => reject(new Error('Invalid email or password.')), 300));
};

export const logout = (): Promise<void> => {
    return simulateDelay(undefined);
};

export const getMe = (): Promise<User> => {
    const token = sessionStorage.getItem('token');
    if (token && token.startsWith('mock-token-for-')) {
        const parts = token.split('-');
        const userId = parseInt(parts[3], 10);
        const user = mock.users.find(u => u.id === userId);
        if (user) {
            return simulateDelay(user);
        }
    }
    return Promise.reject(new Error("Not authenticated"));
};

// --- READ (GET) ---

export const getStudents = (): Promise<Student[]> => simulateDelay(mock.getStudents());
export const getStudentsByCourse = (courseId: string): Promise<Student[]> => simulateDelay(mock.getStudentsByCourse(courseId));
export const getFaculty = (): Promise<Faculty[]> => simulateDelay(mock.faculty);
export const getCourses = (): Promise<Course[]> => simulateDelay(mock.courses);
export const getCoursesForStudent = (studentId: string): Promise<Course[]> => simulateDelay(mock.getCoursesForStudent(studentId));
export const getCoursesForFaculty = (facultyId: number): Promise<Course[]> => simulateDelay(mock.getCoursesForFaculty(facultyId));
export const getCoursesByDepartment = (department: string): Promise<Course[]> => simulateDelay(mock.getCoursesByDepartment(department));
export const getDashboardKpis = () => simulateDelay(mock.getDashboardKpis());
export const getAdminUsers = (): Promise<User[]> => simulateDelay(mock.users);
export const getAnalyticsData = () => simulateDelay(mock.getAnalyticsData());
export const getAssessments = (courseId: string): Promise<Assessment[]> => simulateDelay(mock.getAssessmentsByCourse(courseId));
export const getAttendanceSummary = (courseId: string): Promise<AttendanceSummary[]> => simulateDelay(mock.getAttendanceSummaryByCourse(courseId));
export const getDailyAttendance = (courseId: string, studentId: string): Promise<AttendanceRecord[]> => simulateDelay(mock.getDailyAttendance(courseId, studentId));
export const getDailyAttendanceForCourse = (courseId: string, year: number, month: number): Promise<any> => simulateDelay(mock.getDailyAttendanceForCourse(courseId, year, month));
export const getSemestersForStudent = (studentId: string): Promise<string[]> => simulateDelay(mock.getSemestersForStudent(studentId));
export const getMarkSheet = (studentId: string, semester: string): Promise<MarkSheet> => simulateDelay(mock.generateMarkSheetData(studentId, semester));

// --- WRITE (POST, PUT, PATCH, DELETE) ---

export const updateAssessmentScore = (data: { studentId: string; assessmentId: number; score: number | null }): Promise<{success: boolean}> => {
    try {
        const result = mock.updateAssessmentScore(data);
        if (result.success) {
            return simulateDelay({ success: true });
        } else {
             return Promise.reject(new Error("Assessment or student score not found"));
        }
    } catch (e: any) {
        return Promise.reject(new Error(e.message));
    }
};

export const updateAttendance = (courseId: string, studentId: string, date: string, status: 'Present' | 'Absent' | 'Late' | 'Excused'): Promise<{success: boolean}> => {
    return simulateDelay(mock.updateAttendance(courseId, studentId, date, status));
};

export const addCourse = (courseData: Omit<Course, 'id'>): Promise<Course> => {
    try {
        return simulateDelay(mock.addCourse(courseData));
    } catch (e: any) {
        return Promise.reject(new Error(e.message));
    }
};

export const addAssessment = (courseId: string, assessmentData: { title: string, type: string, maxScore: number }): Promise<Assessment> => {
    try {
        return simulateDelay(mock.addAssessment(courseId, assessmentData));
    } catch (e: any) {
        return Promise.reject(new Error(e.message));
    }
};

export const removeCourse = (courseId: string): Promise<{ success: boolean }> => {
    return simulateDelay(mock.removeCourse(courseId));
};

export const addFaculty = (facultyData: Omit<Faculty, 'id' | 'avatar'>): Promise<Faculty> => {
    try {
        return simulateDelay(mock.addFaculty(facultyData));
    } catch(e: any) {
        return Promise.reject(new Error(e.message));
    }
};

export const removeFaculty = (facultyId: number): Promise<{ success: boolean }> => {
    return simulateDelay(mock.removeFaculty(facultyId));
};
