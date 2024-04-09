import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from '../component/login/LoginPage';
import SignUp from '../component/Signup/SignUp';
import Product from '../component/product/Product';
import './App.css';
import HomePage from '../component/home/Homepage';
import ProductDetails from '../component/productdetails/ProductDetails';
import PlaceOrder from '../component/placeorder/PlaceOrder';
import ManageProduct from '../component/manageproduct/ManageProduct';


export default function App() {
  return (
    <div className="background-container">
      <Router>
        <div>
          
          <Routes>
            <Route exact path="/login" Component={LoginPage} />
            <Route exact path="/signup" Component={SignUp} />
            <Route exact path="/products" Component={Product} />
            <Route exact path="/" Component={HomePage} />
            <Route exact path="/product/details" Component={ProductDetails} />
            <Route exact path="/product/details/placeorder" Component={PlaceOrder} />
            <Route exact path="/manage-product" Component={ManageProduct} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}
