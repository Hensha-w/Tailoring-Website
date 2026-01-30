// client/src/components/tailor/Dashboard.js
const React = window.React;

function Dashboard() {
    return React.createElement('div', { className: 'dashboard' },
        React.createElement('h1', null, 'Dashboard'),
        React.createElement('p', null, 'Welcome to TailorPro Dashboard'),

        React.createElement('style', null, `
            .dashboard {
                padding: 20px;
            }
            
            .dashboard h1 {
                color: #333;
                margin-bottom: 20px;
            }
        `)
    );
}

export default Dashboard;