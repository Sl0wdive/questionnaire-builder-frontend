import React from 'react';
import { Button, AppBar, Toolbar, Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, SelectIsAuth } from '../redux/slices/auth';

function Header() {
  const dispatch = useDispatch();
  const isAuth = useSelector(SelectIsAuth);

  const onClickLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      dispatch(logout());
      window.localStorage.removeItem('token');
    }
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: 'primary.main', padding: 1 }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" component={Link} to="/" sx={{ textDecoration: 'none', color: 'white' }}>
          Quebi
        </Typography>

        <Box>
          {isAuth ? (
            <>
              <Button component={Link} to="/builder" variant="outlined" sx={{ marginRight: 1, color: 'white', borderColor: 'white' }}>
                Create questionnaire
              </Button>
              <Button onClick={onClickLogout} component={Link} to="/login" variant="contained" color="error">
                Logout
              </Button></>
          ) : (
            <>
              <Button component={Link} to="/login" variant="outlined" sx={{ marginRight: 1, color: 'white', borderColor: 'white' }}>
                Sign in
              </Button>
              <Button component={Link} to="/register" variant="contained" color="secondary">
                Sign up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
