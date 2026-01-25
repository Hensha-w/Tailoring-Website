// frontend/src/components/payments/PaymentForm.jsx
import React, { useState } from 'react';
import {
    Box, Card, CardContent, Typography, Button,
    TextField, FormControl, InputLabel, Select,
    MenuItem, Alert, LinearProgress
} from '@mui/material';
import { CloudUpload, AttachMoney } from '@mui/icons-material';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';

const PaymentForm = ({ user }) => {
    const [formData, setFormData] = useState({
        period: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`,
        paymentMethod: 'bank_transfer',
        transactionReference: '',
        receipt: null
    });
    const [uploadProgress, setUploadProgress] = useState(0);
    const [previewUrl, setPreviewUrl] = useState('');

    const paymentMutation = useMutation({
        mutationFn: async (formData) => {
            const formDataToSend = new FormData();
            Object.keys(formData).forEach(key => {
                if (formData[key] !== null) {
                    formDataToSend.append(key, formData[key]);
                }
            });

            const response = await axios.post('/api/payments/upload', formDataToSend, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    setUploadProgress(percentCompleted);
                }
            });
            return response.data;
        },
        onSuccess: () => {
            toast.success('Payment receipt uploaded successfully! Awaiting approval.');
            setFormData({
                period: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`,
                paymentMethod: 'bank_transfer',
                transactionReference: '',
                receipt: null
            });
            setPreviewUrl('');
            setUploadProgress(0);
        },
        onError: (error) => {
            toast.error(error.response?.data?.error || 'Payment upload failed');
        }
    });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, receipt: file });
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.receipt) {
            toast.error('Please upload a receipt');
            return;
        }
        paymentMutation.mutate(formData);
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom color="primary.dark">
                    Make Payment
                </Typography>

                {user.subscription === 'free_trial' && (
                    <Alert severity="info" sx={{ mb: 2 }}>
                        Your free trial ends on {new Date(user.trialEndsAt).toLocaleDateString()}.
                        Pay ₦1,500 monthly to continue using all features.
                    </Alert>
                )}

                <Box sx={{ bgcolor: 'accent.cream', p: 2, borderRadius: 1, mb: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>
                        Bank Transfer Details:
                    </Typography>
                    <Typography variant="body2">
                        <strong>Bank:</strong> Access Bank<br />
                        <strong>Account Name:</strong> TailorCraft Solutions<br />
                        <strong>Account Number:</strong> 0123456789
                    </Typography>
                </Box>

                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Period (YYYY-MM)"
                        value={formData.period}
                        onChange={(e) => setFormData({...formData, period: e.target.value})}
                        margin="normal"
                        required
                    />

                    <FormControl fullWidth margin="normal">
                        <InputLabel>Payment Method</InputLabel>
                        <Select
                            value={formData.paymentMethod}
                            label="Payment Method"
                            onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                        >
                            <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                            <MenuItem value="card">Card Payment</MenuItem>
                            <MenuItem value="cash">Cash</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        fullWidth
                        label="Transaction Reference"
                        value={formData.transactionReference}
                        onChange={(e) => setFormData({...formData, transactionReference: e.target.value})}
                        margin="normal"
                    />

                    <Box sx={{ mt: 2, mb: 2 }}>
                        <input
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="receipt-upload"
                            type="file"
                            onChange={handleFileChange}
                        />
                        <label htmlFor="receipt-upload">
                            <Button
                                variant="outlined"
                                component="span"
                                startIcon={<CloudUpload />}
                                fullWidth
                            >
                                Upload Receipt
                            </Button>
                        </label>
                        {previewUrl && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="caption">Preview:</Typography>
                                <img
                                    src={previewUrl}
                                    alt="Receipt preview"
                                    style={{ maxWidth: '100%', maxHeight: '200px', marginTop: '8px' }}
                                />
                            </Box>
                        )}
                    </Box>

                    {uploadProgress > 0 && uploadProgress < 100 && (
                        <Box sx={{ width: '100%', mb: 2 }}>
                            <LinearProgress variant="determinate" value={uploadProgress} />
                            <Typography variant="caption">{uploadProgress}% uploaded</Typography>
                        </Box>
                    )}

                    <Button
                        type="submit"
                        variant="contained"
                        startIcon={<AttachMoney />}
                        fullWidth
                        disabled={paymentMutation.isLoading}
                        sx={{
                            bgcolor: 'accent.gold',
                            color: 'primary.dark',
                            '&:hover': { bgcolor: '#c19b2e' }
                        }}
                    >
                        Submit Payment
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};