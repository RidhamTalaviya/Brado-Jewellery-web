import { Navigate, Outlet } from 'react-router-dom';
// import Cookies from 'js-cookie';

const PublicRoute = () => {
  const token = true;

  return token ? <Navigate to="/" /> : <Outlet />;
};

export default PublicRoute;
