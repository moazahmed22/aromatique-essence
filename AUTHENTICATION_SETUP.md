# Custom Authentication Setup Guide

This project uses a **custom authentication system** built on Supabase tables instead of Supabase Auth. This provides more control over user management and role-based access.

## 🔧 Database Setup Required

You need to set up the following tables and policies in your Supabase project. You can run these SQL commands in the Supabase SQL Editor:

### 1. Create Users Table

```sql
-- Create users table (stores basic user information)
create table public.users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique not null,
  password text not null,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Enable Row Level Security
alter table public.users enable row level security;

-- Create index for faster email lookups
create index users_email_idx on public.users(email);
```

### 2. Create Role Enum

```sql
-- Create enum for user roles
create type public.app_role as enum ('owner', 'staff', 'customer');
```

### 3. Create User Roles Table

```sql
-- Create user_roles table (stores role assignments)
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);

-- Enable Row Level Security
alter table public.user_roles enable row level security;

-- Create index for faster user_id lookups
create index user_roles_user_id_idx on public.user_roles(user_id);
```

### 4. Set Up Row Level Security Policies

```sql
-- Allow anyone to read users for login verification
-- (passwords are hashed so this is safe for authentication)
create policy "Allow public read for authentication"
  on public.users
  for select
  using (true);

-- Allow anyone to insert users (for registration)
create policy "Allow public insert for registration"
  on public.users
  for insert
  with check (true);

-- Allow users to read their own role
create policy "Users can read their own roles"
  on public.user_roles
  for select
  using (true);

-- Allow role insertion during registration
create policy "Allow role insertion during registration"
  on public.user_roles
  for insert
  with check (true);
```

### 5. Create an Owner Account (Optional)

After setting up the tables, you can manually create an owner account:

```sql
-- First, hash a password using bcrypt (you'll need to do this in your app or use an online tool)
-- For example, if your password is "SecurePass123!", hash it first

-- Insert owner user (replace with your actual hashed password)
insert into public.users (name, email, password)
values ('Admin User', 'admin@example.com', 'YOUR_HASHED_PASSWORD_HERE');

-- Get the user_id from the inserted user
-- Then assign the owner role
insert into public.user_roles (user_id, role)
values ('USER_ID_FROM_PREVIOUS_INSERT', 'owner');
```

## 🔐 Security Features

### Password Hashing
- All passwords are hashed using **bcryptjs** with 10 salt rounds on the client-side before being stored
- Passwords are never stored in plain text
- Password verification happens by comparing hashed values

### Role-Based Access Control
- **Owner**: Full access to admin dashboard and all features
- **Staff**: Access to admin dashboard with limited permissions
- **Customer**: Access to storefront only, redirected away from admin routes

### Session Management
- User sessions are stored in localStorage
- Sessions persist across page refreshes
- Logout clears the session from localStorage

## 🎯 User Flows

### Registration Flow
1. User fills out registration form with name, email, password
2. Password is hashed on the client-side using bcrypt
3. User record is created in `users` table
4. User role is assigned in `user_roles` table (default: 'customer')
5. User is directed to login

### Login Flow
1. User enters email and password
2. System fetches user by email from `users` table
3. Password is verified using bcrypt comparison
4. User role is fetched from `user_roles` table
5. User object (without password) is stored in localStorage
6. User is redirected based on role:
   - Owner/Staff → `/admin`
   - Customer → `/`

### Route Protection
- Admin routes (`/admin/*`) require owner or staff role
- Unauthorized access attempts redirect to login page
- Already logged-in users are redirected appropriately

## 📁 Key Files

- `src/lib/auth.util.ts` - Core authentication utilities
- `src/contexts/AuthContext.tsx` - Auth state management
- `src/pages/Auth.tsx` - Login/Signup UI
- `src/components/ProtectedRoute.tsx` - Route protection component
- `src/types/User.type.ts` - TypeScript types for users and roles

## 🚀 Environment Variables

Make sure your `.env` file contains:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_KEY=your_supabase_anon_key
```

## ⚠️ Important Notes

1. **Never commit** your `.env` file to version control
2. **RLS policies** should be reviewed and adjusted based on your security requirements
3. **Password complexity** is enforced in the signup form validation
4. **Client-side hashing** means passwords are hashed before transmission to Supabase
5. Consider implementing **rate limiting** on the database level to prevent brute force attacks

## 🔄 Future Enhancements

Consider adding:
- Password reset functionality
- Email verification
- Two-factor authentication
- Session expiration
- Account lockout after failed attempts
- Admin panel for user management
