import { PERMISSIONS } from './permissions';

export const hasPermission = (permission) => {
  const userRole = getUserRole();
  const userPermissions = PERMISSIONS[userRole] || [];
  return userPermissions.includes(permission);
};

export const getUserRole = () => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    const { role } = JSON.parse(userInfo);
    return role;
  }
  return null; // or a default role
};
