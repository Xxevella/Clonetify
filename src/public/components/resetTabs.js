import { resetTab } from "../../redux/slices/tabSlice.js";

const resetTabs = (dispatch, navigate) => {
    dispatch(resetTab());
    navigate('/');
};

export default resetTabs;