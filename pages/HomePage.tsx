import React, { useState, useEffect } from 'react';
import KpiCard from '../components/KpiCard';
import * as api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const AcademicCapIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path d="M12 14l9-5-9-5-9 5 9 5z" />
    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-5.998 12.078 12.078 0 01.665-6.479L12 14z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-5.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222 4 2.222V20M1 12v7a2 2 0 002 2h18a2 2 0 002-2v-7" />
  </svg>
);

const BookOpenIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
);


const HomePage: React.FC = () => {
  const { user } = useAuth();
  const [kpis, setKpis] = useState({ totalStudents: 0, totalFaculty: 0, totalCourses: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDashboardKpis()
      .then(data => {
        // FIX: Explicitly cast the API response to `any` to avoid a type error where the data was being inferred as 'unknown'.
        setKpis(data as any);
        setLoading(false);
      })
      .catch(error => {
        console.error("Failed to fetch KPIs", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-12">
      <section className="text-center py-20">
        <h1 className="text-5xl md:text-7xl font-heading font-bold text-stone-900 dark:text-[#FAF4F4]">
          Welcome, {user?.name || 'User'}!
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg text-stone-600 dark:text-stone-300">
          Unlocking institutional potential through data-driven decisions. This portal provides a unified view of academic performance, engagement, and resource management.
        </p>
      </section>

      <section>
        {loading ? <p>Loading statistics...</p> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <KpiCard 
              title="Total Students" 
              value={kpis.totalStudents.toLocaleString()} 
              icon={<UsersIcon />}
            />
            <KpiCard 
              title="Faculty Members" 
              value={kpis.totalFaculty.toLocaleString()} 
              icon={<AcademicCapIcon />}
            />
            <KpiCard 
              title="Active Courses" 
              value={kpis.totalCourses.toLocaleString()} 
              icon={<BookOpenIcon />}
            />
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
