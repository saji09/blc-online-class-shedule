import { NextRequest, NextResponse } from 'next/server';
import { getSheetData, appendToSheet, updateSheet, deleteFromSheet, SHEETS } from '@/lib/googleSheets';

export async function GET() {
  try {
    // Fetch all data
    const [classesData, coursesData, modulesData, batchesData, lecturersData] = await Promise.all([
      getSheetData(SHEETS.CLASSES),
      getSheetData(SHEETS.COURSES),
      getSheetData(SHEETS.MODULES),
      getSheetData(SHEETS.BATCHES),
      getSheetData(SHEETS.LECTURERS)
    ]);
    
    // Create lookup maps for courses
    const courseMap = new Map();
    if (coursesData && coursesData.length > 1) {
      coursesData.slice(1).forEach((course: any) => {
        if (course[0]) {
          courseMap.set(course[0], { 
            name: course[1] || 'Unknown Course', 
            code: course[2] || '' 
          });
        }
      });
    }
    
    // Create lookup maps for modules
    const moduleMap = new Map();
    if (modulesData && modulesData.length > 1) {
      modulesData.slice(1).forEach((module: any) => {
        if (module[0]) {
          moduleMap.set(module[0], { 
            name: module[1] || 'Unknown Module', 
            courseId: module[2] || '' 
          });
        }
      });
    }
    
    // Create lookup maps for batches
    const batchMap = new Map();
    if (batchesData && batchesData.length > 1) {
      batchesData.slice(1).forEach((batch: any) => {
        if (batch[0]) {
          batchMap.set(batch[0], { 
            name: batch[1] || 'Unknown Batch', 
            year: batch[2] || '' 
          });
        }
      });
    }
    
    // Create lookup maps for lecturers
    const lecturerMap = new Map();
    if (lecturersData && lecturersData.length > 1) {
      lecturersData.slice(1).forEach((lecturer: any) => {
        if (lecturer[0]) {
          lecturerMap.set(lecturer[0], { 
            name: lecturer[1] || 'Unknown Lecturer', 
            email: lecturer[2] || '' 
          });
        }
      });
    }
    
    // Format classes with proper data
    const formattedClasses = [];
    if (classesData && classesData.length > 1) {
      for (let i = 1; i < classesData.length; i++) {
        const cls = classesData[i];
        if (cls && cls.length >= 8) {
          const courseId = cls[1] || '';
          const moduleId = cls[2] || '';
          const batchId = cls[3] || '';
          const lecturerId = cls[4] || '';
          
          formattedClasses.push({
            id: cls[0] || i.toString(),
            courseId: courseId,
            courseName: courseMap.get(courseId)?.name || 'Unknown Course',
            moduleId: moduleId,
            moduleName: moduleMap.get(moduleId)?.name || 'Unknown Module',
            batchId: batchId,
            batchName: batchMap.get(batchId)?.name || 'Unknown Batch',
            lecturerId: lecturerId,
            lecturerName: lecturerMap.get(lecturerId)?.name || 'Unknown Lecturer',
            startTime: cls[5] || '',
            endTime: cls[6] || '',
            meetLink: cls[7] || '',
            createdAt: cls[8] || new Date().toISOString(),
          });
        }
      }
    }
    
    return NextResponse.json(formattedClasses);
  } catch (error) {
    console.error('Error fetching classes:', error);
    return NextResponse.json({ error: 'Failed to fetch classes' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { courseId, moduleId, batchId, lecturerId, startTime, endTime, meetLink } = body;
    
    // Validate required fields
    if (!courseId || !moduleId || !batchId || !lecturerId || !startTime || !endTime || !meetLink) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }
    
    const existingData = await getSheetData(SHEETS.CLASSES);
    const newId = (existingData.length).toString();
    
    const values = [[
      newId,
      courseId,
      moduleId,
      batchId,
      lecturerId,
      startTime,
      endTime,
      meetLink,
      new Date().toISOString(),
    ]];
    
    await appendToSheet(SHEETS.CLASSES, values);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Class created successfully',
      id: newId 
    });
  } catch (error) {
    console.error('Error creating class:', error);
    return NextResponse.json(
      { error: 'Failed to create class' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();
    const { courseId, moduleId, batchId, lecturerId, startTime, endTime, meetLink } = body;
    
    if (!id) {
      return NextResponse.json({ error: 'Class ID is required' }, { status: 400 });
    }
    
    const data = await getSheetData(SHEETS.CLASSES);
    let rowIndex = -1;
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === id) {
        rowIndex = i + 1;
        break;
      }
    }
    
    if (rowIndex === -1) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 });
    }
    
    const values = [[
      id,
      courseId,
      moduleId,
      batchId,
      lecturerId,
      startTime,
      endTime,
      meetLink,
      new Date().toISOString(),
    ]];
    
    await updateSheet(SHEETS.CLASSES, rowIndex, values);
    
    return NextResponse.json({ success: true, message: 'Class updated successfully' });
  } catch (error) {
    console.error('Error updating class:', error);
    return NextResponse.json(
      { error: 'Failed to update class' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Class ID is required' }, { status: 400 });
    }
    
    const data = await getSheetData(SHEETS.CLASSES);
    let rowIndex = -1;
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === id) {
        rowIndex = i + 1;
        break;
      }
    }
    
    if (rowIndex === -1) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 });
    }
    
    await deleteFromSheet(SHEETS.CLASSES, rowIndex);
    
    return NextResponse.json({ success: true, message: 'Class deleted successfully' });
  } catch (error) {
    console.error('Error deleting class:', error);
    return NextResponse.json(
      { error: 'Failed to delete class' },
      { status: 500 }
    );
  }
}