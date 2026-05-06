import { google } from 'googleapis';

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_ID;

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ auth, version: 'v4' });

export const SHEETS = {
  CLASSES: 'Classes',
  MODULES: 'Modules',
  BATCHES: 'Batches',
  COURSES: 'Courses',
  LECTURERS: 'Lecturers',
};

// Initialize Google Sheets with headers
export async function initializeSheets() {
  const headers = {
    [SHEETS.CLASSES]: ['ID', 'CourseID', 'ModuleID', 'BatchID', 'LecturerID', 'StartTime', 'EndTime', 'MeetLink', 'CreatedAt'],
    [SHEETS.MODULES]: ['ID', 'Name', 'CourseID', 'Description'],
    [SHEETS.BATCHES]: ['ID', 'Name', 'Year', 'Status'],
    [SHEETS.COURSES]: ['ID', 'Name', 'Code', 'Duration', 'Description'],
    [SHEETS.LECTURERS]: ['ID', 'Name', 'Email', 'Phone', 'Department'],
  };

  for (const [sheet, header] of Object.entries(headers)) {
    try {
      // Check if sheet exists
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${sheet}!A1:Z1`,
      });
      
      if (!response.data.values || response.data.values.length === 0) {
        // Add headers if sheet is empty
        await sheets.spreadsheets.values.update({
          spreadsheetId: SPREADSHEET_ID,
          range: `${sheet}!A1:Z1`,
          valueInputOption: 'USER_ENTERED',
          requestBody: { values: [header] },
        });
        console.log(`Created headers for ${sheet}`);
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        // Sheet doesn't exist, create it with headers
        await sheets.spreadsheets.values.update({
          spreadsheetId: SPREADSHEET_ID,
          range: `${sheet}!A1:Z1`,
          valueInputOption: 'USER_ENTERED',
          requestBody: { values: [header] },
        });
        console.log(`Created sheet ${sheet}`);
      } else {
        console.error(`Error with sheet ${sheet}:`, error.message);
      }
    }
  }
}

export async function getSheetData(sheetName: string) {
  try {
    if (!SPREADSHEET_ID) {
      console.error('GOOGLE_SHEETS_ID is not configured');
      return [];
    }
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A:Z`,
    });
    return response.data.values || [];
  } catch (error) {
    console.error(`Error fetching data from ${sheetName}:`, error);
    return [];
  }
}

export async function appendToSheet(sheetName: string, values: any[][]) {
  try {
    if (!SPREADSHEET_ID) {
      throw new Error('GOOGLE_SHEETS_ID is not configured');
    }
    
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A:Z`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values },
    });
    return response.data;
  } catch (error) {
    console.error(`Error appending to ${sheetName}:`, error);
    throw error;
  }
}

export async function updateSheet(sheetName: string, rowIndex: number, values: any[][]) {
  try {
    if (!SPREADSHEET_ID) {
      throw new Error('GOOGLE_SHEETS_ID is not configured');
    }
    
    const response = await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A${rowIndex}:Z${rowIndex}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values },
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating ${sheetName}:`, error);
    throw error;
  }
}

export async function deleteFromSheet(sheetName: string, rowIndex: number) {
  try {
    if (!SPREADSHEET_ID) {
      throw new Error('GOOGLE_SHEETS_ID is not configured');
    }
    
    // Clear the row data
    const response = await sheets.spreadsheets.values.clear({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A${rowIndex}:Z${rowIndex}`,
    });
    return response.data;
  } catch (error) {
    console.error(`Error deleting from ${sheetName}:`, error);
    throw error;
  }
}

export async function getSheetRowCount(sheetName: string) {
  try {
    const data = await getSheetData(sheetName);
    return data.length;
  } catch (error) {
    return 0;
  }
}