import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Grid,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import { 
  ShoppingCart, 
  Receipt, 
  AttachMoney,
  CheckCircle,
  Warning
} from '@mui/icons-material';
import Navbar from './Navbar';
//import { orderService, notificationService } from '../services';

const CashierDashboard = ({ username, onNavigate }) => {
  const [dashboardData, setDashboardData] = useState({
    sales: {
      total: 0,
      ticketsCount: 0,
      frequentCustomer: 0
    },
    notifications: []
  });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Get daily sales summary
        //const salesData = await orderService.getDailySummary();
        
        // Get notifications 
        //const notifications = await notificationService.getNotifications();
        
        setDashboardData({
          sales: {
            //total: salesData.totalSales || 0,
            //ticketsCount: salesData.orderCount || 0,
            //frequentCustomer: salesData.frequentCustomerPercentage || 0
          },
          //notifications: notifications || []
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Save data from local storage
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  const currentDate = new Date().toLocaleString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const getTimeBasedGreeting = () => {
    const currentHour = new Date().getHours();
    
    if (currentHour >= 5 && currentHour < 12) {
      return "BUENOS DÍAS";
    } else if (currentHour >= 12 && currentHour < 19) {
      return "BUENAS TARDES";
    } else {
      return "BUENAS NOCHES";
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Navbar title="PUNTO DE VENTA" username={username} userRole="Cajero" />
      
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Welcome Header */}
          <Grid item xs={12} md={8}>
            <Typography variant="h4" component="h1" gutterBottom>
              {getTimeBasedGreeting()}, {username.toUpperCase()}
            </Typography>
          </Grid>
          
          {/* Date/Time Display */}
          <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
            <Typography variant="h6" color="text.secondary">
              {currentDate}
            </Typography>
          </Grid>

          {/* Quick Action Buttons */}
          <Grid item xs={12} sm={4}>
            <Paper 
              elevation={2} 
              sx={{ 
                p: 3, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 3
                }
              }}
              onClick={() => onNavigate('pos')}
            >
              <ShoppingCart sx={{ fontSize: 60, color: 'primary.main', mb: 1 }} />
              <Typography variant="h6" component="h2" align="center">
                NUEVA VENTA
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Paper 
              elevation={2} 
              sx={{ 
                p: 3, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 3
                }
              }}
              onClick={() => onNavigate('tickets')}
            >
              <Receipt sx={{ fontSize: 60, color: 'success.main', mb: 1 }} />
              <Typography variant="h6" component="h2" align="center">
                VER TICKETS
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Paper 
              elevation={2} 
              sx={{ 
                p: 3, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 3
                }
              }}
              onClick={() => onNavigate('cashclose')}
            >
              <AttachMoney sx={{ fontSize: 60, color: 'warning.main', mb: 1 }} />
              <Typography variant="h6" component="h2" align="center">
                CERRAR CAJA
              </Typography>
            </Paper>
          </Grid>

          {/* Sales Summary */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom component="div">
                VENTAS DE HOY
              </Typography>
              <Typography variant="h4" component="div" sx={{ mt: 2 }}>
                ${dashboardData.sales.total.toFixed(2)}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                N° tickets: {dashboardData.sales.ticketsCount}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Cliente frecuente: {dashboardData.sales.frequentCustomer}%
              </Typography>
            </Paper>
          </Grid>

          {/* Notifications */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom component="div">
                NOTIFICACIONES
              </Typography>
              <List>
                {dashboardData.notifications.map((notification) => (
                  <ListItem key={notification.id}>
                    <ListItemIcon>
                      {notification.type === 'success' ? 
                        <CheckCircle color="success" /> : 
                        <Warning color="warning" />
                      }
                    </ListItemIcon>
                    <ListItemText primary={notification.message} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CashierDashboard;