import { signOut } from "firebase/auth";
import { auth } from "../../firebaseConfig.js";
import { logout } from "../../redux/slices/userSlice.js";
import Cookies from "js-cookie";

const handleLogout = async (dispatch) => {
    try {
        await signOut(auth);
        dispatch(logout());
        Cookies.remove('user');
        alert("Вы успешно вышли из системы!");
    } catch (error) {
        console.error("Ошибка выхода:", error);
        alert("Ошибка при выходе из системы. Пожалуйста, попробуйте еще раз.");
    }
};

export default handleLogout;