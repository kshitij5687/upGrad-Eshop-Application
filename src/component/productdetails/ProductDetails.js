import React, { useEffect, useState, useContext } from 'react';
import { Context } from '../../common/ContextProvider';
import './ProductDetails.css';
import Navbar from '../../common/Navbar';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

export default function ProductDetailsPage() {
    const { id,setId } = useContext(Context);
    const [product, setProduct] = useState(JSON.parse(localStorage.getItem('product')) || {});
    const [loading, setLoading] = useState(!product); // Set loading to true if product data is not available
    const {quantity, setQuantity} = useContext(Context); // Initialize quantity state to 1
    const [limitExceeded, setLimitExceeded] = useState(false);

    useEffect(() => {
        // Reset quantity to 1 whenever the id changes
        setQuantity(1);
    }, [id,setQuantity]);

    const placeOrderButtonHandler = () =>{
        setId(id);
        setQuantity(quantity);
      }

    const fetchProductData = async () => {
        if (!id) return; // Return early if id is not available
        try {
            const response = await fetch(`http://localhost:3001/api/v1/products/${id}`);
            if (response.ok) {
                const data = await response.json();
                setProduct(data);
                localStorage.setItem('product', JSON.stringify(data));
            } else {
                console.error('Failed to fetch products');
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchProductData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const handleIncrement = () => {
        if (quantity < product.availableItems) {
            setQuantity(quantity + 1);
            setLimitExceeded(false);
            localStorage.setItem('productQuantity', quantity + 1); // Store updated quantity in local storage
        } else {
            setLimitExceeded(true);
        }
    };
    
    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
            setLimitExceeded(false);
            localStorage.setItem('productQuantity', quantity - 1); // Store updated quantity in local storage
        } else {
            setQuantity(1);
        }
    };
    
    
    

    return (
        <div className='main-container'>
            <Navbar loggedIn={true} />
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    <Card className="card" sx={{ backgroundColor: '#9b7ee4', borderRadius: 6 }}>
                        <Grid container>
                            <Grid item xs={6}>
                                <CardMedia
                                    component="img"
                                    image={product.imageURL || "https://via.placeholder.com/240"}
                                    alt="Product Image"
                                    sx={{width:'100%',height:'101.5%'}}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <CardContent className='card-content' sx={{ color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                                    <div>
                                        <Typography gutterBottom variant="h5" component="div" className='name-details'>
                                            {product.name}
                                        </Typography>
                                        <div className='border'>
                                            <Typography variant="body2" className='description-details'>
                                                Description : {product.description}
                                            </Typography>
                                            <Typography variant="h6" className='price-details'>
                                                Price : {product.price}
                                            </Typography>
                                            <Typography variant="h6" className='availableItems-details'>
                                                No.of items available : {product.availableItems}
                                            </Typography>
                                            <Typography variant="h6" className='manufacturer-details'>
                                                Manufacturer : {product.manufacturer || "unknown"}
                                            </Typography>
                                            <Typography variant="h6" className='category-details'>
                                                Category : {product.category}
                                            </Typography>
                                        </div>
                                        <p className='quantity-paragraph'>Add the quantity : </p>
                                        <div className='main-quantity'>
                                            <Button className='qunatity-button' variant="contained" onClick={handleIncrement}>+</Button>
                                            <p className='qunatity-para'>{quantity}</p>
                                            <Button className='qunatity-button' variant="contained" onClick={handleDecrement}>-</Button>
                                            {limitExceeded && (
                                                <Typography variant="body2" className="limit-exceeded">
                                                    Quantity limit exceeded!
                                                </Typography>
                                            )}
                                        </div>
                                        <Button onClick={()=>placeOrderButtonHandler(product._id)} component={Link} to="/product/details/placeorder" variant="contained" className='place-order'>
                                            Place Order
                                        </Button>
                                    </div>
                                </CardContent>
                            </Grid>
                        </Grid>
                    </Card>
                </div>
            )}
        </div>
    );
}
