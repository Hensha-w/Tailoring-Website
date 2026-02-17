import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalClients: 0,
        pendingDeadlines: 0,
        completedProjects: 0,
        upcomingEvents: []
    });
    const [recentClients, setRecentClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deadlines, setDeadlines] = useState([]);
    const [monthlyData, setMonthlyData] = useState([]);
    const [monthlyStats, setMonthlyStats] = useState({
        labels: [],
        data: []
    });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [clientsRes, eventsRes] = await Promise.all([
                axios.get('/api/clients'),
                axios.get('/api/calendar')
            ]);

            const clients = clientsRes.data;
            const events = eventsRes.data;

            // Calculate stats
            const now = new Date();
            const upcomingDeadlines = events.filter(event =>
                event.type === 'deadline' &&
                new Date(event.startDate) > now &&
                event.status === 'pending'
            );

            const completedEvents = events.filter(event =>
                event.status === 'completed'
            );

            setStats({
                totalClients: clients.length,
                pendingDeadlines: upcomingDeadlines.length,
                completedProjects: completedEvents.length,
                upcomingEvents: upcomingDeadlines.slice(0, 5)
            });

            setRecentClients(clients.slice(0, 5));
            setDeadlines(upcomingDeadlines.slice(0, 3));

            // Calculate monthly statistics
            calculateMonthlyStats(events);

            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
            setLoading(false);
        }
    };

    const calculateMonthlyStats = (events) => {
        // Get last 6 months
        const months = [];
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentDate = new Date();

        for (let i = 5; i >= 0; i--) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
            months.push({
                month: date.getMonth(),
                year: date.getFullYear(),
                label: monthNames[date.getMonth()],
                count: 0
            });
        }

        // Count completed events per month
        events.forEach(event => {
            if (event.status === 'completed' && event.startDate) {
                const eventDate = new Date(event.startDate);
                const eventMonth = eventDate.getMonth();
                const eventYear = eventDate.getFullYear();

                const monthData = months.find(m =>
                    m.month === eventMonth && m.year === eventYear
                );

                if (monthData) {
                    monthData.count++;
                }
            }
        });

        // Find max count for scaling (minimum 1 to avoid division by zero)
        const maxCount = Math.max(...months.map(m => m.count), 1);

        setMonthlyStats({
            labels: months.map(m => m.label),
            data: months.map(m => ({
                count: m.count,
                height: maxCount > 0 ? (m.count / maxCount) * 100 : 0
            }))
        });

        setMonthlyData(months);
    };

    // Professional SVG Icons
    const Icons = {
        Clients: () => (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"
                      fill="currentColor" fillOpacity="0.9"/>
            </svg>
        ),
        Deadlines: () => (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20ZM12.5 7H11V13L16.2 16.2L17 14.9L12.5 12.2V7Z"
                      fill="currentColor" fillOpacity="0.9"/>
            </svg>
        ),
        Completed: () => (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z"
                      fill="currentColor" fillOpacity="0.9"/>
            </svg>
        ),
        QuickActions: () => (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z"
                      fill="currentColor" fillOpacity="0.9"/>
            </svg>
        ),
        Calendar: () => (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 4H18V2H16V4H8V2H6V4H5C3.89 4 3.01 4.9 3.01 6L3 20C3 21.1 3.89 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 19 4ZM19 20H5V10H19V20ZM9 14H7V12H9V14ZM13 14H11V12H13V14ZM17 14H15V12H17V14ZM9 18H7V16H9V18ZM13 18H11V16H13V18ZM17 18H15V16H17V18Z"
                      fill="currentColor"/>
            </svg>
        ),
        Client: () => (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"
                      fill="currentColor"/>
            </svg>
        ),
        Male: () => (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM16 9V15C16 16.1 15.1 17 14 17H13V22H11V17H10V22H8V17H7C5.9 17 5 16.1 5 15V9C5 7.9 5.9 7 7 7H14C15.1 7 16 7.9 16 9Z"
                      fill="currentColor"/>
            </svg>
        ),
        Female: () => (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM16 14V18H19V22H17V18H13V22H11V15H10C8.9 15 8 14.1 8 13V9C8 7.9 8.9 7 10 7H14C15.1 7 16 7.9 16 9V14Z"
                      fill="currentColor"/>
            </svg>
        ),
        ArrowRight: () => (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z"
                      fill="currentColor"/>
            </svg>
        )
    };

    if (loading) {
        return (
            <div className="loading-spinner">
                <div className="spinner"></div>
                <p>Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="dashboard">
            <div className="welcome-section">
                <h1>Welcome back, {user?.name}!</h1>
                <p className="trial-status">
                    {user?.subscription?.status === 'trial' && (
                        <>Free trial ends: {new Date(user.subscription.trialEndDate).toLocaleDateString()}</>
                    )}
                    {user?.subscription?.status === 'active' && (
                        <>Subscription active</>
                    )}
                </p>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">
                        <Icons.Clients />
                    </div>
                    <div className="stat-details">
                        <h3>Total Clients</h3>
                        <p className="stat-number">{stats.totalClients}</p>
                        <Link to="/clients" className="stat-link">
                            View all <Icons.ArrowRight />
                        </Link>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">
                        <Icons.Deadlines />
                    </div>
                    <div className="stat-details">
                        <h3>Pending Deadlines</h3>
                        <p className="stat-number">{stats.pendingDeadlines}</p>
                        <Link to="/calendar" className="stat-link">
                            View calendar <Icons.ArrowRight />
                        </Link>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">
                        <Icons.Completed />
                    </div>
                    <div className="stat-details">
                        <h3>Completed Projects</h3>
                        <p className="stat-number">{stats.completedProjects}</p>
                    </div>
                </div>

                <div className="stat-card quick-add">
                    <div className="stat-icon">
                        <Icons.QuickActions />
                    </div>
                    <div className="stat-details">
                        <h3>Quick Actions</h3>
                        <Link to="/clients?action=add" className="stat-link">Add New Client</Link>
                        <Link to="/calendar?action=add" className="stat-link">Schedule Event</Link>
                    </div>
                </div>
            </div>

            <div className="dashboard-grid">
                <div className="dashboard-card upcoming-deadlines">
                    <div className="card-header">
                        <h2>Upcoming Deadlines</h2>
                        <Link to="/calendar" className="view-all">
                            View all <Icons.ArrowRight />
                        </Link>
                    </div>
                    <div className="card-body">
                        {deadlines.length > 0 ? (
                            <ul className="deadline-list">
                                {deadlines.map(deadline => (
                                    <li key={deadline._id} className="deadline-item">
                                        <div className="deadline-info">
                                            <span className="deadline-title">{deadline.title}</span>
                                            <span className="deadline-client">{deadline.clientName}</span>
                                        </div>
                                        <div className="deadline-date">
                                            <Icons.Calendar />
                                            {new Date(deadline.startDate).toLocaleDateString()}
                                        </div>
                                        <span className={`status-badge status-${deadline.status}`}>
                                            {deadline.status}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="empty-state">No upcoming deadlines</p>
                        )}
                    </div>
                </div>

                <div className="dashboard-card recent-clients">
                    <div className="card-header">
                        <h2>Recent Clients</h2>
                        <Link to="/clients" className="view-all">
                            View all <Icons.ArrowRight />
                        </Link>
                    </div>
                    <div className="card-body">
                        {recentClients.length > 0 ? (
                            <ul className="client-list">
                                {recentClients.map(client => (
                                    <li key={client._id} className="client-item">
                                        <div className="client-avatar">
                                            {client.gender === 'male' ? <Icons.Male /> : <Icons.Female />}
                                        </div>
                                        <div className="client-info">
                                            <span className="client-name">{client.name}</span>
                                            <span className="client-measurements">
                                                Chest: {client.measurements?.chest || 'N/A'}"
                                            </span>
                                        </div>
                                        <Link to={`/clients?id=${client._id}`} className="view-link">
                                            View
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="empty-state">No clients yet</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="dashboard-card statistics-chart">
                <div className="card-header">
                    <h2>Monthly Overview</h2>
                    <span className="chart-subtitle">Completed projects (Last 6 months)</span>
                </div>
                <div className="card-body">
                    {monthlyStats.data.length > 0 && monthlyStats.data.some(item => item.count > 0) ? (
                        <div className="chart-container">
                            <div className="chart-bars">
                                {monthlyStats.data.map((item, index) => (
                                    <div key={index} className="bar-wrapper">
                                        <div
                                            className="bar"
                                            style={{ height: `${Math.max(item.height, 5)}%` }}
                                            data-count={item.count}
                                        >
                                            <span className="bar-tooltip">
                                                {item.count} project{item.count !== 1 ? 's' : ''}
                                            </span>
                                        </div>
                                        <span className="bar-label">{monthlyStats.labels[index]}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="chart-stats">
                                <div className="stat-summary">
                                    <span className="summary-label">Total (6 months):</span>
                                    <span className="summary-value">
                                        {monthlyStats.data.reduce((sum, item) => sum + item.count, 0)} projects
                                    </span>
                                </div>
                                <div className="stat-summary">
                                    <span className="summary-label">Monthly average:</span>
                                    <span className="summary-value">
                                        {Math.round(monthlyStats.data.reduce((sum, item) => sum + item.count, 0) / monthlyStats.data.length)} projects
                                    </span>
                                </div>
                                <div className="stat-summary">
                                    <span className="summary-label">Best month:</span>
                                    <span className="summary-value">
                                        {monthlyStats.labels[monthlyStats.data.reduce((maxIdx, item, idx, arr) =>
                                            item.count > arr[maxIdx].count ? idx : maxIdx, 0
                                        )]} ({Math.max(...monthlyStats.data.map(item => item.count))} projects)
                                    </span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="empty-state">
                            <p>No completed projects data available for the last 6 months</p>
                            <p className="text-muted">Complete some projects to see statistics here!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;