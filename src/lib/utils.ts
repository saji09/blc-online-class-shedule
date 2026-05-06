// Format date for display
export const formatDate = (date: string | Date, format: 'full' | 'date' | 'time' = 'full'): string => {
  const d = new Date(date);
  
  if (format === 'date') {
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
  
  if (format === 'time') {
    return d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Get class status
export const getClassStatus = (startTime: string, endTime: string): 'upcoming' | 'ongoing' | 'completed' => {
  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);
  
  if (now < start) return 'upcoming';
  if (now >= start && now <= end) return 'ongoing';
  return 'completed';
};

// Generate unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Validate Google Meet link
export const isValidMeetLink = (url: string): boolean => {
  const pattern = /^https:\/\/meet\.google\.com\/[a-z\-]+$/;
  return pattern.test(url);
};

// Format duration between two dates
export const formatDuration = (startTime: string, endTime: string): string => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const diffHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  
  if (diffHours < 1) {
    const minutes = Math.round(diffHours * 60);
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }
  
  return `${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
};

// Export data to CSV
export const exportToCSV = (data: any[], filename: string) => {
  if (!data.length) return;
  
  const headers = Object.keys(data[0]);
  const csvData = data.map(row => headers.map(header => row[header]).join(','));
  const csv = [headers.join(','), ...csvData].join('\n');
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
};

// Debounce function for search inputs
export const debounce = <T extends (...args: any[]) => any>(func: T, delay: number): T => {
  let timeoutId: NodeJS.Timeout;
  return ((...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  }) as T;
};