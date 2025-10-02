import './App.css';
import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
  useNavigate,
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from "react-router-dom";
import StartPage from './Component/AuthComponent/StartPage';

function App() {
  return (
  <>
          <StartPage />

    {/* <BrowserRouter>
      <Routes>
      </Routes>
    </BrowserRouter> */}
  </>
  );
}

export default App;
