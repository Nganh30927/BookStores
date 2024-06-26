import Home from '../pages/Home';
import Product from '../pages/Product';
import Category from '../pages/Categories';
import Customers from '../pages/Customers';
import CustomerProfile from '../pages/Customers/CustomerProfile';
import CustomerOrders from '../pages/Customers/CustomerOrders';
import ProductDetails from '../pages/ProductDetails';
import Login from '../pages/Login';
import EmptyLayout from '../components/Layouts/EmptyLayout';
import CategoryAdd from '../pages/Categories/CategoryAdd';
import CategoryEdit from '../pages/Categories/CategoryEdit';
import Employees from '../pages/Employees';

interface BaseProps {
    id: number;
    path: string;
    element: () => JSX.Element;
}
interface Routes extends  BaseProps {
    layout?: () => JSX.Element;
    nested?: BaseProps[]
}

//Public routes

const publicRoutes: Routes[] = [
    {id: 5, path: '/login', element: Login, layout: EmptyLayout},
]

//Private routes
const privateRoutes: Routes[] = [
    {id: 1, path: '/', element: Home},
    {id: 2, path: '/product', element: Product},
    {id: 3, path: '/product/:id', element: ProductDetails},
    {id: 4, path: '/category', element: Category},
    {id: 6, path: '/customers', element: Customers},
    {id: 7, path: '/category/add', element: CategoryAdd},
    {id: 8, path: '/category/edit/:id', element: CategoryEdit},
    {id: 9, path: '/customers/profile', element: CustomerProfile},
    {id: 10, path: '/customers/orders', element: CustomerOrders},
    {id: 11, path: '/employees', element: Employees},
];

export {
    publicRoutes,
    privateRoutes
}