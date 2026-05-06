'use client';

import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { FiClock, FiLink, FiUser, FiBook, FiCalendar, FiUsers } from 'react-icons/fi';

interface ClassModalProps {
  show: boolean;
  onHide: () => void;
  mode: 'create' | 'edit' | 'view';
  classData: any;
  courses: any[];
  modules: any[];
  batches: any[];
  lecturers: any[];
  onSave: (data: any) => void;
}

export default function ClassModal({ 
  show, 
  onHide, 
  mode, 
  classData, 
  courses, 
  modules, 
  batches, 
  lecturers, 
  onSave 
}: ClassModalProps) {
  const [formData, setFormData] = useState({
    id: '',
    courseId: '',
    moduleId: '',
    batchId: '',
    lecturerId: '',
    startTime: '',
    endTime: '',
    meetLink: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [filteredModules, setFilteredModules] = useState<any[]>([]);

  const isViewMode = mode === 'view';
  const isEditMode = mode === 'edit';
  const isCreateMode = mode === 'create';

  useEffect(() => {
    if (classData && mode !== 'create') {
      setFormData({
        id: classData.id || '',
        courseId: classData.courseId || '',
        moduleId: classData.moduleId || '',
        batchId: classData.batchId || '',
        lecturerId: classData.lecturerId || '',
        startTime: classData.startTime?.slice(0, 16) || '',
        endTime: classData.endTime?.slice(0, 16) || '',
        meetLink: classData.meetLink || '',
      });
    } else {
      // Set default times for create mode
      const now = new Date();
      const nextHour = new Date(now.setHours(now.getHours() + 1));
      setFormData({
        id: '',
        courseId: '',
        moduleId: '',
        batchId: '',
        lecturerId: '',
        startTime: nextHour.toISOString().slice(0, 16),
        endTime: new Date(nextHour.setHours(nextHour.getHours() + 1)).toISOString().slice(0, 16),
        meetLink: '',
      });
    }
  }, [classData, mode, show]);

  useEffect(() => {
    if (formData.courseId) {
      setFilteredModules(modules.filter(m => m.courseId === formData.courseId));
    } else {
      setFilteredModules(modules);
    }
  }, [formData.courseId, modules]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.courseId) newErrors.courseId = 'Course is required';
    if (!formData.moduleId) newErrors.moduleId = 'Module is required';
    if (!formData.batchId) newErrors.batchId = 'Batch is required';
    if (!formData.lecturerId) newErrors.lecturerId = 'Lecturer is required';
    if (!formData.startTime) newErrors.startTime = 'Start time is required';
    if (!formData.endTime) newErrors.endTime = 'End time is required';
    
    if (formData.startTime && formData.endTime) {
      if (new Date(formData.startTime) >= new Date(formData.endTime)) {
        newErrors.endTime = 'End time must be after start time';
      }
    }
    
    if (formData.meetLink && !formData.meetLink.includes('meet.google.com')) {
      newErrors.meetLink = 'Please enter a valid Google Meet link';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    
    const selectedCourse = courses.find(c => c.id === formData.courseId);
    const selectedModule = modules.find(m => m.id === formData.moduleId);
    const selectedBatch = batches.find(b => b.id === formData.batchId);
    const selectedLecturer = lecturers.find(l => l.id === formData.lecturerId);
    
    onSave({
      ...formData,
      courseName: selectedCourse?.name,
      moduleName: selectedModule?.name,
      batchName: selectedBatch?.name,
      lecturerName: selectedLecturer?.name,
      createdAt: isCreateMode ? new Date().toISOString() : classData?.createdAt,
    });
  };

  const getSelectedNames = () => {
    const course = courses.find(c => c.id === formData.courseId);
    const module = modules.find(m => m.id === formData.moduleId);
    const batch = batches.find(b => b.id === formData.batchId);
    const lecturer = lecturers.find(l => l.id === formData.lecturerId);
    
    return { course, module, batch, lecturer };
  };

  const selected = getSelectedNames();

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {isCreateMode && '📚 Create New Class'}
          {isEditMode && '✏️ Edit Class'}
          {isViewMode && '👁️ View Class Details'}
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        {isViewMode && selected.course && (
          <div className="alert alert-info mb-3">
            <strong>Class Information:</strong> Viewing complete details of the class
          </div>
        )}
        
        <Form>
          <Form.Group className="mb-3">
            <Form.Label><FiBook className="me-1" /> Course Program *</Form.Label>
            <Form.Select
              value={formData.courseId}
              onChange={(e) => setFormData({ ...formData, courseId: e.target.value, moduleId: '' })}
              disabled={isViewMode}
              isInvalid={!!errors.courseId}
            >
              <option value="">Select Course</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.name} ({course.code})
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.courseId}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label><FiBook className="me-1" /> Module *</Form.Label>
            <Form.Select
              value={formData.moduleId}
              onChange={(e) => setFormData({ ...formData, moduleId: e.target.value })}
              disabled={isViewMode || !formData.courseId}
              isInvalid={!!errors.moduleId}
            >
              <option value="">Select Module</option>
              {filteredModules.map(module => (
                <option key={module.id} value={module.id}>{module.name}</option>
              ))}
            </Form.Select>
            {formData.courseId && filteredModules.length === 0 && (
              <small className="text-muted">No modules found for this course</small>
            )}
            <Form.Control.Feedback type="invalid">{errors.moduleId}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label><FiUsers className="me-1" /> Batch *</Form.Label>
            <Form.Select
              value={formData.batchId}
              onChange={(e) => setFormData({ ...formData, batchId: e.target.value })}
              disabled={isViewMode}
              isInvalid={!!errors.batchId}
            >
              <option value="">Select Batch</option>
              {batches.map(batch => (
                <option key={batch.id} value={batch.id}>
                  {batch.name} ({batch.year})
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.batchId}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label><FiUser className="me-1" /> Lecturer *</Form.Label>
            <Form.Select
              value={formData.lecturerId}
              onChange={(e) => setFormData({ ...formData, lecturerId: e.target.value })}
              disabled={isViewMode}
              isInvalid={!!errors.lecturerId}
            >
              <option value="">Select Lecturer</option>
              {lecturers.map(lecturer => (
                <option key={lecturer.id} value={lecturer.id}>
                  {lecturer.name} - {lecturer.department}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.lecturerId}</Form.Control.Feedback>
          </Form.Group>

          <div className="row">
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label><FiClock className="me-1" /> Start Time *</Form.Label>
                <Form.Control
                  type="datetime-local"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  disabled={isViewMode}
                  isInvalid={!!errors.startTime}
                />
                <Form.Control.Feedback type="invalid">{errors.startTime}</Form.Control.Feedback>
              </Form.Group>
            </div>
            
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label><FiClock className="me-1" /> End Time *</Form.Label>
                <Form.Control
                  type="datetime-local"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  disabled={isViewMode}
                  isInvalid={!!errors.endTime}
                />
                <Form.Control.Feedback type="invalid">{errors.endTime}</Form.Control.Feedback>
              </Form.Group>
            </div>
          </div>

          <Form.Group className="mb-3">
            <Form.Label><FiLink className="me-1" /> Google Meet Link *</Form.Label>
            <Form.Control
              type="url"
              placeholder="https://meet.google.com/xxx-xxxx-xxx"
              value={formData.meetLink}
              onChange={(e) => setFormData({ ...formData, meetLink: e.target.value })}
              disabled={isViewMode}
              isInvalid={!!errors.meetLink}
            />
            <Form.Text className="text-muted">
              Example: https://meet.google.com/abc-defg-hij
            </Form.Text>
            <Form.Control.Feedback type="invalid">{errors.meetLink}</Form.Control.Feedback>
          </Form.Group>

          {isViewMode && (
            <div className="mt-3 p-3 bg-light rounded">
              <h6>Class Summary:</h6>
              <p className="mb-1"><strong>Course:</strong> {selected.course?.name}</p>
              <p className="mb-1"><strong>Module:</strong> {selected.module?.name}</p>
              <p className="mb-1"><strong>Batch:</strong> {selected.batch?.name}</p>
              <p className="mb-1"><strong>Lecturer:</strong> {selected.lecturer?.name}</p>
              <p className="mb-1"><strong>Duration:</strong> {new Date(formData.startTime).toLocaleString()} - {new Date(formData.endTime).toLocaleString()}</p>
              <p className="mb-0"><strong>Meeting Link:</strong> <a href={formData.meetLink} target="_blank" rel="noopener noreferrer">{formData.meetLink}</a></p>
            </div>
          )}
        </Form>
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          {isViewMode ? 'Close' : 'Cancel'}
        </Button>
        {!isViewMode && (
          <Button variant="primary" onClick={handleSubmit}>
            {isCreateMode ? 'Create Class' : 'Save Changes'}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}