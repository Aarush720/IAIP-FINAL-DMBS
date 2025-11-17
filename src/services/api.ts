import {
  User, Course, Assessment, AttendanceSummary, Student,
  Faculty, AttendanceRecord, MarkSheet
} from '../types';
import * as mock from './mockData';

// Simulate async + deep clone to avoid accidental mutations
const delay = <T>(data: T) =>
  new Promise<T>(resolve => setTimeout(() => resolve(JSON.parse(JSON.stringify(data))), 150));

// Auth (kept for compatibility with your AuthContext)
export const login = (email: string, password: string) => {
  const user = mock.users.find(u => u.email === email);
  if (!user) return Promise.reject(new Error('Invalid email or password.'));
  const token = `mock-token-for-${user.id}-${user.role}`;
  return delay({ token, user });
};

export const logout = (): Promise<void> => delay(undefined as unknown as void);

export const getMe = (): Promise<User> => {
  const token = sessionStorage.getItem('token');
  if (!token || !token.startsWith('mock-token-for-')) return Promise.reject(new Error('Not authenticated'));
  const userId = Number(token.split('-')[3]);
  const user = mock.users.find(u => u.id === userId);
  if (!user) return Promise.reject(new Error('Not authenticated'));
  return delay(user);
};

// MarkSheet-related
export const getStudents = (): Promise<Student[]> => delay(mock.getStudents());
export const getStudentsByCourse = (courseId: string): Promise<Student[]> => delay(mock.getStudentsByCourse(courseId));
export const getFaculty = (): Promise<Faculty[]> => delay(mock.faculty);
export const getCourses = (): Promise<Course[]> => delay(mock.getCourses());
export const getCoursesForStudent = (studentId: string): Promise<Course[]> => delay(mock.getCoursesForStudent(studentId));
export const getCoursesForFaculty = (facultyId: number): Promise<Course[]> => delay(mock.getCoursesForFaculty(facultyId));
export const getCoursesByDepartment = (department: string): Promise<Course[]> => delay(mock.getCoursesByDepartment(department));
export const getDashboardKpis = () => delay(mock.getDashboardKpis());
export const getAdminUsers = (): Promise<User[]> => delay(mock.users);
export const getAnalyticsData = () => delay(mock.getAnalyticsData());
export const getAssessments = (courseId: string): Promise<Assessment[]> => delay(mock.getAssessmentsByCourse(courseId));
export const getAttendanceSummary = (courseId: string): Promise<AttendanceSummary[]> => delay(mock.getAttendanceSummaryByCourse(courseId));
export const getDailyAttendance = (courseId: string, studentId: string): Promise<AttendanceRecord[]> => delay(mock.getDailyAttendance(courseId, studentId));
export const getDailyAttendanceForCourse = (courseId: string, year: number, month: number) => delay(mock.getDailyAttendanceForCourse(courseId, year, month));
export const getSemestersForStudent = (studentId: string): Promise<string[]> => delay(mock.getSemestersForStudent(studentId));
export const getMarkSheet = (studentId: string, semester: string): Promise<MarkSheet> => delay(mock.generateMarkSheetData(studentId, semester));

export const updateAssessmentScore = (data: { studentId: string; assessmentId: number; score: number | null }) =>
  delay(mock.updateAssessmentScore(data));
export const updateAttendance = (courseId: string, studentId: string, date: string, status: 'Present' | 'Late' | 'Absent' | 'Excused') =>
  delay(mock.updateAttendance(courseId, studentId, date, status));
export const addCourse = (courseData: Omit<Course, 'id'>): Promise<Course> => delay(mock.addCourse(courseData));
export const addAssessment = (courseId: string, assessmentData: { title: string; type: string; maxScore: number }) =>
  delay(mock.addAssessment(courseId, assessmentData));
export const removeCourse = (courseId: string) => delay(mock.removeCourse(courseId));
export const addFaculty = (facultyData: Omit<Faculty, 'id' | 'avatar'>): Promise<Faculty> => delay(mock.addFaculty(facultyData));
export const removeFaculty = (facultyId: number) => delay(mock.removeFaculty(facultyId));
