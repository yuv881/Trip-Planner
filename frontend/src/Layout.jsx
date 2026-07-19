import { RouterProvider, createHashRouter, Navigate, Outlet } from "react-router-dom"
import Dashboard from "./pages/Dashboard.jsx"
import Trip from "./pages/Trip.jsx"
import All_Trips from "./pages/Trip/All_Trips.jsx"
import Pending_trips from "./pages/Trip/Pending_trips.jsx"
import Completed_Trip from "./pages/Trip/Completed_Trip.jsx"
import TripDetailsPage from "./pages/Trip/TripDetailsPage.jsx"
import DashboardHome from "./pages/DashboardHome.jsx"
import Login from "./pages/Auth/Login.jsx"
import Register from "./pages/Auth/Register.jsx"

const ProtectedRoute = () => {
    const user = localStorage.getItem('user');
    return user ? <Outlet /> : <Navigate to="/login" replace />;
}

const router = createHashRouter([
    {
        path: "/",
        element: <Navigate to="/dashboard" replace />,
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/register",
        element: <Register />,
    },
    {
        element: <ProtectedRoute />,
        children: [
            {
                path: "/dashboard",
                element: <Dashboard />,
                children: [
                    {
                        index: true,
                        element: <DashboardHome />,
                    },
                    {
                        path: "trips",
                        element: <Trip />,
                        children: [
                            {
                                index: true,
                                element: <Navigate to="all" replace />,
                            },
                            {
                                path: "all",
                                element: <All_Trips />,
                            },
                            {
                                path: "pending",
                                element: <Pending_trips />,
                            },
                            {
                                path: "completed",
                                element: <Completed_Trip />,
                            },
                        ],
                    },
                    {
                        path: "trip/:tripId",
                        element: <TripDetailsPage />,
                    },
                    {
                        path: "settings",
                        element: (
                            <div>
                                <h1 className="text-2xl font-bold">Settings</h1>
                                <p className="mt-2 text-zinc-650">Adjust your application settings.</p>
                            </div>
                        ),
                    },
                ],
            },
        ],
    },
])

const Layout = () => {
    return (
        <RouterProvider router={router} />
    )
}

export default Layout