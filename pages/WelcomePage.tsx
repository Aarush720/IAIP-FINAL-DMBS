import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const WelcomePage: React.FC = () => {
    const navigate = useNavigate();
    const [exitSubheading, setExitSubheading] = useState(false);
    const [exitHeading, setExitHeading] = useState(false);

    useEffect(() => {
        // Staging Exit Animation
        const subheadingExitTimer = setTimeout(() => {
            setExitSubheading(true);
        }, 3000); // Start subheading fade out

        const headingExitTimer = setTimeout(() => {
            setExitHeading(true);
        }, 3200); // Start heading fade out shortly after

        const navigateTimer = setTimeout(() => {
            navigate('/login');
        }, 3800); // Navigate after animations are done

        return () => {
            clearTimeout(subheadingExitTimer);
            clearTimeout(headingExitTimer);
            clearTimeout(navigateTimer);
        };
    }, [navigate]);

    return (
        <div className={`min-h-screen text-stone-900 dark:text-[#FAF4F4] flex flex-col items-center justify-center text-center p-4 overflow-hidden`}>
            <div className="max-w-4xl">
                <h1 className="text-5xl md:text-8xl font-heading font-bold text-stone-900 dark:text-[#FAF4F4] leading-tight">
                   <span className={exitHeading ? 'animate-fade-out-up' : 'animate-fade-in-up'}>Integrated</span>{' '}
                   <span className={exitHeading ? 'animate-fade-out-up delay-150' : 'animate-fade-in-up delay-150'}>Academic</span>{' '}
                   <span className={`font-italic-accent italic text-[#CF5256] ${exitHeading ? 'animate-fade-out-up delay-300' : 'animate-fade-in-up delay-300'}`}>Insights</span>
                </h1>
                <p className={`mt-6 text-2xl font-bold text-stone-600 dark:text-stone-300 text-center ${exitSubheading ? 'animate-fade-out' : 'animate-fade-in-up delay-600'}`}>
                    A UNIFIED PORTAL FOR DATA-DRIVEN EDUCATION.
                </p>
            </div>
        </div>
    );
};

export default WelcomePage;
