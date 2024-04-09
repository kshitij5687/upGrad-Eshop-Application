import React, { useState } from 'react';
import { Grid, Paper, Avatar, TextField, Button } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import './SignUp.css';
import Navbar from '../../common/Navbar';

export default function SignUp() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [passwordMismatch, setPasswordMismatch] = useState(false);

    async function signUpHandler(event) {
        event.preventDefault();
        if (password !== confirmPassword) {
            setPasswordMismatch(true);
            return;
        }

        try {
            const rawResponse = await fetch('http://localhost:3001/api/v1/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    email,
                    password,
                    contactNumber
                })
            });

            if (rawResponse.ok) {
                alert('User signed up successfully!');
            } else {
                const response = await rawResponse.text();
                alert(response);
            }
        } catch (error) {
            console.error('Error during sign-up:', error);
        }
    }

    return (
        <div>
            <Navbar/>
            <Grid container justifyContent="center" alignItems="center" className="signup-page-container">
                <Paper elevation={10} className='paperStyle'>
                    <Grid align='center'>
                        <div className='heading'>
                            <Avatar className='avatarStyle'>
                                <LockOutlinedIcon />
                            </Avatar>
                            <h1>Sign Up</h1>
                        </div>
                    </Grid>
                    <form onSubmit={signUpHandler} className='sign-up'>
                        <TextField value={firstName} onChange={(e) => setFirstName(e.target.value)} className="signup-input" label='First Name' placeholder='Enter your firstname' fullWidth required />
                        <TextField value={lastName} onChange={(e) => setLastName(e.target.value)} className="signup-input" label='Last Name' placeholder='Enter your lastname' fullWidth required />
                        <TextField value={email} onChange={(e) => setEmail(e.target.value)} className="signup-input" label='Email' placeholder='Enter your email' fullWidth required />
                        <TextField value={password} onChange={(e) => setPassword(e.target.value)} className="signup-input" label='Password' placeholder='Enter your password' type='password' fullWidth required />
                        <TextField value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="signup-input" label='Confirm Password' placeholder='Confirm your password' type='password' fullWidth required />
                        {passwordMismatch && <p style={{ color: 'red' }}>Password does not match!</p>}
                        <TextField value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} className="signup-input" label='Contact Number' placeholder='Enter your number' fullWidth required />
                        <Button type='submit' color='primary' variant="outlined" className='btnstyle' fullWidth>Sign Up</Button>
                    </form>
                    <hr />
                </Paper>
            </Grid>
        </div>
    );
}
