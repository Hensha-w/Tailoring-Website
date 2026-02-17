import React from 'react';

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
    )
};

const ClientCard = ({ client, onEdit, onDelete }) => {
    const getGenderIcon = () => {
        return client.gender === 'male' ? <Icons.Male /> : <Icons.Female />;
    };

    return (
        <div className="client-card fade-in">
            <div className="client-header">
                <div className="client-avatar-large">
                    {getGenderIcon()}
                </div>
                <div className="client-info">
                    <h3>{client.name}</h3>
                    <p>{client.gender}</p>
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
            </div>

            <div className="client-footer">
                <button onClick={onEdit} className="btn btn-sm btn-primary">
                    Edit
                </button>
                <button onClick={onDelete} className="btn btn-sm btn-danger">
                    Delete
                </button>
            </div>
        </div>
    );
};

export default ClientCard;