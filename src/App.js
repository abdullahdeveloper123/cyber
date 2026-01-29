import './App.css';
import Home from './views/Home';
import Catalog from './views/Catalog';
import ProductDetail from './views/ProductDetail';
import Login from './views/Login';
import Signup from './views/Signup';
import MyWishlist from './views/MyWishlist';
import MyCart from './views/MyCart';
import MyProfile from './views/MyProfile';
import Checkout from './views/Checkout';
import SearchResults from './views/SearchResults';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from "./components/PrivateRoute";
import { SearchProvider } from './context/SearchContext';

function App() {
  return (
    <SearchProvider>
      <BrowserRouter>
      <Routes>
        <Route path="/products/:category" element={<Catalog />} />
        <Route path="/product/:id" element={<PrivateRoute><ProductDetail /></PrivateRoute>} />
        <Route path="/wishlist" element={<MyWishlist />} />
        <Route path="/cart" element={<MyCart />} />
        <Route path="/profile" element={<PrivateRoute><MyProfile /></PrivateRoute>} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
    </SearchProvider>
  );
}

export default App;
