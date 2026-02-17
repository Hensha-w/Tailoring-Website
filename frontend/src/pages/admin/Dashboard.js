import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalClients: 0,
        pendingPayments: 0,
        pendingFeedback: 0
    });
    const [recentPayments, setRecentPayments] = useState([]);
    const [recentFeedback, setRecentFeedback] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAdminStats();
        fetchRecentData();
    }, []);

    const fetchAdminStats = async () => {
        try {
            const { data } = await axios.get('/api/users/admin/stats');
            setStats(data);
        } catch (error) {
            console.error('Failed to fetch admin stats:', error);
        }
    };

    const fetchRecentData = async () => {
        try {
            const [paymentsRes, feedbackRes] = await Promise.all([
                axios.get('/api/payments/admin'),
                axios.get('/api/feedback/admin')
            ]);

            setRecentPayments(paymentsRes.data.slice(0, 5));
            setRecentFeedback(feedbackRes.data.slice(0, 5));
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch recent data:', error);
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">Loading dashboard...</div>;

    return (
        <div className="admin-dashboard">
            <div className="page-header">
                <h1>Admin Dashboard</h1>
            </div>

            <div className="stats-grid">
                <div className="stat-card admin-stat">
                    <div className="stat-icon">👥</div>
                    <div className="stat-details">
                        <h3>Total Users</h3>
                        <p className="stat-number">{stats.totalUsers}</p>
                    </div>
                </div>

                <div className="stat-card admin-stat">
                    <div className="stat-icon">📋</div>
                    <div className="stat-details">
                        <h3>Total Clients</h3>
                        <p className="stat-number">{stats.totalClients}</p>
                    </div>
                </div>

                <div className="stat-card admin-stat">
                    <div className="stat-icon">💰</div>
                    <div className="stat-details">
                        <h3>Pending Payments</h3>
                        <p className="stat-number">{stats.pendingPayments}</p>
                    </div>
                </div>

                <div className="stat-card admin-stat">
                    <div className="stat-icon">💬</div>
                    <div className="stat-details">
                        <h3>Pending Feedback</h3>
                        <p className="stat-number">{stats.pendingFeedback}</p>
                    </div>
                </div>
            </div>

            <div className="dashboard-grid">
                <div className="dashboard-card">
                    <div className="card-header">
                        <h2>Recent Payments</h2>
                        <a href="/admin/payments" className="view-all">View all</a>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Amount</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                </tr>
                                </thead>
                                <tbody>
                                {recentPayments.map(payment => (
                                    <tr key={payment._id}>
                                        <td>{payment.userId?.name || 'N/A'}</td>
                                        <td>₦{payment.amount}</td>
                                        <td>{new Date(payment.paymentDate).toLocaleDateString()}</td>
                                        <td>
                        <span className={`badge badge-${payment.status}`}>
                          {payment.status}
                        </span>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="dashboard-card">
                    <div className="card-header">
                        <h2>Recent Feedback</h2>
                        <a href="/admin/feedback" className="view-all">View all</a>
                    </div>
                    <div className="card-body">
                        <div className="feedback-list">
                            {recentFeedback.map(feedback => (
                                <div key={feedback._id} className="feedback-item">
                                    <div className="feedback-header">
                                        <span className="feedback-user">{feedback.userName}</span>
                                        <span className={`badge badge-${feedback.status}`}>
                      {feedback.status}
                    </span>
                                    </div>
                                    <div className="feedback-subject">{feedback.subject}</div>
                                    <div className="feedback-meta">
                                        {new Date(feedback.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;