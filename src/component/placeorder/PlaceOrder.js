import React, { useContext, useEffect, useState, useCallback } from 'react';
import Navbar from '../../common/Navbar';
import { Context } from '../../common/ContextProvider';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import "./PlaceOrder.css";
import { TextField } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';

const steps = ['Add Address', 'Select Address', 'Confirm Order'];

export default function PlaceOrder() {
    const { id, setId, quantity, setQuantity, token, setToken } = useContext(Context);
    const [name, setName] = useState('');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [landmark, setLandMark] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [activeStep, setActiveStep] = useState(0);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [product, setProduct] = useState(null);
    const navigate = useNavigate();

    const fetchAllAddresses = useCallback(async () => {
        if (token) {
            try {
                const rawResponse = await fetch('http://localhost:3001/api/v1/addresses', {
                    method: 'GET',
                    headers: {
                        'x-auth-token': token
                    }
                });

                if (rawResponse.ok) {
                    const data = await rawResponse.json();
                    setAddresses(data);
                } else {
                    console.error('Failed to fetch addresses');
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        }
    }, [token]);

    useEffect(() => {
        const storedId = localStorage.getItem('productId');
        const storedQuantity = localStorage.getItem('orderQuantity');
        const storedToken = localStorage.getItem('token');

        if (storedId && !id) {
            setId(storedId);
        }
        if (storedQuantity && !quantity) {
            setQuantity(storedQuantity);
        }
        if (storedToken && !token) {
            setToken(storedToken);
        }

        localStorage.setItem('productId', id);
        localStorage.setItem('orderQuantity', quantity);
        fetchAllAddresses();

        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://localhost:3001/api/v1/products/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': token
                    }
                });
                if (response.ok) {
                    const productData = await response.json();
                    setProduct(productData);
                } else {
                    console.error('Failed to fetch product details');
                }
            } catch (error) {
                console.error('Error fetching product details:', error);
            }
        };

        if (id && token) {
            fetchProduct();
        }
    }, [id, setId, quantity, setQuantity, token, setToken, fetchAllAddresses]);

    const handleAddressClick = (addressId) => {
        const selected = addresses.find(address => address._id === addressId);
        setSelectedAddress(selected);
        setSelectedAddressId(addressId);
    };

    const handleDeleteAddress = (event, addressId) => {
        event.stopPropagation();
        const updatedAddresses = addresses.filter(address => address._id !== addressId);
        setAddresses(updatedAddresses);
        localStorage.setItem('addresses', JSON.stringify(updatedAddresses));
        if (selectedAddressId === addressId) {
            setSelectedAddressId(null);
            setSelectedAddress(null);
        }
    };

    async function addAddressHandler(event) {
        event.preventDefault();

        try {
            const rawResponse = await fetch('http://localhost:3001/api/v1/addresses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({
                    name,
                    street,
                    city,
                    state,
                    landmark,
                    contactNumber,
                    zipCode
                })
            });

            if (rawResponse.ok) {
                alert('Address added successfully!');
                fetchAllAddresses();
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
            } else {
                const response = await rawResponse.text();
                alert(response);
            }
        } catch (error) {
            console.error('Error adding address:', error);
        }
    }

    async function confirmOrderHandler(event) {
        event.preventDefault();

        try {
            const rawResponse = await fetch('http://localhost:3001/api/v1/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({
                    product: id,
                    quantity: quantity,
                    address: selectedAddress
                })
            });

            if (rawResponse.ok) {
                alert("Your order has been confirmed. You will be redirected to the Home page.");
                navigate("/Products");
            } else {
                const response = await rawResponse.text();
                alert(response);
            }
        } catch (error) {
            console.error('Error confirming order:', error);
        }
    }

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleSkip = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    return (
        <div>
            <div className='place-order-container'>
                <Navbar loggedIn={true} isAdmin={true} />
                <div className='stepper-menu'>
                    <Box sx={{ width: '90%', padding: '30px', backgroundColor: 'white', height: '88vh', margin: '30px auto', borderRadius: '20px' }}>
                        <Stepper activeStep={activeStep}>
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                        <React.Fragment>
                            <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography>
                            {activeStep === 0 ? (
                                <div>
                                    <form onSubmit={addAddressHandler}>
                                        <TextField value={name} onChange={(e) => setName(e.target.value)} label='Name' fullWidth required sx={{ marginTop: '10px' }} />
                                        <TextField value={street} onChange={(e) => setStreet(e.target.value)} label='Street' fullWidth required sx={{ marginTop: '10px' }} />
                                        <TextField value={city} onChange={(e) => setCity(e.target.value)} label='City' fullWidth required sx={{ marginTop: '10px' }} />
                                        <TextField value={zipCode} onChange={(e) => setZipCode(e.target.value)} label='Zip Code' fullWidth required sx={{ marginTop: '10px' }} />
                                        <TextField value={state} onChange={(e) => setState(e.target.value)} label='State' fullWidth required sx={{ marginTop: '10px' }} />
                                        <TextField value={landmark} onChange={(e) => setLandMark(e.target.value)} label='Land Mark' fullWidth required sx={{ marginTop: '10px' }} />
                                        <TextField value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} label='Contact Number' fullWidth required sx={{ marginTop: '10px' }} />
                                        <Button
                                            type='submit'
                                            color="inherit"
                                            variant="outlined"
                                            fullWidth
                                            sx={{ marginTop: '10px', height: "50px", color: "white", backgroundColor: "#9b7ee4", '&:hover': { backgroundColor: "#d4caef" } }}>
                                            Add Address
                                        </Button>
                                    </form>
                                </div>
                            ) : activeStep === 1 ? (
                                <div>
                                    <Typography variant="h5">Address List</Typography>
                                    <div style={{ overflowY: 'auto', maxHeight: '400px', marginBottom: "50px" }}>
                                        <List>
                                            {addresses.map(address => (
                                                <ListItem
                                                    key={address._id}
                                                    button
                                                    selected={selectedAddressId === address._id}
                                                    onClick={() => handleAddressClick(address._id)}
                                                >
                                                    <ListItemText
                                                        primary={`Name = ${address.name}, Street = ${address.street}, City = ${address.city}, Landmark = ${address.landmark}, State = ${address.state}, ZipCode = ${address.zipCode}`}
                                                    />
                                                    <Button
                                                        onClick={(e) => handleDeleteAddress(e, address._id)}
                                                        color="error"
                                                        variant="contained"
                                                        sx={{ ml: 2 }}
                                                    >
                                                        Delete
                                                    </Button>
                                                </ListItem>
                                            ))}
                                        </List>
                                    </div>
                                    <Typography variant="body1">Selected Address ID: {selectedAddressId}</Typography>
                                </div>
                            ) : activeStep === 2 ? (
                                <div>
                                    <h2>Review Order</h2>
                                    <Card>
                                        <Grid container spacing={2}>
                                            <Grid item xs={4}>
                                                <CardMedia
                                                    component="img"
                                                    height="470"
                                                    image={product ? product.imageURL || "https://via.placeholder.com/240" : "https://via.placeholder.com/240"}
                                                    alt={product ? product.name : "Product Image"}
                                                    sx={{ width: 400 }}
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <CardContent>
                                                    <Typography variant="h5" component="h2">
                                                        Product name: {product ? product.name : ''}
                                                    </Typography>
                                                    <Typography color="textSecondary" gutterBottom>
                                                        Manufacturer: {product ? product.manufacturer : ''}
                                                    </Typography>
                                                    <Typography variant="body2" component="p">
                                                        Description: {product ? product.description : ''}
                                                    </Typography>
                                                    <Typography variant="body1" component="p">
                                                        Price: ${product ? product.price : ''}
                                                    </Typography>
                                                    <Typography variant='body1' component="p">
                                                        Quantity: {quantity}
                                                    </Typography>
                                                    <Typography variant="body1" component="p">
                                                        Total Price: ${product ? product.price * quantity : ''}
                                                    </Typography>
                                                    <Typography variant="h5" component="h2">
                                                        Your Address
                                                    </Typography>
                                                    <Typography variant="body1">{`Name: ${selectedAddress ? selectedAddress.name : ''}, Street: ${selectedAddress ? selectedAddress.street : ''}, City: ${selectedAddress ? selectedAddress.city : ''}, Landmark: ${selectedAddress ? selectedAddress.landmark : ''}, State: ${selectedAddress ? selectedAddress.state : ''}, ZipCode: ${selectedAddress ? selectedAddress.zipCode : ''}`}</Typography>
                                                </CardContent>
                                            </Grid>
                                        </Grid>
                                    </Card>
                                </div>
                            ) : null}

                            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                                <Button
                                    color="inherit"
                                    disabled={activeStep === 0}
                                    onClick={handleBack}
                                    sx={{ mr: 1, color: "9b7ee4", '&:hover': { backgroundColor: "#d4caef" } }}
                                >
                                    Back
                                </Button>
                                <Box sx={{ flex: '1 1 auto' }} />

                                {activeStep === 0 ? (
                                    <>
                                        <Typography sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '100px' }}>If Address Already Added then skip!</Typography>
                                        <Button sx={{ marginLeft: '10px', color: "white", backgroundColor: "#9b7ee4", '&:hover': { backgroundColor: "#d4caef" } }} onClick={handleSkip}>skip</Button>
                                    </>

                                ) : (<></>)}

                                {activeStep === steps.length - 1 ? (
                                    <>
                                        <Button onClick={(e) => confirmOrderHandler(e)} sx={{ marginLeft: '10px', color: "white", backgroundColor: "#9b7ee4", '&:hover': { backgroundColor: "#d4caef" } }}>
                                            Confirm order
                                        </Button>
                                    </>) : (
                                    <>
                                        <Button sx={{ marginLeft: '10px', color: "white", backgroundColor: "#9b7ee4", '&:hover': { backgroundColor: "#d4caef" } }} onClick={handleNext}>
                                            Next
                                        </Button>
                                    </>
                                )}
                            </Box>
                        </React.Fragment>
                    </Box>
                </div>
            </div>

            <footer className="footer">
                <Typography variant="body2" className="footer-placeoreder">
                    <br />
                    Lorem ipsum dolor sit amet consectetur.
                    <br />
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                </Typography>
            </footer>
        </div>
    );
}
