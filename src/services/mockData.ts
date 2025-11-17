import {
  Student, Faculty, Course, User, Assessment,
  AttendanceRecord, AttendanceSummary, Grade, MarkSheet, MarkSheetCourse
} from '../types';

// Seed users for login compatibility
export const users: User[] = [
  { id: 1, name: 'Admin User', email: 'admin@university.edu', role: 'Admin', lastLogin: new Date().toISOString(), status: 'Active' },
  { id: 2, name: 'Dr. Evelyn Reed', email: 'faculty@university.edu', role: 'Faculty', lastLogin: new Date().toISOString(), status: 'Active', facultyId: 1 },
  { id: 3, name: 'Alice Johnson', email: 'student@university.edu', role: 'Student', lastLogin: new Date().toISOString(), status: 'Active', studentId: 'S001' },
];

// Students
const studentsBase: Omit<Student, 'cgpa'>[] = [
  { id: 'S001', name: 'Alice Johnson', email: 'alice@university.edu', department: 'Computer Science', enrollmentDate: '2022-08-20', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice' },
  { id: 'S002', name: 'Bob Smith', email: 'bob@university.edu', department: 'Computer Science', enrollmentDate: '2022-08-20', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob' },
];

// Faculty
const facultyBase: Faculty[] = [
  { id: 1, name: 'Dr. Evelyn Reed', email: 'evelyn.reed@university.edu', department: 'Computer Science', role: 'Professor', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Evelyn' },
];

// Courses
export const courses: Course[] = [
  { id: 'CS101', title: 'Intro to Programming', code: 'CS101', department: 'Computer Science', credits: 3, instructor: 'Dr. Evelyn Reed' },
  { id: 'CS202', title: 'Data Structures', code: 'CS202', department: 'Computer Science', credits: 4, instructor: 'Dr. Evelyn Reed' },
];

// Assessments by course with semester tagging
const assessmentsByCourse: Record<string, Assessment[]> = {
  CS101: [
    { id: 1, title: 'Quiz 1', type: 'Quiz', maxScore: 20, semester: 'Spring 2024',
      scores: [{ studentId: 'S001', studentName: 'Alice Johnson', score: 16 }, { studentId: 'S002', studentName: 'Bob Smith', score: 14 }] },
    { id: 2, title: 'Midterm', type: 'Exam', maxScore: 100, semester: 'Spring 2024',
      scores: [{ studentId: 'S001', studentName: 'Alice Johnson', score: 82 }, { studentId: 'S002', studentName: 'Bob Smith', score: 76 }] },
  ],
  CS202: [
    { id: 3, title: 'Project', type: 'Project', maxScore: 50, semester: 'Spring 2024',
      scores: [{ studentId: 'S001', studentName: 'Alice Johnson', score: 42 }] },
  ],
};

const enrolled: Record<string, string[]> = {
  CS101: ['S001', 'S002'],
  CS202: ['S001'],
};

const dailyAttendance: AttendanceRecord[] = [
  { id: 1, date: '2024-01-10', courseId: 'CS101', studentId: 'S001', status: 'Present' },
  { id: 2, date: '2024-01-10', courseId: 'CS101', studentId: 'S002', status: 'Absent' },
  { id: 3, date: '2024-01-11', courseId: 'CS101', studentId: 'S001', status: 'Present' },
  { id: 4, date: '2024-01-11', courseId: 'CS101', studentId: 'S002', status: 'Present' },
  { id: 5, date: '2024-01-10', courseId: 'CS202', studentId: 'S001', status: 'Present' },
];

const attendanceSummary: AttendanceSummary[] = [
  { studentId: 'S001', courseId: 'CS101', totalClasses: 10, classesAttended: 8, classesMissed: 2 },
  { studentId: 'S002', courseId: 'CS101', totalClasses: 10, classesAttended: 6, classesMissed: 4 },
  { studentId: 'S001', courseId: 'CS202', totalClasses: 10, classesAttended: 9, classesMissed: 1 },
];

// Public API used by services/api

export const getStudents = (): Student[] =>
  studentsBase.map(s => ({ ...s, cgpa: 8 + Math.random() * 1.5 }));

export const getCoursesForStudent = (studentId: string): Course[] =>
  courses.filter(c => (enrolled[c.id] || []).includes(studentId));

export const getSemestersForStudent = (_studentId: string): string[] =>
  ['Spring 2024', 'Fall 2023'];

export const generateMarkSheetData = (studentId: string, semester: string): MarkSheet => {
  const student = studentsBase.find(s => s.id === studentId);
  if (!student) throw new Error('Student not found');

  const studentCourses = getCoursesForStudent(studentId);
  const mkCourses: MarkSheetCourse[] = studentCourses.map(c => {
    const asses = (assessmentsByCourse[c.id] || []).filter(a => a.semester === semester);
    const totals = asses.reduce((acc, a) => {
      const sc = a.scores.find(s => s.studentId === studentId)?.score ?? 0;
      return { score: acc.score + sc, max: acc.max + a.maxScore };
    }, { score: 0, max: 0 });
    const pct = totals.max ? (totals.score / totals.max) * 100 : 75;
    const grade = gradeFromPct(pct);
    return { code: c.code, title: c.title, credits: c.credits, score: totals.score, maxScore: totals.max, grade };
  });

  const totalCredits = mkCourses.reduce((t, m) => t + m.credits, 0) || 1;
  const sgpa = mkCourses.reduce((t, m) => t + m.grade.points * m.credits, 0) / totalCredits;
  const cgpa = Number((7.8 + Math.random() * 0.7).toFixed(2));

  return {
    student: { ...student, cgpa },
    semester,
    courses: mkCourses,
    sgpa: Number(sgpa.toFixed(2)),
    cgpa,
  };
};

export const addCourse = (course: Course) => {
  courses.push(course);
};

export const removeCourse = (courseId: string) => {
  const index = courses.findIndex(c => c.id === courseId);
  if (index !== -1) courses.splice(index, 1);
};

export const addFaculty = (faculty: Faculty) => {
  facultyBase.push(faculty);
};

export const removeFaculty = (facultyId: number) => {
  const index = facultyBase.findIndex(f => f.id === facultyId);
  if (index !== -1) facultyBase.splice(index, 1);
};

export const updateAttendance = (attendance: AttendanceRecord) => {
  const index = dailyAttendance.findIndex(a => a.id === attendance.id);
  if (index !== -1) dailyAttendance[index] = attendance;
};

export const updateAssessmentScore = (courseId: string, assessmentId: number, studentId: string, newScore: number) => {
  const assessment = (assessmentsByCourse[courseId] || []).find(a => a.id === assessmentId);
  if (assessment) {
    const scoreEntry = assessment.scores.find(s => s.studentId === studentId);
    if (scoreEntry) scoreEntry.score = newScore;
  }
};

export const getDashboardKpis = () => {
  const totalCourses = courses.length;
  const totalStudents = studentsBase.length;
  const totalFaculty = facultyBase.length;
  const totalAssessments = Object.values(assessmentsByCourse).flat().length;

  return { totalCourses, totalStudents, totalFaculty, totalAssessments };
};

export const getAnalyticsData = () => {
  // Placeholder for more complex analytics
  return {
    courseEnrollments: courses.map(c => ({
      courseId: c.id,
      courseName: c.title,
      enrollmentCount: (enrolled[c.id] || []).length,
    })),
    studentPerformances: studentsBase.map(s => ({
      studentId: s.id,
      studentName: s.name,
      cgpa: 8 + Math.random() * 1.5,
    })),
  };
};
