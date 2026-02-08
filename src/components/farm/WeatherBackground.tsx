'use client';

interface WeatherBackgroundProps {
    weather: 'sunny' | 'rainy' | 'cloudy' | 'snowy';
}

export default function WeatherBackground({ weather }: WeatherBackgroundProps) {
    if (weather === 'rainy') {
        return (
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute inset-0 bg-blue-900/10 mix-blend-multiply"></div>
                {/* Simple CSS Rain Effect simulation */}
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute bg-blue-400/60 w-0.5 h-6 animate-rain"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `-${Math.random() * 20}%`,
                            animationDuration: `${0.5 + Math.random() * 0.5}s`,
                            animationDelay: `${Math.random() * 2}s`
                        }}
                    />
                ))}
            </div>
        );
    }

    if (weather === 'snowy') {
        return (
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute inset-0 bg-slate-900/10 mix-blend-multiply"></div>
                {[...Array(30)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute bg-white/80 w-1.5 h-1.5 rounded-full animate-snow"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `-${Math.random() * 20}%`,
                            animationDuration: `${2 + Math.random() * 3}s`,
                            animationDelay: `${Math.random() * 2}s`
                        }}
                    />
                ))}
            </div>
        );
    }

    if (weather === 'cloudy') {
        return (
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-10 left-10 w-32 h-32 bg-gray-100 rounded-full blur-3xl opacity-60 animate-pulse"></div>
                <div className="absolute top-20 right-[-20px] w-40 h-40 bg-gray-200 rounded-full blur-3xl opacity-50 animate-pulse delay-700"></div>
                <div className="absolute inset-0 bg-gray-900/5"></div>
            </div>
        );
    }

    // Default Sunny
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-yellow-300/30 rounded-full blur-3xl"></div>
            <div className="absolute top-[20%] left-[20%] w-32 h-32 bg-orange-200/20 rounded-full blur-2xl"></div>
        </div>
    );
}
