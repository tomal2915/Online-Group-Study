import { useContext } from "react";
import { context } from "../components/Context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";


const PrivetRoutes = ({ children }) => {

  const { user, loading } = useContext(context);

  const location = useLocation()

  if (loading) {
    return <div className="max-w-7xl mx-auto mt-20 text-center">
      <span className="loading loading-dots loading-xs"></span>
      <span className="loading loading-dots loading-sm"></span>
      <span className="loading loading-dots loading-md"></span>
      <span className="loading loading-dots loading-lg"></span>
    </div>
  }

  if (user) {
    return children;
  }

  return (
    <Navigate state={location.pathname} to='/signIn'></Navigate>
  )
}

export default PrivetRoutes