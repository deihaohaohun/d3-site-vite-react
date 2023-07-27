import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "normalize.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home.tsx";
import BiliHistory from "./pages/bili/BiliHistory.tsx";
import { Toaster } from "react-hot-toast";
import Index from "./pages/bili/Index.tsx";
import Abhs from "./pages/abhs/Abhs.tsx";
import AbhsIndex from "./pages/abhs/Index.tsx";
import Statistic from "./pages/bili/Statistic.tsx";
import { http } from "./utils/fetch.ts";

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
              const resp = await http.get("/videos/Doing");
              return { videos: resp.data };
            },
          },
          {
            path: "statistic",
            element: <Statistic />,
          },
        ],
      },
      {
        path: "abhs",
        element: <Abhs />,
        errorElement: <h1>Error</h1>,
        children: [
          {
            index: true,
            element: <AbhsIndex />,
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
