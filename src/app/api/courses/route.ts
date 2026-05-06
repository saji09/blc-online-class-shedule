import { NextRequest, NextResponse } from 'next/server';
import { getSheetData, appendToSheet, updateSheet, deleteFromSheet, SHEETS } from '@/lib/googleSheets';

export async function GET() {
  try {
    const data = await getSheetData(SHEETS.COURSES);
    
    console.log('Courses data from sheet:', data);
    
    if (!data || data.length <= 1) {
      return NextResponse.json([]);
    }
    
    // Skip header row (row 0) and map data
    const courses = data.slice(1).map((row: any, index: number) => ({
      id: row[0] || (index + 1).toString(),
      name: row[1] || '',
      code: row[2] || '',
      duration: row[3] || '',
      description: row[4] || '',
    }));
    
    console.log('Formatted courses:', courses);
    return NextResponse.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, code, duration, description } = body;
    
    console.log('Creating course:', { name, code, duration, description });
    
    // Validate required fields
    if (!name || !code || !duration) {
      return NextResponse.json(
        { error: 'Name, code, and duration are required' },
        { status: 400 }
      );
    }
    
    // Get existing data to generate new ID
    const existingData = await getSheetData(SHEETS.COURSES);
    const newId = (existingData.length).toString();
    
    const values = [[
      newId,
      name,
      code,
      duration,
      description || ''
    ]];
    
    await appendToSheet(SHEETS.COURSES, values);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Course created successfully',
      id: newId,
      course: { id: newId, name, code, duration, description }
    });
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();
    const { name, code, duration, description } = body;
    
    console.log('Updating course:', { id, name, code, duration, description });
    
    if (!id) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
    }
    
    const data = await getSheetData(SHEETS.COURSES);
    let rowIndex = -1;
    
    // Find the row with matching ID
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === id) {
        rowIndex = i + 1; // +1 because sheet rows are 1-indexed
        break;
      }
    }
    
    if (rowIndex === -1) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }
    
    const values = [[
      id,
      name,
      code,
      duration,
      description || ''
    ]];
    
    await updateSheet(SHEETS.COURSES, rowIndex, values);
    
    return NextResponse.json({ success: true, message: 'Course updated successfully' });
  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json(
      { error: 'Failed to update course' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    console.log('Deleting course:', id);
    
    if (!id) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
    }
    
    const data = await getSheetData(SHEETS.COURSES);
    let rowIndex = -1;
    
    // Find the row with matching ID
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === id) {
        rowIndex = i + 1;
        break;
      }
    }
    
    if (rowIndex === -1) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }
    
    await deleteFromSheet(SHEETS.COURSES, rowIndex);
    
    return NextResponse.json({ success: true, message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    return NextResponse.json(
      { error: 'Failed to delete course' },
      { status: 500 }
    );
  }
}