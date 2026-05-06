'use client';

import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  LineElement,
  PointElement,
  Title, 
  Tooltip, 
  Legend,
  ArcElement
} from 'chart.js';
import { FiCalendar, FiUsers, FiBookOpen, FiUserCheck } from 'react-icons/fi';

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement,
  LineElement,
  PointElement,
  Title, 
  Tooltip, 
  Legend,
  ArcElement
);

interface AnalyticsChartProps {
  classes: any[];
}

export default function AnalyticsChart({ classes }: AnalyticsChartProps) {
  // Calculate statistics
  const totalClasses = classes.length;
  const totalModules = new Set(classes.map(c => c.moduleId)).size;
  const totalLecturers = new Set(classes.map(c => c.lecturerId)).size;
  const totalBatches = new Set(classes.map(c => c.batchId)).size;
  
  // Classes by month
  const classesByMonth = classes.reduce((acc: any, cls) => {
    const month = new Date(cls.startTime).toLocaleString('default', { month: 'short' });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});
  
  // Classes by lecturer
  const classesByLecturer = classes.reduce((acc: any, cls) => {
    const lecturer = cls.lecturerName || 'Unknown';
    acc[lecturer] = (acc[lecturer] || 0) + 1;
    return acc;
  }, {});
  
  // Upcoming vs Completed
  const now = new Date();
  const upcomingClasses = classes.filter(c => new Date(c.startTime) > now).length;
  const completedClasses = classes.filter(c => new Date(c.endTime) < now).length;
  const ongoingClasses = classes.filter(c => 
    new Date(c.startTime) <= now && new Date(c.endTime) >= now
  ).length;

  const barChartData = {
    labels: Object.keys(classesByMonth),
    datasets: [
      {
        label: 'Classes per Month',
        data: Object.values(classesByMonth),
        backgroundColor: 'rgba(102, 126, 234, 0.5)',
        borderColor: 'rgb(102, 126, 234)',
        borderWidth: 2,
        borderRadius: 10,
      },
    ],
  };

  const lineChartData = {
    labels: Object.keys(classesByMonth),
    datasets: [
      {
        label: 'Monthly Trend',
        data: Object.values(classesByMonth),
        borderColor: 'rgb(118, 75, 162)',
        backgroundColor: 'rgba(118, 75, 162, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const doughnutChartData = {
    labels: ['Upcoming', 'Ongoing', 'Completed'],
    datasets: [
      {
        data: [upcomingClasses, ongoingClasses, completedClasses],
        backgroundColor: ['#ffc107', '#28a745', '#6c757d'],
        borderWidth: 0,
      },
    ],
  };

  const lecturerChartData = {
    labels: Object.keys(classesByLecturer).slice(0, 5),
    datasets: [
      {
        label: 'Classes per Lecturer',
        data: Object.values(classesByLecturer).slice(0, 5),
        backgroundColor: 'rgba(240, 147, 251, 0.5)',
        borderColor: 'rgb(240, 147, 251)',
        borderWidth: 2,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Classes Distribution by Month' },
    },
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Monthly Class Trend' },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' as const },
      title: { display: true, text: 'Class Status Distribution' },
    },
  };

  return (
    <div className="fade-in">
      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card stat-card">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <p className="mb-1">Total Classes</p>
                <h3 className="mb-0">{totalClasses}</h3>
              </div>
              <FiCalendar size={40} opacity={0.7} />
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-3">
          <div className="card stat-card" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <p className="mb-1">Active Modules</p>
                <h3 className="mb-0">{totalModules}</h3>
              </div>
              <FiBookOpen size={40} opacity={0.7} />
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-3">
          <div className="card stat-card" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <p className="mb-1">Active Lecturers</p>
                <h3 className="mb-0">{totalLecturers}</h3>
              </div>
              <FiUserCheck size={40} opacity={0.7} />
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-3">
          <div className="card stat-card" style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <p className="mb-1">Active Batches</p>
                <h3 className="mb-0">{totalBatches}</h3>
              </div>
              <FiUsers size={40} opacity={0.7} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Charts Row 1 */}
      <div className="row mb-4">
        <div className="col-md-6 mb-4">
          <div className="card p-3">
            <Bar data={barChartData} options={barOptions} />
          </div>
        </div>
        
        <div className="col-md-6 mb-4">
          <div className="card p-3">
            <Line data={lineChartData} options={lineOptions} />
          </div>
        </div>
      </div>
      
      {/* Charts Row 2 */}
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card p-3">
            <Doughnut data={doughnutChartData} options={doughnutOptions} />
            <div className="mt-3 text-center">
              <h6>Class Status Summary</h6>
              <div className="row mt-2">
                <div className="col-4">
                  <small className="text-warning">Upcoming</small>
                  <strong className="d-block">{upcomingClasses}</strong>
                </div>
                <div className="col-4">
                  <small className="text-success">Ongoing</small>
                  <strong className="d-block">{ongoingClasses}</strong>
                </div>
                <div className="col-4">
                  <small className="text-secondary">Completed</small>
                  <strong className="d-block">{completedClasses}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-6 mb-4">
          <div className="card p-3">
            <Bar data={lecturerChartData} options={{ responsive: true, plugins: { legend: { position: 'top' }, title: { display: true, text: 'Top Lecturers by Classes' } } }} />
          </div>
        </div>
      </div>
      
      {/* Recent Classes Table */}
      <div className="card p-3">
        <h5 className="mb-3">Recent Classes</h5>
        <div className="table-responsive">
          <table className="table table-sm">
            <thead>
              <tr>
                <th>Class</th>
                <th>Lecturer</th>
                <th>Date & Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {classes.slice(0, 5).map((cls, idx) => (
                <tr key={idx}>
                  <td>{cls.moduleName}</td>
                  <td>{cls.lecturerName}</td>
                  <td>{new Date(cls.startTime).toLocaleString()}</td>
                  <td>
                    {new Date(cls.startTime) > now ? (
                      <span className="badge bg-warning">Upcoming</span>
                    ) : new Date(cls.endTime) < now ? (
                      <span className="badge bg-secondary">Completed</span>
                    ) : (
                      <span className="badge bg-success">Ongoing</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}