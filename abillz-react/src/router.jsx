import { createBrowserRouter } from 'react-router-dom'
import Notfound from './pages/Notfound';
import GuestLayout from './components/GuestLayout';
import DefaultLayout from './components/DefaultLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Cart from './pages/Cart';
import Shop from './pages/Shop';
import Search from './pages/Search';
import Checkout from './pages/Checkout';
import Menu from './pages/Menu';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import DashboardHome from './pages/DashboardHome';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import Orderdetails from './pages/Orderdetails';
import Product from './pages/Product'
import AddProducts from './admin/AddProducts';
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/AdminDashboard';
import AdminOrderDetails from './admin/AdminOrderDetails';
import AdminOrders from './admin/AdminOrders';
import AdminProducts from './admin/AdminProducts';
import  EditProduct  from './admin/EditProduct';
import ForgotPassword from './pages/ForgotPassword';
import ResetForm from './pages/ResetForm';


import AdminProtectedRoute from './admin/components/AdminProtectedRoute';

const router = createBrowserRouter([
    {
        path: "/auth",
        element: <GuestLayout />,
        children: [
            { index: true, element: <Auth /> },
            { path: "forgot-password", element: <ForgotPassword />},
            { path: "reset-password/:token", element: <ResetForm />},
        ]
    },
    {
        path: "/",
        element: <DefaultLayout />,
        children: [
            { index: true, element: <Home /> },
            { path: "search", element: <Search /> },
            { path: "cart", element: <Cart /> },
            { path: "blog", element: <Menu /> },
            { path: "shop", element: <Shop /> },
            { path: "products/:id", element: <Product /> },
            { path: "checkout", element: <Checkout /> },
            { path: "contact", element: <Contact /> },
            { path: "about", element: <About /> },
            {
                element: (
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                ),
                children: [
                    { path: "dashboard", element: <DashboardHome /> },
                    { path: "profile", element: <Profile /> },
                    { path: "settings", element: <Settings /> },
                    { path: "orders", element: <Orders /> },
                    { path: "orders/:order_id", element: <Orderdetails /> },
                ]
            }
        ]
    },
    {
        path: "/admin",
        element: (
            <AdminProtectedRoute>
                <AdminLayout />
            </AdminProtectedRoute>
        ),
        children: [
            { index: true, element: <AdminDashboard /> },
            { path: "add-products", element: <AddProducts /> },
            { path: "orders", element: <AdminOrders /> },
            { path: "orders/:order_id", element: <AdminOrderDetails />},
            { path: "products", element: <AdminProducts />,},
            { path: "products/:product_id/edit", element: <EditProduct />, },
        ]
    },
    {
        path: "*",
        element: <Notfound />,
    },
]);

export default router;
