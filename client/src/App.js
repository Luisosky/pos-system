import React, { useState, useEffect } from 'react';
import { CssBaseline, ThemeProvider, Button } from '@mui/material';
import theme from './theme';

// Import components
import Login from './components/Login';
import CashierDashboard from './components/CashierDashboard';
import AdminDashboard from './components/AdminDashboard';
import POS from './components/POS';
import Payment from './components/Payment';
import ProductManagement from './components/ProductManagement';
import SafeCashierDashboard from './components/SafeCashierDashboard';

// Import services
import { authService, orderService } from './services';

// Import ErrorBoundary
import ErrorBoundary from './components/ErrorBoundary';

// Create context for navigation
export const NavigationContext = React.createContext();

function App() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    id: '',
    username: '',
    role: '' // 'admin' o 'cashier'
  });
  const [loading, setLoading] = useState(true);
  
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
      try {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        console.log('Verificando autenticación:', { token: !!token, storedUser });
        
        if (token && storedUser) {
          try {
            // Parse user data
            const userData = JSON.parse(storedUser);
            console.log('Usuario encontrado en localStorage:', userData);
            
            setIsAuthenticated(true);
            setCurrentUser({
              id: userData.id,
              username: userData.username,
              role: userData.role
            });
            
            // Set initial screen based on role
            const initialScreen = userData.role === 'admin' ? 'adminDashboard' : 'cashierDashboard';
            console.log(`Estableciendo pantalla inicial: ${initialScreen} basado en rol: ${userData.role}`);
            setCurrentScreen(initialScreen);
          } catch (error) {
            console.error('Error al procesar datos de usuario:', error);
            handleLogout();
          }
        } else {
          console.log('No hay datos de autenticación, mostrando login');
          setCurrentScreen('login');
        }
      } catch (error) {
        console.error('Error en checkAuth:', error);
        handleLogout();
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Agregar un efecto que responda a cambios de autenticación
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      console.log('Usuario autenticado detectado, actualizando vista...');
      const targetScreen = currentUser.role === 'admin' ? 'adminDashboard' : 'cashierDashboard';
      
      // Forzar la actualización de la pantalla
      setCurrentScreen(prev => {
        if (prev !== targetScreen) {
          console.log(`Cambiando pantalla de ${prev} a ${targetScreen}`);
          return targetScreen;
        }
        return prev;
      });
    }
  }, [isAuthenticated, currentUser]);

  // Navigate function to change screen
  const navigate = (screen) => {
    console.log(`Navegando a pantalla: ${screen} desde ${currentScreen}`);
    
    if (currentScreen !== 'login') {
      setNavigationHistory(prev => [...prev, currentScreen]);
    }
    setCurrentScreen(screen);
  };
  
  // Go back to previous screen
  const goBack = () => {
    if (navigationHistory.length > 0) {
      const prevScreen = navigationHistory[navigationHistory.length - 1];
      console.log(`Volviendo a pantalla anterior: ${prevScreen}`);
      setNavigationHistory(prev => prev.slice(0, prev.length - 1));
      setCurrentScreen(prevScreen);
      return true;
    }
    console.log('No hay historia para volver atrás');
    return false; 
  };

  // Modificar la función handleLogin para ser más determinista
  const handleLogin = async (credentials) => {
    try {
      console.log('Intentando login con:', credentials.username);
      const response = await authService.login(credentials);
      
      console.log('Respuesta de login:', response);
      
      if (!response || !response.user || !response.token) {
        console.error('Respuesta de login inválida:', response);
        return false;
      }
      
      // Actualizar estado en un bloque para forzar un único ciclo de renderizado
      const newUser = {
        id: response.user.id,
        username: response.user.username,
        role: response.user.role
      };
      
      // Actualizar de forma síncrona y en orden
      setIsAuthenticated(true);
      setCurrentUser(newUser);
      
      // Establecer la pantalla según el rol
      const targetScreen = newUser.role === 'admin' ? 'adminDashboard' : 'cashierDashboard';
      console.log(`Navegando a ${targetScreen} después de login exitoso`);
      
      // Actualizar la pantalla y el historial
      setCurrentScreen(targetScreen);
      setNavigationHistory([]);
      
      // Forzar un re-renderizado
      setTimeout(() => {
        console.log('Verificando estado después de login:', {
          isAuthenticated: true,
          currentUser: newUser,
          currentScreen: targetScreen
        });
      }, 0);
      
      return true;
    } catch (error) {
      console.error('Error en login:', error);
      return false;
    }
  };

  // Log out and clear local state
  const handleLogout = async () => {
    try {
      console.log('Cerrando sesión...');
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
      const createOrder = async (orderData) => {
        console.log("Orden creada:", orderData);
        return { id: "temp-" + Math.random().toString(36).substr(2, 9) };
      };
    
      
      // Clear cart and navigate to the dashboard
      setCartItems([]);
      setTotalAmount(0);
      navigate(currentUser.role === 'admin' ? 'adminDashboard' : 'cashierDashboard');
      
      
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

  // Monitor auth state changes
  useEffect(() => {
    console.log('Estado de autenticación actualizado:', {
      isAuthenticated, 
      currentUser,
      currentScreen
    });
  }, [isAuthenticated, currentUser, currentScreen]);

  // Render the appropriate screen based on the current state
  const renderScreen = () => {
    console.log(`Renderizando pantalla: ${currentScreen}, autenticado: ${isAuthenticated}`);
    
    if (loading) {
      return <div>Cargando...</div>;
    }
    
    if (!isAuthenticated) {
      return <Login onLogin={handleLogin} />;
    }

    switch (currentScreen) {
      case 'cashierDashboard':
        // Si el usuario es admin, mostrar dashboard admin como fallback
        if (currentUser.role === 'admin') {
          console.log('Redirigiendo a admin dashboard (rol:', currentUser.role, ')');
          return (
            <AdminDashboard 
              username={currentUser.username} 
              onNavigate={navigate} 
              onLogout={handleLogout}
            />
          );
        }
        
        // Envolver el dashboard en un try/catch
        try {
          return (
            <ErrorBoundary fallback={
              <div>
                <p>Error al cargar el Dashboard de Cajero</p>
                <Button onClick={handleLogout} variant="contained" color="primary">
                  Cerrar Sesión
                </Button>
              </div>
            }>
              <div style={{padding: '20px'}}>
                <h2>Dashboard de Cajero</h2>
                <p>Bienvenido, {currentUser.username}</p>
                <Button onClick={() => navigate('pos')} variant="contained" color="primary" sx={{mr: 2}}>
                  Ir a POS
                </Button>
                <Button onClick={handleLogout} variant="outlined" color="secondary">
                  Cerrar Sesión
                </Button>
              </div>
            </ErrorBoundary>
          );
        } catch (error) {
          console.error('Error crítico:', error);
          return (
            <div>
              <p>Error al cargar el Dashboard. Por favor, contacte al administrador.</p>
              <Button onClick={handleLogout} variant="contained" color="primary">
                Cerrar Sesión
              </Button>
            </div>
          );
        }
      
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
    <ErrorBoundary fallback={<div>Algo salió mal. Por favor, recarga la página.</div>}>
      <NavigationContext.Provider value={navigationContextValue}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {renderScreen()}
        </ThemeProvider>
      </NavigationContext.Provider>
    </ErrorBoundary>
  );
}

export default App;