import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function PrivateRoute({ element }) {
  const user = useSelector((state) => state.auth.user);
  console.log('user',user)
  return user ? element : <Navigate to="/" />;
}

export default PrivateRoute;
