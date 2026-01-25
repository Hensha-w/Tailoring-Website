// frontend/src/pages/admin/Users.jsx
import React, { useState } from 'react';
import {
    Box, Card, CardContent, Typography, IconButton,
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, TablePagination, Chip,
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, MenuItem, Switch
} from '@mui/material';
import { Delete, Edit, Block, CheckCircle } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminUsers = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const queryClient = useQueryClient();

    const { data: usersData, isLoading } = useQuery({
        queryKey: ['admin-users', page, rowsPerPage],
        queryFn: async () => {
            const response = await axios.get('/api/admin/users', {
                params: { page: page + 1, limit: rowsPerPage }
            });
            return response.data;
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (userId) => axios.delete(`/api/admin/users/${userId}`),
        onSuccess: () => {
            toast.success('User account deleted');
            queryClient.invalidateQueries(['admin-users']);
        }
    });

    const toggleStatusMutation = useMutation({
        mutationFn: ({ userId, active }) =>
            axios.patch(`/api/admin/users/${userId}/status`, { active }),
        onSuccess: () => {
            toast.success('User status updated');
            queryClient.invalidateQueries(['admin-users']);
        }
    });

    const handleDelete = (userId) => {
        if (window.confirm('Are you sure you want to delete this user account?')) {
            deleteMutation.mutate(userId);
        }
    };

    const handleToggleStatus = (userId, currentStatus) => {
        toggleStatusMutation.mutate({
            userId,
            active: !currentStatus
        });
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom color="primary.dark">
                User Management
            </Typography>

            <Card>
                <CardContent>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ bgcolor: 'primary.dark' }}>
                                    <TableCell sx={{ color: 'white' }}>Name</TableCell>
                                    <TableCell sx={{ color: 'white' }}>Email</TableCell>
                                    <TableCell sx={{ color: 'white' }}>Business</TableCell>
                                    <TableCell sx={{ color: 'white' }}>Subscription</TableCell>
                                    <TableCell sx={{ color: 'white' }}>Status</TableCell>
                                    <TableCell sx={{ color: 'white' }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center">
                                            Loading users...
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    usersData?.users.map((user) => (
                                        <TableRow key={user._id} hover>
                                            <TableCell>
                                                {user.firstName} {user.lastName}
                                            </TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>{user.businessName || 'N/A'}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={user.subscription}
                                                    color={
                                                        user.subscription === 'active' ? 'success' :
                                                            user.subscription === 'free_trial' ? 'warning' : 'error'
                                                    }
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Switch
                                                        checked={user.isActive}
                                                        onChange={() => handleToggleStatus(user._id, user.isActive)}
                                                        color="success"
                                                    />
                                                    <Chip
                                                        label={user.isActive ? 'Active' : 'Inactive'}
                                                        size="small"
                                                        color={user.isActive ? 'success' : 'error'}
                                                    />
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() => handleDelete(user._id)}
                                                >
                                                    <Delete />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <TablePagination
                        rowsPerPageOptions={[10, 25, 50]}
                        component="div"
                        count={usersData?.total || 0}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={(e, newPage) => setPage(newPage)}
                        onRowsPerPageChange={(e) => {
                            setRowsPerPage(parseInt(e.target.value, 10));
                            setPage(0);
                        }}
                    />
                </CardContent>
            </Card>
        </Box>
    );
};