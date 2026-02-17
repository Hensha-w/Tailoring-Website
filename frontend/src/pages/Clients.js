import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ClientForm from '../components/ClientForm';
import ClientCard from '../components/ClientCard';

const Clients = () => {
    const [clients, setClients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedClient, setSelectedClient] = useState(null);

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const { data } = await axios.get('/api/clients');
            setClients(data);
            setLoading(false);
        } catch (error) {
            setError('Failed to fetch clients');
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {
        setSearchTerm(e.target.value);
        if (e.target.value.length > 2) {
            try {
                const { data } = await axios.get(`/api/clients/search?name=${e.target.value}`);
                setClients(data);
            } catch (error) {
                console.error('Search failed:', error);
            }
        } else if (e.target.value.length === 0) {
            fetchClients();
        }
    };

    const handleAddClient = () => {
        setSelectedClient(null);
        setShowForm(true);
    };

    const handleEditClient = (client) => {
        setSelectedClient(client);
        setShowForm(true);
    };

    const handleDeleteClient = async (clientId) => {
        if (window.confirm('Are you sure you want to delete this client?')) {
            try {
                await axios.delete(`/api/clients/${clientId}`);
                setClients(clients.filter(c => c._id !== clientId));
            } catch (error) {
                setError('Failed to delete client');
            }
        }
    };

    const handleFormSubmit = async (formData) => {
        try {
            if (selectedClient) {
                const { data } = await axios.put(`/api/clients/${selectedClient._id}`, formData);
                setClients(clients.map(c => c._id === selectedClient._id ? data : c));
            } else {
                const { data } = await axios.post('/api/clients', formData);
                setClients([data, ...clients]);
            }
            setShowForm(false);
            setSelectedClient(null);
        } catch (error) {
            setError('Failed to save client');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="clients-page">
            <div className="page-header">
                <h1>Clients</h1>
                <button className="btn" onClick={handleAddClient}>
                    Add New Client
                </button>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search clients by name..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="form-control"
                />
            </div>

            {showForm && (
                <div className="modal">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>{selectedClient ? 'Edit Client' : 'Add New Client'}</h2>
                            <button className="btn-close" onClick={() => setShowForm(false)}>&times;</button>
                        </div>
                        <div className="modal-body">
                            <ClientForm
                                client={selectedClient}
                                onSubmit={handleFormSubmit}
                                onCancel={() => setShowForm(false)}
                            />
                        </div>
                    </div>
                </div>
            )}

            <div className="clients-grid">
                {clients.length > 0 ? (
                    clients.map(client => (
                        <ClientCard
                            key={client._id}
                            client={client}
                            onEdit={() => handleEditClient(client)}
                            onDelete={() => handleDeleteClient(client._id)}
                        />
                    ))
                ) : (
                    <p>No clients found</p>
                )}
            </div>
        </div>
    );
};

export default Clients;