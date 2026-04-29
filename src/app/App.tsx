import { RouterProvider } from "react-router";
import { router } from "./routes";

export default function App() {
  // Avoid React Router warning in client-only Vite apps.
  return <RouterProvider router={router} hydrateFallbackElement={<></>} />;
}
