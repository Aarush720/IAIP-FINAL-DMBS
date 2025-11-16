import { User, Student, Faculty, Course, AttendanceSummary, Assessment, AttendanceRecord, Grade, MarkSheet, MarkSheetCourse, AssessmentScore } from '../types';

// --- GENERATION UTILITIES (for creating a larger, more realistic dataset) ---

const DEPARTMENTS = ['Computer Science', 'Physics', 'Mathematics', 'Electrical Engineering'];
const FIRST_NAMES = ['Liam', 'Olivia', 'Noah', 'Emma', 'Oliver', 'Ava', 'Elijah', 'Charlotte', 'William', 'Sophia', 'James', 'Amelia', 'Benjamin', 'Isabella', 'Lucas', 'Mia', 'Henry', 'Evelyn', 'Alexander', 'Harper', 'Michael', 'Camila', 'Ethan', 'Gianna', 'Daniel', 'Abigail', 'Matthew', 'Luna', 'Aiden', 'Ella', 'Jackson', 'Elizabeth', 'Sebastian', 'Sofia', 'David', 'Emily', 'Joseph', 'Avery', 'Carter', 'Mila', 'Owen', 'Scarlett', 'Wyatt', 'Eleanor', 'John', 'Madison', 'Jack', 'Layla', 'Luke', 'Penelope'];
const LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts'];

const getRandomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;

// --- CORE DATA STORE ---

// Base data is defined first, then expanded programmatically
export let faculty: Faculty[] = [
  { id: 2, name: 'Dr. Evelyn Reed', email: 'evelyn.r@university.edu', department: 'Computer Science', title: 'Professor', office: 'CS-101', avatar: `https://i.pravatar.cc/150?u=F001` },
  { id: 10, name: 'Dr. Robert Chen', email: 'robert.c@university.edu', department: 'Physics', title: 'Associate Professor', office: 'PHY-205', avatar: `https://i.pravatar.cc/150?u=F002` },
  { id: 11, name: 'Dr. Susan Bones', email: 'susan.b@university.edu', department: 'Mathematics', title: 'Professor', office: 'MATH-314', avatar: `https://i.pravatar.cc/150?u=F003` },
  { id: 12, name: 'Dr. Alan Grant', email: 'alan.g@university.edu', department: 'Electrical Engineering', title: 'Professor', office: 'EE-A21', avatar: `https://i.pravatar.cc/150?u=F004` },
  { id: 13, name: 'Dr. Laura Dern', email: 'laura.d@university.edu', department: 'Computer Science', title: 'Assistant Professor', office: 'CS-112', avatar: `https://i.pravatar.cc/150?u=F005` },
  { id: 14, name: 'Dr. Indiana Jones', email: 'indy.j@university.edu', department: 'Physics', title: 'Professor', office: 'PHY-111', avatar: `https://i.pravatar.cc/150?u=F006` },
  { id: 15, name: 'Dr. Ellie Sattler', email: 'ellie.s@university.edu', department: 'Computer Science', title: 'Associate Professor', office: 'CS-222', avatar: `https://i.pravatar.cc/150?u=F007` },
];

export let courses: Course[] = [
  { id: 'CS101', title: 'Introduction to Programming', code: 'CS101', department: 'Computer Science', credits: 3, instructor: 'Dr. Evelyn Reed' },
  { id: 'CS202', title: 'Data Structures', code: 'CS202', department: 'Computer Science', credits: 4, instructor: 'Dr. Laura Dern' },
  { id: 'PHY201', title: 'Classical Mechanics', code: 'PHY201', department: 'Physics', credits: 4, instructor: 'Dr. Robert Chen' },
  { id: 'MATH301', title: 'Abstract Algebra', code: 'MATH301', department: 'Mathematics', credits: 3, instructor: 'Dr. Susan Bones' },
  { id: 'EE101', title: 'Circuit Theory', code: 'EE101', department: 'Electrical Engineering', credits: 3, instructor: 'Dr. Alan Grant' },
  { id: 'EE205', title: 'Digital Logic Design', code: 'EE205', department: 'Electrical Engineering', credits: 4, instructor: 'Dr. Alan Grant' },
  { id: 'CS303', title: 'Analysis of Algorithms', code: 'CS303', department: 'Computer Science', credits: 3, instructor: 'Dr. Ellie Sattler' },
  { id: 'CS450', title: 'Machine Learning', code: 'CS450', department: 'Computer Science', credits: 4, instructor: 'Dr. Evelyn Reed' },
  { id: 'PHY310', title: 'Quantum Mechanics', code: 'PHY310', department: 'Physics', credits: 4, instructor: 'Dr. Indiana Jones' },
  { id: 'MATH205', title: 'Linear Algebra', code: 'MATH205', department: 'Mathematics', credits: 4, instructor: 'Dr. Susan Bones' },
  { id: 'EE320', title: 'Signals and Systems', code: 'EE320', department: 'Electrical Engineering', credits: 3, instructor: 'Dr. Alan Grant' },
];

// --- PROGRAMMATIC DATA GENERATION ---

const TOTAL_STUDENTS = 50;
const departmentCounters: { [key: string]: number } = { 'Computer Science': 0, 'Physics': 0, 'Mathematics': 0, 'Electrical Engineering': 0 };

const generatedStudents: Omit<Student, 'cgpa'>[] = [];
const generatedUsers: User[] = [];

for (let i = 0; i < TOTAL_STUDENTS; i++) {
    const firstName = getRandomElement(FIRST_NAMES);
    const lastName = getRandomElement(LAST_NAMES);
    const name = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@university.edu`;
    const department = getRandomElement(DEPARTMENTS);
    
    departmentCounters[department]++;
    const rollNo = `${department.slice(0, 4).toUpperCase().replace(/\s/g, '').substring(0, 2)}-${String(departmentCounters[department]).padStart(3, '0')}`;
    
    const enrollmentYear = getRandomInt(2020, 2023);
    const enrollmentDate = `${enrollmentYear}-08-20`;

    generatedStudents.push({
        id: rollNo,
        name,
        email,
        department,
        enrollmentDate,
        avatar: `https://i.pravatar.cc/150?u=${rollNo}`
    });

    generatedUsers.push({
        id: 100 + i, // Start student user IDs from 100
        name,
        email,
        role: 'Student',
        lastLogin: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Active',
        studentId: rollNo,
    });
}

const studentsData: Omit<Student, 'cgpa'>[] = generatedStudents;

export let users: User[] = [
  { id: 1, name: 'Admin User', email: 'admin@university.edu', role: 'Admin', lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), status: 'Active' },
  { id: 2, name: 'Dr. Evelyn Reed', email: 'faculty@university.edu', role: 'Faculty', lastLogin: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), status: 'Active', facultyId: 2 },
  // Adding student@university.edu for easy login testing, mapped to the first generated student.
  { id: 3, name: studentsData[0].name, email: 'student@university.edu', role: 'Student', lastLogin: new Date(Date.now() - 5 * 60 * 1000).toISOString(), status: 'Active', studentId: studentsData[0].id },
  ...faculty.filter(f => f.id !== 2).map(f => ({
      id: f.id,
      name: f.name,
      email: f.email,
      role: 'Faculty' as const,
      lastLogin: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'Active' as const,
      facultyId: f.id
  })),
  ...generatedUsers,
];


// Generate enrollments: Each student gets 5 courses
export const enrollments: { [courseId: string]: string[] } = {};
courses.forEach(c => enrollments[c.id] = []);

const studentCourseMap: {[studentId: string]: string[]} = {};
studentsData.forEach(student => {
    studentCourseMap[student.id] = [];
    while(studentCourseMap[student.id].length < 5) {
        const randomCourse = getRandomElement(courses);
        if(!studentCourseMap[student.id].includes(randomCourse.id)) {
            studentCourseMap[student.id].push(randomCourse.id);
        }
    }
});

for(const studentId in studentCourseMap) {
    for(const courseId of studentCourseMap[studentId]) {
        if (enrollments[courseId]) {
            enrollments[courseId].push(studentId);
        }
    }
}

// Generate Assessment Data based on enrollments
const assessmentsData: { [courseId: string]: Assessment[] } = {};
const SEMESTERS = ['Fall 2023', 'Spring 2024'];
courses.forEach(course => {
    assessmentsData[course.id] = [];
    const assessmentTypes = [{title: 'Midterm', type: 'Exam', max: 100}, {title: 'Final', type: 'Exam', max: 150}, {title: 'Project', type: 'Project', max: 50}];
    
    assessmentTypes.forEach((atype, index) => {
        const studentsInCourse = enrollments[course.id] || [];
        const semester = getRandomElement(SEMESTERS);

        assessmentsData[course.id].push({
            id: parseInt(`${courses.findIndex(c=>c.id === course.id)}${index}`),
            title: `${atype.title}`,
            type: atype.type,
            maxScore: atype.max,
            semester,
            scores: studentsInCourse.map(studentId => {
                const student = studentsData.find(s => s.id === studentId)!;
                // Generate a plausible score, with a 10% chance of being null (missed)
                const score = Math.random() > 0.1 ? getRandomInt(Math.floor(atype.max * 0.6), atype.max) : null;
                return {
                    studentId,
                    studentName: student.name,
                    score,
                }
            })
        });
    });
});


// --- DYNAMIC CGPA & GRADE CALCULATION LOGIC ---

const getGradeFromPercentage = (percentage: number): Grade => {
    if (percentage >= 90) return { letter: 'A', points: 10 };
    if (percentage >= 80) return { letter: 'B', points: 9 };
    if (percentage >= 70) return { letter: 'C', points: 8 };
    if (percentage >= 60) return { letter: 'D', points: 7 };
    return { letter: 'F', points: 0 };
};

export const getSemestersForStudent = (studentId: string): string[] => {
    const semesters = new Set<string>();
    Object.values(assessmentsData).flat().forEach(assessment => {
        if (assessment.scores.some(s => s.studentId === studentId && s.score !== null) && assessment.semester) {
            semesters.add(assessment.semester);
        }
    });
    return Array.from(semesters).sort((a,b) => b.localeCompare(a)); // Sort descending
};

const calculateSGPA = (studentId: string, semester: string): { sgpa: number, credits: number } => {
    let totalCredits = 0;
    let totalGradePoints = 0;

    courses.forEach(course => {
        const isEnrolled = (enrollments[course.id] || []).includes(studentId);
        const courseAssessments = (assessmentsData[course.id] || []).filter(a => a.semester === semester);
        
        if (isEnrolled && courseAssessments.length > 0) {
            let studentTotalScore = 0;
            let courseMaxScore = 0;

            courseAssessments.forEach(assessment => {
                const scoreRecord = assessment.scores.find(s => s.studentId === studentId);
                if (scoreRecord && scoreRecord.score !== null) {
                    studentTotalScore += scoreRecord.score;
                    courseMaxScore += assessment.maxScore;
                }
            });

            if (courseMaxScore > 0) {
                const percentage = (studentTotalScore / courseMaxScore) * 100;
                const grade = getGradeFromPercentage(percentage);
                totalCredits += course.credits;
                totalGradePoints += grade.points * course.credits;
            }
        }
    });

    const sgpa = totalCredits > 0 ? totalGradePoints / totalCredits : 0;
    return { sgpa, credits: totalCredits };
};

const calculateOverallCGPA = (studentId: string): number => {
    const semesters = getSemestersForStudent(studentId);
    if (semesters.length === 0) return 0.0;

    let cumulativeGradePoints = 0;
    let cumulativeCredits = 0;

    semesters.forEach(semester => {
        const { sgpa, credits } = calculateSGPA(studentId, semester);
        cumulativeGradePoints += sgpa * credits;
        cumulativeCredits += credits;
    });

    return cumulativeCredits > 0 ? cumulativeGradePoints / cumulativeCredits : 0.0;
};

// --- DATA ACCESSOR FUNCTIONS ---

export const getStudents = (): Student[] => {
    return studentsData.map(student => ({
        ...student,
        cgpa: calculateOverallCGPA(student.id)
    }));
};

export const getCoursesForStudent = (studentId: string): Course[] => {
    return courses.filter(course => enrollments[course.id]?.includes(studentId));
};

export const getCoursesForFaculty = (facultyId: number): Course[] => {
    const facultyMember = faculty.find(f => f.id === facultyId);
    if (!facultyMember) return [];
    return courses.filter(course => course.instructor === facultyMember.name);
};

export const generateMarkSheetData = (studentId: string, semester: string): MarkSheet => {
    const student = studentsData.find(s => s.id === studentId);
    if (!student) throw new Error("Student not found");

    const markSheetCourses: MarkSheetCourse[] = [];
    
    courses.forEach(course => {
        if ((enrollments[course.id] || []).includes(studentId)) {
            const courseAssessments = (assessmentsData[course.id] || []).filter(a => a.semester === semester);
            if (courseAssessments.length > 0) {
                let studentTotalScore = 0;
                let courseMaxScore = 0;
                courseAssessments.forEach(assessment => {
                    const scoreRecord = assessment.scores.find(s => s.studentId === studentId);
                    if (scoreRecord && scoreRecord.score !== null) {
                        studentTotalScore += scoreRecord.score;
                        courseMaxScore += assessment.maxScore;
                    }
                });
                if (courseMaxScore > 0) {
                    const percentage = (studentTotalScore / courseMaxScore) * 100;
                    const grade = getGradeFromPercentage(percentage);
                    markSheetCourses.push({ code: course.code, title: course.title, credits: course.credits, score: studentTotalScore, maxScore: courseMaxScore, grade });
                }
            }
        }
    });
    
    const { sgpa } = calculateSGPA(studentId, semester);
    const cgpa = calculateOverallCGPA(studentId);

    return { student: { ...student, cgpa }, semester, courses: markSheetCourses, sgpa, cgpa };
};

let dailyAttendance: any = {};

function initializeAttendance() {
    dailyAttendance = {};
    const SEMESTER_MONTH_DURATION = 4;
    const today = new Date();
    const semesterStartDate = new Date(today.getFullYear(), today.getMonth() - (SEMESTER_MONTH_DURATION - 1), 1);

    let loopDate = new Date(semesterStartDate);
    while (loopDate <= today) {
        const dateString = loopDate.toISOString().split('T')[0];
        const dayOfWeek = loopDate.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Skip weekends
            Object.keys(enrollments).forEach(courseId => {
                if (!dailyAttendance[courseId]) dailyAttendance[courseId] = {};
                enrollments[courseId].forEach(studentId => {
                    if (!dailyAttendance[courseId][studentId]) dailyAttendance[courseId][studentId] = {};
                    const rand = Math.random();
                    let status: 'Present' | 'Absent' | 'Late' = 'Present';
                    if (rand > 0.95) status = 'Absent';
                    else if (rand > 0.9) status = 'Late';
                    dailyAttendance[courseId][studentId][dateString] = status;
                });
            });
        }
        loopDate.setDate(loopDate.getDate() + 1);
    }
}

initializeAttendance(); // Must be called after enrollments are generated


export const getDashboardKpis = () => {
    const allStudents = getStudents();
    const totalStudents = allStudents.length;
    const totalFaculty = faculty.length;
    const totalCourses = courses.length;

    const totalCgpa = allStudents.reduce((sum, s) => sum + s.cgpa, 0);
    const averageCgpa = totalStudents > 0 ? (totalCgpa / totalStudents).toFixed(2) : '0.00';

    let attended = 0;
    let totalClasses = 0;
    Object.values(dailyAttendance).forEach(course => {
        Object.values(course).forEach(student => {
            const statuses = Object.values(student);
            totalClasses += statuses.length;
            attended += statuses.filter(s => s === 'Present' || s === 'Late').length;
        });
    });
    const attendanceRate = totalClasses > 0 ? ((attended / totalClasses) * 100).toFixed(1) : '0.0';
    const studentsAtRisk = allStudents.filter(s => s.cgpa < 7.5).length;
    const facultyLoadAvg = totalFaculty > 0 ? (totalCourses / totalFaculty).toFixed(1) : '0.0';

    return { totalStudents, totalFaculty, totalCourses, averageCgpa, attendanceRate, studentsAtRisk, facultyLoadAvg };
};

export const getAnalyticsData = () => {
    const gpaTrend: { semester: string, avgCgpa: number }[] = [];
    const allSemesters = new Set<string>();
    Object.values(assessmentsData).flat().forEach(a => a.semester && allSemesters.add(a.semester));
    
    Array.from(allSemesters).sort().forEach(semester => {
        let semesterTotalPoints = 0;
        let semesterTotalCredits = 0;
        studentsData.forEach(student => {
            const { sgpa, credits } = calculateSGPA(student.id, semester);
            if (credits > 0) {
                semesterTotalPoints += sgpa * credits;
                semesterTotalCredits += credits;
            }
        });
        if (semesterTotalCredits > 0) {
            gpaTrend.push({
                semester,
                avgCgpa: parseFloat((semesterTotalPoints / semesterTotalCredits).toFixed(2))
            });
        }
    });

    const gradeCounts: { [key: string]: number } = { A: 0, B: 0, C: 0, D: 0, F: 0 };
    Object.values(assessmentsData).flat().forEach(assessment => {
        assessment.scores.forEach(score => {
            if (score.score !== null) {
                const percentage = (score.score / assessment.maxScore) * 100;
                const grade = getGradeFromPercentage(percentage);
                gradeCounts[grade.letter]++;
            }
        });
    });
    const gradeDistribution = [
        { name: 'A', value: gradeCounts.A, fill: '#4ade80' },
        { name: 'B', value: gradeCounts.B, fill: '#60a5fa' },
        { name: 'C', value: gradeCounts.C, fill: '#facc15' },
        { name: 'D', value: gradeCounts.D, fill: '#f87171' },
        { name: 'F', value: gradeCounts.F, fill: '#9ca3af' },
    ];
    
    const attendanceCounts = { Present: 0, Absent: 0, Late: 0 };
    Object.values(dailyAttendance).forEach(course => {
        Object.values(course).forEach(student => {
            Object.values(student).forEach(status => {
                if (status === 'Present') attendanceCounts.Present++;
                else if (status === 'Late') attendanceCounts.Late++;
                else if (status === 'Absent') attendanceCounts.Absent++;
            });
        });
    });
    const attendanceSummary = [
        { name: 'Present', value: attendanceCounts.Present, fill: '#4ade80' },
        { name: 'Absent', value: attendanceCounts.Absent, fill: '#f87171' },
        { name: 'Late', value: attendanceCounts.Late, fill: '#facc15' },
    ];
    
    return { gpaTrend, gradeDistribution, attendanceSummary };
};

// --- MUTATION & OTHER FUNCTIONS ---

export function updateAttendance(courseId: string, studentId: string, date: string, status: 'Present' | 'Absent' | 'Late' | 'Excused') {
    if (!dailyAttendance[courseId]?.[studentId]) return { success: false };
    dailyAttendance[courseId][studentId][date] = status;
    return { success: true };
}

export const getAttendanceSummaryByCourse = (courseId: string): AttendanceSummary[] => {
    const courseAttendance = dailyAttendance[courseId] || {};
    return Object.keys(courseAttendance).map(studentId => {
        const studentRecords = courseAttendance[studentId] || {};
        const dates = Object.keys(studentRecords);
        const attendedClasses = dates.filter(date => studentRecords[date] === 'Present' || studentRecords[date] === 'Late').length;
        const studentInfo = studentsData.find(s => s.id === studentId);
        return {
            studentId,
            studentName: studentInfo?.name || 'Unknown',
            attendedClasses,
            totalClassesHeld: dates.length
        };
    });
};

export const getDailyAttendance = (courseId: string, studentId: string): AttendanceRecord[] => {
    const studentRecords = dailyAttendance[courseId]?.[studentId] || {};
    const studentInfo = studentsData.find(s => s.id === studentId);
    return Object.entries(studentRecords).map(([date, status]) => ({
        studentId,
        studentName: studentInfo?.name || 'Unknown',
        date,
        status: status as 'Present' | 'Absent' | 'Late' | 'Excused',
    }));
};

export const getDailyAttendanceForCourse = (courseId: string, year: number, month: number): any => {
    return dailyAttendance[courseId] || {};
}

export const getStudentsByCourse = (courseId: string): Student[] => {
    const studentIds = enrollments[courseId] || [];
    return studentsData.filter(s => studentIds.includes(s.id)).map(student => ({
        ...student,
        cgpa: calculateOverallCGPA(student.id)
    }));
};

export const getCoursesByDepartment = (department: string): Course[] => {
    return courses.filter(c => c.department === department);
};

export const getAssessmentsByCourse = (courseId: string) => assessmentsData[courseId] || [];

export function addCourse(newCourse: Omit<Course, 'id'>) {
    const newId = newCourse.code.toUpperCase();
    if (courses.some(c => c.id === newId)) throw new Error("Course code exists.");
    if (!faculty.some(f => f.name === newCourse.instructor)) throw new Error(`Instructor not valid.`);
    courses.push({ ...newCourse, id: newId });
    return courses[courses.length - 1];
}

export function removeCourse(courseId: string) {
    courses = courses.filter(c => c.id !== courseId);
    delete enrollments[courseId];
    delete assessmentsData[courseId];
    return { success: true };
}

export function addFaculty(newFacultyData: Omit<Faculty, 'id' | 'avatar'>) {
    const newId = Math.max(0, ...users.map(u => u.id), ...faculty.map(f => f.id)) + 1;
    const newFaculty: Faculty = { ...newFacultyData, id: newId, avatar: `https://i.pravatar.cc/150?u=F${newId}` };
    faculty.push(newFaculty);
    users.push({ id: newId, name: newFaculty.name, email: newFaculty.email, role: 'Faculty', lastLogin: new Date().toISOString(), status: 'Active', facultyId: newId });
    return newFaculty;
}

export function removeFaculty(facultyId: number) {
    faculty = faculty.filter(f => f.id !== facultyId);
    users = users.filter(u => u.id !== facultyId);
    return { success: true };
}

export function addAssessment(courseId: string, newAssessment: { title: string; type: string; maxScore: number; }) {
    if (!assessmentsData[courseId]) assessmentsData[courseId] = [];
    const studentsInCourse = getStudentsByCourse(courseId);
    if (studentsInCourse.length === 0) throw new Error("Course has no students.");
    const newId = Math.max(0, ...Object.values(assessmentsData).flat().map(a => a.id)) + 1;
    const assessmentToAdd: Assessment = {
        id: newId,
        ...newAssessment,
        semester: 'Spring 2024',
        scores: studentsInCourse.map(stud => ({ studentId: stud.id, studentName: stud.name, score: null }))
    };
    assessmentsData[courseId].push(assessmentToAdd);
    return assessmentToAdd;
}

export function updateAssessmentScore(data: { studentId: string; assessmentId: number; score: number | null }): { success: boolean } {
    for (const courseId in assessmentsData) {
        const courseAssessments = assessmentsData[courseId];
        const assessment = courseAssessments.find(a => a.id === data.assessmentId);
        if (assessment) {
            const scoreRecord = assessment.scores.find(s => s.studentId === data.studentId);
            if (scoreRecord) {
                scoreRecord.score = data.score;
                return { success: true };
            }
        }
    }
    return { success: false };
}
