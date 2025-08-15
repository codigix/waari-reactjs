// PrivateRoute.js
import React from 'react';
import { Route, Navigate } from 'react-router-dom';

// export const hasComponentPermission = (permissions, catId, listId) => {
//   return permissions.some((permission) => permission.catId === catId && permission.listId.includes(listId));
// };


export const hasComponentPermission = (permissions, listId) => {
  // Checkingg For If given component have permissions to access ir nott
  return permissions.some((permission) =>  permission.listId.includes(listId));
};


export const hasMenuPermission = (permissions, content) =>  {
  
  const catIds = content.map(content => content.catId)

  for (let i = 0; i < permissions.length; i++) {
      // Check if the current object has the specified catId in its listId array
    if (catIds.includes(permissions[i].catId)) {
          permissions[i].listId.length > 0
          return true; // Return true if found
      }
  }
  return false; // Return false if not found
  
}

export function hasSubMenuPermission(permissions, catId) {
  // Iterate through each object in the permissions array
  // debugger
  for (let i = 0; i < permissions.length; i++) {
      // Check if the current object has the specified catId in its listId array
    if (permissions[i].catId === catId) {
          permissions[i].listId.length > 0
          return true; // Return true if found
      }
  }
  return false; // Return false if not found
}




// const PrivateRoute = ({ element: Element, permissions, requiredPermissions, ...rest }) => {
//   const hasPermission = requiredPermissions.every((perm) => hasComponentPermission(permissions, perm.catId, perm.listId));

//   return (
//     <Route
//       {...rest}
//       element={
//         hasPermission ? (
//           <Element />
//         ) : (
//           <Navigate to="/access-denied" replace />
//         )
//       }
//     />
//   );
// };

// export default PrivateRoute;
