import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "normalize.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home.tsx";
import BiliHistory from "./pages/bili/BiliHistory.tsx";
import axios from "axios";
import { Toaster } from "react-hot-toast";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: (
      <div>
        <h1 className="text-3xl">Not Found</h1>
      </div>
    ),
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "bili",
        element: <BiliHistory />,
        loader: async () => {
          let resp = await axios.get("http://192.168.18.8:3000/videos/Doing");
          return { videos: resp.data };
        },
        errorElement: <h1>Error</h1>,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <>
    <RouterProvider router={router} />
    <Toaster />
  </>
);
