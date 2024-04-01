import { Route, Routes } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import UserPage from "./components/user/UserPage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import AuthContextProvider from "./context/AuthContextProvider";


function App() {
  return (
    <>
      <AuthContextProvider>
        <Routes>
          <Route path="/" element={<LandingPage />}></Route>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/user/*" element={<UserPage />} />
          <Route path="/mockUID" element={<div>your pdf couldn't be generated :(</div>} />
          <Route path="*" element={<div>404 NOT FOUND</div>}></Route>
        </Routes>
      </AuthContextProvider>
    </>
  );
}

export default App;
