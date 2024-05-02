import {BrowserRouter, Routes, Route} from 'react-router-dom'
import './App.css'
import Dashboard from './pages/Dashboard';
import NoPage from './pages/NoPage';
import Category from './pages/Categories';
import Login from './pages/Login';
import DefaultLayout from './components/Layouts/DefaultLayout';

function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<DefaultLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="category" element={<Category />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NoPage />} />
        </Routes>
    </BrowserRouter>
    </>
  )
}

export default App