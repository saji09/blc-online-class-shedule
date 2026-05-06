import { NextRequest, NextResponse } from 'next/server';
import { getSheetData, appendToSheet, updateSheet, deleteFromSheet, SHEETS } from '@/lib/googleSheets';

export async function GET() {
  try {
    const data = await getSheetData(SHEETS.BATCHES);
    
    if (!data || data.length <= 1) {
      return NextResponse.json([]);
    }
    
    const batches = data.slice(1).map((row: any, index: number) => ({
      id: row[0] || (index + 1).toString(),
      name: row[1] || '',
      year: row[2] || '',
      status: row[3] || 'Active',
    }));
    
    return NextResponse.json(batches);
  } catch (error) {
    console.error('Error fetching batches:', error);
    return NextResponse.json({ error: 'Failed to fetch batches' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, year, status } = body;
    
    if (!name || !year) {
      return NextResponse.json(
        { error: 'Name and year are required' },
        { status: 400 }
      );
    }
    
    const existingData = await getSheetData(SHEETS.BATCHES);
    const newId = (existingData.length).toString();
    
    const values = [[
      newId,
      name,
      year,
      status || 'Active'
    ]];
    
    await appendToSheet(SHEETS.BATCHES, values);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Batch created successfully',
      id: newId 
    });
  } catch (error) {
    console.error('Error creating batch:', error);
    return NextResponse.json(
      { error: 'Failed to create batch' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();
    const { name, year, status } = body;
    
    if (!id) {
      return NextResponse.json({ error: 'Batch ID is required' }, { status: 400 });
    }
    
    const data = await getSheetData(SHEETS.BATCHES);
    let rowIndex = -1;
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === id) {
        rowIndex = i + 1;
        break;
      }
    }
    
    if (rowIndex === -1) {
      return NextResponse.json({ error: 'Batch not found' }, { status: 404 });
    }
    
    const values = [[
      id,
      name,
      year,
      status || 'Active'
    ]];
    
    await updateSheet(SHEETS.BATCHES, rowIndex, values);
    
    return NextResponse.json({ success: true, message: 'Batch updated successfully' });
  } catch (error) {
    console.error('Error updating batch:', error);
    return NextResponse.json(
      { error: 'Failed to update batch' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Batch ID is required' }, { status: 400 });
    }
    
    const data = await getSheetData(SHEETS.BATCHES);
    let rowIndex = -1;
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === id) {
        rowIndex = i + 1;
        break;
      }
    }
    
    if (rowIndex === -1) {
      return NextResponse.json({ error: 'Batch not found' }, { status: 404 });
    }
    
    await deleteFromSheet(SHEETS.BATCHES, rowIndex);
    
    return NextResponse.json({ success: true, message: 'Batch deleted successfully' });
  } catch (error) {
    console.error('Error deleting batch:', error);
    return NextResponse.json(
      { error: 'Failed to delete batch' },
      { status: 500 }
    );
  }
}