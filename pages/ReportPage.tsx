import React from 'react';

const ReportPage: React.FC = () => {
    
    return (
        <div className="bg-stone-100 text-stone-800 dark:bg-stone-900 dark:text-stone-200 p-8 rounded-lg max-w-4xl mx-auto print:bg-white print:shadow-none print:p-0">
            <div className="flex justify-between items-center mb-8 print:hidden">
                <h1 className="text-3xl font-bold font-heading text-stone-900 dark:text-[#FAF4F4]">Final Project Report</h1>
            </div>
            
            <article className="prose prose-lg max-w-none text-stone-900 dark:text-stone-300 prose-headings:text-stone-900 dark:prose-headings:text-stone-100 prose-strong:text-stone-900 dark:prose-strong:text-stone-100 dark:prose-invert">
                <h2 className="text-2xl font-bold">Integrated Academic Insights Portal (IAIP)</h2>
                
                <section className="space-y-4">
                    <h3 className="text-xl font-bold border-b border-stone-300 dark:border-stone-700 pb-2">1. Executive Summary</h3>
                    <p>
                        The Integrated Academic Insights Portal (IAIP) is a comprehensive, role-based web application designed to centralize and streamline academic management within an educational institution. The portal provides distinct interfaces for Students, Faculty, and Administrators, each tailored to their specific needs. By consolidating data on courses, attendance, assessments, and user management, the IAIP serves as a single source of truth, enabling data-driven decision-making, enhancing administrative efficiency, and improving the academic experience for all stakeholders.
                    </p>
                </section>

                <section className="space-y-4 mt-8">
                    <h3 className="text-xl font-bold border-b border-stone-300 dark:border-stone-700 pb-2">2. System Architecture & Technology Stack</h3>
                    <p>
                        The IAIP is developed as a modern Single-Page Application (SPA) using a robust and scalable technology stack:
                    </p>
                    <ul className="list-disc pl-6">
                        <li><strong>Frontend Framework:</strong> React.js with TypeScript for type-safe, component-based UI development.</li>
                        <li><strong>Styling:</strong> TailwindCSS for a utility-first, responsive design system, enabling rapid and consistent styling.</li>
                        <li><strong>Routing:</strong> React Router for client-side navigation between different portal sections.</li>
                        <li><strong>Data Visualization:</strong> Recharts for creating interactive and informative charts in the Analytics and Dashboard modules.</li>
                        <li><strong>State Management:</strong> React Context API for managing global state such as user authentication and theme.</li>
                        <li><strong>Backend Simulation:</strong> A mock API service layer that simulates asynchronous data fetching and mutations, allowing for a realistic user experience without a live database.</li>
                    </ul>
                </section>
                
                <section className="space-y-4 mt-8">
                    <h3 className="text-xl font-bold border-b border-stone-300 dark:border-stone-700 pb-2">3. Core Modules & Functionality</h3>
                    <p>
                        The portal's functionality is segregated based on a robust Role-Based Access Control (RBAC) system, ensuring users only access relevant information and tools.
                    </p>
                    <ul className="list-disc pl-6 space-y-3">
                        <li>
                            <strong>Student Portal:</strong> Provides students with a comprehensive view of their academic journey. Key features include viewing enrolled courses, tracking daily attendance, checking assessment scores, and generating official semester-wise Mark Sheets with SGPA and CGPA calculations.
                        </li>
                        <li>
                            <strong>Faculty Portal:</strong> Empowers instructors with tools to manage their courses effectively. In addition to student-level access, faculty can view student rosters for their courses, update daily attendance records via an interactive calendar, manage and input scores for all assessments, and access detailed analytics on grade distribution and performance trends.
                        </li>
                         <li>
                            <strong>Administrator Portal:</strong> Offers complete oversight and control over the entire system. Admins have access to all faculty features, plus advanced administrative capabilities. This includes a full user management dashboard to view and filter users by role (Student, Teacher), manage user statuses, add or remove faculty members, and create or delete courses from the catalog.
                        </li>
                    </ul>
                </section>

                 <section className="space-y-4 mt-8">
                    <h3 className="text-xl font-bold border-b border-stone-300 dark:border-stone-700 pb-2">4. Key Features in Detail</h3>
                    <ul className="list-disc pl-6 space-y-3">
                        <li>
                            <strong>Dynamic Dashboard:</strong> A landing page that presents high-level Key Performance Indicators (KPIs) such as average CGPA, overall attendance rate, and the number of students at academic risk, providing an instant snapshot of the institution's health.
                        </li>
                        <li>
                            <strong>Interactive Analytics:</strong> A dedicated analytics page featuring visualizations for long-term CGPA trends, overall grade distributions across all courses, and a summary of attendance records (Present vs. Absent vs. Late).
                        </li>
                        <li>
                            <strong>Comprehensive Management Pages:</strong> Dedicated sections for managing Students, Faculty, Courses, Attendance, and Assessments, with functionalities like searching, filtering, adding, and removing data, restricted by user role.
                        </li>
                         <li>
                            <strong>Mark Sheet Generation:</strong> An automated system that fetches a student's performance data for a selected semester and dynamically generates a printable, official mark sheet, calculating both the Semester Grade Point Average (SGPA) and Cumulative Grade Point Average (CGPA).
                        </li>
                    </ul>
                </section>
                
                <section className="space-y-4 mt-8">
                    <h3 className="text-xl font-bold border-b border-stone-300 dark:border-stone-700 pb-2">5. Database Design & Normalization</h3>
                    <p>
                        The conceptual database schema is designed around core entities: <strong>Students</strong>, <strong>Faculty</strong>, <strong>Courses</strong>, <strong>Enrollments</strong>, <strong>Attendance</strong>, and <strong>Assessments</strong>. All relations are normalized to Boyce-Codd Normal Form (BCNF) to ensure data integrity and eliminate redundancy.
                    </p>
                    <p>
                        For instance, the <strong>Enrollments</strong> relation, which links Students and Courses, uses a composite primary key {`{StudentID, CourseID}`}. Attributes like `Grade` are fully functionally dependent on this key. This structure prevents data anomalies, ensuring that updates to student or course information are reflected consistently throughout the system without requiring multiple changes.
                    </p>
                </section>
            </article>
        </div>
    );
};

export default ReportPage;
