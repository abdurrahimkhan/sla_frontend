import { useRoutes } from "react-router-dom"
import Error from "../pages/Error"
import Login from "../pages/Login"
import Dashboard from "../pages/Dashboard"
import TicketPage from "../pages/TicketPage"
import ViewTicket from "../pages/ViewTicket"
// import withAuth from "../middleware/AuthMiddleware"

export default function WebRouter() {
    let routes = useRoutes([
        { path: '/', element: <Login /> },
        { path: '/dashboard', element: <Dashboard /> },
        { path: '/ticket/:pr_id', element: <TicketPage /> },
        { path: '/ticket/view/:pr_id', element: <ViewTicket /> },
        { path: '*', element: <Error /> },
    ])
    return routes
}
