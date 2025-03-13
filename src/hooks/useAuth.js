import {useSelector} from "react-redux";

export function useAuth() {
    const {id, email, username, createdAt, updatedAt, isAuthenticated} = useSelector((state) => state.user);
    return {
        isAuth: isAuthenticated,
        id,
        email,
        username,
        createdAt,
        updatedAt
    }
}