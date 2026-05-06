'use client';

import { Modal, Button, Form } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { FiBook, FiFolder, FiFileText } from 'react-icons/fi';

interface ModuleModalProps {
  show: boolean;
  onHide: () => void;
  mode: 'create' | 'edit' | 'view';
  moduleData: any;
  courses: any[];
  onSave: (data: any) => void;
}

export default function ModuleModal({ show, onHide, mode, moduleData, courses, onSave }: ModuleModalProps) {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    courseId: '',
    description: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isViewMode = mode === 'view';

  useEffect(() => {
    if (moduleData && mode !== 'create') {
      setFormData({
        id: moduleData.id || '',
        name: moduleData.name || '',
        courseId: moduleData.courseId || '',
        description: moduleData.description || '',
      });
    } else {
      setFormData({
        id: '',
        name: '',
        courseId: '',
        description: '',
      });
    }
  }, [moduleData, mode, show]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'Module name is required';
    if (!formData.courseId) newErrors.courseId = 'Course is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    onSave(formData);
  };

  const selectedCourse = courses.find(c => c.id === formData.courseId);

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {mode === 'create' && '📖 Create New Module'}
          {mode === 'edit' && '✏️ Edit Module'}
          {mode === 'view' && '👁️ View Module Details'}
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label><FiBook className="me-1" /> Module Name *</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter module name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={isViewMode}
              isInvalid={!!errors.name}
            />
            <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label><FiFolder className="me-1" /> Associated Course *</Form.Label>
            <Form.Select
              value={formData.courseId}
              onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
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
            <Form.Label><FiFileText className="me-1" /> Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter module description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              disabled={isViewMode}
            />
          </Form.Group>

          {isViewMode && (
            <div className="mt-3 p-3 bg-light rounded">
              <h6>Module Summary:</h6>
              <p className="mb-1"><strong>Name:</strong> {formData.name}</p>
              <p className="mb-1"><strong>Course:</strong> {selectedCourse?.name || 'N/A'}</p>
              <p className="mb-0"><strong>Description:</strong> {formData.description || 'N/A'}</p>
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
            {mode === 'create' ? 'Create Module' : 'Save Changes'}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}