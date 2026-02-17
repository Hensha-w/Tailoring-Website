import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPayments = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [declineReason, setDeclineReason] = useState('');

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            const { data } = await axios.get('/api/payments/admin');
            console.log('📊 Payments received:', data);
            setPayments(data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch payments:', error);
            setLoading(false);
        }
    };

    const handleApprove = async (paymentId) => {
        if (window.confirm('Approve this payment?')) {
            try {
                await axios.put(`/api/payments/${paymentId}/approve`);
                fetchPayments();
            } catch (error) {
                console.error('Failed to approve payment:', error);
            }
        }
    };

    const handleDecline = async (paymentId) => {
        if (!declineReason.trim()) {
            alert('Please provide a reason for declining');
            return;
        }

        try {
            await axios.put(`/api/payments/${paymentId}/decline`, {
                reason: declineReason
            });
            setSelectedPayment(null);
            setDeclineReason('');
            fetchPayments();
        } catch (error) {
            console.error('Failed to decline payment:', error);
        }
    };

    // Helper function to get full receipt URL
    const getReceiptUrl = (receiptUrl) => {
        if (!receiptUrl) return null;

        // If it's already a full URL, use it as is
        if (receiptUrl.startsWith('http')) {
            return receiptUrl;
        }

        // If it starts with /uploads, prepend the API base URL
        if (receiptUrl.startsWith('/uploads')) {
            return `http://localhost:5000${receiptUrl}`;
        }

        // Otherwise, assume it's just a filename
        return `http://localhost:5000/uploads/${receiptUrl}`;
    };

    const filteredPayments = payments.filter(payment => {
        if (filter === 'all') return true;
        return payment.status === filter;
    });

    if (loading) return <div className="loading">Loading payments...</div>;

    return (
        <div className="admin-payments">
            <div className="page-header">
                <h1>Payment Approvals</h1>
                <div className="filter-group">
                    <label>Filter by status:</label>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="form-control"
                    >
                        <option value="all">All Payments</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="declined">Declined</option>
                    </select>
                </div>
            </div>

            <div className="payments-table-container">
                <table className="table">
                    <thead>
                    <tr>
                        <th>User</th>
                        <th>Email</th>
                        <th>Amount</th>
                        <th>Payment Date</th>
                        <th>Receipt</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredPayments.map(payment => {
                        const receiptUrl = getReceiptUrl(payment.receiptUrl);
                        console.log('🔗 Receipt URL for payment', payment._id, ':', receiptUrl);

                        return (
                            <tr key={payment._id}>
                                <td>{payment.userId?.name || 'N/A'}</td>
                                <td>{payment.userId?.email || 'N/A'}</td>
                                <td>₦{payment.amount}</td>
                                <td>{new Date(payment.paymentDate).toLocaleDateString()}</td>
                                <td>
                                    {receiptUrl ? (
                                        <a
                                            href={receiptUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn-link"
                                            onClick={() => console.log('🔗 Opening receipt:', receiptUrl)}
                                        >
                                            View Receipt
                                        </a>
                                    ) : (
                                        <span className="text-muted">No receipt</span>
                                    )}
                                </td>
                                <td>
                                        <span className={`badge badge-${payment.status}`}>
                                            {payment.status}
                                        </span>
                                </td>
                                <td>
                                    {payment.status === 'pending' && (
                                        <>
                                            <button
                                                onClick={() => handleApprove(payment._id)}
                                                className="btn btn-success btn-sm"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => setSelectedPayment(payment)}
                                                className="btn btn-danger btn-sm"
                                            >
                                                Decline
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>

            {selectedPayment && (
                <div className="modal">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Decline Payment</h2>
                            <button className="btn-close" onClick={() => setSelectedPayment(null)}>&times;</button>
                        </div>
                        <div className="modal-body">
                            <p><strong>User:</strong> {selectedPayment.userId?.name}</p>
                            <p><strong>Amount:</strong> ₦{selectedPayment.amount}</p>
                            <p><strong>Date:</strong> {new Date(selectedPayment.paymentDate).toLocaleDateString()}</p>

                            {/* Show receipt preview */}
                            {selectedPayment.receiptUrl && (
                                <div className="receipt-preview">
                                    <p><strong>Receipt:</strong></p>
                                    <a
                                        href={getReceiptUrl(selectedPayment.receiptUrl)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-primary btn-sm"
                                    >
                                        View Full Receipt
                                    </a>
                                </div>
                            )}

                            <div className="form-group">
                                <label htmlFor="declineReason">Reason for declining *</label>
                                <textarea
                                    id="declineReason"
                                    value={declineReason}
                                    onChange={(e) => setDeclineReason(e.target.value)}
                                    className="form-control"
                                    rows="3"
                                    placeholder="Enter reason for declining this payment..."
                                    required
                                />
                            </div>

                            <div className="form-actions">
                                <button
                                    onClick={() => handleDecline(selectedPayment._id)}
                                    className="btn btn-danger"
                                >
                                    Confirm Decline
                                </button>
                                <button
                                    onClick={() => {
                                        setSelectedPayment(null);
                                        setDeclineReason('');
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

export default AdminPayments;