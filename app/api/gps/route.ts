import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received GPS payload:', body);

    // Construct recordedAt date from payload fields
    // Payload: { year, month, day, hour, minute, second, ... }
    // Note: Month in Date constructor is 0-indexed (0-11), but GPS usually gives 1-12.
    // Assuming GPS gives 1-12, we subtract 1.
    const recordedAt = new Date(
      body.year,
      body.month - 1,
      body.day,
      body.hour,

      body.minute,
      body.second
    );
    console.log('Constructed Date:', recordedAt);


    const data = await prisma.gpsData.create({
      data: {
        latitude: body.latitude,
        longitude: body.longitude,
        recordedAt: recordedAt,
      },
    });

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error('Error saving GPS data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save data' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const data = await prisma.gpsData.findMany({
      orderBy: {
        recordedAt: 'desc',
      },
      take: 100, // Limit to recent 100 points
    });
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching GPS data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
