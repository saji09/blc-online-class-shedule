'use client';

import { useState, useEffect } from 'react';
import { FiEdit, FiEye, FiTrash2, FiSearch, FiFilter, FiCalendar, FiDownload } from 'react-icons/fi';

interface DataTableProps {
  data: any[];
  onEdit: (item: any) => void;
  onView: (item: any) => void;
  onDelete: (id: string) => void;
  columns?: { key: string; label: string }[];
}

export default function DataTable({ data, onEdit, onView, onDelete, columns }: DataTableProps) {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Default columns if not provided
  const defaultColumns = [
    { key: 'courseName', label: 'Course' },
    { key: 'moduleName', label: 'Module' },
    { key: 'batchName', label: 'Batch' },
    { key: 'lecturerName', label: 'Lecturer' },
    { key: 'startTime', label: 'Start Time' },
    { key: 'endTime', label: 'End Time' },
  ];

  const tableColumns = columns || defaultColumns;

  // Filter data
  let filteredData = data.filter(item => {
    const matchesSearch = Object.values(item).some(value => 
      String(value).toLowerCase().includes(search.toLowerCase())
    );
    
    const matchesDate = !dateFilter || 
      new Date(item.startTime).toDateString() === new Date(dateFilter).toDateString();
    
    const matchesStatus = !statusFilter || 
      (statusFilter === 'upcoming' && new Date(item.startTime) > new Date()) ||
      (statusFilter === 'ongoing' && new Date(item.startTime) <= new Date() && new Date(item.endTime) >= new Date()) ||
      (statusFilter === 'completed' && new Date(item.endTime) < new Date());
    
    return matchesSearch && matchesDate && matchesStatus;
  });

  // Sort data
  if (sortField) {
    filteredData.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      
      if (sortField.includes('Time')) {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
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
    const headers = tableColumns.map(col => col.label);
    const csvData = filteredData.map(item => 
      tableColumns.map(col => item[col.key] || '').join(',')
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
    return new Date(dateTime).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (startTime: string, endTime: string) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    if (now < start) return <span className="badge bg-warning">Upcoming</span>;
    if (now >= start && now <= end) return <span className="badge bg-success">Ongoing</span>;
    return <span className="badge bg-secondary">Completed</span>;
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
              placeholder="Search..."
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
              {tableColumns.map((column) => (
                <th key={column.key} onClick={() => handleSort(column.key)} style={{ cursor: 'pointer' }}>
                  {column.label}
                  {sortField === column.key && (
                    <span className="ms-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
              ))}
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={tableColumns.length + 2} className="text-center py-5">
                  <div className="text-muted">No data found</div>
                </td>
              </tr>
            ) : (
              paginatedData.map((item, index) => (
                <tr key={item.id || index}>
                  {tableColumns.map((column) => (
                    <td key={column.key}>
                      {column.key.includes('Time') ? formatDateTime(item[column.key]) : item[column.key]}
                    </td>
                  ))}
                  <td>{getStatusBadge(item.startTime, item.endTime)}</td>
                  <td>
                    <button 
                      className="btn btn-sm btn-info me-2" 
                      onClick={() => onView(item)}
                      title="View"
                    >
                      <FiEye />
                    </button>
                    <button 
                      className="btn btn-sm btn-warning me-2" 
                      onClick={() => onEdit(item)}
                      title="Edit"
                    >
                      <FiEdit />
                    </button>
                    <button 
                      className="btn btn-sm btn-danger" 
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this item?')) {
                          onDelete(item.id);
                        }
                      }}
                      title="Delete"
                    >
                      <FiTrash2 />
                    </button>
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