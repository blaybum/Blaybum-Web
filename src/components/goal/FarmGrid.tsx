'use client';

type PlantStage = 'empty' | 'seed' | 'sprout';

const PlantIcon = ({ stage }: { stage: PlantStage }) => {
    if (stage === 'empty') return null;

    return (
        <div
            className="relative justify-center items-center flex animate-[bounceIn_0.5s_ease-out]"
            style={{
                animation: 'bounceIn 0.5s ease-out forwards',
            }}
        >
            {stage === 'seed' && (
                <div className="w-6 h-6 rounded-full bg-yellow-400 shadow-sm relative">
                    <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-white opacity-40"></div>
                </div>
            )}
            {stage === 'sprout' && (
                <div className="flex flex-col items-center">
                    <div className="w-1 h-3 bg-green-400 rounded-sm mt-2"></div>
                    <div className="w-4 h-4 bg-green-300 rounded-full -mt-4 opacity-80 blur-[1px]"></div>
                    <div className="w-1.5 h-4 bg-green-500 rounded-full -mt-2"></div>
                </div>
            )}
        </div>
    );
};

export default function FarmGrid({ gridData }: { gridData?: PlantStage[] }) {
    const fallbackGrid: PlantStage[] = ['seed', 'empty', 'seed', 'seed', 'sprout', 'empty'];
    const data = gridData && gridData.length > 0 ? gridData : fallbackGrid;

    return (
        <>
            <style jsx global>{`
                @keyframes bounceIn {
                    0% {
                        transform: scale(0);
                        opacity: 0;
                    }
                    50% {
                        transform: scale(1.1);
                        opacity: 0.8;
                    }
                    100% {
                        transform: scale(1);
                        opacity: 1;
                    }
                }
            `}</style>
            <div className="relative p-3 bg-[#E6DCC3] rounded-[24px] shadow-[0_4px_0_0_#D6CCB3]">
                <div className="absolute top-0 right-0 p-2">
                    <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center shadow-md">
                        <span className="text-white text-xs">🌱</span>
                    </div>
                </div>
                <div className="bg-[#98E6C7] rounded-[20px] p-0.5 grid grid-cols-3 grid-rows-2 gap-[1px] overflow-hidden border-4 border-[#8BD9BA]">
                    {data.map((stage, i) => (
                        <div
                            key={i}
                            className="bg-[#90DFC2] h-32 flex items-center justify-center relative border-[0.5px] border-white/20"
                        >
                            <PlantIcon stage={stage} />
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
