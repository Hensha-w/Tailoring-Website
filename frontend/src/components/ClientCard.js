import React, { useRef } from 'react';

// SVG Icons matching dashboard
const Icons = {
    Male: () => (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM16 9V15C16 16.1 15.1 17 14 17H13V22H11V17H10V22H8V17H7C5.9 17 5 16.1 5 15V9C5 7.9 5.9 7 7 7H14C15.1 7 16 7.9 16 9Z"
                  fill="currentColor"/>
        </svg>
    ),
    Female: () => (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM16 14V18H19V22H17V18H13V22H11V15H10C8.9 15 8 14.1 8 13V9C8 7.9 8.9 7 10 7H14C15.1 7 16 7.9 16 9V14Z"
                  fill="currentColor"/>
        </svg>
    ),
    Print: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 8H18V3H6V8H5C3.34 8 2 9.34 2 11V17H6V21H18V17H22V11C22 9.34 20.66 8 19 8ZM8 5H16V8H8V5ZM16 19H8V15H16V19ZM18 15V13H6V15H4V11C4 10.45 4.45 10 5 10H19C19.55 10 20 10.45 20 11V15H18Z"
                  fill="currentColor"/>
            <rect x="15" y="11" width="2" height="2" fill="currentColor"/>
        </svg>
    ),
    Ruler: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 5V19H21V5H3ZM19 17H5V7H19V17ZM17 9H15V11H17V9ZM13 9H11V11H13V9ZM9 9H7V11H9V9ZM17 13H15V15H17V13ZM13 13H11V15H13V13ZM9 13H7V15H9V13Z"
                  fill="currentColor"/>
        </svg>
    )
};

const ClientCard = ({ client, onEdit, onDelete }) => {
    const printRef = useRef(null);

    const getGenderIcon = () => {
        return client.gender === 'male' ? <Icons.Male /> : <Icons.Female />;
    };

    const handlePrint = () => {
        // Create a new window for printing
        const printWindow = window.open('', '_blank');

        // Get the current date for the print header
        const today = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Generate measurements HTML
        const measurementsHTML = generateMeasurementsHTML();

        // Write the print content
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>${client.name} - Measurements</title>
                <style>
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        max-width: 800px;
                        margin: 0 auto;
                        padding: 40px 20px;
                        background: white;
                    }
                    .print-header {
                        text-align: center;
                        margin-bottom: 40px;
                        padding-bottom: 20px;
                        border-bottom: 2px solid #10b981;
                    }
                    .print-header h1 {
                        color: #10b981;
                        font-size: 32px;
                        margin-bottom: 10px;
                    }
                    .client-info {
                        background: #f9f9f9;
                        padding: 20px;
                        border-radius: 10px;
                        margin-bottom: 30px;
                    }
                    .client-info h2 {
                        color: #10b981;
                        margin-top: 0;
                        margin-bottom: 15px;
                        font-size: 24px;
                    }
                    .info-grid {
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        gap: 15px;
                    }
                    .info-item {
                        display: flex;
                        flex-direction: column;
                    }
                    .info-label {
                        font-size: 14px;
                        color: #666;
                        margin-bottom: 5px;
                    }
                    .info-value {
                        font-size: 18px;
                        font-weight: 600;
                        color: #333;
                    }
                    .measurements-section {
                        margin-bottom: 30px;
                    }
                    .measurements-section h2 {
                        color: #10b981;
                        margin-bottom: 20px;
                        font-size: 24px;
                    }
                    .measurements-grid {
                        display: grid;
                        grid-template-columns: repeat(3, 1fr);
                        gap: 15px;
                    }
                    .measurement-card {
                        background: white;
                        border: 1px solid #e5e7eb;
                        border-radius: 8px;
                        padding: 15px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                    }
                    .measurement-card .label {
                        display: block;
                        font-size: 14px;
                        color: #666;
                        margin-bottom: 5px;
                    }
                    .measurement-card .value {
                        display: block;
                        font-size: 20px;
                        font-weight: 700;
                        color: #10b981;
                    }
                    .measurement-card .unit {
                        font-size: 14px;
                        color: #999;
                        margin-left: 2px;
                    }
                    .notes-section {
                        margin-top: 30px;
                        padding: 20px;
                        background: #f9f9f9;
                        border-radius: 8px;
                    }
                    .notes-section h3 {
                        color: #10b981;
                        margin-top: 0;
                        margin-bottom: 10px;
                    }
                    .print-footer {
                        margin-top: 50px;
                        text-align: center;
                        font-size: 12px;
                        color: #999;
                        border-top: 1px solid #e5e7eb;
                        padding-top: 20px;
                    }
                    @media print {
                        body { padding: 20px; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="print-header">
                    <h1> TailorPro Client Measurements</h1>
                    <p>Printed on: ${today}</p>
                </div>
                
                <div class="client-info">
                    <h2>Client Information</h2>
                    <div class="info-grid">
                        <div class="info-item">
                            <span class="info-label">Full Name</span>
                            <span class="info-value">${client.name}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Gender</span>
                            <span class="info-value">${client.gender?.charAt(0).toUpperCase() + client.gender?.slice(1)}</span>
                        </div>
                        ${client.phone ? `
                        <div class="info-item">
                            <span class="info-label">Phone</span>
                            <span class="info-value">${client.phone}</span>
                        </div>
                        ` : ''}
                        ${client.email ? `
                        <div class="info-item">
                            <span class="info-label">Email</span>
                            <span class="info-value">${client.email}</span>
                        </div>
                        ` : ''}
                        ${client.address ? `
                        <div class="info-item">
                            <span class="info-label">Address</span>
                            <span class="info-value">${client.address}</span>
                        </div>
                        ` : ''}
                    </div>
                </div>

                <div class="measurements-section">
                    <h2>Body Measurements (inches)</h2>
                    <div class="measurements-grid">
                        ${generateMeasurementsHTML()}
                    </div>
                </div>

                ${client.measurements?.notes ? `
                <div class="notes-section">
                    <h3>Additional Notes</h3>
                    <p>${client.measurements.notes}</p>
                </div>
                ` : ''}

                <div class="print-footer">
                    <p>Generated by TailorPro - Professional Tailoring Management System</p>
                </div>
            </body>
            </html>
        `);

        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    };

    const generateMeasurementsHTML = () => {
        const measurements = client.measurements || {};
        const isMale = client.gender === 'male';

        const allMeasurements = [
            { label: 'Chest', value: measurements.chest, category: 'upper' },
            { label: 'Waist', value: measurements.waist, category: 'upper' },
            { label: 'Hips', value: measurements.hips, category: 'lower' },
            { label: 'Shoulder', value: measurements.shoulder, category: 'upper' },
            { label: 'Sleeve Length', value: measurements.sleeveLength, category: 'upper' },
            { label: 'Shirt Length', value: measurements.shirtLength, category: 'upper' },
            { label: 'Trouser Length', value: measurements.trouserLength, category: 'lower' },
            { label: 'Thigh', value: measurements.thigh, category: 'lower' },
            { label: 'Knee', value: measurements.knee, category: 'lower' },
            { label: 'Calf', value: measurements.calf, category: 'lower' },
            { label: 'Neck', value: measurements.neck, category: 'upper' },
            // Female-specific measurements
            ...(isMale ? [] : [
                { label: 'Bust', value: measurements.bust, category: 'upper' },
                { label: 'Underbust', value: measurements.underbust, category: 'upper' },
                { label: 'Waist Rise', value: measurements.waistRise, category: 'lower' },
                { label: 'Hip Rise', value: measurements.hipRise, category: 'lower' }
            ])
        ];

        return allMeasurements
            .filter(m => m.value && m.value !== '')
            .map(m => `
                <div class="measurement-card">
                    <span class="label">${m.label}</span>
                    <span class="value">${m.value}<span class="unit">"</span></span>
                </div>
            `)
            .join('');
    };

    return (
        <div className="client-card fade-in" ref={printRef}>
            <div className="client-header">
                <div className="client-avatar-large">
                    {getGenderIcon()}
                </div>
                <div className="client-info">
                    <h3>{client.name}</h3>
                    <p>{client.gender?.charAt(0).toUpperCase() + client.gender?.slice(1)}</p>
                </div>
            </div>

            <div className="client-body">
                <div className="measurements-preview">
                    <div className="measurement-item">
                        <span className="measurement-label">Chest:</span>
                        <span className="measurement-value">
                            {client.measurements?.chest || 'N/A'}"
                        </span>
                    </div>
                    <div className="measurement-item">
                        <span className="measurement-label">Waist:</span>
                        <span className="measurement-value">
                            {client.measurements?.waist || 'N/A'}"
                        </span>
                    </div>
                    <div className="measurement-item">
                        <span className="measurement-label">Hips:</span>
                        <span className="measurement-value">
                            {client.measurements?.hips || 'N/A'}"
                        </span>
                    </div>
                    <div className="measurement-item">
                        <span className="measurement-label">Shoulder:</span>
                        <span className="measurement-value">
                            {client.measurements?.shoulder || 'N/A'}"
                        </span>
                    </div>
                </div>

                {client.phone && (
                    <div className="client-contact">
                        <span> {client.phone}</span>
                    </div>
                )}

                {client.measurements?.notes && (
                    <div className="client-notes-preview">
                        <span className="notes-label">📝 Notes:</span>
                        <span className="notes-text">{client.measurements.notes.substring(0, 50)}...</span>
                    </div>
                )}
            </div>

            <div className="client-footer">
                <div className="footer-actions-left">
                    <button onClick={onEdit} className="btn btn-sm btn-primary">
                        Edit
                    </button>
                    <button onClick={onDelete} className="btn btn-sm btn-danger">
                        Delete
                    </button>
                </div>
                <div className="footer-actions-right">
                    <button
                        onClick={handlePrint}
                        className="btn btn-sm btn-print"
                        title="Print measurements"
                    >
                        <Icons.Print /> Print
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ClientCard;