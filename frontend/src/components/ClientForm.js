import React, { useState } from 'react';

const ClientForm = ({ client, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        name: client?.name || '',
        gender: client?.gender || 'male',
        phone: client?.phone || '',
        email: client?.email || '',
        address: client?.address || '',
        measurements: {
            chest: client?.measurements?.chest || '',
            waist: client?.measurements?.waist || '',
            hips: client?.measurements?.hips || '',
            shoulder: client?.measurements?.shoulder || '',
            sleeveLength: client?.measurements?.sleeveLength || '',
            shirtLength: client?.measurements?.shirtLength || '',
            trouserLength: client?.measurements?.trouserLength || '',
            thigh: client?.measurements?.thigh || '',
            knee: client?.measurements?.knee || '',
            calf: client?.measurements?.calf || '',
            neck: client?.measurements?.neck || '',
            bust: client?.measurements?.bust || '',
            underbust: client?.measurements?.underbust || '',
            waistRise: client?.measurements?.waistRise || '',
            hipRise: client?.measurements?.hipRise || '',
            notes: client?.measurements?.notes || ''
        }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('measurement.')) {
            const measurementField = name.split('.')[1];
            setFormData({
                ...formData,
                measurements: {
                    ...formData.measurements,
                    [measurementField]: value
                }
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-section">
                <h3>Personal Information</h3>
                <div className="form-group">
                    <label>Name *</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="form-control"
                    />
                </div>

                <div className="form-group">
                    <label>Gender *</label>
                    <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        required
                        className="form-control"
                    >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Phone</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>

                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>

                <div className="form-group">
                    <label>Address</label>
                    <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows="3"
                        className="form-control"
                    />
                </div>
            </div>

            <div className="form-section">
                <h3>Measurements</h3>
                <div className="row">
                    <div className="col">
                        <div className="form-group">
                            <label>Chest (inches)</label>
                            <input
                                type="number"
                                name="measurement.chest"
                                value={formData.measurements.chest}
                                onChange={handleChange}
                                step="0.1"
                                className="form-control"
                            />
                        </div>

                        <div className="form-group">
                            <label>Waist (inches)</label>
                            <input
                                type="number"
                                name="measurement.waist"
                                value={formData.measurements.waist}
                                onChange={handleChange}
                                step="0.1"
                                className="form-control"
                            />
                        </div>

                        <div className="form-group">
                            <label>Hips (inches)</label>
                            <input
                                type="number"
                                name="measurement.hips"
                                value={formData.measurements.hips}
                                onChange={handleChange}
                                step="0.1"
                                className="form-control"
                            />
                        </div>

                        <div className="form-group">
                            <label>Shoulder (inches)</label>
                            <input
                                type="number"
                                name="measurement.shoulder"
                                value={formData.measurements.shoulder}
                                onChange={handleChange}
                                step="0.1"
                                className="form-control"
                            />
                        </div>
                    </div>

                    <div className="col">
                        <div className="form-group">
                            <label>Sleeve Length (inches)</label>
                            <input
                                type="number"
                                name="measurement.sleeveLength"
                                value={formData.measurements.sleeveLength}
                                onChange={handleChange}
                                step="0.1"
                                className="form-control"
                            />
                        </div>

                        <div className="form-group">
                            <label>Shirt Length (inches)</label>
                            <input
                                type="number"
                                name="measurement.shirtLength"
                                value={formData.measurements.shirtLength}
                                onChange={handleChange}
                                step="0.1"
                                className="form-control"
                            />
                        </div>

                        <div className="form-group">
                            <label>Trouser Length (inches)</label>
                            <input
                                type="number"
                                name="measurement.trouserLength"
                                value={formData.measurements.trouserLength}
                                onChange={handleChange}
                                step="0.1"
                                className="form-control"
                            />
                        </div>

                        <div className="form-group">
                            <label>Thigh (inches)</label>
                            <input
                                type="number"
                                name="measurement.thigh"
                                value={formData.measurements.thigh}
                                onChange={handleChange}
                                step="0.1"
                                className="form-control"
                            />
                        </div>
                    </div>
                </div>

                {formData.gender === 'female' && (
                    <div className="row">
                        <div className="col">
                            <div className="form-group">
                                <label>Bust (inches)</label>
                                <input
                                    type="number"
                                    name="measurement.bust"
                                    value={formData.measurements.bust}
                                    onChange={handleChange}
                                    step="0.1"
                                    className="form-control"
                                />
                            </div>

                            <div className="form-group">
                                <label>Underbust (inches)</label>
                                <input
                                    type="number"
                                    name="measurement.underbust"
                                    value={formData.measurements.underbust}
                                    onChange={handleChange}
                                    step="0.1"
                                    className="form-control"
                                />
                            </div>
                        </div>

                        <div className="col">
                            <div className="form-group">
                                <label>Waist Rise (inches)</label>
                                <input
                                    type="number"
                                    name="measurement.waistRise"
                                    value={formData.measurements.waistRise}
                                    onChange={handleChange}
                                    step="0.1"
                                    className="form-control"
                                />
                            </div>

                            <div className="form-group">
                                <label>Hip Rise (inches)</label>
                                <input
                                    type="number"
                                    name="measurement.hipRise"
                                    value={formData.measurements.hipRise}
                                    onChange={handleChange}
                                    step="0.1"
                                    className="form-control"
                                />
                            </div>
                        </div>
                    </div>
                )}

                <div className="form-group">
                    <label>Additional Notes</label>
                    <textarea
                        name="measurement.notes"
                        value={formData.measurements.notes}
                        onChange={handleChange}
                        rows="3"
                        className="form-control"
                        placeholder="Special instructions, fabric preferences, etc."
                    />
                </div>
            </div>

            <div className="form-actions">
                <button type="submit" className="btn">
                    {client ? 'Update Client' : 'Add Client'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={onCancel}>
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default ClientForm;