import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import {Provider} from 'react-redux'
import store from './store/store.js'
import { Toaster } from "@/components/ui/sonner";
import { createBrowserRouter,RouterProvider} from 'react-router-dom';
import AdminDashboard from "@/pages/AdminDashboard";
import AdminRoute from "@/components/AdminRoute";

import Login from './pages/Login.jsx';
import SignUp from './pages/Signup.jsx';
import Dashboard from './pages/Dashboard.jsx'
import PrivateRoute from "./components/PrivateRoute.jsx";
import DashboardLayout from './pages/DashboardLayout.jsx';
import MyTickets from './components/MyTickets'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <SignUp />,
  },
  {
  element: <PrivateRoute><DashboardLayout/></PrivateRoute>,
  children: [
    {
      path: "/dashboard",
      element: <Dashboard />,
    },
    {
      path: "/admin",
      element: <AdminRoute><AdminDashboard /></AdminRoute>,
    },
    {
      path: "/my-tickets",
      element: <MyTickets />,
     }
  ],
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
       <RouterProvider router={router}/>
        <Toaster richColors position="top-center" />
    </Provider>
  </StrictMode>,
)
