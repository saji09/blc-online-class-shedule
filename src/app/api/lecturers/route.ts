import { NextRequest, NextResponse } from 'next/server';
import { getSheetData, appendToSheet, updateSheet, deleteFromSheet, SHEETS } from '@/lib/googleSheets';

export async function GET() {
  try {
    const data = await getSheetData(SHEETS.LECTURERS);
    
    if (!data || data.length <= 1) {
      return NextResponse.json([]);
    }
    
    const lecturers = data.slice(1).map((row: any, index: number) => ({
      id: row[0] || (index + 1).toString(),
      name: row[1] || '',
      email: row[2] || '',
      phone: row[3] || '',
      department: row[4] || '',
    }));
    
    return NextResponse.json(lecturers);
  } catch (error) {
    console.error('Error fetching lecturers:', error);
    return NextResponse.json({ error: 'Failed to fetch lecturers' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, department } = body;
    
    if (!name || !email || !phone || !department) {
      return NextResponse.json(
        { error: 'Name, email, phone, and department are required' },
        { status: 400 }
      );
    }
    
    const existingData = await getSheetData(SHEETS.LECTURERS);
    const newId = (existingData.length).toString();
    
    const values = [[
      newId,
      name,
      email,
      phone,
      department
    ]];
    
    await appendToSheet(SHEETS.LECTURERS, values);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Lecturer created successfully',
      id: newId 
    });
  } catch (error) {
    console.error('Error creating lecturer:', error);
    return NextResponse.json(
      { error: 'Failed to create lecturer' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();
    const { name, email, phone, department } = body;
    
    if (!id) {
      return NextResponse.json({ error: 'Lecturer ID is required' }, { status: 400 });
    }
    
    const data = await getSheetData(SHEETS.LECTURERS);
    let rowIndex = -1;
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === id) {
        rowIndex = i + 1;
        break;
      }
    }
    
    if (rowIndex === -1) {
      return NextResponse.json({ error: 'Lecturer not found' }, { status: 404 });
    }
    
    const values = [[
      id,
      name,
      email,
      phone,
      department
    ]];
    
    await updateSheet(SHEETS.LECTURERS, rowIndex, values);
    
    return NextResponse.json({ success: true, message: 'Lecturer updated successfully' });
  } catch (error) {
    console.error('Error updating lecturer:', error);
    return NextResponse.json(
      { error: 'Failed to update lecturer' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Lecturer ID is required' }, { status: 400 });
    }
    
    const data = await getSheetData(SHEETS.LECTURERS);
    let rowIndex = -1;
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === id) {
        rowIndex = i + 1;
        break;
      }
    }
    
    if (rowIndex === -1) {
      return NextResponse.json({ error: 'Lecturer not found' }, { status: 404 });
    }
    
    await deleteFromSheet(SHEETS.LECTURERS, rowIndex);
    
    return NextResponse.json({ success: true, message: 'Lecturer deleted successfully' });
  } catch (error) {
    console.error('Error deleting lecturer:', error);
    return NextResponse.json(
      { error: 'Failed to delete lecturer' },
      { status: 500 }
    );
  }
}