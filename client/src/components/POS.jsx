import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Tabs,
  Tab,
  Divider,
  IconButton,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  Search,
  Person,
  PercentOutlined,
  DeleteOutline,
  CleaningServices,
  Payments,
  Save,
  Add
} from '@mui/icons-material';
import Navbar from './Navbar';

// Mock product data
const mockProducts = [
  { id: 1, name: 'Manzana', category: 'Frutas', price: 5.99, image: '🍎' },
  { id: 2, name: 'Pizza', category: 'Alimentos', price: 8.99, image: '🍕' },
  { id: 3, name: 'Refresco', category: 'Bebidas', price: 2.50, image: '🥤' },
  { id: 4, name: 'Queso', category: 'Lácteos', price: 4.25, image: '🧀' },
  { id: 5, name: 'Pan', category: 'Panadería', price: 3.49, image: '🥖' },
  { id: 6, name: 'Pollo', category: 'Carnes', price: 9.99, image: '🍗' },
  { id: 7, name: 'Papel', category: 'Hogar', price: 1.99, image: '🧻' },
  { id: 8, name: 'Leche', category: 'Lácteos', price: 2.25, image: '🥛' },
];

// Product categories
const categories = ['Todos', 'Bebidas', 'Alimentos', 'Frutas', 'Lácteos', 'Panadería', 'Carnes', 'Hogar'];

const POS = ({ username }) => {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState('Anónimo');
  
  // Filter products based on category and search term
  const filteredProducts = mockProducts.filter(product => 
    (selectedCategory === 'Todos' || product.category === selectedCategory) &&
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Add product to cart
  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };
  
  // Remove product from cart
  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };
  
  // Clear cart
  const clearCart = () => {
    setCart([]);
  };
  
  // Change product quantity in cart
  const changeQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(cart.map(item => 
      item.id === productId 
        ? { ...item, quantity: quantity } 
        : item
    ));
  };
  
  // Calculate subtotal
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Calculate tax (16%)
  const tax = subtotal * 0.16;
  
  // Calculate total
  const total = subtotal + tax;

  return (
    <Box sx={{ flexGrow: 1, height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar title="NUEVA VENTA" username={username} userRole="Cajero" />
      
      <Box sx={{ flexGrow: 1, overflow: 'hidden', display: 'flex' }}>
        <Container maxWidth={false} sx={{ py: 2, flexGrow: 1, display: 'flex' }}>
          <Grid container spacing={2} sx={{ flexGrow: 1 }}>
            {/* Products Section */}
            <Grid item xs={12} md={7} lg={8} sx={{ display: 'flex', flexDirection: 'column' }}>
              <Paper sx={{ p: 2, mb: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" gutterBottom>
                  PRODUCTOS
                </Typography>
                
                {/* Search Bar */}
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Buscar producto"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    endAdornment: <Search />,
                  }}
                  sx={{ mb: 2 }}
                />
                
                {/* Categories */}
                <Typography variant="subtitle1" gutterBottom>
                  CATEGORÍAS:
                </Typography>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {categories.map((category) => (
                    <Chip
                      key={category}
                      label={category}
                      onClick={() => setSelectedCategory(category)}
                      variant={selectedCategory === category ? 'filled' : 'outlined'}
                      color={selectedCategory === category ? 'primary' : 'default'}
                    />
                  ))}
                </Box>
                
                {/* Products Grid */}
                <Box sx={{ 
                  flexGrow: 1, 
                  overflowY: 'auto',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                  gap: 2,
                  p: 1
                }}>
                  {filteredProducts.map((product) => (
                    <Card 
                      key={product.id} 
                      sx={{ 
                        cursor: 'pointer',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'scale(1.05)',
                          boxShadow: 3
                        }
                      }}
                      onClick={() => addToCart(product)}
                    >
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center',
                        fontSize: '3rem',
                        height: '80px',
                        backgroundColor: 'rgba(0,0,0,0.03)'
                      }}>
                        {product.image}
                      </Box>
                      <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                        <Typography variant="h6" align="center">${product.price.toFixed(2)}</Typography>
                        <Typography variant="body2" align="center" noWrap title={product.name}>
                          {product.name}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Paper>
            </Grid>
            
            {/* Cart Section */}
            <Grid item xs={12} md={5} lg={4} sx={{ display: 'flex', flexDirection: 'column' }}>
              <Paper sx={{ p: 2, mb: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" gutterBottom>
                  TICKET ACTUAL
                </Typography>
                
                {/* Customer */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body1" sx={{ mr: 1 }}>
                    Cliente:
                  </Typography>
                  <Typography variant="body1" fontWeight="bold" sx={{ mr: 1 }}>
                    {customer}
                  </Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={() => {/* Add customer functionality */}}
                  >
                    Agregar
                  </Button>
                </Box>
                
                {/* Cart Items */}
                <TableContainer sx={{ flexGrow: 1, overflow: 'auto' }}>
                  <Table stickyHeader size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>ARTICULO</TableCell>
                        <TableCell align="center">CANT.</TableCell>
                        <TableCell align="right">PRECIO</TableCell>
                        <TableCell align="right">TOTAL</TableCell>
                        <TableCell align="center">ACCIÓN</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {cart.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell align="center">
                            <TextField
                              size="small"
                              type="number"
                              value={item.quantity}
                              onChange={(e) => changeQuantity(item.id, parseInt(e.target.value))}
                              InputProps={{ inputProps: { min: 1, style: { textAlign: 'center' } } }}
                              sx={{ width: '60px' }}
                            />
                          </TableCell>
                          <TableCell align="right">${item.price.toFixed(2)}</TableCell>
                          <TableCell align="right">${(item.price * item.quantity).toFixed(2)}</TableCell>
                          <TableCell align="center">
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <DeleteOutline />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                      {cart.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} align="center">
                            <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                              No hay productos en el carrito
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                
                {/* Totals */}
                <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(0,0,0,0.12)' }}>
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Typography variant="body1">Subtotal:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body1" align="right">${subtotal.toFixed(2)}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body1">Impuestos (16%):</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body1" align="right">${tax.toFixed(2)}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="h6">TOTAL:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="h6" align="right">${total.toFixed(2)}</Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
              
              {/* Action Buttons */}
              <Grid container spacing={1}>
                <Grid item xs={4} sm={2} md={4}>
                  <Button 
                    variant="contained" 
                    color="info"
                    fullWidth
                    startIcon={<PercentOutlined />}
                    sx={{ py: 1 }}
                  >
                    DESCUENTO
                  </Button>
                </Grid>
                <Grid item xs={4} sm={2} md={4}>
                  <Button 
                    variant="contained"
                    color="error"
                    fullWidth
                    startIcon={<DeleteOutline />}
                    sx={{ py: 1 }}
                    disabled={cart.length === 0}
                    onClick={() => {
                      // In a real app, you'd ask for confirmation
                      if (cart.length > 0 && window.confirm('¿Eliminar el producto seleccionado?')) {
                        // This would remove the last selected item in a real app
                        removeFromCart(cart[cart.length - 1].id);
                      }
                    }}
                  >
                    ELIMINAR
                  </Button>
                </Grid>
                <Grid item xs={4} sm={2} md={4}>
                  <Button 
                    variant="contained"
                    color="warning"
                    fullWidth
                    startIcon={<CleaningServices />}
                    sx={{ py: 1 }}
                    disabled={cart.length === 0}
                    onClick={() => {
                      // In a real app, you'd ask for confirmation
                      if (cart.length > 0 && window.confirm('¿Vaciar el carrito?')) {
                        clearCart();
                      }
                    }}
                  >
                    VACIAR
                  </Button>
                </Grid>
                <Grid item xs={12} sm={4} md={12}>
                  <Button 
                    variant="contained"
                    color="success"
                    fullWidth
                    size="large"
                    startIcon={<Payments />}
                    sx={{ py: 1.5 }}
                    disabled={cart.length === 0}
                    onClick={() => {/* Implement payment processing */}}
                  >
                    COBRAR
                  </Button>
                </Grid>
                <Grid item xs={12} sm={2} md={12}>
                  <Button 
                    variant="outlined"
                    fullWidth
                    startIcon={<Save />}
                    sx={{ py: 1 }}
                    disabled={cart.length === 0}
                    onClick={() => {/* Implement save functionality */}}
                  >
                    GUARDAR
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default POS;