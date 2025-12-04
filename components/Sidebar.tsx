'use client';

interface GpsData {
    id: number;
    latitude: number;
    longitude: number;
    recordedAt: string;
}

interface SidebarProps {
    data: GpsData[];
    onSelect: (id: number) => void;
    selectedId?: number | null;
}

export default function Sidebar({ data, onSelect, selectedId }: SidebarProps) {
    return (
        <div className="h-full w-80 bg-white shadow-lg overflow-y-auto border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-xl font-bold text-gray-800">GPS Data Log</h2>
                <p className="text-sm text-gray-500">{data.length} points recorded</p>
            </div>
            <ul className="divide-y divide-gray-100">
                {data.map((point) => (
                    <li
                        key={point.id}
                        onClick={() => onSelect(point.id)}
                        className={`p-4 cursor-pointer hover:bg-blue-50 transition-colors ${selectedId === point.id ? 'bg-blue-100 border-l-4 border-blue-500' : ''
                            }`}
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-medium text-gray-900">
                                    {new Date(point.recordedAt).toLocaleTimeString()}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {new Date(point.recordedAt).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="text-right text-sm text-gray-600 font-mono">
                                <div>{point.latitude.toFixed(4)}</div>
                                <div>{point.longitude.toFixed(4)}</div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
