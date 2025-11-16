export interface Student {
  id: string; // roll_no
  name: string;
  email: string;
  department: string;
  cgpa: number;
  enrollmentDate: string;
  avatar: string;
}

export interface Faculty {
  id: number; // user_id
  name: string;
  email: string;
  department: string;
  title: string;
  office: string;
  avatar: string;
}

export interface Course {
  id: string; // course_id
  title: string;
  code: string;
  department: string;
  credits: number;
  instructor: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'Faculty' | 'Student';
  lastLogin: string;
  status: 'Active' | 'Inactive';
  studentId?: string; // e.g., 'S001'
  facultyId?: number; // e.g., 2
}

export interface AttendanceRecord {
    studentId: string;
    studentName: string;
    date: string;
    status: 'Present' | 'Absent' | 'Late' | 'Excused';
}

export interface AttendanceSummary {
  studentId: string;
  studentName:string;
  attendedClasses: number;
  totalClassesHeld: number;
}

export interface AssessmentScore {
    studentId: string;
    studentName: string;
    score: number | null;
}

export interface Assessment {
    id: number;
    title: string;
    type: string;
    maxScore: number;
    scores: AssessmentScore[];
    semester?: string;
}

export interface Grade {
    letter: 'A' | 'B' | 'C' | 'D' | 'F';
    points: number;
}

export interface MarkSheetCourse {
    code: string;
    title: string;
    credits: number;
    score: number;
    maxScore: number;
    grade: Grade;
}

export interface MarkSheet {
    student: Student;
    semester: string;
    courses: MarkSheetCourse[];
    sgpa: number;
    cgpa: number;
}