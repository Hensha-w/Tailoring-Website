import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminFeedback = () => {
    const [feedback, setFeedback] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [response, setResponse] = useState('');
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchFeedback();
    }, []);

    const fetchFeedback = async () => {
        try {
            const { data } = await axios.get('/api/feedback/admin');
            setFeedback(data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch feedback:', error);
            setLoading(false);
        }
    };

    const handleRespond = async (feedbackId) => {
        if (!response.trim()) {
            alert('Please enter a response');
            return;
        }

        try {
            await axios.post(`/api/feedback/${feedbackId}/respond`, {
                message: response
            });
            setSelectedFeedback(null);
            setResponse('');
            fetchFeedback();
        } catch (error) {
            console.error('Failed to send response:', error);
        }
    };

    const filteredFeedback = feedback.filter(f => {
        if (filter === 'all') return true;
        return f.status === filter;
    });

    if (loading) return <div className="loading">Loading feedback...</div>;

    return (
        <div className="admin-feedback">
            <div className="page-header">
                <h1>User Feedback</h1>
                <div className="filter-group">
                    <label>Filter:</label>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="form-control"
                    >
                        <option value="all">All Feedback</option>
                        <option value="pending">Pending</option>
                        <option value="responded">Responded</option>
                    </select>
                </div>
            </div>

            <div className="feedback-grid">
                {filteredFeedback.map(item => (
                    <div key={item._id} className="feedback-card">
                        <div className="feedback-card-header">
                            <div className="feedback-user-info">
                                <span className="feedback-user-name">{item.userName}</span>
                                <span className="feedback-user-email">{item.userEmail}</span>
                            </div>
                            <span className={`badge badge-${item.status}`}>
                {item.status}
              </span>
                        </div>

                        <div className="feedback-subject">
                            <strong>Subject:</strong> {item.subject}
                        </div>

                        <div className="feedback-message">
                            {item.message}
                        </div>

                        <div className="feedback-date">
                            {new Date(item.createdAt).toLocaleString()}
                        </div>

                        {item.response && (
                            <div className="feedback-response">
                                <div className="response-header">
                                    <span className="response-label">Response:</span>
                                    <span className="response-date">
                    {new Date(item.response.respondedAt).toLocaleDateString()}
                  </span>
                                </div>
                                <div className="response-message">
                                    {item.response.message}
                                </div>
                            </div>
                        )}

                        {item.status === 'pending' && (
                            <div className="feedback-actions">
                                <button
                                    onClick={() => setSelectedFeedback(item)}
                                    className="btn btn-primary btn-sm"
                                >
                                    Respond
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {selectedFeedback && (
                <div className="modal">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Respond to Feedback</h2>
                            <button className="btn-close" onClick={() => setSelectedFeedback(null)}>&times;</button>
                        </div>
                        <div className="modal-body">
                            <div className="original-feedback">
                                <p><strong>From:</strong> {selectedFeedback.userName} ({selectedFeedback.userEmail})</p>
                                <p><strong>Subject:</strong> {selectedFeedback.subject}</p>
                                <p><strong>Message:</strong></p>
                                <div className="feedback-quote">
                                    {selectedFeedback.message}
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="response">Your Response *</label>
                                <textarea
                                    id="response"
                                    value={response}
                                    onChange={(e) => setResponse(e.target.value)}
                                    className="form-control"
                                    rows="4"
                                    placeholder="Type your response here..."
                                    required
                                />
                            </div>

                            <div className="form-actions">
                                <button
                                    onClick={() => handleRespond(selectedFeedback._id)}
                                    className="btn btn-primary"
                                >
                                    Send Response
                                </button>
                                <button
                                    onClick={() => {
                                        setSelectedFeedback(null);
                                        setResponse('');
                                    }}
                                    className="btn btn-secondary"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminFeedback;