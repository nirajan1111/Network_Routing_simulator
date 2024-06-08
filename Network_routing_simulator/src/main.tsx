
import ReactDOM from "react-dom/client";

import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ThreeD from "./components/3D/threeD.tsx";
const router = createBrowserRouter([
 
  {
    path: "/",
    element: <ThreeD />,
    errorElement: <div>Not found</div>,
  }
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <RouterProvider router={router} />
);
