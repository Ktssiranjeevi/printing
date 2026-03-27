import { useNavigate } from 'react-router';
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import AppShell from '../components/layout/AppShell';
import PageIntro from '../components/layout/PageIntro';
import { useCart } from '../contexts/CartContext';

export default function Cart() {
  const navigate = useNavigate();
  const { items, itemCount, subtotal, removeItem, updateQuantity } = useCart();

  const shipping = items.length > 0 ? 149 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <AppShell>
      <PageIntro
        title="Shopping cart"
        description="Review your selected designs before moving into checkout."
      />
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="flex-1">
            {items.length === 0 ? (
              <Card className="border-dashed bg-white">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <ShoppingBag className="mb-4 h-10 w-10 text-slate-400" />
                  <h2 className="text-xl font-semibold text-slate-900">Your cart is empty</h2>
                  <p className="mt-2 max-w-md text-sm text-slate-600">
                    Add a design from the catalog or the designing area and it will appear here.
                  </p>
                  <Button className="mt-6" onClick={() => navigate('/')}>
                    Browse products
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <Card key={`${item.id}-${item.size}-${item.color}`} className="border-0 bg-white shadow-sm">
                    <CardContent className="p-5">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-24 w-24 rounded-2xl object-cover"
                        />
                        <div className="flex-1">
                          <h2 className="text-lg font-semibold text-slate-900">{item.name}</h2>
                          <p className="text-sm text-slate-500">{item.brand}</p>
                          <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-600">
                            <span>Size: {item.size}</span>
                            <span>Color: {item.color}</span>
                            <span>Rs. {item.price.toFixed(2)}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex items-center gap-4 sm:flex-col sm:items-end">
                          <p className="text-lg font-semibold text-slate-900">
                            Rs. {(item.price * item.quantity).toFixed(2)}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="w-full lg:max-w-sm">
              <Card className="sticky top-4 border-0 bg-white shadow-sm">
                <CardHeader>
                  <CardTitle>Order summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Items ({itemCount})</span>
                    <span>Rs. {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Shipping</span>
                    <span>Rs. {shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Tax</span>
                    <span>Rs. {tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-semibold text-slate-900">
                      <span>Total</span>
                      <span>Rs. {total.toFixed(2)}</span>
                    </div>
                  </div>
                  <Button className="w-full" size="lg" onClick={() => navigate('/order')}>
                    Proceed to checkout
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
    </AppShell>
  );
}
