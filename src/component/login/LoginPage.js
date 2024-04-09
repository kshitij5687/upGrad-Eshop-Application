import React, { useState, useContext } from 'react';
import { Grid, Paper, Avatar, TextField, Button, Typography, FormControlLabel, Checkbox } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Link, useNavigate } from 'react-router-dom';
import "./LoginPage.css";
import Navbar from '../../common/Navbar';
import { Context } from '../../common/ContextProvider';


export default function LoginPage() {
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { token,setToken } = useContext(Context);

    async function signInHandler(event) {
        event.preventDefault();

        try {
            // Send the form data to the server using fetch or any other method
            const rawResponse = await fetch('http://localhost:3001/api/v1/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'

                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            // Handle the response from the server
            if (rawResponse.ok) {
                // Successful sign-up, you can redirect the user to another page or show a success message
                const authToken = rawResponse.headers.get("x-auth-token");
                setToken(authToken);
                localStorage.setItem('token', authToken);
                console.log(token);
                navigate('/Products');
            } else {
                const response = await rawResponse.text()
                // Handle errors from the server
                alert(response);
            }
        } catch (error) {
            // Handle network errors or other exceptions
            console.error('Error during sign-in:', error);
        }
    }

    const paperStyle = { padding: 20, height: '49vh', width: 400, margin: '20px auto' };
    const avatarStyle = { backgroundColor: '#9b7ee4' };
    const btnstyle = { margin: '8px 0', backgroundColor: '#9b7ee4', color: '#fff' };

    return (
        <div>
            <Navbar/>
            <Grid container justify="center" className='login-page-container'>
                <Paper elevation={10} style={paperStyle} className='sign-in-container'>
                    <Grid align='center'>
                        <div className="container">
                            <Avatar style={avatarStyle} className='avatar'>
                                <LockOutlinedIcon />
                            </Avatar>
                            <h2 className='heading-sign-in'>Sign In</h2>
                        </div>
                    </Grid>
                    <form onSubmit={signInHandler}>
                        <TextField value={email} onChange={(e) => setEmail(e.target.value)} className='email-input' label='Email' placeholder='Enter your email' fullWidth required />
                        <TextField value={password} onChange={(e) => setPassword(e.target.value)} className='password-input' label='Password' placeholder='Enter your password' type='password' fullWidth required sx={{ marginBottom: 2 }} />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name="checkedB"
                                    color="primary"
                                />
                            }
                            label="Remember me"
                        />
                        <Button className='sign-in-button' type='submit' color='primary' variant="outlined" style={btnstyle} fullWidth>Sign in</Button>
                    </form>
                    <Typography sx={{ fontSize: 20 }}>
                        Do you have an account ?
                        <Link to="/signup" underline="hover" sx={{ fontSize: 18, color: '#5f4c4c', cursor: 'pointer', margin: 5 }}>
                            Signup
                        </Link>
                    </Typography>

                </Paper>
            </Grid>
        </div>
    );
}
