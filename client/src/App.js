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

// Import services
import { authService, orderService } from './services';

// Crate context for navigation
export const NavigationContext = React.createContext();

function App() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    id: '',
    username: '',
    role: '' // 'admin' o 'cashier'
  });
  
  // Navigation state
  const [currentScreen, setCurrentScreen] = useState('login');
  const [navigationHistory, setNavigationHistory] = useState([]);
  
  // POS state
  const [cartItems, setCartItems] = useState([]);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);

  // Verify token and user data on first render
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (token && storedUser) {
        try {
          // Also validate token with the server
          const userData = JSON.parse(storedUser);
          setIsAuthenticated(true);
          setCurrentUser({
            id: userData.id,
            username: userData.username,
            role: userData.role
          });
          setCurrentScreen(userData.role === 'admin' ? 'adminDashboard' : 'cashierDashboard');
        } catch (error) {
          console.error('Error validating authentication:', error);
          handleLogout(); 
        }
      }
    };
    
    checkAuth();
  }, []);

  // Navigate function to change screen
  const navigate = (screen) => {
    if (currentScreen !== 'login') {
      setNavigationHistory(prev => [...prev, currentScreen]);
    }
    setCurrentScreen(screen);
  };
  
  // Go back to previous screen
  const goBack = () => {
    if (navigationHistory.length > 0) {
      const prevScreen = navigationHistory[navigationHistory.length - 1];
      setNavigationHistory(prev => prev.slice(0, prev.length - 1));
      setCurrentScreen(prevScreen);
      return true;
    }
    return false; 
  };

  // Log in using the authentication service
  const handleLogin = async (username, password) => {
    try {
      const response = await authService.login({ username, password });
      
      // Save token and user data in local storage
      setIsAuthenticated(true);
      setCurrentUser({
        id: response.user.id,
        username: response.user.username,
        role: response.user.role
      });
      
      // Navigate to the appropriate dashboard
      setCurrentScreen(response.user.role === 'admin' ? 'adminDashboard' : 'cashierDashboard');
      setNavigationHistory([]);
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  // Log out and clear local state
  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local state
      setIsAuthenticated(false);
      setCurrentUser({ id: '', username: '', role: '' });
      setCurrentScreen('login');
      setNavigationHistory([]);
    }
  };

  // Handle payment completion
  const handlePaymentComplete = async (paymentData) => {
    try {
      // Create Order Object with the data to send to the server
      const orderData = {
        user: currentUser.id,
        customerName: paymentData.customerName || 'Anónimo',
        products: cartItems.map(item => ({
          product: item._id || item.id,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: totalAmount,
        paymentMethod: paymentData.paymentMethod
      };
      
      // Send order data to the server
      const createdOrder = await orderService.createOrder(orderData);
      console.log('Order created:', createdOrder);
      
      // Clear cart and navigate to the dashboard
      setCartItems([]);
      setTotalAmount(0);
      navigate(currentUser.role === 'admin' ? 'adminDashboard' : 'cashierDashboard');
      
      return createdOrder;
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Error al procesar el pago. Intente nuevamente.');
    }
  };

  // Context value for navigation
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
            userId={currentUser.id}
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
            open={true}
            onClose={() => navigate('pos')}
            total={totalAmount}
            onComplete={handlePaymentComplete}
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