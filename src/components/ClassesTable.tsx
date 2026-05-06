'use client';

import { useState } from 'react';
import { FiEdit, FiEye, FiTrash2, FiSearch, FiCalendar, FiDownload, FiCopy, FiShare2 } from 'react-icons/fi';

interface ClassesTableProps {
  data: any[];
  onEdit: (item: any) => void;
  onView: (item: any) => void;
  onDelete: (id: string) => void;
}

export default function ClassesTable({ data, onEdit, onView, onDelete }: ClassesTableProps) {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const columns = [
    { key: 'courseName', label: 'Course' },
    { key: 'moduleName', label: 'Module' },
    { key: 'batchName', label: 'Batch' },
    { key: 'lecturerName', label: 'Lecturer' },
    { key: 'startTime', label: 'Start Time' },
    { key: 'endTime', label: 'End Time' },
  ];

  // Filter data
  let filteredData = data.filter(item => {
    const matchesSearch = Object.values(item).some(value => 
      String(value).toLowerCase().includes(search.toLowerCase())
    );
    
    const matchesDate = !dateFilter || 
      (item.startTime && new Date(item.startTime).toDateString() === new Date(dateFilter).toDateString());
    
    const matchesStatus = !statusFilter || 
      (statusFilter === 'upcoming' && item.startTime && new Date(item.startTime) > new Date()) ||
      (statusFilter === 'ongoing' && item.startTime && item.endTime && 
        new Date(item.startTime) <= new Date() && new Date(item.endTime) >= new Date()) ||
      (statusFilter === 'completed' && item.endTime && new Date(item.endTime) < new Date());
    
    return matchesSearch && matchesDate && matchesStatus;
  });

  // Sort data
  if (sortField) {
    filteredData.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      
      if (sortField.includes('Time')) {
        aVal = aVal ? new Date(aVal).getTime() : 0;
        bVal = bVal ? new Date(bVal).getTime() : 0;
      }
      
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const exportToCSV = () => {
    const headers = columns.map(col => col.label);
    const csvData = filteredData.map(item => 
      columns.map(col => {
        if (col.key.includes('Time') && item[col.key]) {
          return formatDateTime(item[col.key]);
        }
        return item[col.key] || '';
      }).join(',')
    );
    const csv = [headers.join(','), ...csvData].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'classes-data.csv';
    a.click();
  };

  const formatDateTime = (dateTime: string) => {
    if (!dateTime || dateTime === 'Invalid Date') return 'Not scheduled';
    try {
      const date = new Date(dateTime);
      if (isNaN(date.getTime())) return 'Invalid date';
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Invalid date';
    }
  };

  const getStatusBadge = (startTime: string, endTime: string) => {
    if (!startTime || !endTime) return <span className="badge bg-secondary">Not Scheduled</span>;
    
    try {
      const now = new Date();
      const start = new Date(startTime);
      const end = new Date(endTime);
      
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return <span className="badge bg-secondary">Invalid Date</span>;
      }
      
      if (now < start) return <span className="badge bg-warning">Upcoming</span>;
      if (now >= start && now <= end) return <span className="badge bg-success">Ongoing</span>;
      return <span className="badge bg-secondary">Completed</span>;
    } catch {
      return <span className="badge bg-secondary">Error</span>;
    }
  };

  const handleCopyDetails = async (item: any) => {
    const formatTime = (dateTime: string) => {
      if (!dateTime) return 'Not scheduled';
      try {
        const date = new Date(dateTime);
        if (isNaN(date.getTime())) return 'Invalid date';
        return date.toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
      } catch {
        return 'Invalid date';
      }
    };

    const classDetails = `📚 Class Details - BLC Campus 📚

Course: ${item.courseName || 'Not specified'}
Module: ${item.moduleName || 'Not specified'}
Batch: ${item.batchName || 'Not specified'}
Lecturer: ${item.lecturerName || 'Not specified'}
Time: ${formatTime(item.startTime)} - ${formatTime(item.endTime)}
Google Meet: ${item.meetLink || 'Not provided'}

Please join the class on time.`;

    try {
      await navigator.clipboard.writeText(classDetails);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleWhatsAppShare = (item: any) => {
    const formatTime = (dateTime: string) => {
      if (!dateTime) return 'Not scheduled';
      try {
        const date = new Date(dateTime);
        if (isNaN(date.getTime())) return 'Invalid date';
        return date.toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
      } catch {
        return 'Invalid date';
      }
    };

    const message = `📚 Class Details - BLC Campus 📚

Course: ${item.courseName || 'Not specified'}
Module: ${item.moduleName || 'Not specified'}
Batch: ${item.batchName || 'Not specified'}
Lecturer: ${item.lecturerName || 'Not specified'}
Time: ${formatTime(item.startTime)} - ${formatTime(item.endTime)}
Google Meet: ${item.meetLink || 'Not provided'}

Please join the class on time.`;
    
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleCopyLink = async (link: string, classId: string) => {
    if (!link || link === 'Not provided') {
      alert('No Google Meet link available');
      return;
    }
    try {
      await navigator.clipboard.writeText(link);
      setCopiedId(classId);
      setTimeout(() => setCopiedId(null), 2000);
      alert('Google Meet link copied!');
    } catch (err) {
      console.error('Failed to copy link:', err);
      alert('Failed to copy link');
    }
  };

  return (
    <div className="card p-3 fade-in">
      {/* Filters Bar */}
      <div className="row mb-3 g-2">
        <div className="col-md-4">
          <div className="input-group">
            <span className="input-group-text"><FiSearch /></span>
            <input
              type="text"
              className="form-control"
              placeholder="Search classes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        
        <div className="col-md-3">
          <div className="input-group">
            <span className="input-group-text"><FiCalendar /></span>
            <input
              type="date"
              className="form-control"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>
        </div>
        
        <div className="col-md-3">
          <select 
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        
        <div className="col-md-2">
          <button onClick={exportToCSV} className="btn btn-success w-100">
            <FiDownload className="me-1" /> Export
          </button>
        </div>
      </div>
      
      {/* Data Table */}
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key} onClick={() => handleSort(column.key)} style={{ cursor: 'pointer' }}>
                  {column.label}
                  {sortField === column.key && (
                    <span className="ms-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
              ))}
              <th>Google Meet</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 3} className="text-center py-5">
                  <div className="text-muted">No classes found</div>
                </td>
              </tr>
            ) : (
              paginatedData.map((item, index) => (
                <tr key={item.id || index}>
                  <td title={item.courseName}>{item.courseName || '-'}</td>
                  <td title={item.moduleName}>{item.moduleName || '-'}</td>
                  <td title={item.batchName}>{item.batchName || '-'}</td>
                  <td title={item.lecturerName}>{item.lecturerName || '-'}</td>
                  <td>{formatDateTime(item.startTime)}</td>
                  <td>{formatDateTime(item.endTime)}</td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      {item.meetLink && item.meetLink !== 'Not provided' ? (
                        <>
                          <a 
                            href={item.meetLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-outline-primary"
                            title="Open Google Meet"
                          >
                            Join
                          </a>
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => handleCopyLink(item.meetLink, item.id)}
                            title="Copy Meet Link"
                          >
                            <FiCopy size={14} />
                          </button>
                        </>
                      ) : (
                        <span className="text-muted small">No link</span>
                      )}
                      {copiedId === item.id && (
                        <span className="text-success small">Copied!</span>
                      )}
                    </div>
                  </td>
                  <td>{getStatusBadge(item.startTime, item.endTime)}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <button 
                        className="btn btn-sm btn-info" 
                        onClick={() => onView(item)}
                        title="View Details"
                      >
                        <FiEye />
                      </button>
                      <button 
                        className="btn btn-sm btn-warning" 
                        onClick={() => onEdit(item)}
                        title="Edit Class"
                      >
                        <FiEdit />
                      </button>
                      <button 
                        className="btn btn-sm btn-danger" 
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this class?')) {
                            onDelete(item.id);
                          }
                        }}
                        title="Delete Class"
                      >
                        <FiTrash2 />
                      </button>
                      <button 
                        className="btn btn-sm btn-success" 
                        onClick={() => handleCopyDetails(item)}
                        title="Copy Class Details"
                      >
                        <FiCopy />
                      </button>
                      <button 
                        className="btn btn-sm btn-primary" 
                        onClick={() => handleWhatsAppShare(item)}
                        title="Share on WhatsApp"
                      >
                        <FiShare2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {filteredData.length > 0 && (
        <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap">
          <div className="mb-2 mb-md-0">
            <select 
              className="form-select form-select-sm d-inline-block w-auto"
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
            </select>
            <span className="ms-2 text-muted">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length}
            </span>
          </div>
          
          <div>
            <button 
              className="btn btn-sm btn-secondary me-2"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  className={`btn btn-sm me-1 ${currentPage === pageNum ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button 
              className="btn btn-sm btn-secondary"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}