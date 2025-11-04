import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { loginUser, hasDashboardAccess } from "@/lib/auth.util";
import { useAuth } from "@/contexts/AuthContext";

// Validation schema for login only
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Auth() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  if (user) {
    // Redirect based on role
    if (hasDashboardAccess(user)) {
      navigate("/admin");
    } else {
      navigate("/");
    }
    return null;
  }

  // Login form
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Handle login with custom authentication
  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);

    try {
      const {
        success,
        user: loggedInUser,
        error,
      } = await loginUser(data.email, data.password);

      if (!success || !loggedInUser) {
        toast({
          title: "Login Failed",
          description: error || "Invalid credentials",
          variant: "destructive",
        });
        return;
      }

      // Update auth context
      setUser(loggedInUser);

      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });

      // Redirect based on role
      if (hasDashboardAccess(loggedInUser)) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-accent/10 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center">
            Aromatique
          </CardTitle>
          <CardDescription className="text-center">
            Welcome back! Please login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={loginForm.handleSubmit(handleLogin)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                type="email"
                placeholder="your@email.com"
                {...loginForm.register("email")}
                disabled={isLoading}
              />
              {loginForm.formState.errors.email && (
                <p className="text-sm text-destructive">
                  {loginForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="login-password">Password</Label>
              <Input
                id="login-password"
                type="password"
                placeholder="••••••••"
                {...loginForm.register("password")}
                disabled={isLoading}
              />
              {loginForm.formState.errors.password && (
                <p className="text-sm text-destructive">
                  {loginForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
