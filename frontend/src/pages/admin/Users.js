import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const { data } = await axios.get('/api/users/admin');
            setUsers(data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch users:', error);
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            try {
                await axios.delete(`/api/users/admin/${userId}`);
                setUsers(users.filter(u => u._id !== userId));
                setSelectedUser(null);
            } catch (error) {
                console.error('Failed to delete user:', error);
            }
        }
    };

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="loading">Loading users...</div>;

    return (
        <div className="admin-users">
            <div className="page-header">
                <h1>Manage Users</h1>
            </div>

            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search users by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-control"
                />
            </div>

            <div className="users-table-container">
                <table className="table">
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Subscription</th>
                        <th>Trial Ends</th>
                        <th>Joined</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredUsers.map(user => (
                        <tr key={user._id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>
                  <span className={`badge badge-${user.role}`}>
                    {user.role}
                  </span>
                            </td>
                            <td>
                  <span className={`badge badge-${user.subscription?.status}`}>
                    {user.subscription?.status}
                  </span>
                            </td>
                            <td>
                                {user.subscription?.trialEndDate
                                    ? new Date(user.subscription.trialEndDate).toLocaleDateString()
                                    : '-'
                                }
                            </td>
                            <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                            <td>
                                <button
                                    onClick={() => handleDeleteUser(user._id)}
                                    className="btn btn-danger btn-sm"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminUsers;