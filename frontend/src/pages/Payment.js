import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Payment = () => {
    const { user } = useAuth();
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [loading, setLoading] = useState(false);
    const [payments, setPayments] = useState([]);
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const bankDetails = {
        accountName: 'Tailoring Website Payments',
        accountNumber: '0123456789',
        bankName: 'First Bank of Nigeria'
    };

    useEffect(() => {
        fetchPaymentHistory();
        fetchPaymentStatus();
    }, []);

    const fetchPaymentHistory = async () => {
        try {
            const { data } = await axios.get('/api/payments');
            setPayments(data);
        } catch (error) {
            console.error('Failed to fetch payments:', error);
        }
    };

    const fetchPaymentStatus = async () => {
        try {
            const { data } = await axios.get('/api/payments/status');
            setPaymentStatus(data);
        } catch (error) {
            console.error('Failed to fetch payment status:', error);
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (selectedFile.size > 5 * 1024 * 1024) {
                setError('File size must be less than 5MB');
                e.target.value = '';
                return;
            }

            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
            if (!validTypes.includes(selectedFile.type)) {
                setError('Only JPEG, PNG, and PDF files are allowed');
                e.target.value = '';
                return;
            }

            setFile(selectedFile);
            setFileName(selectedFile.name);
            setError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setError('Please select a receipt file');
            return;
        }

        setLoading(true);
        setError('');
        setMessage('');

        const formData = new FormData();
        formData.append('receipt', file);

        try {
            const response = await axios.post('/api/payments', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setMessage('Payment receipt uploaded successfully! Awaiting approval.');
            setFile(null);
            setFileName('');
            e.target.reset();
            fetchPaymentHistory();
            fetchPaymentStatus();
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to upload receipt');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadgeClass = (status) => {
        switch(status) {
            case 'approved': return 'status-approved';
            case 'declined': return 'status-declined';
            default: return 'status-pending';
        }
    };

    const getFullReceiptUrl = (receiptUrl) => {
        if (!receiptUrl) return '';
        if (receiptUrl.startsWith('http')) return receiptUrl;
        if (receiptUrl.startsWith('/uploads')) {
            return `http://localhost:5000${receiptUrl}`;
        }
        return `http://localhost:5000/uploads/${receiptUrl}`;
    };

    const renderSubscriptionStatus = () => {
        if (!paymentStatus) return null;

        const { subscription, trialEndDate, currentPeriodEnd, nextPaymentDue, canMakePayment, hasPendingPayment, daysUntilNextPayment } = paymentStatus;

        return (
            <div className="subscription-status-details">
                <h3>Subscription Details</h3>
                <div className="status-grid">
                    <div className="status-item">
                        <span className="status-label">Status:</span>
                        <span className={`status-badge ${subscription}`}>
                            {subscription}
                        </span>
                    </div>

                    {subscription === 'trial' && (
                        <div className="status-item">
                            <span className="status-label">Trial Ends:</span>
                            <span className="status-value">
                                {new Date(trialEndDate).toLocaleDateString()}
                                <small className="days-left">
                                    ({Math.ceil((new Date(trialEndDate) - new Date()) / (1000 * 60 * 60 * 24))} days left)
                                </small>
                            </span>
                        </div>
                    )}

                    {subscription === 'active' && (
                        <>
                            <div className="status-item">
                                <span className="status-label">Current Period Ends:</span>
                                <span className="status-value">
                                    {new Date(currentPeriodEnd).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="status-item">
                                <span className="status-label">Next Payment Due:</span>
                                <span className="status-value">
                                    {new Date(nextPaymentDue).toLocaleDateString()}
                                    {daysUntilNextPayment && (
                                        <small className="days-left">
                                            ({daysUntilNextPayment} days)
                                        </small>
                                    )}
                                </span>
                            </div>
                        </>
                    )}

                    {hasPendingPayment && (
                        <div className="status-item warning">
                            <span className="status-label">⚠️ Pending Payment:</span>
                            <span className="status-value">
                                You have a payment awaiting approval
                            </span>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="payment-page">
            <div className="page-header">
                <h1>Subscription Payment</h1>
            </div>

            <div className="payment-container">
                <div className="payment-info-card">
                    <h2>Monthly Subscription - ₦1,500</h2>
                    {renderSubscriptionStatus()}
                </div>

                <div className="payment-grid">
                    <div className="bank-details-card">
                        <h3>Bank Transfer Details</h3>
                        <div className="bank-info">
                            <div className="info-row">
                                <span className="label">Account Name:</span>
                                <span className="value">{bankDetails.accountName}</span>
                            </div>
                            <div className="info-row">
                                <span className="label">Account Number:</span>
                                <span className="value account-number">{bankDetails.accountNumber}</span>
                            </div>
                            <div className="info-row">
                                <span className="label">Bank Name:</span>
                                <span className="value">{bankDetails.bankName}</span>
                            </div>
                        </div>
                        <div className="payment-amount">
                            <span className="amount-label">Amount to pay:</span>
                            <span className="amount-value">₦1,500</span>
                        </div>
                        <p className="payment-note">
                            Make a transfer of ₦1,500 to the account above and upload the receipt below.
                        </p>
                    </div>

                    <div className="upload-receipt-card">
                        <h3>Upload Payment Receipt</h3>

                        {paymentStatus && !paymentStatus.canMakePayment && (
                            <div className="alert alert-warning">
                                {paymentStatus.hasPendingPayment
                                    ? "You already have a pending payment. Please wait for approval."
                                    : paymentStatus.daysUntilNextPayment > 0
                                        ? `Your next payment is due in ${paymentStatus.daysUntilNextPayment} days. You cannot upload a payment until then.`
                                        : "You cannot make a payment at this time."
                                }
                            </div>
                        )}

                        {error && <div className="alert alert-danger">{error}</div>}
                        {message && <div className="alert alert-success">{message}</div>}

                        <form onSubmit={handleSubmit} className="upload-form">
                            <div className="form-group">
                                <label htmlFor="receipt">Select Receipt Image/PDF</label>
                                <input
                                    type="file"
                                    id="receipt"
                                    name="receipt"
                                    accept=".jpg,.jpeg,.png,.pdf"
                                    onChange={handleFileChange}
                                    className="form-control-file"
                                    disabled={!paymentStatus?.canMakePayment}
                                />
                                {fileName && (
                                    <small className="form-text selected-file">
                                        Selected: {fileName}
                                    </small>
                                )}
                                <small className="form-text">
                                    Accepted formats: JPEG, PNG, PDF (Max size: 5MB)
                                </small>
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary btn-block"
                                disabled={loading || !file || !paymentStatus?.canMakePayment}
                            >
                                {loading ? 'Uploading...' : 'Upload Receipt'}
                            </button>
                        </form>
                    </div>
                </div>

                {payments.length > 0 && (
                    <div className="payment-history-card">
                        <h3>Payment History</h3>
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Amount</th>
                                    <th>Period</th>
                                    <th>Receipt</th>
                                    <th>Status</th>
                                    <th>Approval Date</th>
                                </tr>
                                </thead>
                                <tbody>
                                {payments.map(payment => (
                                    <tr key={payment._id}>
                                        <td>{new Date(payment.paymentDate).toLocaleDateString()}</td>
                                        <td>₦{payment.amount}</td>
                                        <td>
                                            {payment.periodStart && payment.periodEnd && (
                                                <small>
                                                    {new Date(payment.periodStart).toLocaleDateString()} - {new Date(payment.periodEnd).toLocaleDateString()}
                                                </small>
                                            )}
                                        </td>
                                        <td>
                                            {payment.receiptUrl && (
                                                <a
                                                    href={getFullReceiptUrl(payment.receiptUrl)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn-link"
                                                >
                                                    View Receipt
                                                </a>
                                            )}
                                        </td>
                                        <td>
                                                <span className={`status-badge ${getStatusBadgeClass(payment.status)}`}>
                                                    {payment.status}
                                                </span>
                                        </td>
                                        <td>
                                            {payment.approvalDate
                                                ? new Date(payment.approvalDate).toLocaleDateString()
                                                : '-'
                                            }
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Payment;