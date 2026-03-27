import { FormEvent, useState } from 'react';
import { CheckCircle2, Clock3, Truck } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import AppShell from '../components/layout/AppShell';
import PageIntro from '../components/layout/PageIntro';
import { useCart } from '../contexts/CartContext';
import { useAppData, type OrderRecord } from '../contexts/AppDataContext';

export default function Order() {
  const { items, subtotal, clearCart, itemCount } = useCart();
  const { orders, createOrder } = useAppData();
  const [activeTab, setActiveTab] = useState<'checkout' | 'history'>('checkout');
  const [searchTerm, setSearchTerm] = useState('');

  const shipping = items.length > 0 ? 149 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handlePlaceOrder = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (items.length === 0) {
      return;
    }

    const formData = new FormData(event.currentTarget);

    createOrder({
      customerName: String(formData.get('fullName') || ''),
      customerEmail: String(formData.get('email') || ''),
      items,
      total,
      itemCount,
    });
    clearCart();
    setActiveTab('history');
  };

  const filteredOrders = orders.filter((order) =>
    order.id.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getStatusIcon = (status: OrderRecord['status']) => {
    switch (status) {
      case 'Delivered':
        return <CheckCircle2 className="h-5 w-5 text-emerald-600" />;
      case 'Dispatched':
        return <Truck className="h-5 w-5 text-blue-600" />;
      default:
        return <Clock3 className="h-5 w-5 text-amber-600" />;
    }
  };

  return (
    <AppShell>
      <PageIntro
        title="Orders"
        description="Complete checkout or review your recent purchases from the same order workspace."
      />
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-3">
            <Button
              variant={activeTab === 'checkout' ? 'default' : 'outline'}
              onClick={() => setActiveTab('checkout')}
            >
              Checkout
            </Button>
            <Button
              variant={activeTab === 'history' ? 'default' : 'outline'}
              onClick={() => setActiveTab('history')}
            >
              Order history
            </Button>
          </div>
        </div>

        {activeTab === 'checkout' ? (
          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            <Card className="border-0 bg-white shadow-sm">
              <CardHeader>
                <CardTitle>Shipping and payment</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="grid gap-4 sm:grid-cols-2" onSubmit={handlePlaceOrder}>
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full name</Label>
                    <Input id="fullName" name="fullName" placeholder="Enter your full name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input id="email" name="email" type="email" placeholder="Enter your email" required />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" placeholder="Street address" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="City" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal code</Label>
                    <Input id="postalCode" placeholder="Postal code" required />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="cardNumber">Card number</Label>
                    <Input id="cardNumber" placeholder="1234 5678 9012 3456" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry</Label>
                    <Input id="expiry" placeholder="MM/YY" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input id="cvv" placeholder="123" required />
                  </div>
                  <div className="sm:col-span-2">
                    <Button className="w-full" size="lg" type="submit" disabled={items.length === 0}>
                      Place order
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white shadow-sm">
              <CardHeader>
                <CardTitle>Checkout summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.length > 0 ? (
                  <>
                    {items.map((item) => (
                      <div key={`${item.id}-${item.size}-${item.color}`} className="flex justify-between gap-4 text-sm">
                        <div>
                          <p className="font-medium text-slate-900">{item.name}</p>
                          <p className="text-slate-500">
                            {item.quantity} x Rs. {item.price.toFixed(2)}
                          </p>
                        </div>
                        <p className="font-medium text-slate-900">
                          Rs. {(item.quantity * item.price).toFixed(2)}
                        </p>
                      </div>
                    ))}
                    <div className="border-t pt-4 text-sm">
                      <div className="flex justify-between text-slate-600">
                        <span>Subtotal</span>
                        <span>Rs. {subtotal.toFixed(2)}</span>
                      </div>
                      <div className="mt-2 flex justify-between text-slate-600">
                        <span>Shipping</span>
                        <span>Rs. {shipping.toFixed(2)}</span>
                      </div>
                      <div className="mt-2 flex justify-between text-slate-600">
                        <span>Tax</span>
                        <span>Rs. {tax.toFixed(2)}</span>
                      </div>
                      <div className="mt-4 flex justify-between text-lg font-semibold text-slate-900">
                        <span>Total</span>
                        <span>Rs. {total.toFixed(2)}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-slate-600">
                    Your cart is empty. Add a design before checking out.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-4">
            <Input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by order ID"
              className="max-w-sm bg-white"
            />

            {filteredOrders.map((order) => (
              <Card key={order.id} className="border-0 bg-white shadow-sm">
                <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    {getStatusIcon(order.status)}
                    <div>
                      <h2 className="font-semibold text-slate-900">{order.id}</h2>
                      <p className="text-sm text-slate-500">{order.date}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                    <span>{order.itemCount} item(s)</span>
                    <span>{order.status}</span>
                    <span className="font-semibold text-slate-900">Rs. {order.total.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
    </AppShell>
  );
}

