import { createBrowserRouter, RouterProvider } from "react-router";
import { createRoot } from "react-dom/client";
import Home from "@/pages/Home";
import "@/styles/global.css";

import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
]);

// PrimeReact configuration
// const value = {
//   ripple: true,
//   inputStyle: 'outlined' as const,
//   buttonStyle: 'outlined',
//   ptOptions: {
//     mergeSections: true,
//     mergeProps: true,
//   },
// };

createRoot(document.getElementById("root")!).render(
  <PrimeReactProvider>
    <RouterProvider router={router} />
  </PrimeReactProvider>
);
