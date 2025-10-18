import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

export const Newsletter = () => {
  const [email, setEmail] = useState("");

  // TODO: Connect to Supabase newsletter subscription table
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({
        title: "Subscribed!",
        description: "Thank you for subscribing to our newsletter.",
      });
      setEmail("");
    }
  };

  return (
    <section className="bg-gradient-gold py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-primary-foreground">
          Subscribe to Our Newsletter
        </h2>
        <p className="text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
          Be the first to discover new fragrances, exclusive offers, and insider perfume tips.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 bg-background"
          />
          <Button type="submit" variant="secondary" className="font-semibold">
            Subscribe
          </Button>
        </form>
      </div>
    </section>
  );
};
