import {BrowserRouter, Routes, Route} from 'react-router-dom'
import './App.css'
import Dashboard from './pages/Dashboard';
import NoPage from './pages/NoPage';
import Category from './pages/Categories';
import Login from './pages/Login';
import Publisher from './pages/Publishers';
import Employee from './pages/Employees';
import Member from './pages/Members';
import BooksPage from './pages/Books';
import Orders from './pages/Orders';

import DefaultLayout from './components/Layouts/DefaultLayout';

function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<DefaultLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="category" element={<Category />} />
            <Route path="publishers" element={<Publisher />} />
            <Route path="employees" element={<Employee />} />
            <Route path="members" element={<Member />} />
            <Route path="books" element={<BooksPage />} />
            <Route path="orders" element={<Orders />} />
        </Route>
        <Route path="/login" element={<Login />} />
        
        <Route path="*" element={<NoPage />} />
        </Routes>
    </BrowserRouter>
    </>
  )
}

export default App