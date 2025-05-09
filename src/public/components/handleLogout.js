import { signOut } from "firebase/auth";
import { auth } from "../../firebaseConfig.js";
import { logout } from "../../redux/slices/userSlice.js";
import { clearCurrentTrack } from "../../redux/slices/tracksSlice.js";
import Cookies from "js-cookie";

const handleLogout = async (dispatch, navigate) => {
    try {
        await signOut(auth);
        dispatch(logout());
        dispatch(clearCurrentTrack());

        const allCookies = Cookies.get();
        Object.keys(allCookies).forEach(cookieName => {
            Cookies.remove(cookieName, { path: '/' });
        });

        localStorage.removeItem('currentTrack');

        alert("Вы успешно вышли из системы!");
        navigate('/');
    } catch (error) {
        console.error("Ошибка выхода:", error);
        alert("Ошибка при выходе из системы. Пожалуйста, попробуйте еще раз.");
    }
};

export default handleLogout;