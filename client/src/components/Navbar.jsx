import React, { useContext } from 'react';
import { NavigationContext } from '../App';
import { ArrowBack } from '@mui/icons-material';
import { 
  AppBar, 
  Box, 
  Toolbar, 
  Typography, 
  InputBase, 
  Badge, 
  IconButton,
  Avatar,
  Tooltip
} from '@mui/material';
import { Search as SearchIcon, Notifications } from '@mui/icons-material';
import LogoImage from '../assets/logo.png';

const Navbar = ({ title, username, userRole }) => {
  const { goBack, canGoBack } = useContext(NavigationContext);
  const currentDateTime = new Date().toLocaleString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        {/* Back Button */}
        {canGoBack && (
          <IconButton 
            edge="start" 
            color="inherit" 
            onClick={goBack} 
            aria-label="back"
            sx={{ mr: 2 }}
          >
            <ArrowBack />
          </IconButton>
        )}

        {/* Logo */}
        <Box 
          component="img"
          src={LogoImage}
          alt="Logo"
          sx={{ 
            height: 40, 
            width: 'auto',
            mr: 2
          }}
        />

        {/* Title */}
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ display: { xs: 'none', sm: 'block' }, flexGrow: 1 }}
        >
          {title}
        </Typography>

        {/* Search Bar */}
        <Box sx={{ 
          position: 'relative',
          borderRadius: 1,
          backgroundColor: '#f5f5f5',
          '&:hover': { backgroundColor: '#ececec' },
          marginRight: 2,
          width: 'auto',
          display: 'flex'
        }}>
          <Box sx={{ 
            position: 'absolute',
            top: '50%', 
            left: '10px', 
            transform: 'translateY(-50%)' 
          }}>
            <SearchIcon />
          </Box>
          <InputBase
            placeholder="Buscar..."
            sx={{ 
              padding: '8px 8px 8px 36px', 
              width: '100%',
              minWidth: '200px'
            }}
          />
        </Box>

        {/* Notifications */}
        <Tooltip title="Notificaciones">
          <IconButton size="large" color="inherit">
            <Badge badgeContent={4} color="error">
              <Notifications />
            </Badge>
          </IconButton>
        </Tooltip>

        {/* User Avatar */}
        <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
          <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: 'primary.main' }}>
            {username?.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
            {userRole}
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;