import { useRoutes } from "react-router-dom"
import Error from "../pages/Error"
import Login from "../pages/Login"
import Dashboard from "../pages/Dashboard"
import TicketPage from "../pages/TicketPage"
import ViewTicket from "../pages/ViewTicket"
import CreateUserPage from "../pages/CreateUserPage"
import PendingTicketsPage from "../pages/PendingTicketsPage"
import CalendarPage from "../pages/CalendarPage"
import UserProfilePage from "../pages/ProfilePage"
import AllTicketsPage from "../pages/AllTickets"
import SearchPage from "../pages/SearchPage"
import Worklog from "../pages/Worklog"
// import withAuth from "../middleware/AuthMiddleware"

export default function WebRouter() {
    let routes = useRoutes([
        { path: '/', element: <Login /> },
        { path: '/dashboard', element: <Dashboard /> },
        { path: '/create-user', element: <CreateUserPage /> },
        { path: '/pending-tickets', element: <PendingTicketsPage /> },
        { path: '/pending-tickets/:filter', element: <PendingTicketsPage /> },
        { path: '/calendar', element: <CalendarPage /> },
        { path: '/profile', element: <UserProfilePage /> },
        { path: '/feedback-form', element: <UserProfilePage /> },
        { path: '/all-tickets', element: <AllTicketsPage /> },
        { path: '/worklog/:pr_id', element: <Worklog /> },
        { path: '/ticket/:pr_id', element: <TicketPage /> },
        { path: '/ticket/view/:pr_id', element: <ViewTicket /> },
        { path: '/search-ticket', element: <SearchPage /> },
        { path: '*', element: <Error /> },
    ])
    return routes
}
