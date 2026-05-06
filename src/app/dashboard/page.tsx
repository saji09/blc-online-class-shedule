'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import ClassesTable from '@/components/ClassesTable';
import ClassModal from '@/components/ClassModal';
import CourseModal from '@/components/CourseModal';
import ModuleModal from '@/components/ModuleModal';
import BatchModal from '@/components/BatchModal';
import LecturerModal from '@/components/LecturerModal';
import AnalyticsChart from '@/components/AnalyticsChart';
import Navbar from '@/components/Navbar';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Class, Course, Module, Batch, Lecturer } from '@/lib/types';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [selectedLecturer, setSelectedLecturer] = useState<Lecturer | null>(null);
  const [classes, setClasses] = useState<Class[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  // Check screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(true); // Keep sidebar open on desktop
      } else {
        setSidebarOpen(false); // Keep sidebar closed on mobile
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle mounting and authentication
  useEffect(() => {
    setMounted(true);
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn || isLoggedIn !== 'true') {
      router.replace('/login');
    } else {
      fetchAllData();
    }
  }, [router]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchClasses(),
        fetchCourses(),
        fetchModules(),
        fetchBatches(),
        fetchLecturers()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await fetch('/api/classes');
      const data = await response.json();
      setClasses(data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses');
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchModules = async () => {
    try {
      const response = await fetch('/api/modules');
      const data = await response.json();
      setModules(data);
    } catch (error) {
      console.error('Error fetching modules:', error);
    }
  };

  const fetchBatches = async () => {
    try {
      const response = await fetch('/api/batches');
      const data = await response.json();
      setBatches(data);
    } catch (error) {
      console.error('Error fetching batches:', error);
    }
  };

  const fetchLecturers = async () => {
    try {
      const response = await fetch('/api/lecturers');
      const data = await response.json();
      setLecturers(data);
    } catch (error) {
      console.error('Error fetching lecturers:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    document.cookie = "isLoggedIn=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push('/login');
  };

  // Course CRUD
  const handleCreateCourse = async (courseData: any) => {
    try {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(courseData),
      });
      if (response.ok) {
        await fetchCourses();
        setShowModal(false);
        alert('Course created successfully!');
      }
    } catch (error) {
      console.error('Error creating course:', error);
      alert('Failed to create course');
    }
  };

  const handleUpdateCourse = async (courseData: any) => {
    try {
      const response = await fetch(`/api/courses?id=${courseData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(courseData),
      });
      if (response.ok) {
        await fetchCourses();
        setShowModal(false);
        alert('Course updated successfully!');
      }
    } catch (error) {
      console.error('Error updating course:', error);
      alert('Failed to update course');
    }
  };

  const handleDeleteCourse = async (id: string) => {
    try {
      const response = await fetch(`/api/courses?id=${id}`, { method: 'DELETE' });
      if (response.ok) {
        await fetchCourses();
        alert('Course deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Failed to delete course');
    }
  };

  // Module CRUD
  const handleCreateModule = async (moduleData: any) => {
    try {
      const response = await fetch('/api/modules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(moduleData),
      });
      if (response.ok) {
        await fetchModules();
        setShowModal(false);
        alert('Module created successfully!');
      }
    } catch (error) {
      console.error('Error creating module:', error);
      alert('Failed to create module');
    }
  };

  const handleUpdateModule = async (moduleData: any) => {
    try {
      const response = await fetch(`/api/modules?id=${moduleData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(moduleData),
      });
      if (response.ok) {
        await fetchModules();
        setShowModal(false);
        alert('Module updated successfully!');
      }
    } catch (error) {
      console.error('Error updating module:', error);
      alert('Failed to update module');
    }
  };

  const handleDeleteModule = async (id: string) => {
    try {
      const response = await fetch(`/api/modules?id=${id}`, { method: 'DELETE' });
      if (response.ok) {
        await fetchModules();
        alert('Module deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting module:', error);
      alert('Failed to delete module');
    }
  };

  // Batch CRUD
  const handleCreateBatch = async (batchData: any) => {
    try {
      const response = await fetch('/api/batches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(batchData),
      });
      if (response.ok) {
        await fetchBatches();
        setShowModal(false);
        alert('Batch created successfully!');
      }
    } catch (error) {
      console.error('Error creating batch:', error);
      alert('Failed to create batch');
    }
  };

  const handleUpdateBatch = async (batchData: any) => {
    try {
      const response = await fetch(`/api/batches?id=${batchData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(batchData),
      });
      if (response.ok) {
        await fetchBatches();
        setShowModal(false);
        alert('Batch updated successfully!');
      }
    } catch (error) {
      console.error('Error updating batch:', error);
      alert('Failed to update batch');
    }
  };

  const handleDeleteBatch = async (id: string) => {
    try {
      const response = await fetch(`/api/batches?id=${id}`, { method: 'DELETE' });
      if (response.ok) {
        await fetchBatches();
        alert('Batch deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting batch:', error);
      alert('Failed to delete batch');
    }
  };

  // Lecturer CRUD
  const handleCreateLecturer = async (lecturerData: any) => {
    try {
      const response = await fetch('/api/lecturers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lecturerData),
      });
      if (response.ok) {
        await fetchLecturers();
        setShowModal(false);
        alert('Lecturer created successfully!');
      }
    } catch (error) {
      console.error('Error creating lecturer:', error);
      alert('Failed to create lecturer');
    }
  };

  const handleUpdateLecturer = async (lecturerData: any) => {
    try {
      const response = await fetch(`/api/lecturers?id=${lecturerData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lecturerData),
      });
      if (response.ok) {
        await fetchLecturers();
        setShowModal(false);
        alert('Lecturer updated successfully!');
      }
    } catch (error) {
      console.error('Error updating lecturer:', error);
      alert('Failed to update lecturer');
    }
  };

  const handleDeleteLecturer = async (id: string) => {
    try {
      const response = await fetch(`/api/lecturers?id=${id}`, { method: 'DELETE' });
      if (response.ok) {
        await fetchLecturers();
        alert('Lecturer deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting lecturer:', error);
      alert('Failed to delete lecturer');
    }
  };

  // Class CRUD
  const handleCreateClass = async (classData: any) => {
    try {
      const response = await fetch('/api/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(classData),
      });
      
      if (response.ok) {
        await fetchClasses();
        setShowModal(false);
        
        const message = generateWhatsAppMessage(classData);
        const confirmSend = confirm('Class created successfully! Do you want to share via WhatsApp?');
        if (confirmSend) {
          window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
        }
      }
    } catch (error) {
      console.error('Error creating class:', error);
      alert('Failed to create class');
    }
  };

  const handleUpdateClass = async (classData: any) => {
    try {
      const response = await fetch(`/api/classes?id=${classData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(classData),
      });
      
      if (response.ok) {
        await fetchClasses();
        setShowModal(false);
        alert('Class updated successfully!');
      }
    } catch (error) {
      console.error('Error updating class:', error);
      alert('Failed to update class');
    }
  };

  const handleDeleteClass = async (id: string) => {
    try {
      const response = await fetch(`/api/classes?id=${id}`, { method: 'DELETE' });
      
      if (response.ok) {
        await fetchClasses();
        alert('Class deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting class:', error);
      alert('Failed to delete class');
    }
  };

  const generateWhatsAppMessage = (classData: any) => {
    const startTime = new Date(classData.startTime).toLocaleString();
    const endTime = new Date(classData.endTime).toLocaleString();
    
    return `📚 Class Details - BLC Campus 📚

Course: ${classData.courseName}
Module: ${classData.moduleName}
Batch: ${classData.batchName}
Lecturer: ${classData.lecturerName}
Time: ${startTime} - ${endTime}
Google Meet: ${classData.meetLink}

Please join the class on time.`;
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return <AnalyticsChart classes={classes} />;
        
      case 'classes':
        return (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
              <h3 className="mb-2 mb-md-0">Manage Classes</h3>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  setModalMode('create');
                  setSelectedClass(null);
                  setShowModal(true);
                }}
              >
                + Create New Class
              </button>
            </div>
            <ClassesTable 
              data={classes} 
              onEdit={(classItem) => {
                setModalMode('edit');
                setSelectedClass(classItem);
                setShowModal(true);
              }}
              onView={(classItem) => {
                setModalMode('view');
                setSelectedClass(classItem);
                setShowModal(true);
              }}
              onDelete={handleDeleteClass}
            />
          </div>
        );
        
      case 'courses':
        return (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3>Manage Courses</h3>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  setModalMode('create');
                  setSelectedCourse(null);
                  setShowModal(true);
                }}
              >
                + Add Course
              </button>
            </div>
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Course Name</th>
                    <th>Code</th>
                    <th>Duration</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr key={course.id}>
                      <td>{course.name}</td>
                      <td>{course.code}</td>
                      <td>{course.duration}</td>
                      <td>{course.description || '-'}</td>
                      <td>
                        <button 
                          className="btn btn-sm btn-info me-2"
                          onClick={() => {
                            setModalMode('view');
                            setSelectedCourse(course);
                            setShowModal(true);
                          }}
                        >
                          View
                        </button>
                        <button 
                          className="btn btn-sm btn-warning me-2"
                          onClick={() => {
                            setModalMode('edit');
                            setSelectedCourse(course);
                            setShowModal(true);
                          }}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDeleteCourse(course.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
        
      case 'modules':
        return (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3>Manage Modules</h3>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  setModalMode('create');
                  setSelectedModule(null);
                  setShowModal(true);
                }}
              >
                + Add Module
              </button>
            </div>
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Module Name</th>
                    <th>Course</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {modules.map((module) => (
                    <tr key={module.id}>
                      <td>{module.name}</td>
                      <td>{module.courseName || '-'}</td>
                      <td>{module.description || '-'}</td>
                      <td>
                        <button 
                          className="btn btn-sm btn-info me-2"
                          onClick={() => {
                            setModalMode('view');
                            setSelectedModule(module);
                            setShowModal(true);
                          }}
                        >
                          View
                        </button>
                        <button 
                          className="btn btn-sm btn-warning me-2"
                          onClick={() => {
                            setModalMode('edit');
                            setSelectedModule(module);
                            setShowModal(true);
                          }}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDeleteModule(module.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
        
      case 'batches':
        return (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3>Manage Batches</h3>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  setModalMode('create');
                  setSelectedBatch(null);
                  setShowModal(true);
                }}
              >
                + Add Batch
              </button>
            </div>
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Batch Name</th>
                    <th>Year</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {batches.map((batch) => (
                    <tr key={batch.id}>
                      <td>{batch.name}</td>
                      <td>{batch.year}</td>
                      <td>{batch.status}</td>
                      <td>
                        <button 
                          className="btn btn-sm btn-info me-2"
                          onClick={() => {
                            setModalMode('view');
                            setSelectedBatch(batch);
                            setShowModal(true);
                          }}
                        >
                          View
                        </button>
                        <button 
                          className="btn btn-sm btn-warning me-2"
                          onClick={() => {
                            setModalMode('edit');
                            setSelectedBatch(batch);
                            setShowModal(true);
                          }}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDeleteBatch(batch.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
        
      case 'lecturers':
        return (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3>Manage Lecturers</h3>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  setModalMode('create');
                  setSelectedLecturer(null);
                  setShowModal(true);
                }}
              >
                + Add Lecturer
              </button>
            </div>
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Department</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {lecturers.map((lecturer) => (
                    <tr key={lecturer.id}>
                      <td>{lecturer.name}</td>
                      <td>{lecturer.email}</td>
                      <td>{lecturer.department}</td>
                      <td>
                        <button 
                          className="btn btn-sm btn-info me-2"
                          onClick={() => {
                            setModalMode('view');
                            setSelectedLecturer(lecturer);
                            setShowModal(true);
                          }}
                        >
                          View
                        </button>
                        <button 
                          className="btn btn-sm btn-warning me-2"
                          onClick={() => {
                            setModalMode('edit');
                            setSelectedLecturer(lecturer);
                            setShowModal(true);
                          }}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDeleteLecturer(lecturer.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
        
      default:
        return <div>Content for {activeTab}</div>;
    }
  };

  // Show loading spinner while checking auth or fetching data
  if (!mounted || loading) {
    return <LoadingSpinner />;
  }

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh',
      backgroundColor: '#f8f9fa'
    }}>
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      
      {/* Main Content Area with proper margin for sidebar */}
      <div style={{
        flex: 1,
        marginLeft: !isMobile && sidebarOpen ? '260px' : '0',
        transition: 'margin-left 0.3s ease-in-out',
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Navbar onLogout={handleLogout} onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main style={{
          flex: 1,
          padding: isMobile ? '1rem' : '1.5rem',
          backgroundColor: '#f8f9fa'
        }}>
          {renderContent()}
        </main>
      </div>
      
      {/* Modals */}
      <ClassModal
        show={showModal && activeTab === 'classes'}
        onHide={() => setShowModal(false)}
        mode={modalMode}
        classData={selectedClass}
        courses={courses}
        modules={modules}
        batches={batches}
        lecturers={lecturers}
        onSave={modalMode === 'create' ? handleCreateClass : handleUpdateClass}
      />
      
      <CourseModal
        show={showModal && activeTab === 'courses'}
        onHide={() => setShowModal(false)}
        mode={modalMode}
        courseData={selectedCourse}
        onSave={modalMode === 'create' ? handleCreateCourse : handleUpdateCourse}
      />
      
      <ModuleModal
        show={showModal && activeTab === 'modules'}
        onHide={() => setShowModal(false)}
        mode={modalMode}
        moduleData={selectedModule}
        courses={courses}
        onSave={modalMode === 'create' ? handleCreateModule : handleUpdateModule}
      />
      
      <BatchModal
        show={showModal && activeTab === 'batches'}
        onHide={() => setShowModal(false)}
        mode={modalMode}
        batchData={selectedBatch}
        onSave={modalMode === 'create' ? handleCreateBatch : handleUpdateBatch}
      />
      
      <LecturerModal
        show={showModal && activeTab === 'lecturers'}
        onHide={() => setShowModal(false)}
        mode={modalMode}
        lecturerData={selectedLecturer}
        onSave={modalMode === 'create' ? handleCreateLecturer : handleUpdateLecturer}
      />
    </div>
  );
}