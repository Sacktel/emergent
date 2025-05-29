import React, { useState, useEffect } from 'react';
import './App.css';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Area, AreaChart
} from 'recharts';
import { 
  Calendar, Filter, Download, RefreshCw, AlertTriangle, CheckCircle, 
  Clock, Users, TrendingUp, TrendingDown, Activity, Settings 
} from 'lucide-react';

// Mock ServiceNow Data
const generateMockData = () => {
  const currentDate = new Date();
  const monthlyData = [];
  
  for (let i = 11; i >= 0; i--) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    monthlyData.push({
      month: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      incidents: Math.floor(Math.random() * 200) + 150,
      resolved: Math.floor(Math.random() * 180) + 120,
      changeRequests: Math.floor(Math.random() * 50) + 30,
      slaCompliance: Math.floor(Math.random() * 20) + 75
    });
  }

  return {
    kpis: {
      totalIncidents: 1847,
      openIncidents: 234,
      resolvedIncidents: 1613,
      avgResolutionTime: 2.3,
      slaCompliance: 89.2,
      userSatisfaction: 4.2,
      changeRequests: 342,
      pendingChanges: 45
    },
    monthlyTrends: monthlyData,
    priorityDistribution: [
      { name: 'P1 - Critical', value: 15, color: '#ef4444' },
      { name: 'P2 - High', value: 45, color: '#f97316' },
      { name: 'P3 - Medium', value: 120, color: '#eab308' },
      { name: 'P4 - Low', value: 54, color: '#22c55e' }
    ],
    statusDistribution: [
      { name: 'Open', value: 89, color: '#3b82f6' },
      { name: 'In Progress', value: 145, color: '#8b5cf6' },
      { name: 'Resolved', value: 567, color: '#22c55e' },
      { name: 'Closed', value: 1046, color: '#6b7280' }
    ],
    resolutionTimes: [
      { category: 'P1', avgTime: 0.5, target: 1 },
      { category: 'P2', avgTime: 2.1, target: 4 },
      { category: 'P3', avgTime: 6.8, target: 8 },
      { category: 'P4', avgTime: 12.3, target: 24 }
    ]
  };
};

const KPICard = ({ title, value, subtitle, icon: Icon, trend, trendValue, color = "blue" }) => {
  const colorClasses = {
    blue: "border-blue-500 bg-blue-50",
    green: "border-green-500 bg-green-50", 
    orange: "border-orange-500 bg-orange-50",
    red: "border-red-500 bg-red-50",
    purple: "border-purple-500 bg-purple-50"
  };

  return (
    <div className={`bg-white rounded-lg shadow-md border-l-4 ${colorClasses[color]} p-6 hover:shadow-lg transition-shadow`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Icon className={`h-6 w-6 text-${color}-600`} />
            <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">{value}</span>
            {trendValue && (
              <div className={`flex items-center text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {trend === 'up' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                <span className="ml-1">{trendValue}%</span>
              </div>
            )}
          </div>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState('12m');
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      setData(generateMockData());
    }, 500);
  }, []);

  const refreshData = () => {
    setData(generateMockData());
    setLastRefresh(new Date());
  };

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-lg text-gray-600">Loading ServiceNow Dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <Activity className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">ServiceNow Analytics</h1>
              </div>
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                Last updated: {lastRefresh.toLocaleTimeString()}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <select 
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="1m">Last Month</option>
                <option value="3m">Last 3 Months</option>
                <option value="6m">Last 6 Months</option>
                <option value="12m">Last 12 Months</option>
              </select>
              <button 
                onClick={refreshData}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard
            title="Total Incidents"
            value={data.kpis.totalIncidents.toLocaleString()}
            subtitle={`${data.kpis.openIncidents} currently open`}
            icon={AlertTriangle}
            color="blue"
            trend="up"
            trendValue="12"
          />
          <KPICard
            title="SLA Compliance"
            value={`${data.kpis.slaCompliance}%`}
            subtitle="Above target of 85%"
            icon={CheckCircle}
            color="green"
            trend="up"
            trendValue="3"
          />
          <KPICard
            title="Avg Resolution Time"
            value={`${data.kpis.avgResolutionTime}h`}
            subtitle="Better than last month"
            icon={Clock}
            color="orange"
            trend="down"
            trendValue="15"
          />
          <KPICard
            title="User Satisfaction"
            value={data.kpis.userSatisfaction}
            subtitle="Out of 5 stars"
            icon={Users}
            color="purple"
            trend="up"
            trendValue="8"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* Monthly Trends */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Incident Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data.monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="incidents" 
                  stackId="1"
                  stroke="#3b82f6" 
                  fill="#3b82f6" 
                  fillOpacity={0.6}
                  name="Total Incidents"
                />
                <Area 
                  type="monotone" 
                  dataKey="resolved" 
                  stackId="1"
                  stroke="#22c55e" 
                  fill="#22c55e" 
                  fillOpacity={0.6}
                  name="Resolved"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Priority Distribution */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Incident Priority Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.priorityDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.priorityDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* SLA Compliance Trends */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">SLA Compliance Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[70, 100]} />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="slaCompliance" 
                  stroke="#22c55e" 
                  strokeWidth={3}
                  name="SLA Compliance %"
                />
                <Line 
                  type="monotone" 
                  dataKey={85} 
                  stroke="#ef4444" 
                  strokeDasharray="5 5"
                  name="Target (85%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Resolution Times by Priority */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resolution Times vs Targets</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.resolutionTimes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="avgTime" fill="#3b82f6" name="Actual Time (hours)" />
                <Bar dataKey="target" fill="#22c55e" name="Target Time (hours)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Overview Table */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Status Overview</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Count</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trend</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.statusDistribution.map((status, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-3"
                          style={{ backgroundColor: status.color }}
                        ></div>
                        <span className="text-sm font-medium text-gray-900">{status.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {status.value.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {((status.value / data.statusDistribution.reduce((sum, s) => sum + s.value, 0)) * 100).toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center text-green-600">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        +{Math.floor(Math.random() * 20) + 5}%
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <Dashboard />
    </div>
  );
}

export default App;