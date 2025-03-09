import React from 'react';
import CashierDashboard from './CashierDashboard';

const SafeCashierDashboard = (props) => {
  // Ensure all required props have default values
  const safeProps = {
    username: props.username || '',
    onNavigate: props.onNavigate || (() => console.warn('onNavigate not provided')),
    onLogout: props.onLogout || (() => console.warn('onLogout not provided')),
    dailySales: Array.isArray(props.dailySales) ? props.dailySales : [],
    dailyTotal: typeof props.dailyTotal === 'number' ? props.dailyTotal : 0,
    monthlySales: props.monthlySales && typeof props.monthlySales === 'object' 
      ? props.monthlySales 
      : { /* estructura por defecto */ },
    // Add other props with safe defaults
  };

  try {
    return <CashierDashboard {...safeProps} />;
  } catch (error) {
    console.error("Error rendering CashierDashboard:", error);
    return (
      <div style={{ padding: '20px', border: '1px solid red' }}>
        <h2>Error al cargar el Dashboard de Cajero</h2>
        <p>{error.message}</p>
      </div>
    );
  }
};

export default SafeCashierDashboard;