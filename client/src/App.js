import React, { useState, useEffect } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from './theme';

// Import components
import Login from './components/Login';
import CashierDashboard from './components/CashierDashboard';
import AdminDashboard from './components/AdminDashboard';
import POS from './components/POS';
import Payment from './components/Payment';
import ProductManagement from './components/ProductManagement';

// Create Navigation Context
export const NavigationContext = React.createContext();

function App() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    username: '',
    role: '' // 'admin' or 'cashier'
  });
  
  // Navigation state with history
  const [currentScreen, setCurrentScreen] = useState('login');
  const [navigationHistory, setNavigationHistory] = useState([]);
  
  // POS state
  const [cartItems, setCartItems] = useState([]);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);

  // Enhanced navigation function
  const navigate = (screen) => {
    // Add current screen to history before changing screens
    if (currentScreen !== 'login') {
      setNavigationHistory(prev => [...prev, currentScreen]);
    }
    setCurrentScreen(screen);
  };
  
  // Go back function
  const goBack = () => {
    if (navigationHistory.length > 0) {
      // Get the last screen from history
      const prevScreen = navigationHistory[navigationHistory.length - 1];
      
      // Remove it from history
      setNavigationHistory(prev => prev.slice(0, prev.length - 1));
      
      // Set it as current screen
      setCurrentScreen(prevScreen);
      
      return true;
    }
    return false; 
  };
  
  // Check if we can go back
  const canGoBack = navigationHistory.length > 0;

  // Handle login
  const handleLogin = (username, role) => {
    setIsAuthenticated(true);
    setCurrentUser({
      username,
      role: role || (username.toLowerCase().includes('admin') ? 'admin' : 'cashier')
    });
    
    // Navigate to appropriate dashboard without adding to history
    setCurrentScreen(role === 'admin' ? 'adminDashboard' : 'cashierDashboard');
    setNavigationHistory([]);
  };

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser({ username: '', role: '' });
    setCurrentScreen('login');
    setNavigationHistory([]);
  };

  // Handle payment completion
  const handlePaymentComplete = (paymentData) => {
    console.log('Payment completed:', paymentData);
    setCartItems([]);
    setShowPaymentDialog(false);
    navigate('cashierDashboard'); 
  };

  // Navigation context value
  const navigationContextValue = {
    currentScreen,
    navigate,
    goBack,
    canGoBack: navigationHistory.length > 0
  };

  // Render the appropriate screen based on the current state
  const renderScreen = () => {
    if (!isAuthenticated) {
      return <Login onLogin={handleLogin} />;
    }

    switch (currentScreen) {
      case 'cashierDashboard':
        return (
          <CashierDashboard 
            username={currentUser.username} 
            onNavigate={navigate} 
            onLogout={handleLogout}
          />
        );
      
      case 'adminDashboard':
        return (
          <AdminDashboard 
            username={currentUser.username} 
            onNavigate={navigate} 
            onLogout={handleLogout}
          />
        );
      
      case 'pos':
        return (
          <POS 
            username={currentUser.username}
            cartItems={cartItems}
            setCartItems={setCartItems}
            totalAmount={totalAmount}
            setTotalAmount={setTotalAmount}
            onNavigate={navigate}
          />
        );
      
        case 'payment':
          return (
            <Payment
              username={currentUser.username}
              amount={totalAmount}
              onComplete={() => {
                setCartItems([]);
                navigate(currentUser.role === 'admin' ? 'adminDashboard' : 'cashierDashboard');
              }}
            />
          );

      case 'products':
        return (
          <ProductManagement 
            username={currentUser.username}
          />
        );
        
      default:
        return <div>Screen not found: {currentScreen}</div>;
    }
  };

  return (
    <NavigationContext.Provider value={navigationContextValue}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {renderScreen()}
      </ThemeProvider>
    </NavigationContext.Provider>
  );
}

export default App;