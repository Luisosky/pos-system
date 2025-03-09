import React from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Card,
  CardContent,
  CardActionArea
} from '@mui/material';
import {
  Inventory,
  People,
  BarChart,
  Settings
} from '@mui/icons-material';
import Navbar from './Navbar';

const AdminDashboard = ({ username, onLogout, onNavigate }) => {
  const currentDate = new Date().toLocaleString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Dashboard data (would come from your API in a real app)
  const dashboardData = {
    salesSummary: {
      today: 1250.75,
      month: 32500.50,
      lowStockProducts: 5
    },
    recentActivity: [
      { time: '10:35', description: 'Venta #1234 completada por Cajero1', value: '$56.75' },
      { time: '10:22', description: 'Producto "Leche" actualizado por Admin', value: 'Stock: 45' },
      { time: '09:47', description: 'Usuario nuevo "Cajero3" creado por Admin', value: '' },
      { time: '09:15', description: 'Reporte de ventas mensual generado por Admin', value: '' }
    ]
  };

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
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar 
        title="Panel de Administración" 
        username={username} 
        userRole="admin" 
        onLogout={onLogout} 
      />
      
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

          {/* Main Navigation Cards */}
          <Grid item xs={6} sm={3}>
            <Card 
              elevation={3}
              sx={{ 
                height: '100%',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6
                }
              }}
              onClick={() => onNavigate('products')}
            >
              <CardActionArea sx={{ height: '100%', p: 2 }}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%'
                }}>
                  <Inventory sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h6" component="h2" align="center">
                    PRODUCTOS
                  </Typography>
                </Box>
              </CardActionArea>
            </Card>
          </Grid>

          <Grid item xs={6} sm={3}>
            <Card 
              elevation={3}
              sx={{ 
                height: '100%',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6
                }
              }}
              onClick={() => onNavigate('users')}
            >
              <CardActionArea sx={{ height: '100%', p: 2 }}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%'
                }}>
                  <People sx={{ fontSize: 60, color: 'secondary.main', mb: 2 }} />
                  <Typography variant="h6" component="h2" align="center">
                    USUARIOS
                  </Typography>
                </Box>
              </CardActionArea>
            </Card>
          </Grid>

          <Grid item xs={6} sm={3}>
            <Card 
              elevation={3}
              sx={{ 
                height: '100%',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6
                }
              }}
              onClick={() => onNavigate('reports')}
            >
              <CardActionArea sx={{ height: '100%', p: 2 }}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%'
                }}>
                  <BarChart sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
                  <Typography variant="h6" component="h2" align="center">
                    REPORTES
                  </Typography>
                </Box>
              </CardActionArea>
            </Card>
          </Grid>

          <Grid item xs={6} sm={3}>
            <Card 
              elevation={3}
              sx={{ 
                height: '100%',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6
                }
              }}
              onClick={() => onNavigate('settings')}
            >
              <CardActionArea sx={{ height: '100%', p: 2 }}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%'
                }}>
                  <Settings sx={{ fontSize: 60, color: 'warning.main', mb: 2 }} />
                  <Typography variant="h6" component="h2" align="center">
                    CONFIGURACIÓN
                  </Typography>
                </Box>
              </CardActionArea>
            </Card>
          </Grid>

          {/* System Summary */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                RESUMEN DEL SISTEMA
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Box sx={{ p: 2, borderRight: { md: 1 }, borderColor: 'divider' }}>
                    <Typography variant="subtitle1" gutterBottom>
                      VENTAS HOY
                    </Typography>
                    <Typography variant="h4" color="primary">
                      ${dashboardData.salesSummary.today.toFixed(2)}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Box sx={{ p: 2, borderRight: { md: 1 }, borderColor: 'divider' }}>
                    <Typography variant="subtitle1" gutterBottom>
                      VENTAS MES
                    </Typography>
                    <Typography variant="h4" color="primary">
                      ${dashboardData.salesSummary.month.toFixed(2)}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Box sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      PRODUCTOS STOCK BAJO
                    </Typography>
                    <Typography variant="h4" color="error">
                      {dashboardData.salesSummary.lowStockProducts} productos
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Recent Activity */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                ACTIVIDAD RECIENTE
              </Typography>
              <List>
                {dashboardData.recentActivity.map((activity, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <Box sx={{ minWidth: '60px' }}>
                        <Typography variant="body2" color="text.secondary">
                          {activity.time}
                        </Typography>
                      </Box>
                      <ListItemText 
                        primary={activity.description} 
                        sx={{ ml: 2 }}
                      />
                      {activity.value && (
                        <Box sx={{ ml: 2 }}>
                          <Typography variant="body2" fontWeight="bold">
                            {activity.value}
                          </Typography>
                        </Box>
                      )}
                    </ListItem>
                    {index < dashboardData.recentActivity.length - 1 && (
                      <Divider component="li" />
                    )}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AdminDashboard;