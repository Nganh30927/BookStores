import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import NoPage from './pages/NoPage';
import ProductsPage from './pages/BooksPage';
import ProductDetailsPage from './pages/BooksDetailsPage';
import Login from './pages/LoginPage';
import DefaultLayout from './components/Layouts/DefaultLayout';
import EmptyLayout from './components/Layouts/EmptyLayout';
import OnlyHeaderLayout from './components/Layouts/OnlyHeaderLayout';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import Customers from './pages/Customers';
import CustomerOrders from './pages/Customers/CustomerOrders';
import CustomerProfile from './pages/Customers/CustomerProfile';
import CheckoutDonePage from './pages/CheckoutDonePage';
import SignUpPage from './pages/SignUpPage';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import BooksPage from './pages/BooksPage';
import BooksDetailsPage from './pages/BooksDetailsPage';
import ContactPage from './pages/ContactPage';
import BlogPages from './pages/Blogs';
import AboutPages from './pages/About';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            {/* DefaultLayout */}
            <Route path="/" element={<DefaultLayout />}>
              <Route index element={<HomePage />} />
              <Route path="/books" element={<BooksPage />} />
              <Route path="/books/search" element={<BooksPage />} />
              <Route path="booksdetail/:id" element={<BooksDetailsPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/blog" element={<BlogPages />} />
              <Route path="/about" element={<AboutPages />} />
            </Route>

            {/* OnlyHeaderLayout */}
            <Route path="/cart" element={<OnlyHeaderLayout />}>
              <Route index element={<CartPage />} />
            </Route>

            <Route path="/checkout" element={<OnlyHeaderLayout />}>
              <Route index element={<CheckoutPage />} />
            </Route>
            <Route path="/checkout-done" element={<OnlyHeaderLayout />}>
              <Route index element={<CheckoutDonePage />} />
            </Route>
            {/* Nested Layout */}
            <Route path="/customers" element={<OnlyHeaderLayout />}>
              <Route path="/customers" element={<Customers />}>
                <Route path="orders" element={<CustomerOrders />} />
                <Route path="profile" element={<CustomerProfile />} />
              </Route>
            </Route>

            {/* EmptyLayout */}
            <Route path="/login" element={<EmptyLayout />}>
              <Route index element={<Login />} />
            </Route>
            <Route path="/signup" element={<EmptyLayout />}>
              <Route index element={<SignUpPage />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NoPage />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </>
  );
}

export default App;
