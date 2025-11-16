import React, { useState, useEffect } from 'react';
import KpiCard from '../components/KpiCard';
import * as api from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from '../contexts/ThemeContext';

const ChartBarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const CheckCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const ExclamationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
);


const DashboardPage: React.FC = () => {
    const { theme } = useTheme();
    const [kpis, setKpis] = useState({
        averageCgpa: "0.0",
        attendanceRate: "0.0",
        studentsAtRisk: 0,
        facultyLoadAvg: "0.0"
    });
    // FIX: Explicitly type the state to avoid `never[]` type inference on empty arrays.
    const [analyticsData, setAnalyticsData] = useState<{ gpaTrend: any[] }>({ gpaTrend: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [kpiData, analytics] = await Promise.all([
                    api.getDashboardKpis(),
                    api.getAnalyticsData()
                ]);
                // FIX: Cast API response to 'any' to avoid type error where data was inferred as 'unknown'.
                setKpis(kpiData as any);
                // FIX: Cast API response to 'any' to avoid type error where data was inferred as 'unknown'.
                setAnalyticsData(analytics as any);
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const gridStrokeColor = theme === 'dark' ? '#52525b' : '#e5e7eb';
    const axisStrokeColor = theme === 'dark' ? '#a1a1aa' : '#6b7280';
    const legendColor = theme === 'dark' ? '#FAF4F4' : '#374151';
    const tooltipStyle = {
        backgroundColor: theme === 'dark' ? '#303030' : '#ffffff',
        border: `1px solid ${gridStrokeColor}`
    };
    const labelStyle = { color: theme === 'dark' ? '#FAF4F4' : '#1f2937' };

    if (loading) {
        return <div>Loading dashboard...</div>;
    }

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold font-heading">Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard title="Avg. CGPA" value={`${kpis.averageCgpa} / 10`} icon={<ChartBarIcon />} />
                <KpiCard title="Attendance Rate" value={`${kpis.attendanceRate}%`} icon={<CheckCircleIcon />} change="1.5%" changeType="increase" />
                <KpiCard title="Students at Risk" value={String(kpis.studentsAtRisk)} icon={<ExclamationIcon />} change="1" changeType="decrease" />
                <KpiCard title="Faculty Load Avg." value={`${kpis.facultyLoadAvg} Courses`} icon={<ChartBarIcon />} />
            </div>

            <div className="bg-white dark:bg-stone-800/50 p-6 rounded-lg border border-stone-200 dark:border-stone-700/50">
                <h2 className="text-xl font-bold font-heading mb-4">Semester CGPA Trend</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analyticsData.gpaTrend} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={gridStrokeColor} />
                        <XAxis dataKey="semester" stroke={axisStrokeColor} />
                        <YAxis stroke={axisStrokeColor} domain={[0, 10]} />
                        <Tooltip
                            contentStyle={tooltipStyle}
                            labelStyle={labelStyle}
                        />
                        <Legend wrapperStyle={{ color: legendColor }} />
                        <Bar dataKey="avgCgpa" fill="#CF5256" name="Average CGPA" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default DashboardPage;
