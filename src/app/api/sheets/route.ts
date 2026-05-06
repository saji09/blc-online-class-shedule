import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

// Initialize Google Sheets client
const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_ID;

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ auth, version: 'v4' });

// Sheet names
const SHEETS_CONFIG = {
  CLASSES: 'Classes',
  MODULES: 'Modules',
  BATCHES: 'Batches',
  COURSES: 'Courses',
  LECTURERS: 'Lecturers',
};

// GET: Fetch data from any sheet
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sheetName = searchParams.get('sheet');
    
    if (!sheetName) {
      return NextResponse.json({ error: 'Sheet name is required' }, { status: 400 });
    }
    
    // Validate sheet name
    const validSheets = Object.values(SHEETS_CONFIG);
    if (!validSheets.includes(sheetName)) {
      return NextResponse.json({ error: 'Invalid sheet name' }, { status: 400 });
    }
    
    // Check if spreadsheet ID is configured
    if (!SPREADSHEET_ID) {
      console.error('GOOGLE_SHEETS_ID is not configured');
      return NextResponse.json({ error: 'Google Sheets ID not configured' }, { status: 500 });
    }
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A:Z`,
    });
    
    const rows = response.data.values || [];
    
    // Return data (first row as headers, rest as data)
    if (rows.length === 0) {
      return NextResponse.json({ headers: [], data: [] });
    }
    
    const headers = rows[0];
    const data = rows.slice(1).map((row: any[], index: number) => {
      const item: any = { id: index.toString() };
      headers.forEach((header: string, idx: number) => {
        item[header.toLowerCase()] = row[idx] || '';
      });
      return item;
    });
    
    return NextResponse.json({ headers, data });
    
  } catch (error: any) {
    console.error('Error fetching sheet data:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch data', 
      details: error.message 
    }, { status: 500 });
  }
}

// POST: Append data to a sheet
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sheetName, values } = body;
    
    if (!sheetName || !values || !Array.isArray(values)) {
      return NextResponse.json({ error: 'Sheet name and values array are required' }, { status: 400 });
    }
    
    // Validate sheet name
    const validSheets = Object.values(SHEETS_CONFIG);
    if (!validSheets.includes(sheetName)) {
      return NextResponse.json({ error: 'Invalid sheet name' }, { status: 400 });
    }
    
    if (!SPREADSHEET_ID) {
      return NextResponse.json({ error: 'Google Sheets ID not configured' }, { status: 500 });
    }
    
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A:Z`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [values] },
    });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Data appended successfully',
      updates: response.data 
    });
    
  } catch (error: any) {
    console.error('Error appending data:', error);
    return NextResponse.json({ 
      error: 'Failed to append data', 
      details: error.message 
    }, { status: 500 });
  }
}

// PUT: Update data in a sheet
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { sheetName, rowIndex, values } = body;
    
    if (!sheetName || !rowIndex || !values || !Array.isArray(values)) {
      return NextResponse.json({ error: 'Sheet name, row index, and values array are required' }, { status: 400 });
    }
    
    // Validate sheet name
    const validSheets = Object.values(SHEETS_CONFIG);
    if (!validSheets.includes(sheetName)) {
      return NextResponse.json({ error: 'Invalid sheet name' }, { status: 400 });
    }
    
    if (!SPREADSHEET_ID) {
      return NextResponse.json({ error: 'Google Sheets ID not configured' }, { status: 500 });
    }
    
    const response = await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A${rowIndex}:Z${rowIndex}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [values] },
    });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Data updated successfully',
      updates: response.data 
    });
    
  } catch (error: any) {
    console.error('Error updating data:', error);
    return NextResponse.json({ 
      error: 'Failed to update data', 
      details: error.message 
    }, { status: 500 });
  }
}

// DELETE: Clear data from a sheet row
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sheetName = searchParams.get('sheet');
    const rowIndex = searchParams.get('rowIndex');
    
    if (!sheetName || !rowIndex) {
      return NextResponse.json({ error: 'Sheet name and row index are required' }, { status: 400 });
    }
    
    // Validate sheet name
    const validSheets = Object.values(SHEETS_CONFIG);
    if (!validSheets.includes(sheetName)) {
      return NextResponse.json({ error: 'Invalid sheet name' }, { status: 400 });
    }
    
    if (!SPREADSHEET_ID) {
      return NextResponse.json({ error: 'Google Sheets ID not configured' }, { status: 500 });
    }
    
    const response = await sheets.spreadsheets.values.clear({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A${rowIndex}:Z${rowIndex}`,
    });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Data deleted successfully',
      updates: response.data 
    });
    
  } catch (error: any) {
    console.error('Error deleting data:', error);
    return NextResponse.json({ 
      error: 'Failed to delete data', 
      details: error.message 
    }, { status: 500 });
  }
}

// OPTIONS: Get sheet headers or create new sheet
export async function OPTIONS(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sheetName = searchParams.get('sheet');
    
    if (!sheetName) {
      return NextResponse.json({ error: 'Sheet name is required' }, { status: 400 });
    }
    
    if (!SPREADSHEET_ID) {
      return NextResponse.json({ error: 'Google Sheets ID not configured' }, { status: 500 });
    }
    
    // Try to get existing headers
    try {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${sheetName}!A1:Z1`,
      });
      
      const headers = response.data.values?.[0] || [];
      return NextResponse.json({ headers, exists: true });
      
    } catch (error) {
      // Sheet doesn't exist, create default headers
      const defaultHeaders: Record<string, string[]> = {
        [SHEETS_CONFIG.CLASSES]: ['ID', 'CourseID', 'ModuleID', 'BatchID', 'LecturerID', 'StartTime', 'EndTime', 'MeetLink', 'CreatedAt'],
        [SHEETS_CONFIG.MODULES]: ['ID', 'Name', 'CourseID', 'Description'],
        [SHEETS_CONFIG.BATCHES]: ['ID', 'Name', 'Year', 'Status'],
        [SHEETS_CONFIG.COURSES]: ['ID', 'Name', 'Code', 'Duration', 'Description'],
        [SHEETS_CONFIG.LECTURERS]: ['ID', 'Name', 'Email', 'Phone', 'Department'],
      };
      
      const headers = defaultHeaders[sheetName] || ['ID', 'Name', 'CreatedAt'];
      
      // Create the sheet with headers
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${sheetName}!A1:Z1`,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [headers] },
      });
      
      return NextResponse.json({ headers, exists: false, created: true });
    }
    
  } catch (error: any) {
    console.error('Error checking sheet:', error);
    return NextResponse.json({ 
      error: 'Failed to check sheet', 
      details: error.message 
    }, { status: 500 });
  }
}

// Helper function to batch write multiple rows
export async function batchWrite(sheetName: string, values: any[][]) {
  try {
    if (!SPREADSHEET_ID) {
      throw new Error('Google Sheets ID not configured');
    }
    
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A:Z`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error in batch write:', error);
    throw error;
  }
}

// Helper function to get all sheet names
export async function getSheetNames() {
  try {
    if (!SPREADSHEET_ID) {
      throw new Error('Google Sheets ID not configured');
    }
    
    const response = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });
    const sheetList = response.data.sheets as any[];
    return sheetList?.map((sheet: any) => sheet.properties?.title) || [];

  } catch (error) {
    console.error('Error getting sheet names:', error);
    return [];
  }
}