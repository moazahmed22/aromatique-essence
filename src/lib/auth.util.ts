import { supabase } from "./supabase.util";
import type { User, UserRole, UserWithRole } from "@/types/User.type";
import bcrypt from "bcryptjs"; 

const SALT_ROUNDS = 10;
const STORAGE_KEY = "currentUser";

/**
 * Register a new user with hashed password
 * @param name - User's full name
 * @param email - User's email address
 * @param password - Plain text password (will be hashed)
 * @param role - User role (default: 'customer')
 * @returns Success status and user data or error message
 */
export async function registerUser(
  name: string,
  email: string,
  password: string,
  role: UserRole = "customer"
): Promise<{ success: boolean; user?: UserWithRole; error?: string }> {
  try {
    // Hash password on client side before sending to database
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Insert new user into users table
    const { data: userData, error: userError } = await supabase
      .from("users")
      .insert([
        {
          name,
          email: email.toLowerCase().trim(),
          password: hashedPassword,
        },
      ])
      .select()
      .single();

    if (userError) {
      // Check for duplicate email
      if (userError.code === "23505") {
        return { success: false, error: "Email already registered" };
      }
      return { success: false, error: userError.message };
    }

    // Insert user role into user_roles table
    const { error: roleError } = await supabase.from("user_roles").insert([
      {
        user_id: userData.id,
        role,
      },
    ]);

    if (roleError) {
      // If role insertion fails, we should clean up the user
      await supabase.from("users").delete().eq("id", userData.id);
      return { success: false, error: "Failed to assign user role" };
    }

    // Create user object without password
    const user: UserWithRole = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      created_at: userData.created_at,
      updated_at: userData.updated_at,
      role,
    };

    return { success: true, user };
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, error: "Registration failed. Please try again." };
  }
}

/**
 * Login user by verifying email and password
 * @param email - User's email address
 * @param password - Plain text password
 * @returns Success status and user data or error message
 */
export async function loginUser(
  email: string,
  password: string
): Promise<{ success: boolean; user?: UserWithRole; error?: string }> {
  try {
    // Fetch user by email
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email.toLowerCase().trim())
      .single();

    if (userError || !userData) {
      return { success: false, error: "Invalid email or password" };
    }

    // Verify password locally using bcrypt
    const passwordMatch = await bcrypt.compare(password, userData.password);

    if (!passwordMatch) {
      return { success: false, error: "Invalid email or password" };
    }

    // Fetch user role
    const { data: roleData, error: roleError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.id)
      .single();

    if (roleError || !roleData) {
      return { success: false, error: "Failed to fetch user role" };
    }

    // Create user object without password
    const user: UserWithRole = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      created_at: userData.created_at,
      updated_at: userData.updated_at,
      role: roleData.role as UserRole,
    };

    // Store user in localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));

    return { success: true, user };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "Login failed. Please try again." };
  }
}

/**
 * Get currently logged in user from localStorage
 * @returns User object or null if not logged in
 */
export function getCurrentUser(): UserWithRole | null {
  try {
    const userJson = localStorage.getItem(STORAGE_KEY);
    if (!userJson) return null;

    return JSON.parse(userJson) as UserWithRole;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

/**
 * Logout current user by clearing localStorage
 */
export function logoutUser(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Check if user has access to dashboard (admin panel)
 * @param user - User object with role
 * @returns true if user is owner or staff
 */
export function hasDashboardAccess(user: UserWithRole | null): boolean {
  return user?.role === "owner" || user?.role === "staff";
}

/**
 * Update user session in localStorage
 * Useful when user data changes
 */
export function updateUserSession(user: UserWithRole): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}
