import React, { useState, useEffect } from 'react';
import * as api from '../services/api';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { useTheme } from '../contexts/ThemeContext';


const AnalyticsPage: React.FC = () => {
  const { theme } = useTheme();
  // FIX: Provide an explicit type for the state to avoid 'never[]' type inference issues with empty arrays.
  const [analyticsData, setAnalyticsData] = useState<{ gpaTrend: any[], gradeDistribution: any[], attendanceSummary: any[] }>({ gpaTrend: [], gradeDistribution: [], attendanceSummary: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
      api.getAnalyticsData()
          .then(data => {
              setAnalyticsData(data as any);
              setLoading(false);
          })
          .catch(err => {
              setError('Failed to fetch analytics data.');
              setLoading(false);
          });
  }, []);

  const gridStrokeColor = theme === 'dark' ? '#52525b' : '#e5e7eb';
  const axisStrokeColor = theme === 'dark' ? '#a1a1aa' : '#6b7280';
  const tooltipStyle = {
      backgroundColor: theme === 'dark' ? '#303030' : '#ffffff',
      border: `1px solid ${gridStrokeColor}`
  };

  if (loading) return <div>Loading analytics...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold font-heading">Analytics</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-stone-800/50 p-6 rounded-lg border border-stone-200 dark:border-stone-700/50">
          <h2 className="text-xl font-bold font-heading mb-4">Overall CGPA Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analyticsData.gpaTrend} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStrokeColor} />
              <XAxis dataKey="semester" stroke={axisStrokeColor} />
              <YAxis stroke={axisStrokeColor} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
              <Line type="monotone" dataKey="avgCgpa" stroke="#CF5256" strokeWidth={2} name="Average CGPA" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-stone-800/50 p-6 rounded-lg border border-stone-200 dark:border-stone-700/50">
          <h2 className="text-xl font-bold font-heading mb-4">Grade Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={analyticsData.gradeDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {analyticsData.gradeDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
        <div className="bg-white dark:bg-stone-800/50 p-6 rounded-lg border border-stone-200 dark:border-stone-700/50">
          <h2 className="text-xl font-bold font-heading mb-4">Attendance Summary</h2>
           <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData.attendanceSummary}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridStrokeColor} />
                    <XAxis dataKey="name" stroke={axisStrokeColor} />
                    <YAxis stroke={axisStrokeColor} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="value" name="Records">
                        {analyticsData.attendanceSummary.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    </div>
  );
};

export default AnalyticsPage;
