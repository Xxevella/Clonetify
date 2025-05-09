import './App.css';
import Navbar from "./components/Navbar";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import Main from "./pages/Main.jsx";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Profile from "./pages/Profile.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";
import AddAdminPanel from "./pages/AddAdminPanel.jsx";
import UpdateUserPanel from "./pages/UpdateUserPanel.jsx";
import ArtistPanel from "./pages/ArtistPanel/ArtistPanel.jsx";
import { useSelector } from 'react-redux';

function App() {
    const user = useSelector((state) => state.user);

    const AdminRoute = ({ element }) => {
        return user.role === 'admin' ? element : <Navigate to="/" />;
    };

    const ArtistRoute = ({ element }) => {
        return user.role === 'artist' ? element : <Navigate to="/" />;
    };

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
                <Route path="/profile" element={<Profile />} />
                <Route path="/admin-panel" element={<AdminRoute element={<AdminPanel />} />} />
                <Route path="/add-admin-panel" element={<AdminRoute element={<AddAdminPanel />} />} />
                <Route path="/update-user/:id" element={<AdminRoute element={<UpdateUserPanel />} />} />
                <Route path="/artist-panel" element={<ArtistRoute element={<ArtistPanel />} />} />
            </Routes>
        </Router>
    );
}

export default App;