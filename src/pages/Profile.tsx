import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Edit, LogOut, Mail, MapPin, Package, Palette, Phone, ShoppingCart, UserRound } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Textarea } from '../components/ui/textarea';
import AppShell from '../components/layout/AppShell';
import PageIntro from '../components/layout/PageIntro';
import { useCart } from '../contexts/CartContext';
import { useDesignTabs } from '../contexts/DesignTabsContext';
import { useAuth } from '../contexts/AuthContext';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Fix for default markers in webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function LocationMarker({ position, setPosition }: { position: [number, number]; setPosition: (pos: [number, number]) => void }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return <Marker draggable position={position} eventHandlers={{
    dragend(event) {
      const marker = event.target;
      const { lat, lng } = marker.getLatLng();
      setPosition([lat, lng]);
    },
  }} />;
}

type ProfileFormState = {
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  landmark: string;
  latitude: number;
  longitude: number;
};

const DEFAULT_POSITION: [number, number] = [13.0827, 80.2707];

function buildProfileForm(user: ReturnType<typeof useAuth>['storefrontUser']): ProfileFormState {
  return {
    phone: user?.phone || '',
    addressLine1: user?.addressLine1 || user?.address || '',
    addressLine2: user?.addressLine2 || '',
    city: user?.city || '',
    state: user?.state || '',
    postalCode: user?.postalCode || '',
    country: user?.country || 'India',
    landmark: user?.landmark || '',
    latitude: user?.latitude ?? DEFAULT_POSITION[0],
    longitude: user?.longitude ?? DEFAULT_POSITION[1],
  };
}

function formatAddress(form: ProfileFormState) {
  return [
    form.addressLine1,
    form.addressLine2,
    form.landmark && `Near ${form.landmark}`,
    [form.city, form.state, form.postalCode].filter(Boolean).join(', '),
    form.country,
  ]
    .filter(Boolean)
    .join(', ');
}

export default function Profile() {
  const navigate = useNavigate();
  const { itemCount } = useCart();
  const { tabs } = useDesignTabs();
  const { storefrontUser, logoutStorefront, updateStorefrontProfile } = useAuth();

  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [profileForm, setProfileForm] = useState<ProfileFormState>(() => buildProfileForm(storefrontUser));

  useEffect(() => {
    setProfileForm(buildProfileForm(storefrontUser));
  }, [storefrontUser]);

  const formattedAddress = useMemo(() => {
    if (!storefrontUser) {
      return '';
    }

    return (
      storefrontUser.address ||
      formatAddress(buildProfileForm(storefrontUser))
    );
  }, [storefrontUser]);

  const handleOpenDesignArea = () => {
    navigate('/my-designs');
  };

  const handleSaveAddress = () => {
    updateStorefrontProfile({
      phone: profileForm.phone.trim(),
      addressLine1: profileForm.addressLine1.trim(),
      addressLine2: profileForm.addressLine2.trim(),
      city: profileForm.city.trim(),
      state: profileForm.state.trim(),
      postalCode: profileForm.postalCode.trim(),
      country: profileForm.country.trim(),
      landmark: profileForm.landmark.trim(),
      address: formatAddress(profileForm),
      latitude: profileForm.latitude,
      longitude: profileForm.longitude,
    });
    setIsEditingAddress(false);
  };

  const handleLogout = () => {
    logoutStorefront();
    navigate('/');
  };

  const updateField = <K extends keyof ProfileFormState>(key: K, value: ProfileFormState[K]) => {
    setProfileForm((current) => ({ ...current, [key]: value }));
  };

  return (
    <AppShell>
      <PageIntro
        title="Your profile"
        description="Manage your designs, orders, and shopping flow from one shared workspace."
        action={<Button onClick={() => navigate('/')}>Browse catalog</Button>}
        eyebrow={
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <UserRound className="h-8 w-8 text-blue-700" />
          </div>
        }
      />
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-0 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-blue-600" />
              Saved designs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-3xl font-bold text-slate-900">{tabs.length}</p>
            <p className="text-sm text-slate-600">
              Open design tab{tabs.length === 1 ? '' : 's'} ready for editing and sharing.
            </p>
            <Button variant="outline" className="w-full" onClick={handleOpenDesignArea}>
              View my designs
            </Button>
          </CardContent>
        </Card>

        <Card className="border-0 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-blue-600" />
              Cart items
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-3xl font-bold text-slate-900">{itemCount}</p>
            <p className="text-sm text-slate-600">
              Items currently waiting for checkout.
            </p>
            <Button variant="outline" className="w-full" onClick={() => navigate('/cart')}>
              Review cart
            </Button>
          </CardContent>
        </Card>

        <Card className="border-0 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-600" />
              Orders
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-3xl font-bold text-slate-900">2+</p>
            <p className="text-sm text-slate-600">
              Track your purchases and complete checkout in one place.
            </p>
            <Button variant="outline" className="w-full" onClick={() => navigate('/order')}>
              View orders
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <Card className="border-0 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              Contact and address
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-slate-200 p-4">
                <p className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Mail className="h-4 w-4 text-slate-500" />
                  Email
                </p>
                <p className="text-sm text-slate-600">{storefrontUser?.email || 'No email found'}</p>
              </div>
              <div className="rounded-xl border border-slate-200 p-4">
                <p className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Phone className="h-4 w-4 text-slate-500" />
                  Phone
                </p>
                <p className="text-sm text-slate-600">{storefrontUser?.phone || 'No phone number added'}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-900">Saved address</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {formattedAddress || 'No address set yet. Add your delivery address and pin it on the map.'}
              </p>
              {(storefrontUser?.latitude !== undefined || storefrontUser?.longitude !== undefined) && (
                <p className="mt-3 text-xs text-slate-500">
                  Map pin: {Number(profileForm.latitude).toFixed(5)}, {Number(profileForm.longitude).toFixed(5)}
                </p>
              )}
            </div>

            <Dialog
              open={isEditingAddress}
              onOpenChange={(open) => {
                setIsEditingAddress(open);
                if (open) {
                  setProfileForm(buildProfileForm(storefrontUser));
                }
              }}
            >
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit profile address
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Edit address details</DialogTitle>
                </DialogHeader>
                <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone number</Label>
                      <Input
                        id="phone"
                        value={profileForm.phone}
                        onChange={(event) => updateField('phone', event.target.value)}
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="addressLine1">Address line 1</Label>
                      <Input
                        id="addressLine1"
                        value={profileForm.addressLine1}
                        onChange={(event) => updateField('addressLine1', event.target.value)}
                        placeholder="House number, street, area"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="addressLine2">Address line 2</Label>
                      <Textarea
                        id="addressLine2"
                        value={profileForm.addressLine2}
                        onChange={(event) => updateField('addressLine2', event.target.value)}
                        placeholder="Apartment, floor, building details"
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={profileForm.city}
                          onChange={(event) => updateField('city', event.target.value)}
                          placeholder="City"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          value={profileForm.state}
                          onChange={(event) => updateField('state', event.target.value)}
                          placeholder="State"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="postalCode">Postal code</Label>
                        <Input
                          id="postalCode"
                          value={profileForm.postalCode}
                          onChange={(event) => updateField('postalCode', event.target.value)}
                          placeholder="Postal code"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Input
                          id="country"
                          value={profileForm.country}
                          onChange={(event) => updateField('country', event.target.value)}
                          placeholder="Country"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="landmark">Landmark</Label>
                      <Input
                        id="landmark"
                        value={profileForm.landmark}
                        onChange={(event) => updateField('landmark', event.target.value)}
                        placeholder="Nearby landmark"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="overflow-hidden rounded-2xl border border-slate-200">
                      <div className="h-72 bg-slate-100">
                        <MapContainer
                          center={[profileForm.latitude, profileForm.longitude]}
                          zoom={13}
                          style={{ height: '100%', width: '100%' }}
                        >
                          <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          />
                          <LocationMarker
                            position={[profileForm.latitude, profileForm.longitude]}
                            setPosition={(position) => {
                              updateField('latitude', position[0]);
                              updateField('longitude', position[1]);
                            }}
                          />
                        </MapContainer>
                      </div>
                    </div>
                    <p className="text-xs leading-5 text-slate-500">
                      Click anywhere on the map or drag the marker to set the exact delivery location.
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="latitude">Latitude</Label>
                        <Input
                          id="latitude"
                          value={profileForm.latitude}
                          onChange={(event) => updateField('latitude', Number(event.target.value) || 0)}
                          placeholder="Latitude"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="longitude">Longitude</Label>
                        <Input
                          id="longitude"
                          value={profileForm.longitude}
                          onChange={(event) => updateField('longitude', Number(event.target.value) || 0)}
                          placeholder="Longitude"
                        />
                      </div>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
                      {formatAddress(profileForm) || 'Your formatted address preview will appear here as you fill in the fields.'}
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button onClick={handleSaveAddress} className="flex-1">
                    Save changes
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditingAddress(false)} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        <Card className="border-0 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LogOut className="h-5 w-5 text-red-600" />
              Account
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-lg font-semibold text-slate-900">{storefrontUser?.name || 'Guest user'}</p>
              <p className="text-sm text-slate-600">Signed in as {storefrontUser?.email || 'No email available'}</p>
            </div>
            <Button variant="destructive" className="w-full" onClick={handleLogout}>
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
