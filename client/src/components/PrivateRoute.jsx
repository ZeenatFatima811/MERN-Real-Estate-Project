import { useSelector } from "react-redux"
import Profile from "../pages/Profile";
import SignIn from "../pages/SignIn";
import { Outlet, Navigate } from "react-router-dom";

export default function PrivateRoute() {
  const {currentUser} = useSelector((state)=> state.user);
  return currentUser ? <Outlet/> : <Navigate to="/sign-in"/>
}
