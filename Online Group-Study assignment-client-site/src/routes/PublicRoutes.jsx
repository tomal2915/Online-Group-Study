
import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import Home from "../pages/Home/Home";
import Root from "../layout/Root";
import SignIn from "../pages/signIn/SignIn";
import Register from "../pages/register/Register";
import Assignments from "../pages/assignments/Assignments";
import CreateAssignment from "../pages/createAssignment/CreateAssignment";
import SubmittedAssignments from "../pages/submittedAssignments/SubmittedAssignments";
import PrivetRoutes from "./PrivetRoutes";
import MyAssignments from "../pages/myAssignments/MyAssignments";
import AssignmentDetails from "../pages/assignmentDetails/AssignmentDetails";
import UpdateAssignment from "../pages/updateAssignment/UpdateAssignment";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root></Root>,
        errorElement: <ErrorPage></ErrorPage>,
        children: [
            {
                path: "/",
                element: <Home></Home>,
            },
            {
                path: "/signIn",
                element: <SignIn></SignIn>
            },
            {
                path: "/register",
                element: <Register></Register>
            },
            {
                path: '/assignments',
                element: <Assignments></Assignments> //will be public
            },
            {
                path: '/myAssignments',
                element: <PrivetRoutes><MyAssignments></MyAssignments></PrivetRoutes>
            },
            {
                path: '/createAssignment',
                element: <PrivetRoutes><CreateAssignment></CreateAssignment></PrivetRoutes>
            },
            {
                path: '/submittedAssignments',
                element: <PrivetRoutes><SubmittedAssignments></SubmittedAssignments></PrivetRoutes>
            },
            {
                path: '/assignmentDetails/:_id',
                element: <PrivetRoutes><AssignmentDetails></AssignmentDetails></PrivetRoutes>,
                loader: ({ params }) => fetch(`https://online-group-study-assignment-server-site.vercel.app/assignment/assignmentDetails/${params._id}`, {
                    credentials: 'include',
                }),
            },
            {
                path: '/updateAssignment/:_id',
                element: <PrivetRoutes><UpdateAssignment></UpdateAssignment></PrivetRoutes>,
                loader: ({ params }) => fetch(`https://online-group-study-assignment-server-site.vercel.app/assignment/updateAssignment/${params._id}`, {
                    credentials: 'include',
                }),
            }
        ],
    },
]);

export default router;