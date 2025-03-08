import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Dialog,
  Grid,
  Divider,
  ButtonGroup
} from '@mui/material';
import {
  Cancel,
  Receipt,
  CheckCircle,
  AttachMoney,
  CreditCard,
  AccountBalance,
  MoreHoriz
} from '@mui/icons-material';

const Payment = ({ open, onClose, total, onComplete }) => {
  // State for payment method, amount received, and change
  const [paymentMethod, setPaymentMethod] = useState('efectivo'); // Default to cash
  const [amountReceived, setAmountReceived] = useState('');
  const [change, setChange] = useState(0);
  const [processing, setProcessing] = useState(false);
  
  // Options for payment method select
  const paymentOptions = [
    { value: 'efectivo', label: 'Efectivo' },
    { value: 'tarjeta', label: 'Tarjeta' },
    { value: 'transferencia', label: 'Transferencia' }
  ];

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setPaymentMethod('efectivo');
      setAmountReceived('');
      setChange(0);
      setProcessing(false);
    }
  }, [open]);

  // Calculate change when amount received changes
  useEffect(() => {
    const received = parseFloat(amountReceived) || 0;
    if (received >= total) {
      setChange(received - total);
    } else {
      setChange(0);
    }
  }, [amountReceived, total]);

  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
    
    // For non-cash payments, we assume exact amount
    if (method !== 'efectivo') {
      setAmountReceived(total.toString());
      setChange(0);
    }
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    // Only allow numbers and one decimal point
    if (/^\d*\.?\d*$/.test(value)) {
      setAmountReceived(value);
    }
  };

  const handleFinalizeSale = () => {
    setProcessing(true);
    
    // Simulate processing delay
    setTimeout(() => {
      onComplete({
        paymentMethod,
        amountReceived: parseFloat(amountReceived) || total,
        change,
        date: new Date().toISOString()
      });
      setProcessing(false);
      onClose();
    }, 800);
  };

  const isPaymentValid = () => {
    if (!paymentMethod) return false;
    
    if (paymentMethod === 'efectivo') {
      return parseFloat(amountReceived) >= total;
    }
    
    return true;
  };

  const handleSubmit = async () => {
    try {
      setProcessing(true);
      
      // Prepare payment details
      const paymentDetails = {
        method: paymentMethod,
        amountReceived: parseFloat(amountReceived),
        change: change
      };
      
      // Call the onComplete callback with payment details
      await onComplete(paymentDetails);
      
      onClose();
    } catch (error) {
      console.error('Error processing payment:', error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          p: 3
        }
      }}
    >
      <Typography variant="h5" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
        PROCESANDO PAGO
      </Typography>
      
      <Box sx={{ my: 3 }}>
        <Typography variant="h4" align="center" color="primary" sx={{ fontWeight: 'bold' }}>
          TOTAL A PAGAR: ${total.toFixed(2)}
        </Typography>
      </Box>
      
      <Typography variant="h6" gutterBottom>
        MÉTODO DE PAGO:
      </Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Button
          variant={paymentMethod === 'efectivo' ? 'contained' : 'outlined'}
          onClick={() => handlePaymentMethodSelect('efectivo')}
          startIcon={<AttachMoney />}
          sx={{ flex: 1, mr: 1, py: 1.5 }}
        >
          EFECTIVO
        </Button>
        <Button
          variant={paymentMethod === 'tarjeta' ? 'contained' : 'outlined'}
          onClick={() => handlePaymentMethodSelect('tarjeta')}
          startIcon={<CreditCard />}
          sx={{ flex: 1, mx: 1, py: 1.5 }}
        >
          TARJETA
        </Button>
        <Button
          variant={paymentMethod === 'transferencia' ? 'contained' : 'outlined'}
          onClick={() => handlePaymentMethodSelect('transferencia')}
          startIcon={<AccountBalance />}
          sx={{ flex: 1, mx: 1, py: 1.5 }}
        >
          TRANSFER.
        </Button>
        <Button
          variant={paymentMethod === 'other' ? 'contained' : 'outlined'}
          onClick={() => handlePaymentMethodSelect('other')}
          startIcon={<MoreHoriz />}
          sx={{ flex: 1, ml: 1, py: 1.5 }}
        >
          OTRO
        </Button>
      </Box>
      
      {paymentMethod === 'efectivo' && (
        <>
          <Typography variant="body1" gutterBottom>
            MONTO RECIBIDO:
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            value={amountReceived}
            onChange={handleAmountChange}
            InputProps={{
              startAdornment: <Box component="span" sx={{ mr: 1 }}>$</Box>,
            }}
            placeholder={`Ingrese monto igual o mayor a ${total.toFixed(2)}`}
            autoFocus
            sx={{ mb: 3 }}
          />
          
          <Box sx={{ mb: 4, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
            <Typography variant="h6">
              CAMBIO A DEVOLVER: <Box component="span" sx={{ fontWeight: 'bold' }}>${change.toFixed(2)}</Box>
            </Typography>
          </Box>
        </>
      )}
      
      {paymentMethod === 'tarjeta' && (
        <Box sx={{ mb: 4, p: 3, border: '1px dashed', borderColor: 'divider', borderRadius: 1 }}>
          <Typography variant="body1" align="center">
            Por favor, pase la tarjeta por el lector o inserte el chip
          </Typography>
        </Box>
      )}
      
      {paymentMethod === 'transferencia' && (
        <Box sx={{ mb: 4, p: 3, border: '1px dashed', borderColor: 'divider', borderRadius: 1 }}>
          <Typography variant="body1" align="center">
            Por favor, realice la transferencia al siguiente número de cuenta:
          </Typography>
          <Typography variant="h6" align="center" sx={{ mt: 1, fontWeight: 'bold' }}>
            0123 4567 8910 1112
          </Typography>
        </Box>
      )}
      
      {paymentMethod === 'other' && (
        <Box sx={{ mb: 4, p: 3, border: '1px dashed', borderColor: 'divider', borderRadius: 1 }}>
          <Typography variant="body1" align="center">
            Otro método de pago (Configurar en ajustes del sistema)
          </Typography>
        </Box>
      )}
      
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Button
            fullWidth
            variant="outlined"
            color="error"
            startIcon={<Cancel />}
            onClick={onClose}
            sx={{ py: 1.5 }}
            disabled={processing}
          >
            CANCELAR
          </Button>
        </Grid>
        <Grid item xs={4}>
          <Button
            fullWidth
            variant="outlined"
            color="primary"
            startIcon={<Receipt />}
            sx={{ py: 1.5 }}
            disabled={!isPaymentValid() || processing}
          >
            BOLETA
          </Button>
        </Grid>
        <Grid item xs={4}>
          <Button
            fullWidth
            variant="contained"
            color="success"
            startIcon={<CheckCircle />}
            onClick={handleFinalizeSale}
            sx={{ py: 1.5 }}
            disabled={!isPaymentValid() || processing}
          >
            FINALIZAR VENTA
          </Button>
        </Grid>
      </Grid>
    </Dialog>
  );
};

export default Payment;