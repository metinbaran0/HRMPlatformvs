// src/components/organisms/CompanyDashboard.tsx
import React, { useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';
import { 
  FaUsers, 
  FaChartLine, 
  FaClock, 
  FaUserPlus,
  FaMoneyBillWave,
  FaExchangeAlt 
} from 'react-icons/fa';
import './CompanyDashboard.css';

interface DashboardStats {
  totalUsers: number;
  monthlyPerformance: number;
  totalWorkHours: number;
  newUsers: number;
  totalRevenue: number;
  refundRate: number;
  changes: {
    totalUsers: number;
    monthlyPerformance: number;
    totalWorkHours: number;
    newUsers: number;
    totalRevenue: number;
    refundRate: number;
  };
}

// Görev dağılımı verileri
const taskDistributionData = [
  { name: 'Tamamlanan', value: 540, color: '#2ecc71' },
  { name: 'Devam Eden', value: 320, color: '#3498db' },
  { name: 'Bekleyen', value: 210, color: '#f1c40f' },
  { name: 'Geciken', value: 120, color: '#e74c3c' }
];

// Departman performans verileri
const departmentPerformanceData = [
  {
    department: 'Satış',
    performans: 85,
    hedef: 80,
    geçenAy: 75
  },
  {
    department: 'Pazarlama',
    performans: 78,
    hedef: 75,
    geçenAy: 72
  },
  {
    department: 'İK',
    performans: 92,
    hedef: 85,
    geçenAy: 88
  },
  {
    department: 'Finans',
    performans: 88,
    hedef: 85,
    geçenAy: 82
  },
  {
    department: 'Teknik',
    performans: 95,
    hedef: 90,
    geçenAy: 91
  }
];

// Çalışma saatleri dağılımı verileri
const workingHoursDistribution = [
  {
    departman: 'Yazılım',
    normalMesai: 180,
    fazlaMesai: 20,
    izin: 16,
    toplamSaat: 216
  },
  {
    departman: 'Pazarlama',
    normalMesai: 168,
    fazlaMesai: 12,
    izin: 8,
    toplamSaat: 188
  },
  {
    departman: 'İK',
    normalMesai: 176,
    fazlaMesai: 8,
    izin: 16,
    toplamSaat: 200
  },
  {
    departman: 'Finans',
    normalMesai: 172,
    fazlaMesai: 16,
    izin: 8,
    toplamSaat: 196
  },
  {
    departman: 'Destek',
    normalMesai: 168,
    fazlaMesai: 24,
    izin: 8,
    toplamSaat: 200
  }
];

const CompanyDashboard: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  // Örnek veriler - Gerçek uygulamada API'den gelecek
  const stats: DashboardStats = {
    totalUsers: 1250,
    monthlyPerformance: 85,
    totalWorkHours: 45600,
    newUsers: 120,
    totalRevenue: 85000,
    refundRate: 2.5,
    changes: {
      totalUsers: 12.5,
      monthlyPerformance: -5.2,
      totalWorkHours: 8.7,
      newUsers: 15.3,
      totalRevenue: 22.1,
      refundRate: -1.5,
    }
  };

  // Genişletilmiş grafik verileri
  const performanceData = [
    { month: 'Ocak', performans: 65, hedef: 70 },
    { month: 'Şubat', performans: 70, hedef: 72 },
    { month: 'Mart', performans: 75, hedef: 75 },
    { month: 'Nisan', performans: 80, hedef: 78 },
    { month: 'Mayıs', performans: 85, hedef: 80 },
    { month: 'Haziran', performans: 82, hedef: 82 },
    { month: 'Temmuz', performans: 88, hedef: 85 },
    { month: 'Ağustos', performans: 85, hedef: 85 },
    { month: 'Eylül', performans: 90, hedef: 87 },
    { month: 'Ekim', performans: 87, hedef: 88 },
    { month: 'Kasım', performans: 92, hedef: 90 },
    { month: 'Aralık', performans: 95, hedef: 92 },
  ];

  const userGrowthData = [
    { month: 'Ocak', users: 1000, aktifKullanıcı: 950 },
    { month: 'Şubat', users: 1050, aktifKullanıcı: 980 },
    { month: 'Mart', users: 1150, aktifKullanıcı: 1050 },
    { month: 'Nisan', users: 1200, aktifKullanıcı: 1100 },
    { month: 'Mayıs', users: 1250, aktifKullanıcı: 1150 },
    { month: 'Haziran', users: 1300, aktifKullanıcı: 1200 },
    { month: 'Temmuz', users: 1400, aktifKullanıcı: 1300 },
    { month: 'Ağustos', users: 1450, aktifKullanıcı: 1350 },
    { month: 'Eylül', users: 1500, aktifKullanıcı: 1400 },
    { month: 'Ekim', users: 1600, aktifKullanıcı: 1500 },
    { month: 'Kasım', users: 1700, aktifKullanıcı: 1600 },
    { month: 'Aralık', users: 1800, aktifKullanıcı: 1700 },
  ];

  const workHoursData = [
    { month: 'Ocak', saat: 42000, fazlaMesai: 2000 },
    { month: 'Şubat', saat: 43500, fazlaMesai: 2200 },
    { month: 'Mart', saat: 44000, fazlaMesai: 2100 },
    { month: 'Nisan', saat: 44500, fazlaMesai: 2300 },
    { month: 'Mayıs', saat: 45600, fazlaMesai: 2400 },
    { month: 'Haziran', saat: 46000, fazlaMesai: 2500 },
    { month: 'Temmuz', saat: 46500, fazlaMesai: 2600 },
    { month: 'Ağustos', saat: 47000, fazlaMesai: 2700 },
    { month: 'Eylül', saat: 47500, fazlaMesai: 2800 },
    { month: 'Ekim', saat: 48000, fazlaMesai: 2900 },
    { month: 'Kasım', saat: 48500, fazlaMesai: 3000 },
    { month: 'Aralık', saat: 49000, fazlaMesai: 3100 },
  ];

  const revenueData = [
    { month: 'Ocak', gelir: 75000, gider: 65000 },
    { month: 'Şubat', gelir: 78000, gider: 66000 },
    { month: 'Mart', gelir: 80000, gider: 68000 },
    { month: 'Nisan', gelir: 82000, gider: 69000 },
    { month: 'Mayıs', gelir: 85000, gider: 70000 },
    { month: 'Haziran', gelir: 87000, gider: 71000 },
    { month: 'Temmuz', gelir: 90000, gider: 72000 },
    { month: 'Ağustos', gelir: 92000, gider: 73000 },
    { month: 'Eylül', gelir: 94000, gider: 74000 },
    { month: 'Ekim', gelir: 96000, gider: 75000 },
    { month: 'Kasım', gelir: 98000, gider: 76000 },
    { month: 'Aralık', gelir: 100000, gider: 77000 },
  ];

  // Yeni kullanıcılar için veri ekleyelim
  const newUsersData = [
    { month: 'Ocak', yeniKayıt: 85, aktivasyon: 80 },
    { month: 'Şubat', yeniKayıt: 90, aktivasyon: 85 },
    { month: 'Mart', yeniKayıt: 110, aktivasyon: 100 },
    { month: 'Nisan', yeniKayıt: 120, aktivasyon: 115 },
    { month: 'Mayıs', yeniKayıt: 115, aktivasyon: 110 },
    { month: 'Haziran', yeniKayıt: 125, aktivasyon: 120 },
    { month: 'Temmuz', yeniKayıt: 135, aktivasyon: 130 },
    { month: 'Ağustos', yeniKayıt: 130, aktivasyon: 125 },
    { month: 'Eylül', yeniKayıt: 140, aktivasyon: 135 },
    { month: 'Ekim', yeniKayıt: 145, aktivasyon: 140 },
    { month: 'Kasım', yeniKayıt: 150, aktivasyon: 145 },
    { month: 'Aralık', yeniKayıt: 155, aktivasyon: 150 },
  ];

  // İade oranı için veri ekleyelim
  const refundData = [
    { month: 'Ocak', iadeOranı: 2.8, ortalamaİade: 3.0 },
    { month: 'Şubat', iadeOranı: 2.7, ortalamaİade: 3.0 },
    { month: 'Mart', iadeOranı: 2.6, ortalamaİade: 2.9 },
    { month: 'Nisan', iadeOranı: 2.5, ortalamaİade: 2.9 },
    { month: 'Mayıs', iadeOranı: 2.4, ortalamaİade: 2.8 },
    { month: 'Haziran', iadeOranı: 2.3, ortalamaİade: 2.8 },
    { month: 'Temmuz', iadeOranı: 2.2, ortalamaİade: 2.7 },
    { month: 'Ağustos', iadeOranı: 2.1, ortalamaİade: 2.7 },
    { month: 'Eylül', iadeOranı: 2.0, ortalamaİade: 2.6 },
    { month: 'Ekim', iadeOranı: 1.9, ortalamaİade: 2.6 },
    { month: 'Kasım', iadeOranı: 1.8, ortalamaİade: 2.5 },
    { month: 'Aralık', iadeOranı: 1.7, ortalamaİade: 2.5 },
  ];

  const renderDetailView = () => {
    switch (selectedMetric) {
      case 'totalUsers':
        return (
          <div className="detail-view">
            <h3>Kullanıcı Büyüme Grafiği</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="users" 
                  stroke="#8884d8" 
                  name="Toplam Kullanıcı"
                />
                <Line 
                  type="monotone" 
                  dataKey="aktifKullanıcı" 
                  stroke="#82ca9d" 
                  name="Aktif Kullanıcı"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );

      case 'monthlyPerformance':
        return (
          <div className="detail-view">
            <h3>Aylık Performans Grafiği</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="performans" fill="#82ca9d" name="Gerçekleşen" />
                <Bar dataKey="hedef" fill="#8884d8" name="Hedef" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );

      case 'totalWorkHours':
        return (
          <div className="detail-view">
            <h3>Çalışma Saatleri Grafiği</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={workHoursData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="saat" fill="#8884d8" name="Normal Mesai" />
                <Bar dataKey="fazlaMesai" fill="#82ca9d" name="Fazla Mesai" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );

      case 'totalRevenue':
        return (
          <div className="detail-view">
            <h3>Gelir-Gider Grafiği</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="gelir" 
                  stroke="#82ca9d" 
                  name="Gelir"
                />
                <Line 
                  type="monotone" 
                  dataKey="gider" 
                  stroke="#ff7675" 
                  name="Gider"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );

      case 'newUsers':
        return (
          <div className="detail-view">
            <h3>Yeni Kullanıcı Detayları</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={newUsersData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar 
                  dataKey="yeniKayıt" 
                  fill="#8884d8" 
                  name="Yeni Kayıt"
                />
                <Bar 
                  dataKey="aktivasyon" 
                  fill="#82ca9d" 
                  name="Aktivasyon"
                />
              </BarChart>
            </ResponsiveContainer>
            <div className="detail-summary">
              <p>Toplam Yeni Kayıt: {newUsersData.reduce((sum, item) => sum + item.yeniKayıt, 0)}</p>
              <p>Aktivasyon Oranı: {((newUsersData.reduce((sum, item) => sum + item.aktivasyon, 0) / 
                newUsersData.reduce((sum, item) => sum + item.yeniKayıt, 0)) * 100).toFixed(1)}%</p>
            </div>
          </div>
        );

      case 'refundRate':
        return (
          <div className="detail-view">
            <h3>İade Oranı Analizi</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={refundData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="iadeOranı" 
                  stroke="#e74c3c" 
                  name="İade Oranı (%)"
                />
                <Line 
                  type="monotone" 
                  dataKey="ortalamaİade" 
                  stroke="#95a5a6" 
                  name="Ortalama İade (%)"
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="detail-summary">
              <p>En Düşük İade: %{Math.min(...refundData.map(item => item.iadeOranı))}</p>
              <p>En Yüksek İade: %{Math.max(...refundData.map(item => item.iadeOranı))}</p>
              <p>Yıllık Ortalama: %{(refundData.reduce((sum, item) => sum + item.iadeOranı, 0) / refundData.length).toFixed(1)}</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('tr-TR').format(num);
  };

  const renderChangeIndicator = (change: number) => {
    if (change === 0) return null;
    
    const isPositive = change > 0;
    return (
      <div className={`change-indicator ${isPositive ? 'positive' : 'negative'}`}>
        {isPositive ? '+' : ''}{change.toFixed(1)}%
      </div>
    );
  };

  return (
    <div className="company-dashboard">
      <h2>Şirket İstatistikleri</h2>
      <div className="stats-container">
        <div 
          className="stat-card clickable" 
          onClick={() => setSelectedMetric('totalUsers')}
        >
          <div className="stat-header">
            <FaUsers className="stat-icon" />
            <h3>Toplam Kullanıcılar</h3>
          </div>
          <p>{formatNumber(stats.totalUsers)}</p>
          {renderChangeIndicator(stats.changes.totalUsers)}
        </div>

        <div 
          className="stat-card clickable" 
          onClick={() => setSelectedMetric('monthlyPerformance')}
        >
          <div className="stat-header">
            <FaChartLine className="stat-icon" />
            <h3>Aylık Performans</h3>
          </div>
          <p>%{stats.monthlyPerformance}</p>
          {renderChangeIndicator(stats.changes.monthlyPerformance)}
        </div>

        <div 
          className="stat-card clickable" 
          onClick={() => setSelectedMetric('totalWorkHours')}
        >
          <div className="stat-header">
            <FaClock className="stat-icon" />
            <h3>Toplam Çalışma Saatleri</h3>
          </div>
          <p>{formatNumber(stats.totalWorkHours)} saat</p>
          {renderChangeIndicator(stats.changes.totalWorkHours)}
        </div>

        <div 
          className="stat-card clickable" 
          onClick={() => setSelectedMetric('newUsers')}
        >
          <div className="stat-header">
            <FaUserPlus className="stat-icon" />
            <h3>Yeni Kullanıcılar</h3>
          </div>
          <p>{formatNumber(stats.newUsers)}</p>
          {renderChangeIndicator(stats.changes.newUsers)}
        </div>

        <div 
          className="stat-card clickable" 
          onClick={() => setSelectedMetric('totalRevenue')}
        >
          <div className="stat-header">
            <FaMoneyBillWave className="stat-icon" />
            <h3>Toplam Gelir</h3>
          </div>
          <p>{formatNumber(stats.totalRevenue)} ₺</p>
          {renderChangeIndicator(stats.changes.totalRevenue)}
        </div>

        <div 
          className="stat-card clickable" 
          onClick={() => setSelectedMetric('refundRate')}
        >
          <div className="stat-header">
            <FaExchangeAlt className="stat-icon" />
            <h3>İade Oranı</h3>
          </div>
          <p>%{stats.refundRate}</p>
          {renderChangeIndicator(stats.changes.refundRate)}
        </div>
      </div>

      {/* Görev ve Performans Grafikleri */}
      <div className="dashboard-charts">
        <h2>Görev ve Performans Analizi</h2>
        <div className="charts-container">
          {/* Görev Dağılımı */}
          <div className="chart-card">
            <h3>Görev Dağılımı</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={taskDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {taskDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend 
                  verticalAlign="middle" 
                  align="right"
                  layout="vertical"
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="chart-summary">
              <div className="summary-item">
                <span className="summary-label">Toplam Görev:</span>
                <span className="summary-value">
                  {taskDistributionData.reduce((sum, item) => sum + item.value, 0)}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Tamamlanma Oranı:</span>
                <span className="summary-value">
                  {Math.round((taskDistributionData[0].value / 
                    taskDistributionData.reduce((sum, item) => sum + item.value, 0)) * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* Departman Performansı */}
          <div className="chart-card">
            <h3>Departman Performansı</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart outerRadius={100} data={departmentPerformanceData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="department" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar
                  name="Performans"
                  dataKey="performans"
                  stroke="#2ecc71"
                  fill="#2ecc71"
                  fillOpacity={0.5}
                />
                <Radar
                  name="Hedef"
                  dataKey="hedef"
                  stroke="#3498db"
                  fill="#3498db"
                  fillOpacity={0.3}
                />
                <Radar
                  name="Geçen Ay"
                  dataKey="geçenAy"
                  stroke="#95a5a6"
                  fill="#95a5a6"
                  fillOpacity={0.2}
                />
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
            <div className="chart-summary">
              <div className="summary-item">
                <span className="summary-label">Ortalama Performans:</span>
                <span className="summary-value">
                  {Math.round(departmentPerformanceData.reduce((sum, item) => 
                    sum + item.performans, 0) / departmentPerformanceData.length)}%
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">En Yüksek Performans:</span>
                <span className="summary-value">
                  {Math.max(...departmentPerformanceData.map(item => item.performans))}%
                </span>
              </div>
            </div>
          </div>

          {/* Çalışma Saatleri Dağılımı */}
          <div className="chart-card">
            <h3>Departman Bazlı Çalışma Saatleri</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={workingHoursDistribution}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="departman" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar 
                  dataKey="normalMesai" 
                  stackId="a" 
                  fill="#3498db" 
                  name="Normal Mesai"
                />
                <Bar 
                  dataKey="fazlaMesai" 
                  stackId="a" 
                  fill="#2ecc71" 
                  name="Fazla Mesai"
                />
                <Bar 
                  dataKey="izin" 
                  stackId="a" 
                  fill="#e74c3c" 
                  name="İzin"
                />
              </BarChart>
            </ResponsiveContainer>
            <div className="chart-summary">
              <div className="summary-item">
                <span className="summary-label">Toplam Çalışma Saati:</span>
                <span className="summary-value">
                  {workingHoursDistribution.reduce((sum, item) => sum + item.toplamSaat, 0)} saat
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Ortalama Fazla Mesai:</span>
                <span className="summary-value">
                  {Math.round(workingHoursDistribution.reduce((sum, item) => sum + item.fazlaMesai, 0) / 
                    workingHoursDistribution.length)} saat
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Toplam İzin:</span>
                <span className="summary-value">
                  {workingHoursDistribution.reduce((sum, item) => sum + item.izin, 0)} saat
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedMetric && (
        <div className="metric-details">
          <button 
            className="close-button"
            onClick={() => setSelectedMetric(null)}
          >
            ✕
          </button>
          {renderDetailView()}
        </div>
      )}
    </div>
  );
};

export default CompanyDashboard;