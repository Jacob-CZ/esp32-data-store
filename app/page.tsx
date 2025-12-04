'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Sidebar from '@/components/Sidebar';

// Dynamically import Map component to avoid SSR issues with Leaflet
const Map = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => <div className="h-full w-full flex items-center justify-center bg-gray-100">Loading Map...</div>
});

interface GpsData {
  id: number;
  latitude: number;
  longitude: number;
  recordedAt: string;
}

export default function Home() {
  const [data, setData] = useState<GpsData[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/gps');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Poll every 10 seconds
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="flex h-screen w-screen overflow-hidden bg-gray-100">
      <Sidebar
        data={data}
        onSelect={setSelectedId}
        selectedId={selectedId}
      />
      <div className="flex-1 relative">
        <Map data={data} selectedId={selectedId} />
      </div>
    </main>
  );
}
