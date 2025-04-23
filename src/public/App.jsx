import './App.css';
import Navbar from "./components/Navbar";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import Main from "./pages/Main.jsx";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Profile from "./pages/Profile.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";
import AddAdminPanel from "./pages/AddAdminPanel.jsx";
import UpdateUserPanel from "./pages/UpdateUserPanel.jsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={
                    <>
                        <Navbar />
                        <Main />
                    </>
                } />
                <Route path="/login" element={<Login />} />
                <Route path="/registration" element={<Registration />} />
                <Route path="/profile" element={<Profile/>} />
                <Route path="/admin-panel" element={<AdminPanel/>} />
                <Route path="/add-admin-panel" element={<AddAdminPanel/>} />
                <Route path="/update-user/:id" element={<UpdateUserPanel />} />
            </Routes>
        </Router>
    );
}

export default App;