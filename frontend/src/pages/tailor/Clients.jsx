import React, { useState } from 'react';
import {
    Box, Button, Card, CardContent, Grid, TextField,
    Typography, IconButton, Dialog, DialogTitle,
    DialogContent, DialogActions, Tabs, Tab, Chip,
    InputAdornment, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, TablePagination,
    Paper, Tooltip, Fab
} from '@mui/material';
import {
    Search, Add, Edit, Delete, Visibility,
    Male, Female, FilterList
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import ClientForm from '../../components/clients/ClientForm';
import MeasurementForm from '../../components/clients/MeasurementForm';

const Clients = () => {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    const [genderFilter, setGenderFilter] = useState('all');
    const queryClient = useQueryClient();

    // Fetch clients
    const { data: clientsData, isLoading } = useQuery({
        queryKey: ['clients', search, page, rowsPerPage, genderFilter],
        queryFn: async () => {
            const response = await axios.get('/api/clients', {
                params: { search, page: page + 1, limit: rowsPerPage, gender: genderFilter !== 'all' ? genderFilter : undefined }
            });
            return response.data;
        }
    });

    // Delete client mutation
    const deleteMutation = useMutation({
        mutationFn: (clientId) => axios.delete(`/api/clients/${clientId}`),
        onSuccess: () => {
            toast.success('Client deleted successfully');
            queryClient.invalidateQueries(['clients']);
        },
        onError: (error) => {
            toast.error(error.response?.data?.error || 'Failed to delete client');
        }
    });

    const handleDelete = (clientId) => {
        if (window.confirm('Are you sure you want to delete this client?')) {
            deleteMutation.mutate(clientId);
        }
    };

    const handleOpenDialog = (client = null) => {
        setSelectedClient(client);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setSelectedClient(null);
        setOpenDialog(false);
    };

    const filteredClients = clientsData?.clients || [];

    return (
        <Box>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4" sx={{ color: 'primary.dark' }}>
                    Clients
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => handleOpenDialog()}
                    sx={{ bgcolor: 'accent.gold', color: 'primary.dark' }}
                >
                    Add New Client
                </Button>
            </Box>

            {/* Search and Filters */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="Search clients by name, phone, or email"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                <Chip
                                    label="All"
                                    onClick={() => setGenderFilter('all')}
                                    color={genderFilter === 'all' ? 'primary' : 'default'}
                                />
                                <Chip
                                    icon={<Male />}
                                    label="Male"
                                    onClick={() => setGenderFilter('male')}
                                    color={genderFilter === 'male' ? 'primary' : 'default'}
                                />
                                <Chip
                                    icon={<Female />}
                                    label="Female"
                                    onClick={() => setGenderFilter('female')}
                                    color={genderFilter === 'female' ? 'primary' : 'default'}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Clients Table */}
            <Card>
                <CardContent>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ bgcolor: 'primary.light' }}>
                                    <TableCell sx={{ color: 'white' }}>Name</TableCell>
                                    <TableCell sx={{ color: 'white' }}>Gender</TableCell>
                                    <TableCell sx={{ color: 'white' }}>Phone</TableCell>
                                    <TableCell sx={{ color: 'white' }}>Last Measured</TableCell>
                                    <TableCell sx={{ color: 'white' }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">
                                            Loading...
                                        </TableCell>
                                    </TableRow>
                                ) : filteredClients.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">
                                            No clients found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredClients.map((client) => (
                                        <TableRow key={client._id} hover>
                                            <TableCell>
                                                <Typography fontWeight="bold">
                                                    {client.firstName} {client.lastName}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    icon={client.gender === 'male' ? <Male /> : <Female />}
                                                    label={client.gender}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>{client.phone || 'N/A'}</TableCell>
                                            <TableCell>
                                                {new Date(client.lastMeasurementDate).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', gap: 1 }}>
                                                    <Tooltip title="View Details">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => navigate(`/clients/${client._id}`)}
                                                        >
                                                            <Visibility />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Edit">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleOpenDialog(client)}
                                                        >
                                                            <Edit />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Delete">
                                                        <IconButton
                                                            size="small"
                                                            color="error"
                                                            onClick={() => handleDelete(client._id)}
                                                        >
                                                            <Delete />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Pagination */}
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={clientsData?.totalClients || 0}
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

            {/* Add/Edit Client Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle sx={{ bgcolor: 'primary.dark', color: 'accent.cream' }}>
                    {selectedClient ? 'Edit Client' : 'Add New Client'}
                </DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    {selectedClient ? (
                        <MeasurementForm
                            client={selectedClient}
                            onSuccess={handleCloseDialog}
                        />
                    ) : (
                        <ClientForm onSuccess={handleCloseDialog} />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                </DialogActions>
            </Dialog>

            {/* Floating Action Button for Quick Add */}
            <Fab
                color="primary"
                sx={{
                    position: 'fixed',
                    bottom: 16,
                    right: 16,
                    bgcolor: 'accent.gold',
                    color: 'primary.dark',
                    '&:hover': { bgcolor: '#c19b2e' }
                }}
                onClick={() => handleOpenDialog()}
            >
                <Add />
            </Fab>
        </Box>
    );
};

export default Clients;