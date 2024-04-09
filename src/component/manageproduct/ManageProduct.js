import React from 'react'
import "./ManageProduct.css"
import Navbar from '../../common/Navbar' // Import the Navbar component
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { useContext } from 'react';
import { Context } from '../../common/ContextProvider';
import DeleteIcon from '@mui/icons-material/Delete';
import Modal from '@mui/material/Modal';

export default function ManageProductsPage() {
  const [productName, setProductName] = React.useState('');
  const [productImageURL, setProductImageURL] = React.useState('');
  const [productDescription, setProductDescription] = React.useState('');
  const [availableUnits, setAvailableUnits] = React.useState('');
  const [productManufacturer, setProductManufacturer] = React.useState('');
  const [productCategory, setProductCategory] = React.useState('');
  const [productPrice, setProductPrice] = React.useState('');
  const [products, setProducts] = React.useState([]);
  const { token } = useContext(Context);
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
  const [productId, setProductId] = React.useState('');

  React.useEffect(() => {
    fetchAllProducts();
  }, []);

  async function addProductHandler(event) {
    event.preventDefault();
    try {
      const rawResponse = await fetch('http://localhost:3001/api/v1/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({
          name: productName,
          category: productCategory,
          manufacturer: productManufacturer,
          description: productDescription,
          price: productPrice,
          imageURL: productImageURL,
          availableItems: availableUnits
        })
      });

      // Handle the response from the server
      if (rawResponse.ok) {
        console.log(rawResponse);
        alert('Product Added Successfully');
        window.location.reload();
      } else {
        const response = await rawResponse.text();
        alert(response);
      }
    } catch (error) {
      // Handle network errors or other exceptions
      console.error('Error during sign-up:', error);
    }
  }

  const fetchAllProducts = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/v1/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data || []);
        console.log(data);
      } else {
        console.error('Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleDelete = (id) => {
    setOpenDeleteModal(true);
    setProductId(id);
  }

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
  }

  async function handleConfirmDelete() {
    try {
      const response = await fetch(`http://localhost:3001/api/v1/products/${productId}`, { method: 'DELETE' }); // Added backticks around the URL
      if (response.ok) {
        alert("Product Deleted Successfully");
        // Reload the page after successful deletion
        window.location.reload();
        // Close the delete modal
        handleCloseDeleteModal();
      } else {
        throw new Error('Failed to delete product');
      }
    } catch (error) {
      // Handle error
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div className='manage-products-container'>
      <Navbar loggedIn={true} />

      <div className='manage-form-container'>
        <h1>Add Product Here</h1>
        <form onSubmit={addProductHandler}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                label="Product Name"
                fullWidth
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                label="Image URL"
                fullWidth
                value={productImageURL}
                onChange={(e) => setProductImageURL(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                label="Description"
                fullWidth
                multiline
                rows={4}
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                label="Available Units"
                fullWidth
                type="number"
                value={availableUnits}
                onChange={(e) => setAvailableUnits(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                label="Manufacturer"
                fullWidth
                value={productManufacturer}
                onChange={(e) => setProductManufacturer(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                label="Category"
                fullWidth
                value={productCategory}
                onChange={(e) => setProductCategory(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                label="Price"
                fullWidth
                type="number"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" sx={{backgroundColor:"#a183ed",color:"white" ,'&:hover': { backgroundColor: "#d4caef",color:"white" }}}>
                Add Product
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
      <div className='products-grid'>
        <h1 className='modify-heading'>Modify Products Here</h1>
        <Grid container spacing={2}> {/* Grid container */}
          {products.map((product, index) => (
            <Grid item key={index} xs={12} sm={6} md={4} lg={3}> {/* Grid item */}
              <Card className="card-container" sx={{ maxWidth: 290, backgroundColor: '#9b7ee4', borderRadius: 6 }}>
                <CardMedia
                  component="img"
                  height="290"
                  image={product.imageURL || "https://via.placeholder.com/240"}
                  alt="Product Image"
                />
                <CardContent sx={{ color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                  <div>
                    <Typography gutterBottom variant="h5" component="div">
                      {product.name}
                    </Typography>
                    <Typography variant="body2">
                      {product.description}
                    </Typography>
                    <Typography variant="h6">
                      Price : ${product.price}/-
                    </Typography>
                    <Button onClick={() => handleDelete(product._id)}>
                      <DeleteIcon sx={{ color: 'white', marginTop: '10px', fontSize: '30px' }} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
      <footer className="footer-manage-products">
        <Typography variant="body2" className="footer">
          Lorem ipsum dolor sit amet consectetur.
          <br />
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </Typography>
      </footer>
      <Modal
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        aria-labelledby="Delete-modal-title"
        aria-describedby="Delete-modal-description"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#FFF',
            padding: '20px',
            borderRadius: '5px',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography variant="h5" component="h2" gutterBottom>
            Delete
          </Typography>
          <Typography variant="body1" gutterBottom>
            Are you sure you want to delete this product?
          </Typography>
          <Button onClick={handleConfirmDelete} variant="outlined" color="inherit" sx={{ color: 'white', backgroundColor: '#9b7ee4', marginRight: '10px','&:hover': { backgroundColor: "#d4caef" } }}>
            Yes
          </Button>
          <Button onClick={handleCloseDeleteModal} variant="outlined" color="inherit" sx={{ marginLeft: 17, color: 'white', backgroundColor: '#9b7ee4','&:hover': { backgroundColor: "#d4caef" } }}>
            No
          </Button>
        </div>
      </Modal>

    </div>
  );
}
