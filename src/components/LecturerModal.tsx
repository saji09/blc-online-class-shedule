'use client';

import { Modal, Button, Form } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { FiUser, FiMail, FiPhone, FiBriefcase } from 'react-icons/fi';

interface LecturerModalProps {
  show: boolean;
  onHide: () => void;
  mode: 'create' | 'edit' | 'view';
  lecturerData: any;
  onSave: (data: any) => void;
}

export default function LecturerModal({ show, onHide, mode, lecturerData, onSave }: LecturerModalProps) {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
    department: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isViewMode = mode === 'view';

  useEffect(() => {
    if (lecturerData && mode !== 'create') {
      setFormData({
        id: lecturerData.id || '',
        name: lecturerData.name || '',
        email: lecturerData.email || '',
        phone: lecturerData.phone || '',
        department: lecturerData.department || '',
      });
    } else {
      setFormData({
        id: '',
        name: '',
        email: '',
        phone: '',
        department: '',
      });
    }
  }, [lecturerData, mode, show]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'Lecturer name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.department) newErrors.department = 'Department is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    onSave(formData);
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {mode === 'create' && '👨‍🏫 Create New Lecturer'}
          {mode === 'edit' && '✏️ Edit Lecturer'}
          {mode === 'view' && '👁️ View Lecturer Details'}
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label><FiUser className="me-1" /> Full Name *</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter lecturer name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={isViewMode}
              isInvalid={!!errors.name}
            />
            <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label><FiMail className="me-1" /> Email Address *</Form.Label>
            <Form.Control
              type="email"
              placeholder="lecturer@blc.edu"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={isViewMode}
              isInvalid={!!errors.email}
            />
            <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label><FiPhone className="me-1" /> Phone Number *</Form.Label>
            <Form.Control
              type="tel"
              placeholder="+1234567890"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              disabled={isViewMode}
              isInvalid={!!errors.phone}
            />
            <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label><FiBriefcase className="me-1" /> Department *</Form.Label>
            <Form.Select
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              disabled={isViewMode}
              isInvalid={!!errors.department}
            >
              <option value="">Select Department</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Software Engineering">Software Engineering</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Data Science">Data Science</option>
              <option value="Cyber Security">Cyber Security</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.department}</Form.Control.Feedback>
          </Form.Group>

          {isViewMode && (
            <div className="mt-3 p-3 bg-light rounded">
              <h6>Lecturer Summary:</h6>
              <p className="mb-1"><strong>Name:</strong> {formData.name}</p>
              <p className="mb-1"><strong>Email:</strong> {formData.email}</p>
              <p className="mb-1"><strong>Phone:</strong> {formData.phone}</p>
              <p className="mb-0"><strong>Department:</strong> {formData.department}</p>
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
            {mode === 'create' ? 'Create Lecturer' : 'Save Changes'}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}