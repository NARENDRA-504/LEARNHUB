import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import { Container, Nav } from 'react-bootstrap';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import axiosInstance from './AxiosInstance';

const Login = () => {
   const navigate = useNavigate()
   const [data, setData] = useState({
      email: "",
      password: "",
   })

   const handleChange = (e) => {
      const { name, value } = e.target;
      setData({ ...data, [name]: value });
   };

   const handleSubmit = (e) => {
      e.preventDefault();

      if (!data?.email || !data?.password) {
         return alert("Please fill all fields");
      } else {
         axiosInstance.post('/api/user/login', data)
            .then((res) => {
               if (res.data.success) {
                  alert(res.data.message)

                  localStorage.setItem("token", res.data.token);
                  localStorage.setItem("user", JSON.stringify(res.data.userData));
                  navigate('/dashboard')
                  setTimeout(() => {
                     window.location.reload()
                  }, 1000)
               } else {
                  alert(res.data.message)
               }
            })
            .catch((err) => {
               if (err.response && err.response.status === 401) {
                  alert("User doesn't exist");
               }
               navigate("/login");
            });
      }
   };

   return (
      <>

         <Navbar expand="lg" className="bg-body-tertiary premium-navbar">
            <Container fluid>
               <Navbar.Brand>
                 <span className="brand-premium"><span className="brand-premium-L">L</span>earnhub</span>
               </Navbar.Brand>
               <Navbar.Toggle aria-controls="navbarScroll" />
               <Navbar.Collapse id="navbarScroll">
                  <Nav className="ms-auto premium-nav-links">
                     <Link className="premium-btn" to={'/'}>Home</Link>
                     <Link className="premium-btn" to={'/login'}>Login</Link>
                     <Link className="premium-btn" to={'/register'}>Register</Link>
                  </Nav>
               </Navbar.Collapse>
            </Container>
         </Navbar>

         <div className='first-container premium-bg'>
            <Container component="main" className="premium-login-container">
               <Box className="premium-login-box">
                  <Avatar sx={{ bgcolor: 'secondary.main' }}>
                  </Avatar>
                  <Typography component="h1" variant="h5">
                     Sign In
                  </Typography>
                  <Box component="form" onSubmit={handleSubmit} noValidate>

                     <TextField
                        margin="normal"
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        value={data.email}
                        onChange={handleChange}
                        autoComplete="email"
                        autoFocus
                     />
                     <TextField
                        margin="normal"
                        fullWidth
                        name="password"
                        value={data.password}
                        onChange={handleChange}
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                     />
                     <Box mt={2}>
                        <Button
                           type="submit"
                           variant="contained"
                           sx={{ mt: 3, mb: 2 }}
                           style={{ width: '200px' }}
                        >
                           Sign In
                        </Button>
                     </Box>
                     <Grid container>
                        <Grid item>Have an account?
                           <Link style={{ color: "blue" }} to={'/register'} variant="body2">
                              {" Sign Up"}
                           </Link>
                        </Grid>
                     </Grid>
                  </Box>
               </Box>
            </Container>
         </div>

      </>
   )
}

export default Login



