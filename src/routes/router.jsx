import { createBrowserRouter } from "react-router";
import MainLayout from "../layouts/MainLayout";
import NotFound from "../pages/NotFound";
import AllService from "../pages/allService";
import Contact from "../pages/Contact";
import About from "../pages/About";
import News from "../pages/News";
import Notice from "../pages/Notice";



const router = createBrowserRouter(
    [
        {
            path: "/",
            element: <MainLayout />,
            errorElement: <NotFound></NotFound>,
            children: [
               
            ]
        },
        {
            path: "/services",
            element: <h1>Service</h1>,
        },
        {
            path: "/about",
            element: <About></About>,
        },
        {
            path: "/contact",
            element: <Contact></Contact>,
        },
        {
            path:"/AllServices",
            element: <AllService></AllService>,
        },
        {
            path: "/news",
            element: <News></News>,
        },
        {
            path: "/notice",
            element: <Notice></Notice>,
        }

    ]
);
export default router;