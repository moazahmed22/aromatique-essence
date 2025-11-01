// User type for custom authentication system
export interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

// Role types
export type UserRole = 'owner' | 'staff' | 'customer';

// User with role information (for frontend use)
export interface UserWithRole extends User {
  role: UserRole;
}
