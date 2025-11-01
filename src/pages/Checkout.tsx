import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase.util";

type shippingFormType = {
  firstName: string;
  lastName: string;
  email: string;
  phone: number | string;
  address: string;
  city: string;
  postalCode: string;
};

type paymentFormType = {
  cardNumber: string | number;
  expiryDate: string | number;
  cvv: string | number;
};

const Checkout = () => {
  const { items, total, clearCart } = useCart();
  // use shipping form for the admin dashboard
  const [shippingFormData, setShippingFormData] = useState<shippingFormType>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });

  // use payment form for the future integration (checking)
  const [paymentFormData, setPaymentFormData] = useState<paymentFormType>({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  // TODO: Connect to Supabase for order processing and Stripe for payments
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length > 0) {
      const { data, error } = await supabase
        .from("orders")
        .insert([
          {
            order_id: `ORD-${new Date().getTime() % 1000}`,
            customer_name: `${shippingFormData.firstName} ${shippingFormData.firstName}`,
            customer_email: `${shippingFormData.email}`,
            items: items,
            total: total,
            shipping_address: `${shippingFormData.address}, ${shippingFormData.city}, ${shippingFormData.postalCode}`,
          },
        ])
        .select();

      console.log(data, error);
      if (error) {
        toast({
          title: "Failed to place order",
          description: "Please try again shortly.",
        });
      }
      if (data) {
        toast({
          title: "Order placed successfully!",
          description: "You will receive a confirmation email shortly.",
        });
        setTimeout(() => {
          clearCart();
        }, 2000);
      }
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-heading font-bold mb-4">
            No Items to Checkout
          </h1>
          <p className="text-muted-foreground mb-8">
            Add some fragrances to your cart first
          </p>
          <Link to="/shop">
            <Button size="lg">Browse Collection</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-heading font-bold mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Information */}
              <Card className="shadow-elegant">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-heading font-semibold mb-6">
                    Shipping Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        First Name
                      </label>
                      <Input
                        type="text"
                        required
                        value={shippingFormData.firstName}
                        onChange={(e) =>
                          setShippingFormData({
                            ...shippingFormData,
                            firstName: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Last Name
                      </label>
                      <Input
                        type="text"
                        required
                        value={shippingFormData.lastName}
                        onChange={(e) =>
                          setShippingFormData({
                            ...shippingFormData,
                            lastName: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Email
                      </label>
                      <Input
                        type="email"
                        required
                        value={shippingFormData.email}
                        onChange={(e) =>
                          setShippingFormData({
                            ...shippingFormData,
                            email: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Phone
                      </label>
                      <Input
                        type="tel"
                        required
                        value={shippingFormData.phone}
                        onChange={(e) =>
                          setShippingFormData({
                            ...shippingFormData,
                            phone: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">
                        Address
                      </label>
                      <Input
                        type="text"
                        required
                        value={shippingFormData.address}
                        onChange={(e) =>
                          setShippingFormData({
                            ...shippingFormData,
                            address: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        City
                      </label>
                      <Input
                        type="text"
                        required
                        value={shippingFormData.city}
                        onChange={(e) =>
                          setShippingFormData({
                            ...shippingFormData,
                            city: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Postal Code
                      </label>
                      <Input
                        type="text"
                        required
                        value={shippingFormData.postalCode}
                        onChange={(e) =>
                          setShippingFormData({
                            ...shippingFormData,
                            postalCode: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card className="shadow-elegant">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-heading font-semibold mb-6">
                    Payment Information
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Card Number
                      </label>
                      <Input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        required
                        minLength={16}
                        maxLength={16}
                        value={paymentFormData.cardNumber}
                        onChange={(e) =>
                          setPaymentFormData({
                            ...paymentFormData,
                            cardNumber: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Expiry Date
                        </label>
                        <Input
                          type="text"
                          placeholder="MM/YY"
                          required
                          value={paymentFormData.expiryDate}
                          onChange={(e) =>
                            setPaymentFormData({
                              ...paymentFormData,
                              expiryDate: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          CVV
                        </label>
                        <Input
                          type="text"
                          placeholder="123"
                          required
                          maxLength={3}
                          value={paymentFormData.cvv}
                          onChange={(e) =>
                            setPaymentFormData({
                              ...paymentFormData,
                              cvv: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="shadow-luxury sticky top-24">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-heading font-bold mb-6">
                    Order Summary
                  </h2>

                  <div className="space-y-4 mb-6">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between text-sm"
                      >
                        <span className="text-muted-foreground">
                          {item.name} x {item.quantity}
                        </span>
                        <span className="font-medium">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 mb-6 border-t pt-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-semibold">
                        ₹{total.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-semibold">Free</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between text-lg">
                        <span className="font-semibold">Total</span>
                        <span className="font-bold text-primary">
                          ₹{total.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button type="submit" size="lg" className="w-full">
                    Place Order
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
