import React, { useState, useEffect } from "react";
import Navbar from "../../common/Navbar";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import SortIcon from "@mui/icons-material/Sort";
import PriceDownIcon from "@mui/icons-material/ArrowDownward";
import PriceUpIcon from "@mui/icons-material/ArrowUpward";
import NewestIcon from "@mui/icons-material/NewReleases";
import "./Product.css";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import CardActionArea from "@mui/material/CardActionArea";
import { Link } from "react-router-dom";
import { Context } from "../../common/ContextProvider";
import { useContext } from "react";

const Product = () => {
  const [alignment, setAlignment] = useState();
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const { setId } = useContext(Context);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/api/v1/products/categories"
        );
        if (response.ok) {
          const data = await response.json();
          setCategories(data || []);
        } else {
          console.error("Failed to fetch categories");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/v1/products");
        if (response.ok) {
          const data = await response.json();
          setProducts(data || []);
          setFilteredProducts(data || []);
          console.log(data);
        } else {
          console.error("Failed to fetch products");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchCategories();
    fetchProducts();
  }, []);

  const handleChange = (event, newAlignment) => {
    if (newAlignment !== null) {
      setAlignment(newAlignment);
      if (newAlignment === "All") {
        setFilteredProducts(products);
      } else {
        const filtered = products.filter(
          (product) => product.category === newAlignment
        );
        setFilteredProducts(filtered);
      }
    }
  };

  const buyButtonHandler = (id) => {
    setId(id);
  };

  const handleSortChange = (event) => {
    const sortedProducts = [...filteredProducts];
    if (event.target.innerText === "Price high to low") {
      sortedProducts.sort((a, b) => b.price - a.price);
    } else if (event.target.innerText === "Price low to high") {
      sortedProducts.sort((a, b) => a.price - b.price);
    } else if (event.target.innerText === "Newest") {
      sortedProducts.sort((a, b) => {
        const dateA = new Date(a.updatedAt).getTime();
        const dateB = new Date(b.updatedAt).getTime();
        return dateB - dateA;
      });
    }
    setFilteredProducts(sortedProducts);
  };

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    <Box sx={{ width: 270 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {[
          { text: "Default", icon: <SortIcon sx={{ color: "#dbdbdb" }} /> },
          {
            text: "Price high to low",
            icon: <PriceDownIcon sx={{ color: "#dbdbdb" }} />,
          },
          {
            text: "Price low to high",
            icon: <PriceUpIcon sx={{ color: "#dbdbdb" }} />,
          },
          { text: "Newest", icon: <NewestIcon sx={{ color: "#dbdbdb" }} /> },
        ].map((item) => (
          <ListItemButton key={item.text} onClick={handleSortChange}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <div>
      <div className="main-container">
        <Navbar loggedIn={true} isAdmin={true} />
        <div className="product-container">
          <Button onClick={toggleDrawer(true)} className="filter">
            Sort By <SortIcon />
          </Button>
          <Drawer
            open={open}
            onClose={toggleDrawer(false)}
            className="filter-menu"
            classes={{
              paper: "drawer-paper",
            }}
            BackdropProps={{
              classes: {
                root: "drawer-backdrop",
              },
            }}
          >
            {DrawerList}
          </Drawer>
          <ToggleButtonGroup
            color="primary"
            value={alignment}
            exclusive
            onChange={handleChange}
            aria-label="Platform"
            sx={{ backgroundColor: "#a183ed",marginRight:3 }}
          >
            <ToggleButton value="All" sx={{ color: "white" , backgroundColor: "#a183ed"}}>
              All
            </ToggleButton>
            {categories.map((category, index) => (
              <ToggleButton
                key={index}
                value={category}
                sx={{ color: "#dbdbdb" }}
              >
                {category}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </div>
        <div className="products-grid">
          <Grid container spacing={2}>
            {filteredProducts.map((product, index) => (
              <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                <Card
                  sx={{
                    maxWidth: 250,
                    backgroundColor: "#a183ed",
                    borderRadius: 5,
                  }}
                >
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      height="255"
                      image={
                        product.imageURL || "https://via.placeholder.com/240"
                      }
                      alt="Product Image"
                    />
                    <CardContent sx={{ color: "#fdfdfd" }}>
                      <Typography gutterBottom variant="h6" component="div">
                        {product.name}
                      </Typography>
                      <Typography variant="body2">
                        {product.description}
                      </Typography>
                      <Typography variant="subtitle1">
                        ${product.price}
                      </Typography>
                      <Button
                        component={Link}
                        to="/product/details"
                        onClick={() => buyButtonHandler(product._id)}
                        variant="contained"
                        sx={{
                          position: "absolute",
                          bottom: 10,
                          right: 10,
                          borderRadius: 7,
                          color: "#a183ed",
                          backgroundColor: "white",
                          "&:hover": {
                            backgroundColor: "#d4caef", // Change the background color on hover
                            color: "white", // Change the text color on hover
                          },
                        }}
                      >
                        Buy
                      </Button>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </div>
      </div>
      <footer className="footer">
        <Typography variant="body2">
          <br />
          Lorem ipsum dolor sit amet consectetur.
          <br />
          Lorem ipsum dolor sit amet consectetur, adipisicing elit.
          <br />
        </Typography>
      </footer>
    </div>
  );
};

export default Product;
