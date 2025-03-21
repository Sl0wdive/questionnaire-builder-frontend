import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axios";
import { TextField, Button, Container, Typography, Box } from "@mui/material";

const Register = () => {
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/auth/register", form);
      navigate("/login");
    } catch (err) {
      setError("Registration failed!");
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, textAlign: "center" }}>
        <Typography variant="h4">Register</Typography>
        {error && <Typography color="error">{error}</Typography>}
        <form onSubmit={handleSubmit}>
          <TextField fullWidth label="Name" name="fullName" onChange={handleChange} margin="normal" required />
          <TextField fullWidth label="Email" name="email" onChange={handleChange} margin="normal" required />
          <TextField fullWidth label="Password" type="password" name="password" onChange={handleChange} margin="normal" required />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>Register</Button>
        </form>
      </Box>
    </Container>
  );
};

export default Register;
