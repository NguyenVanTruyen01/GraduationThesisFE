// import React from "react";
// import { Route, Navigate, RouteProps } from "react-router-dom";

// interface PrivateRouteProps extends RouteProps {
//   element: React.ComponentType<any>;
//   isAuthenticated: boolean;
// }

// const PrivateRoute: React.FC<PrivateRouteProps> = ({
//   element: Component,
//   isAuthenticated,
//   ...rest
// }) => {
//   return (
//     <Route
//       {...rest}
//       element={isAuthenticated ? <Component /> : <Navigate to="/login" />}
//     />
//   );
// };

// export default PrivateRoute;
