import { NextRequest, NextResponse } from 'next/server';
import { getSheetData, appendToSheet, updateSheet, deleteFromSheet, SHEETS } from '@/lib/googleSheets';

export async function GET() {
  try {
    const data = await getSheetData(SHEETS.MODULES);
    const courses = await getSheetData(SHEETS.COURSES);
    
    if (!data || data.length <= 1) {
      return NextResponse.json([]);
    }
    
    // Create course lookup map
    const courseMap = new Map();
    courses.slice(1).forEach((course: any) => {
      courseMap.set(course[0], course[1]);
    });
    
    const modules = data.slice(1).map((row: any, index: number) => ({
      id: row[0] || (index + 1).toString(),
      name: row[1] || '',
      courseId: row[2] || '',
      courseName: courseMap.get(row[2]) || 'Unknown',
      description: row[3] || '',
    }));
    
    return NextResponse.json(modules);
  } catch (error) {
    console.error('Error fetching modules:', error);
    return NextResponse.json({ error: 'Failed to fetch modules' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, courseId, description } = body;
    
    if (!name || !courseId) {
      return NextResponse.json(
        { error: 'Name and course ID are required' },
        { status: 400 }
      );
    }
    
    const existingData = await getSheetData(SHEETS.MODULES);
    const newId = (existingData.length).toString();
    
    const values = [[
      newId,
      name,
      courseId,
      description || ''
    ]];
    
    await appendToSheet(SHEETS.MODULES, values);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Module created successfully',
      id: newId 
    });
  } catch (error) {
    console.error('Error creating module:', error);
    return NextResponse.json(
      { error: 'Failed to create module' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();
    const { name, courseId, description } = body;
    
    if (!id) {
      return NextResponse.json({ error: 'Module ID is required' }, { status: 400 });
    }
    
    const data = await getSheetData(SHEETS.MODULES);
    let rowIndex = -1;
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === id) {
        rowIndex = i + 1;
        break;
      }
    }
    
    if (rowIndex === -1) {
      return NextResponse.json({ error: 'Module not found' }, { status: 404 });
    }
    
    const values = [[
      id,
      name,
      courseId,
      description || ''
    ]];
    
    await updateSheet(SHEETS.MODULES, rowIndex, values);
    
    return NextResponse.json({ success: true, message: 'Module updated successfully' });
  } catch (error) {
    console.error('Error updating module:', error);
    return NextResponse.json(
      { error: 'Failed to update module' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Module ID is required' }, { status: 400 });
    }
    
    const data = await getSheetData(SHEETS.MODULES);
    let rowIndex = -1;
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === id) {
        rowIndex = i + 1;
        break;
      }
    }
    
    if (rowIndex === -1) {
      return NextResponse.json({ error: 'Module not found' }, { status: 404 });
    }
    
    await deleteFromSheet(SHEETS.MODULES, rowIndex);
    
    return NextResponse.json({ success: true, message: 'Module deleted successfully' });
  } catch (error) {
    console.error('Error deleting module:', error);
    return NextResponse.json(
      { error: 'Failed to delete module' },
      { status: 500 }
    );
  }
}