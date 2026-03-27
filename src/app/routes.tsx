import { createBrowserRouter } from "react-router";
import RequireStorefrontAuth from "../components/auth/RequireStorefrontAuth";
import Home from "../pages/Home";
import ProductCatalog from "../pages/ProductCatalog";
import ProductDetails from "../pages/ProductDetails";
import DesigningArea from "../pages/DesigningArea";
import Cart from "../pages/Cart";
import Order from "../pages/Order";
import Gallery from "../pages/Gallery";
import MyDesigns from "../pages/MyDesigns";
import Profile from "../pages/Profile";
import Login from "../pages/Login";
import ErrorPage from "../components/ErrorPage";

const createErrorElement = () => <ErrorPage />;

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
    errorElement: createErrorElement(),
  },
  {
    Component: RequireStorefrontAuth,
    errorElement: createErrorElement(),
    children: [
      {
        path: "/",
        Component: Home,
      },
      {
        path: "/catalog",
        Component: ProductCatalog,
      },
      {
        path: "/product/:productId",
        Component: ProductDetails,
      },
      {
        path: "/product/:productId/design",
        Component: DesigningArea,
      },
      {
        path: "/cart",
        Component: Cart,
      },
      {
        path: "/order",
        Component: Order,
      },
      {
        path: "/gallery",
        Component: Gallery,
      },
      {
        path: "/my-designs",
        Component: MyDesigns,
      },
      {
        path: "/profile",
        Component: Profile,
      },
    ],
  },
]);
