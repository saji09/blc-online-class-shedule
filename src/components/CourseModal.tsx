'use client';

import { Modal, Button, Form } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { FiBook, FiCode, FiClock, FiFileText } from 'react-icons/fi';

interface CourseModalProps {
  show: boolean;
  onHide: () => void;
  mode: 'create' | 'edit' | 'view';
  courseData: any;
  onSave: (data: any) => void;
}

export default function CourseModal({ show, onHide, mode, courseData, onSave }: CourseModalProps) {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    code: '',
    duration: '',
    description: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isViewMode = mode === 'view';
  const isEditMode = mode === 'edit';
  const isCreateMode = mode === 'create';

  useEffect(() => {
    if (courseData && (mode === 'edit' || mode === 'view')) {
      console.log('Loading course data into modal:', courseData);
      setFormData({
        id: courseData.id || '',
        name: courseData.name || '',
        code: courseData.code || '',
        duration: courseData.duration || '',
        description: courseData.description || '',
      });
    } else if (mode === 'create') {
      setFormData({
        id: '',
        name: '',
        code: '',
        duration: '',
        description: '',
      });
    }
  }, [courseData, mode, show]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Course name is required';
    if (!formData.code.trim()) newErrors.code = 'Course code is required';
    if (!formData.duration) newErrors.duration = 'Duration is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    console.log('Saving course:', formData);
    onSave(formData);
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {isCreateMode && '📚 Create New Course'}
          {isEditMode && '✏️ Edit Course'}
          {isViewMode && '👁️ View Course Details'}
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label><FiBook className="me-1" /> Course Name *</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter course name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={isViewMode}
              isInvalid={!!errors.name}
            />
            <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label><FiCode className="me-1" /> Course Code *</Form.Label>
            <Form.Control
              type="text"
              placeholder="e.g., CS101, SE201"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              disabled={isViewMode}
              isInvalid={!!errors.code}
            />
            <Form.Control.Feedback type="invalid">{errors.code}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label><FiClock className="me-1" /> Duration *</Form.Label>
            <Form.Select
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              disabled={isViewMode}
              isInvalid={!!errors.duration}
            >
              <option value="">Select Duration</option>
              <option value="1 Year">1 Year</option>
              <option value="2 Years">2 Years</option>
              <option value="3 Years">3 Years</option>
              <option value="4 Years">4 Years</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.duration}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label><FiFileText className="me-1" /> Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter course description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              disabled={isViewMode}
            />
          </Form.Group>

          {isViewMode && (
            <div className="mt-3 p-3 bg-light rounded">
              <h6>Course Summary:</h6>
              <p className="mb-1"><strong>Name:</strong> {formData.name}</p>
              <p className="mb-1"><strong>Code:</strong> {formData.code}</p>
              <p className="mb-1"><strong>Duration:</strong> {formData.duration}</p>
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
            {isCreateMode ? 'Create Course' : 'Save Changes'}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}