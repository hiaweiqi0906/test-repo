const allRoles = {
  user: [
    // Manage Items
    'manageItems'
  ],
  admin: [
    // Manage Users
    'getUsers', 'manageUsers', 

    // Manage Items
    'manageItems', 
  ],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
