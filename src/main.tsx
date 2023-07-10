import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "normalize.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home.tsx";
import BiliHistory from "./pages/bili/BiliHistory.tsx";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import Index from "./pages/bili/Index.tsx";
import Statistic from "./pages/bili/Statistic.tsx";

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
        errorElement: <h1>Error</h1>,
        children: [
          {
            index: true,
            element: <Index />,
            loader: async () => {
              const resp = await axios.get(
                "https://d3-site-server.onrender.com/videos/Doing"
              );
              return { videos: resp.data };
            },
          },
          {
            element: <Statistic />,
            path: "statistic",
          },
        ],
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
