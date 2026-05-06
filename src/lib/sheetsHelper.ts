import { google } from 'googleapis';
import { getSheetData, appendToSheet, updateSheet, deleteFromSheet, SHEETS } from './googleSheets';

// Initialize all sheets with default data
export async function initializeAllSheets() {
  try {
    // Check if sheets exist and have data
    const courses = await getSheetData(SHEETS.COURSES);
    if (courses.length <= 1) {
      // Add sample data
      await appendToSheet(SHEETS.COURSES, [
        ['1', 'Computer Science', 'CS101', '4 Years', 'Bachelor in Computer Science'],
        ['2', 'Software Engineering', 'SE101', '4 Years', 'Bachelor in Software Engineering'],
        ['3', 'Information Technology', 'IT101', '3 Years', 'Bachelor in Information Technology'],
      ]);
      console.log('Sample courses added');
    }
    
    const modules = await getSheetData(SHEETS.MODULES);
    if (modules.length <= 1) {
      await appendToSheet(SHEETS.MODULES, [
        ['1', 'Web Development', '1', 'Modern web development with React'],
        ['2', 'Database Systems', '1', 'SQL and NoSQL databases'],
        ['3', 'Mobile Development', '2', 'React Native and Flutter'],
      ]);
      console.log('Sample modules added');
    }
    
    const batches = await getSheetData(SHEETS.BATCHES);
    if (batches.length <= 1) {
      await appendToSheet(SHEETS.BATCHES, [
        ['1', 'Batch 2024 A', '2024', 'Active'],
        ['2', 'Batch 2024 B', '2024', 'Active'],
        ['3', 'Batch 2023 A', '2023', 'Completed'],
      ]);
      console.log('Sample batches added');
    }
    
    const lecturers = await getSheetData(SHEETS.LECTURERS);
    if (lecturers.length <= 1) {
      await appendToSheet(SHEETS.LECTURERS, [
        ['1', 'Dr. John Smith', 'john@blc.edu', '+1234567890', 'Computer Science'],
        ['2', 'Prof. Jane Doe', 'jane@blc.edu', '+1234567891', 'Software Engineering'],
        ['3', 'Dr. Robert Johnson', 'robert@blc.edu', '+1234567892', 'Information Technology'],
      ]);
      console.log('Sample lecturers added');
    }
    
    return { success: true, message: 'Sheets initialized successfully' };
  } catch (error) {
    console.error('Error initializing sheets:', error);
    return { success: false, error: 'Failed to initialize sheets' };
  }
}

// Get formatted data for display
export async function getFormattedClasses() {
  try {
    const classes = await getSheetData(SHEETS.CLASSES);
    const courses = await getSheetData(SHEETS.COURSES);
    const modules = await getSheetData(SHEETS.MODULES);
    const batches = await getSheetData(SHEETS.BATCHES);
    const lecturers = await getSheetData(SHEETS.LECTURERS);
    
    // Create lookup maps
    const courseMap = new Map();
    if (courses && courses.length > 1) {
      courses.slice(1).forEach((course: any) => {
        if (course[0]) {
          courseMap.set(course[0], { name: course[1] || 'Unknown', code: course[2] || '' });
        }
      });
    }
    
    const moduleMap = new Map();
    if (modules && modules.length > 1) {
      modules.slice(1).forEach((module: any) => {
        if (module[0]) {
          moduleMap.set(module[0], { name: module[1] || 'Unknown', courseId: module[2] || '' });
        }
      });
    }
    
    const batchMap = new Map();
    if (batches && batches.length > 1) {
      batches.slice(1).forEach((batch: any) => {
        if (batch[0]) {
          batchMap.set(batch[0], { name: batch[1] || 'Unknown', year: batch[2] || '' });
        }
      });
    }
    
    const lecturerMap = new Map();
    if (lecturers && lecturers.length > 1) {
      lecturers.slice(1).forEach((lecturer: any) => {
        if (lecturer[0]) {
          lecturerMap.set(lecturer[0], { name: lecturer[1] || 'Unknown', email: lecturer[2] || '' });
        }
      });
    }
    
    // Format classes data
    const formattedClasses = [];
    if (classes && classes.length > 1) {
      for (let i = 1; i < classes.length; i++) {
        const cls = classes[i];
        if (cls && cls.length >= 8) {
          formattedClasses.push({
            id: cls[0] || i.toString(),
            courseId: cls[1] || '',
            courseName: courseMap.get(cls[1])?.name || 'Unknown Course',
            moduleId: cls[2] || '',
            moduleName: moduleMap.get(cls[2])?.name || 'Unknown Module',
            batchId: cls[3] || '',
            batchName: batchMap.get(cls[3])?.name || 'Unknown Batch',
            lecturerId: cls[4] || '',
            lecturerName: lecturerMap.get(cls[4])?.name || 'Unknown Lecturer',
            startTime: cls[5] || '',
            endTime: cls[6] || '',
            meetLink: cls[7] || '',
            createdAt: cls[8] || new Date().toISOString(),
          });
        }
      }
    }
    
    return formattedClasses;
  } catch (error) {
    console.error('Error getting formatted classes:', error);
    return [];
  }
}

// Validate Google Sheets connection
export async function testSheetsConnection() {
  try {
    const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
    
    if (!spreadsheetId) {
      return { success: false, error: 'GOOGLE_SHEETS_ID is not configured' };
    }
    
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    
    const sheets = google.sheets({ auth, version: 'v4' });
    
    const response = await sheets.spreadsheets.get({
      spreadsheetId: spreadsheetId,
    });
    
    return { 
      success: true, 
      message: 'Connection successful', 
      spreadsheetTitle: response.data.properties?.title 
    };
  } catch (error: any) {
    console.error('Connection test failed:', error);
    return { success: false, error: error.message };
  }
}

// Add a new course
export async function addCourse(name: string, code: string, duration: string, description: string = '') {
  try {
    const existingData = await getSheetData(SHEETS.COURSES);
    const newId = (existingData.length).toString();
    
    await appendToSheet(SHEETS.COURSES, [[newId, name, code, duration, description]]);
    return { success: true, id: newId };
  } catch (error) {
    console.error('Error adding course:', error);
    return { success: false, error: 'Failed to add course' };
  }
}

// Add a new module
export async function addModule(name: string, courseId: string, description: string = '') {
  try {
    const existingData = await getSheetData(SHEETS.MODULES);
    const newId = (existingData.length).toString();
    
    await appendToSheet(SHEETS.MODULES, [[newId, name, courseId, description]]);
    return { success: true, id: newId };
  } catch (error) {
    console.error('Error adding module:', error);
    return { success: false, error: 'Failed to add module' };
  }
}

// Add a new batch
export async function addBatch(name: string, year: string, status: string = 'Active') {
  try {
    const existingData = await getSheetData(SHEETS.BATCHES);
    const newId = (existingData.length).toString();
    
    await appendToSheet(SHEETS.BATCHES, [[newId, name, year, status]]);
    return { success: true, id: newId };
  } catch (error) {
    console.error('Error adding batch:', error);
    return { success: false, error: 'Failed to add batch' };
  }
}

// Add a new lecturer
export async function addLecturer(name: string, email: string, phone: string, department: string) {
  try {
    const existingData = await getSheetData(SHEETS.LECTURERS);
    const newId = (existingData.length).toString();
    
    await appendToSheet(SHEETS.LECTURERS, [[newId, name, email, phone, department]]);
    return { success: true, id: newId };
  } catch (error) {
    console.error('Error adding lecturer:', error);
    return { success: false, error: 'Failed to add lecturer' };
  }
}

// Add a new class
export async function addClass(
  courseId: string,
  moduleId: string,
  batchId: string,
  lecturerId: string,
  startTime: string,
  endTime: string,
  meetLink: string
) {
  try {
    const existingData = await getSheetData(SHEETS.CLASSES);
    const newId = (existingData.length).toString();
    
    await appendToSheet(SHEETS.CLASSES, [[
      newId, courseId, moduleId, batchId, lecturerId, startTime, endTime, meetLink, new Date().toISOString()
    ]]);
    return { success: true, id: newId };
  } catch (error) {
    console.error('Error adding class:', error);
    return { success: false, error: 'Failed to add class' };
  }
}