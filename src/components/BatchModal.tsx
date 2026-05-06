'use client';

import { Modal, Button, Form } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { FiUsers, FiCalendar, FiFlag } from 'react-icons/fi';

interface BatchModalProps {
  show: boolean;
  onHide: () => void;
  mode: 'create' | 'edit' | 'view';
  batchData: any;
  onSave: (data: any) => void;
}

export default function BatchModal({ show, onHide, mode, batchData, onSave }: BatchModalProps) {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    year: '',
    status: 'Active',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isViewMode = mode === 'view';

  useEffect(() => {
    if (batchData && mode !== 'create') {
      setFormData({
        id: batchData.id || '',
        name: batchData.name || '',
        year: batchData.year || '',
        status: batchData.status || 'Active',
      });
    } else {
      setFormData({
        id: '',
        name: '',
        year: new Date().getFullYear().toString(),
        status: 'Active',
      });
    }
  }, [batchData, mode, show]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'Batch name is required';
    if (!formData.year) newErrors.year = 'Year is required';
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
          {mode === 'create' && '👥 Create New Batch'}
          {mode === 'edit' && '✏️ Edit Batch'}
          {mode === 'view' && '👁️ View Batch Details'}
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label><FiUsers className="me-1" /> Batch Name *</Form.Label>
            <Form.Control
              type="text"
              placeholder="e.g., Batch 2024 A"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={isViewMode}
              isInvalid={!!errors.name}
            />
            <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label><FiCalendar className="me-1" /> Year *</Form.Label>
            <Form.Select
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              disabled={isViewMode}
              isInvalid={!!errors.year}
            >
              <option value="">Select Year</option>
              <option value="2023">2023</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.year}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label><FiFlag className="me-1" /> Status</Form.Label>
            <Form.Select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              disabled={isViewMode}
            >
              <option value="Active">Active</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Completed">Completed</option>
            </Form.Select>
          </Form.Group>

          {isViewMode && (
            <div className="mt-3 p-3 bg-light rounded">
              <h6>Batch Summary:</h6>
              <p className="mb-1"><strong>Name:</strong> {formData.name}</p>
              <p className="mb-1"><strong>Year:</strong> {formData.year}</p>
              <p className="mb-0"><strong>Status:</strong> {formData.status}</p>
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
            {mode === 'create' ? 'Create Batch' : 'Save Changes'}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}