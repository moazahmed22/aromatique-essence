import { supabase } from "./supabase.util";
import type { User } from "@supabase/supabase-js";

/**
 * Login user using Supabase Auth
 * @param email - User's email address
 * @param password - Plain text password
 * @returns Success status and user data or error message
 */
export async function loginUser(
  email: string,
  password: string
): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase().trim(),
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data.user) {
      return { success: false, error: "Login failed" };
    }

    return { success: true, user: data.user };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "Login failed. Please try again." };
  }
}

/**
 * Sign up user using Supabase Auth
 * @param email - User's email address
 * @param password - Plain text password
 * @returns Success status and user data or error message
 */
export async function signUpUser(
  email: string,
  password: string
): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email: email.toLowerCase().trim(),
      password,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data.user) {
      return { success: false, error: "Sign up failed" };
    }

    return { success: true, user: data.user };
  } catch (error) {
    console.error("Sign up error:", error);
    return { success: false, error: "Sign up failed. Please try again." };
  }
}

/**
 * Get current session from Supabase Auth
 * @returns Session object or null if not logged in
 */
export async function getCurrentSession() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
}

/**
 * Logout current user using Supabase Auth
 */
export async function logoutUser(): Promise<void> {
  try {
    await supabase.auth.signOut();
  } catch (error) {
    console.error("Error logging out:", error);
  }
}
