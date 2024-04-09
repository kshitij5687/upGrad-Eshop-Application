import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Link, useLocation } from "react-router-dom";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import Modal from "@mui/material/Modal";
import Autocomplete from "@mui/material/Autocomplete"; // Import Autocomplete component

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "62ch",
      "&:focus": {
        width: "55ch",
      },
    },
  },
}));

const CustomButton = styled(Button)(({ theme }) => ({
  color: "inherit",
  marginRight: theme.spacing(2),
}));

export default function Navbar({ loggedIn, isAdmin }) {
  const [openModal, setOpenModal] = React.useState(false);
  const location = useLocation();

  const handleLogout = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleLogoutConfirm = () => {
    window.location.href = "/";
    window.history.replaceState(null, null, "/");
  };

  const isManageProductPage = location.pathname === "/manage-product";

  // Sample product names for autocomplete
  const productNames = [
    "puma Shoes",
    "Car",
    "Mackbook",
  ];

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={{ backgroundColor: "#a183ed" }}>
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            ></IconButton>
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="#app-bar-with-responsive-menu"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              upgrad
            </Typography>
            <ShoppingCartIcon />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Upgrad-Eshop
            </Typography>

            {loggedIn ? (
              <>
                {!isManageProductPage && (
                  <Search className="search">
                    <SearchIconWrapper>
                      <SearchIcon />
                    </SearchIconWrapper>
                    {/* Autocomplete component for search */}
                    <Autocomplete
                      freeSolo
                      options={productNames}
                      renderInput={(params) => (
                        <StyledInputBase
                          {...params}
                          placeholder="Search…"
                          inputProps={{
                            ...params.inputProps,
                            "aria-label": "search",
                          }}
                        />
                      )}
                    />
                  </Search>
                )}

                <Link to="/products" style={{ textDecoration: "none" }}>
                  <CustomButton className="home" sx={{backgroundColor:"white", color:"#9b7ee4", marginLeft:2,'&:hover': { backgroundColor: "#d4caef" }}}>
                    Home
                  </CustomButton>
                </Link>

                {isAdmin && (
                  <Button component={Link} to="/manage-product" className="add-products" sx={{backgroundColor:"white", color:"#9b7ee4",marginRight:2,'&:hover': { backgroundColor: "#d4caef" }}}>
                    Add Products
                  </Button>
                )}
                <CustomButton
                  onClick={handleLogout}
                  variant="outlined"
                  className="logout"
                  sx={{borderColor:"white",'&:hover': { backgroundColor: "#d4caef",borderColor:"white" }}}
                >
                  Logout
                </CustomButton>
                <Modal
                  open={openModal}
                  onClose={handleCloseModal}
                  aria-labelledby="logout-modal-title"
                  aria-describedby="logout-modal-description"
                >
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      backgroundColor: "#FFF",
                      padding: "20px",
                      borderRadius: "5px",
                      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <Typography variant="h6" component="h2" gutterBottom>
                      Logout
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      Are you sure you want to logout?
                    </Typography>
                    <Button
                      onClick={handleLogoutConfirm}
                      variant="contained"
                      color="primary"
                      style={{ marginRight: "10px" }}
                    >
                      Yes
                    </Button>
                    <Button
                      onClick={handleCloseModal}
                      variant="outlined"
                      color="primary"
                      sx={{marginLeft:12.5}}
                    >
                      No
                    </Button>
                  </div>
                </Modal>
              </>
            ) : (
              <>
                <Link to="/signup">
                  <CustomButton
                    sx={{color:"white",borderColor:"white",
                    "&:hover": {
                      borderColor: "#d4caef"}}}
                    variant="outlined"
                  >
                    SIGN-UP
                  </CustomButton>
                </Link>
                <Link to="/login">
                  <CustomButton
                    sx={{color:"white",borderColor:"white",
                    "&:hover": {
                      borderColor: "#d4caef"}}}
                    variant="outlined"
                  >
                    SIGN-IN
                  </CustomButton>
                </Link>
              </>
            )}
          </Toolbar>
        </AppBar>
      </Box>
    </div>
  );
}
