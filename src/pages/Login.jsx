import React from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

import { fetchUserData, SelectIsAuth } from "../redux/slices/auth";

function Login() {
  const isAuth = useSelector(SelectIsAuth);
  const dispatch = useDispatch();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: { email: "", password: "" },
    mode: "onChange",
  });

  const onSubmit = async (values) => {
    const { payload } = await dispatch(fetchUserData(values));

    if (!payload) {
      alert("Login failed");
      return;
    }

    if (payload.token) {
      window.localStorage.setItem("token", payload.token);
    } else {
      alert("Login failed");
    }
  };

  if (isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, textAlign: "center" }}>
        <Typography variant="h4">Login</Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            fullWidth
            label="Email"
            {...register("email", { required: "Email is required" })}
            margin="normal"
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            {...register("password", { required: "Password is required" })}
            margin="normal"
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <Button 
            type="submit" 
            variant="contained" 
            fullWidth 
            sx={{ mt: 2 }}
            disabled={!isValid}
          >
            Login
          </Button>
        </form>
      </Box>
    </Container>
  );
}

export default Login;
