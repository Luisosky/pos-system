import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Search,
  Refresh
} from '@mui/icons-material';
import { productService } from '../services';
import Navbar from './Navbar';

const ProductManagement = ({ username }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState(['Todos']);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    barcode: '',
    stock: '',
    image: '📦',
    description: ''
  });
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Cargar productos y categorías
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const filters = {};
      if (selectedCategory !== 'Todos') {
        filters.category = selectedCategory;
      }
      if (searchTerm) {
        filters.search = searchTerm;
      }

      const data = await productService.getAllProducts(filters);
      setProducts(data);

      // Obtener categorías únicas
      if (selectedCategory === 'Todos') {
        const uniqueCategories = ['Todos', ...new Set(data.map(item => item.category))];
        setCategories(uniqueCategories);
      }
    } catch (err) {
      console.error('Error al cargar productos:', err);
      setError('Error al cargar productos. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  // Cargar productos al iniciar
  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchTerm]);

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Para campos numéricos, validar entrada
    if (name === 'price' || name === 'stock') {
      if (value === '' || !isNaN(value)) {
        setFormData({ ...formData, [name]: value });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Abrir diálogo para crear/editar
  const handleOpenDialog = (product = null) => {
    if (product) {
      setSelectedProduct(product);
      setFormData({
        name: product.name,
        price: product.price,
        category: product.category,
        barcode: product.barcode,
        stock: product.stock,
        image: product.image || '📦',
        description: product.description || ''
      });
    } else {
      setSelectedProduct(null);
      setFormData({
        name: '',
        price: '',
        category: '',
        barcode: '',
        stock: '',
        image: '📦',
        description: ''
      });
    }
    setOpen(true);
  };

  // Cerrar diálogo
  const handleClose = () => {
    setOpen(false);
  };

  // Guardar producto (crear o actualizar)
  const handleSave = async () => {
    try {
      setLoading(true);
      
      // Validar campos requeridos
      if (!formData.name || !formData.price || !formData.category || !formData.barcode) {
        setNotification({
          open: true,
          message: 'Por favor complete todos los campos requeridos',
          severity: 'error'
        });
        setLoading(false);
        return;
      }
      
      // Convertir precio y stock a números
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock || '0', 10)
      };
      
      let result;
      
      if (selectedProduct) {
        // Actualizar producto existente
        result = await productService.updateProduct(selectedProduct.id, productData);
        setNotification({
          open: true,
          message: 'Producto actualizado correctamente',
          severity: 'success'
        });
      } else {
        // Crear nuevo producto
        result = await productService.createProduct(productData);
        setNotification({
          open: true,
          message: 'Producto creado correctamente',
          severity: 'success'
        });
      }
      
      // Cerrar diálogo y recargar productos
      setOpen(false);
      fetchProducts();
      
    } catch (error) {
      console.error('Error al guardar producto:', error);
      setNotification({
        open: true,
        message: error.message || 'Error al guardar producto',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Eliminar producto
  const handleDelete = async (product) => {
    if (window.confirm(`¿Está seguro de eliminar el producto "${product.name}"?`)) {
      try {
        setLoading(true);
        await productService.deleteProduct(product.id);
        setNotification({
          open: true,
          message: 'Producto eliminado correctamente',
          severity: 'success'
        });
        fetchProducts();
      } catch (error) {
        console.error('Error al eliminar producto:', error);
        setNotification({
          open: true,
          message: 'Error al eliminar producto',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    }
  };

  // Cerrar notificación
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar title="Gestión de Productos" username={username} />
      
      <Box sx={{ p: 3, flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="h1">
            Inventario de Productos
          </Typography>
          
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<Add />} 
            onClick={() => handleOpenDialog()}
          >
            Nuevo Producto
          </Button>
        </Box>
        
        <Box sx={{ display: 'flex', mb: 3, gap: 2 }}>
          <TextField
            label="Buscar productos"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ flexGrow: 1 }}
          />
          
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel id="category-select-label">Categoría</InputLabel>
            <Select
              labelId="category-select-label"
              value={selectedCategory}
              label="Categoría"
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <IconButton 
            color="primary" 
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('Todos');
              fetchProducts();
            }}
          >
            <Refresh />
          </IconButton>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Imagen</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Precio</TableCell>
                <TableCell>Categoría</TableCell>
                <TableCell>Código de Barras</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <CircularProgress size={40} sx={{ my: 2 }} />
                  </TableCell>
                </TableRow>
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body2" color="textSecondary" sx={{ py: 2 }}>
                      No se encontraron productos
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Typography variant="h4" component="span">
                        {product.image || '📦'}
                      </Typography>
                    </TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.barcode}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell align="right">
                      <IconButton 
                        color="primary" 
                        onClick={() => handleOpenDialog(product)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        onClick={() => handleDelete(product)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      
      {/* Diálogo para crear/editar producto */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedProduct ? 'Editar Producto' : 'Nuevo Producto'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 1 }}>
            <TextField
              required
              label="Nombre"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              margin="dense"
            />
            <TextField
              required
              label="Precio"
              name="price"
              value={formData.price}
              onChange={handleChange}
              fullWidth
              margin="dense"
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
            />
            <TextField
              required
              label="Categoría"
              name="category"
              value={formData.category}
              onChange={handleChange}
              fullWidth
              margin="dense"
            />
            <TextField
              required
              label="Código de Barras"
              name="barcode"
              value={formData.barcode}
              onChange={handleChange}
              fullWidth
              margin="dense"
            />
            <TextField
              label="Stock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              fullWidth
              margin="dense"
              type="number"
            />
            <TextField
              label="Imagen (Emoji)"
              name="image"
              value={formData.image}
              onChange={handleChange}
              fullWidth
              margin="dense"
              placeholder="📦"
              helperText="Usar un emoji que represente el producto"
            />
            <TextField
              label="Descripción"
              name="description"
              value={formData.description}
              onChange={handleChange}
              fullWidth
              margin="dense"
              multiline
              rows={3}
              sx={{ gridColumn: '1 / -1' }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button 
            onClick={handleSave} 
            variant="contained" 
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Notificación */}
      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity} 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductManagement;