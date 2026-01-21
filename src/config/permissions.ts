// Role & Permission Management Configuration

export type UserRole = 'Admin' | 'Manager' | 'Staff';

export type Permission =
  | 'dashboard.view'
  | 'products.view'
  | 'products.create'
  | 'products.edit'
  | 'products.delete'
  | 'categories.manage'
  | 'brands.manage'
  | 'sales.view'
  | 'sales.create'
  | 'sales.edit'
  | 'sales.delete'
  | 'purchases.view'
  | 'purchases.create'
  | 'purchases.edit'
  | 'purchases.delete'
  | 'customers.view'
  | 'customers.manage'
  | 'suppliers.view'
  | 'suppliers.manage'
  | 'stores.view'
  | 'stores.manage'
  | 'expenses.view'
  | 'expenses.create'
  | 'expenses.manage'
  | 'adjustments.view'
  | 'adjustments.create'
  | 'adjustments.manage'
  | 'reports.view'
  | 'users.view'
  | 'users.manage'
  | 'settings.view'
  | 'settings.manage'
  | 'activity.view';

// Define permissions for each role
export const rolePermissions: Record<UserRole, Permission[]> = {
  Admin: [
    'dashboard.view',
    'products.view', 'products.create', 'products.edit', 'products.delete',
    'categories.manage', 'brands.manage',
    'sales.view', 'sales.create', 'sales.edit', 'sales.delete',
    'purchases.view', 'purchases.create', 'purchases.edit', 'purchases.delete',
    'customers.view', 'customers.manage',
    'suppliers.view', 'suppliers.manage',
    'stores.view', 'stores.manage',
    'expenses.view', 'expenses.create', 'expenses.manage',
    'adjustments.view', 'adjustments.create', 'adjustments.manage',
    'reports.view',
    'users.view', 'users.manage',
    'settings.view', 'settings.manage',
    'activity.view',
  ],
  Manager: [
    'dashboard.view',
    'products.view', 'products.create', 'products.edit',
    'categories.manage', 'brands.manage',
    'sales.view', 'sales.create', 'sales.edit',
    'purchases.view', 'purchases.create', 'purchases.edit',
    'customers.view', 'customers.manage',
    'suppliers.view', 'suppliers.manage',
    'stores.view',
    'expenses.view', 'expenses.create',
    'adjustments.view', 'adjustments.create',
    'reports.view',
    'users.view',
    'settings.view',
  ],
  Staff: [
    'dashboard.view',
    'products.view',
    'sales.view', 'sales.create',
    'purchases.view',
    'customers.view',
    'suppliers.view',
    'stores.view',
    'expenses.view',
    'adjustments.view',
  ],
};

// Permission descriptions for UI display
export const permissionDescriptions: Record<Permission, string> = {
  'dashboard.view': 'View Dashboard',
  'products.view': 'View Products',
  'products.create': 'Create Products',
  'products.edit': 'Edit Products',
  'products.delete': 'Delete Products',
  'categories.manage': 'Manage Categories',
  'brands.manage': 'Manage Brands',
  'sales.view': 'View Sales',
  'sales.create': 'Create Sales',
  'sales.edit': 'Edit Sales',
  'sales.delete': 'Delete Sales',
  'purchases.view': 'View Purchases',
  'purchases.create': 'Create Purchases',
  'purchases.edit': 'Edit Purchases',
  'purchases.delete': 'Delete Purchases',
  'customers.view': 'View Customers',
  'customers.manage': 'Manage Customers',
  'suppliers.view': 'View Suppliers',
  'suppliers.manage': 'Manage Suppliers',
  'stores.view': 'View Stores',
  'stores.manage': 'Manage Stores',
  'expenses.view': 'View Expenses',
  'expenses.create': 'Create Expenses',
  'expenses.manage': 'Manage Expenses',
  'adjustments.view': 'View Adjustments',
  'adjustments.create': 'Create Adjustments',
  'adjustments.manage': 'Manage Adjustments',
  'reports.view': 'View Reports',
  'users.view': 'View Users',
  'users.manage': 'Manage Users',
  'settings.view': 'View Settings',
  'settings.manage': 'Manage Settings',
  'activity.view': 'View Activity Log',
};

// Role descriptions
export const roleDescriptions: Record<UserRole, string> = {
  Admin: 'Full system access with user management capabilities',
  Manager: 'Can manage inventory, sales, and view reports',
  Staff: 'Basic access for day-to-day operations',
};

// Role badge colors (Bootstrap classes)
export const roleBadgeColors: Record<UserRole, string> = {
  Admin: 'bg-danger',
  Manager: 'bg-warning text-dark',
  Staff: 'bg-info',
};

// Check if a role has a specific permission
export const hasPermission = (role: UserRole, permission: Permission): boolean => {
  return rolePermissions[role]?.includes(permission) ?? false;
};

// Get all permissions for a role
export const getPermissions = (role: UserRole): Permission[] => {
  return rolePermissions[role] ?? [];
};

// Group permissions by category for display
export const permissionCategories = {
  Dashboard: ['dashboard.view'],
  Products: ['products.view', 'products.create', 'products.edit', 'products.delete', 'categories.manage', 'brands.manage'],
  Sales: ['sales.view', 'sales.create', 'sales.edit', 'sales.delete'],
  Purchases: ['purchases.view', 'purchases.create', 'purchases.edit', 'purchases.delete'],
  People: ['customers.view', 'customers.manage', 'suppliers.view', 'suppliers.manage', 'stores.view', 'stores.manage'],
  Expenses: ['expenses.view', 'expenses.create', 'expenses.manage'],
  Adjustments: ['adjustments.view', 'adjustments.create', 'adjustments.manage'],
  Reports: ['reports.view'],
  Administration: ['users.view', 'users.manage', 'settings.view', 'settings.manage', 'activity.view'],
} as const;
