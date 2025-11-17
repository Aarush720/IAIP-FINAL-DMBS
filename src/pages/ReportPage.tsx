import React from 'react';

const ReportPage: React.FC = () => {
  return (
    <div className="bg-stone-100 text-stone-800 dark:bg-stone-900 dark:text-stone-200 p-8 rounded-lg max-w-4xl mx-auto print:bg-white print:shadow-none print:p-0">
      <div className="flex justify-between items-center mb-8 print:hidden">
        <h1 className="text-3xl font-bold font-heading">Final Project Report</h1>
      </div>
      <article className="prose prose-lg max-w-none dark:prose-invert">
        <h2 className="text-2xl font-bold">Integrated Academic Insights Portal (IAIP)</h2>
        {/* ...existing content... */}
      </article>
    </div>
  );
};

export default ReportPage;
