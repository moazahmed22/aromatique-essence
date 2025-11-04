# Supabase Authentication Setup

This application uses **Supabase Authentication** for user management. All authentication, password management, and sessions are handled by Supabase's built-in `auth.users` system.

## Setup Instructions

### 1. Supabase Configuration

Ensure your Supabase project is properly configured with the following environment variables in your `.env` file:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_KEY=your_supabase_anon_key
```

### 2. Authentication Flow

The app uses the following Supabase Auth methods:

- **Login**: `supabase.auth.signInWithPassword({ email, password })`
- **Sign Up**: `supabase.auth.signUp({ email, password })`
- **Session Management**: `supabase.auth.getSession()`
- **Sign Out**: `supabase.auth.signOut()`

### 3. Protected Routes

All admin/dashboard routes are protected and require authentication:
- Unauthenticated users are automatically redirected to `/auth` (login page)
- The `ProtectedRoute` component checks for valid Supabase sessions
- Any authenticated user can access the dashboard

### 4. Creating Admin Users

To create users with access to the dashboard:

1. **Via Supabase Dashboard**:
   - Go to Authentication > Users
   - Click "Invite user" or "Add user"
   - Enter email and password

2. **Via Sign-Up API** (if enabled in your Supabase settings):
   ```ts
   const { data, error } = await supabase.auth.signUp({
     email: 'user@example.com',
     password: 'securepassword123',
   });
   ```

3. **Via SQL** (for testing):
   ```sql
   -- Note: This is for development only
   -- In production, use Supabase Auth Dashboard or API
   ```

### 5. Email Configuration

Configure email settings in your Supabase project:

1. Go to **Authentication > Email Templates**
2. Customize the confirmation and password reset emails
3. Set up your SMTP settings or use Supabase's default email service
4. **Optional**: Disable email confirmation for faster development (Authentication > Providers > Email > Confirm email)

### 6. URL Configuration

Set the following URLs in Supabase Dashboard under **Authentication > URL Configuration**:

- **Site URL**: Your application URL (e.g., `https://yourdomain.com`)
- **Redirect URLs**: Add both your local development URL and production URL
  - `http://localhost:5173`
  - `http://localhost:5173/`
  - `https://yourdomain.com`
  - `https://yourdomain.com/`

## 🔐 Security Features

✅ **Secure Password Storage**: Supabase handles password hashing with bcrypt automatically
✅ **Session Management**: Automatic token refresh and session persistence via localStorage
✅ **Email Verification**: Can be enabled in Supabase settings
✅ **Password Reset**: Built-in password reset flow
✅ **Rate Limiting**: Supabase provides built-in rate limiting for auth endpoints
✅ **Row Level Security (RLS)**: Use Supabase RLS policies for data access control

## 🎯 User Flows

### Login Flow
1. User enters email and password at `/auth`
2. System calls `supabase.auth.signInWithPassword()`
3. Supabase validates credentials and returns session
4. Session is stored automatically by Supabase client
5. User is redirected to `/admin` dashboard

### Session Persistence
- Sessions are automatically persisted in localStorage by Supabase
- `onAuthStateChange` listener keeps auth state in sync
- Sessions refresh automatically before expiration
- Logout calls `supabase.auth.signOut()` and clears the session

### Route Protection
- Admin routes (`/admin/*`) require valid authentication
- Unauthorized access attempts redirect to `/auth` login page
- Already logged-in users can access the dashboard immediately

## 📁 Key Files

- `src/lib/auth.util.ts` - Authentication utilities using Supabase Auth
- `src/lib/supabase.util.ts` - Supabase client configuration
- `src/contexts/AuthContext.tsx` - Auth state management with session handling
- `src/pages/Auth.tsx` - Login UI
- `src/components/ProtectedRoute.tsx` - Route protection component

## 🔄 Future Enhancements

For **role-based access control** (e.g., admin, staff, customer roles):

1. Create a `user_roles` table:
   ```sql
   create type public.app_role as enum ('admin', 'moderator', 'user');
   
   create table public.user_roles (
     id uuid primary key default gen_random_uuid(),
     user_id uuid references auth.users(id) on delete cascade not null,
     role app_role not null,
     unique (user_id, role)
   );
   
   alter table public.user_roles enable row level security;
   ```

2. Create a security definer function:
   ```sql
   create or replace function public.has_role(_user_id uuid, _role app_role)
   returns boolean
   language sql
   stable
   security definer
   set search_path = public
   as $$
     select exists (
       select 1
       from public.user_roles
       where user_id = _user_id
         and role = _role
     )
   $$;
   ```

3. Use RLS policies with the function:
   ```sql
   create policy "Admins can access"
   on public.some_table
   for select
   to authenticated
   using (public.has_role(auth.uid(), 'admin'));
   ```

Other enhancements to consider:
- Two-factor authentication (Supabase supports MFA)
- Social login (Google, GitHub, etc.)
- Magic link authentication
- Session expiration customization
- Admin panel for user management

## ⚠️ Important Notes

1. **Never commit** your `.env` file to version control
2. **Email verification** can be disabled during development for easier testing
3. **Supabase handles** all password hashing and security automatically
4. **Sessions are managed** by Supabase client - no manual localStorage handling needed
5. **RLS policies** should be configured for any custom tables you create

## 🐛 Troubleshooting

- **Sessions not persisting**: Ensure localStorage is enabled in browser
- **Email not sending**: Verify SMTP configuration in Supabase Dashboard
- **Redirects failing**: Check that all URLs are added to allowed redirect URLs
- **Login fails**: Check console for error messages and verify Supabase credentials
