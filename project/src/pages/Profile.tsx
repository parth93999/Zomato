import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Mail, Phone, MapPin, CreditCard, Heart, Package, Bell, LogOut,
  ChevronRight, Camera, X, Plus, Trash2, Home, Briefcase, Check,
  BellOff, Shield, Star, Tag, Edit2
} from "lucide-react";
import { useApp } from "../context/AppContext";

const getInitials = (name?: string) => {
  if (!name) return "ZU";
  return name.trim().split(/\s+/).filter(Boolean).slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "").join("");
};

interface Address { id: number; type: string; address: string; }
interface PaymentCard { id: number; type: "visa" | "mastercard" | "upi"; label: string; last4?: string; upiId?: string; }
interface NotifSettings { orderUpdates: boolean; offers: boolean; newRestaurants: boolean; appNews: boolean; }

export default function Profile({ user, onLogout }: { user: any | null; onLogout: () => void }) {
  const { orders, favorites } = useApp();
  const storedUser = user || JSON.parse(localStorage.getItem("user") || "null");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profileName, setProfileName] = useState(storedUser?.name || "Zamato User");
  const [profilePhone, setProfilePhone] = useState(storedUser?.mobile || "");
  const [profileImage, setProfileImage] = useState(
    storedUser?.image ? `http://localhost:8001${storedUser.image}` : ""
  );
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState(profileName);
  const [editPhone, setEditPhone] = useState(profilePhone);

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddrType, setNewAddrType] = useState("Home");
  const [newAddrText, setNewAddrText] = useState("");

  const [cards, setCards] = useState<PaymentCard[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [payType, setPayType] = useState<"card" | "upi">("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardLabel, setCardLabel] = useState("");
  const [upiId, setUpiId] = useState("");

  const [showNotifModal, setShowNotifModal] = useState(false);
  const [notifSettings, setNotifSettings] = useState<NotifSettings>({
    orderUpdates: true, offers: true, newRestaurants: false, appNews: false,
  });

  const email = storedUser?.email || "No email added";
  const initials = getInitials(profileName);

  const handleSaveProfile = () => {
    setProfileName(editName);
    setProfilePhone(editPhone);
    const updated = { ...storedUser, name: editName, mobile: editPhone };
    localStorage.setItem("user", JSON.stringify(updated));
    setShowEditModal(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAddAddress = () => {
    if (!newAddrText.trim()) return;
    setAddresses((prev) => [...prev, { id: Date.now(), type: newAddrType, address: newAddrText.trim() }]);
    setNewAddrText(""); setNewAddrType("Home"); setShowAddressModal(false);
  };

  const handleAddPayment = () => {
    if (payType === "card") {
      if (cardNumber.length < 4) return;
      const last4 = cardNumber.slice(-4);
      const type = cardNumber.startsWith("4") ? "visa" : "mastercard";
      setCards((prev) => [...prev, { id: Date.now(), type, label: cardLabel || `${type === "visa" ? "Visa" : "Mastercard"} ending ${last4}`, last4 }]);
    } else {
      if (!upiId.includes("@")) return;
      setCards((prev) => [...prev, { id: Date.now(), type: "upi", label: upiId, upiId }]);
    }
    setCardNumber(""); setCardLabel(""); setUpiId(""); setShowPaymentModal(false);
  };

  const toggleNotif = (key: keyof NotifSettings) =>
    setNotifSettings((prev) => ({ ...prev, [key]: !prev[key] }));

  const menuItems = [
    { icon: Heart, label: "Favorites", href: "/favorites", count: favorites.length > 0 ? favorites.length : null, action: null as (() => void) | null },
    { icon: Package, label: "Order History", href: "/orders", count: orders.length > 0 ? orders.length : null, action: null as (() => void) | null },
    { icon: MapPin, label: "Saved Addresses", href: "#", count: addresses.length > 0 ? addresses.length : null, action: () => setShowAddressModal(true) },
    { icon: CreditCard, label: "Payment Methods", href: "#", count: cards.length > 0 ? cards.length : null, action: () => setShowPaymentModal(true) },
    { icon: Bell, label: "Notifications", href: "#", count: null as number | null, action: () => setShowNotifModal(true) },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">

        {/* Profile Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center overflow-hidden ring-4 ring-red-100">
                {profileImage
                  ? <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                  : <span className="text-3xl font-bold text-white">{initials}</span>
                }
              </div>
              <button onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 shadow-md hover:bg-gray-50 transition-colors border border-gray-100">
                <Camera className="w-4 h-4 text-gray-600" />
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-gray-900 truncate">{profileName}</h1>
              <div className="flex items-center text-gray-500 mt-1">
                <Mail className="w-4 h-4 mr-1 flex-shrink-0" />
                <span className="text-sm truncate">{email}</span>
              </div>
              <div className="flex items-center text-gray-500 mt-1">
                <Phone className="w-4 h-4 mr-1 flex-shrink-0" />
                <span className="text-sm">{profilePhone || "No mobile added"}</span>
              </div>
            </div>
            <button onClick={() => { setEditName(profileName); setEditPhone(profilePhone); setShowEditModal(true); }}
              className="px-4 py-2 border border-red-500 text-red-500 rounded-xl font-medium hover:bg-red-50 transition-colors flex items-center gap-1.5 flex-shrink-0">
              <Edit2 className="w-4 h-4" /> Edit
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
          {menuItems.map((item, index) => {
            const inner = (
              <>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-gray-600" />
                  </div>
                  <span className="font-medium text-gray-900">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.count !== null && item.count !== undefined && item.count > 0 && (
                    <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-sm font-medium">{item.count}</span>
                  )}
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </>
            );
            const cls = `flex items-center justify-between p-4 hover:bg-gray-50 transition-colors cursor-pointer w-full text-left ${index !== menuItems.length - 1 ? "border-b" : ""}`;
            return item.action
              ? <button key={item.label} onClick={item.action} className={cls}>{inner}</button>
              : <Link key={item.label} to={item.href} className={cls}>{inner}</Link>;
          })}
        </div>

        {/* Saved Addresses Preview */}
        {addresses.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Saved Addresses</h3>
              <button onClick={() => setShowAddressModal(true)} className="text-red-500 font-medium hover:text-red-600 text-sm flex items-center gap-1">
                <Plus className="w-4 h-4" /> Add New
              </button>
            </div>
            <div className="space-y-3">
              {addresses.map((addr) => (
                <div key={addr.id} className="flex items-start gap-3 p-3 border border-gray-200 rounded-xl">
                  <div className="w-8 h-8 bg-red-50 rounded-full flex items-center justify-center flex-shrink-0">
                    {addr.type === "Home" ? <Home className="w-4 h-4 text-red-500" />
                      : addr.type === "Work" ? <Briefcase className="w-4 h-4 text-red-500" />
                      : <MapPin className="w-4 h-4 text-red-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-semibold text-gray-900 text-sm">{addr.type}</span>
                    <p className="text-gray-500 text-sm truncate">{addr.address}</p>
                  </div>
                  <button onClick={() => setAddresses((p) => p.filter((a) => a.id !== addr.id))}
                    className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payment Methods Preview */}
        {cards.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Payment Methods</h3>
              <button onClick={() => setShowPaymentModal(true)} className="text-red-500 font-medium hover:text-red-600 text-sm flex items-center gap-1">
                <Plus className="w-4 h-4" /> Add New
              </button>
            </div>
            <div className="space-y-3">
              {cards.map((c) => (
                <div key={c.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-900 text-white font-bold text-xs">
                    {c.type === "visa" ? "VISA" : c.type === "mastercard" ? "MC" : "UPI"}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{c.label}</p>
                    <p className="text-gray-400 text-xs">{c.type === "upi" ? "UPI ID" : `Card ending in ${c.last4}`}</p>
                  </div>
                  <button onClick={() => setCards((p) => p.filter((x) => x.id !== c.id))}
                    className="text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Referral Card */}
        <div className="bg-gradient-to-r from-amber-400 to-amber-500 rounded-2xl p-6 text-white mb-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Star className="w-5 h-5" />
                <h3 className="font-bold text-lg">Invite &amp; Earn</h3>
              </div>
              <p className="text-amber-100 text-sm">Get ₹200 for every friend who orders using your referral code</p>
            </div>
            <div className="text-right">
              <div className="bg-white text-amber-600 px-4 py-2 rounded-xl font-bold tracking-wider">
                {profileName.split(" ")[0].toUpperCase().slice(0, 6)}200
              </div>
              <p className="text-amber-100 text-xs mt-1">Tap to copy</p>
            </div>
          </div>
        </div>

        {/* Logout */}
        <button onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 bg-white text-red-500 py-4 rounded-2xl shadow-sm hover:bg-red-50 transition-colors font-semibold mb-4">
          <LogOut className="w-5 h-5" /> Log Out
        </button>
        <p className="text-center text-gray-400 text-xs mt-4 pb-6">
          Zamato © 2026 · Terms · Privacy
        </p>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-orange-500 p-5 flex items-center justify-between">
              <h2 className="text-white font-bold text-lg">Edit Profile</h2>
              <button onClick={() => setShowEditModal(false)} className="text-white/80 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Full Name</label>
                <input value={editName} onChange={(e) => setEditName(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 text-gray-900 transition"
                  placeholder="Your name" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Phone Number</label>
                <input value={editPhone} onChange={(e) => setEditPhone(e.target.value)} type="tel"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 text-gray-900 transition"
                  placeholder="+91 98765 43210" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Email</label>
                <input value={email} disabled className="w-full border border-gray-100 bg-gray-50 rounded-xl px-4 py-3 text-gray-400 cursor-not-allowed" />
                <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowEditModal(false)} className="flex-1 py-3 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors text-gray-700">Cancel</button>
                <button onClick={handleSaveProfile} className="flex-1 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity">Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-orange-500 p-5 flex items-center justify-between">
              <h2 className="text-white font-bold text-lg">Add New Address</h2>
              <button onClick={() => setShowAddressModal(false)} className="text-white/80 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Address Type</label>
                <div className="flex gap-3">
                  {["Home", "Work", "Other"].map((t) => (
                    <button key={t} onClick={() => setNewAddrType(t)}
                      className={`flex-1 py-2.5 rounded-xl border font-medium text-sm transition-all ${newAddrType === t ? "border-red-500 bg-red-50 text-red-600" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                      {t === "Home" ? "🏠" : t === "Work" ? "💼" : "📍"} {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Full Address</label>
                <textarea value={newAddrText} onChange={(e) => setNewAddrText(e.target.value)} rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 text-gray-900 transition resize-none"
                  placeholder="e.g. 123 Main Street, Banjara Hills, Hyderabad - 500034" />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowAddressModal(false)} className="flex-1 py-3 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors text-gray-700">Cancel</button>
                <button onClick={handleAddAddress} className="flex-1 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity">Save Address</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Methods Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-orange-500 p-5 flex items-center justify-between">
              <h2 className="text-white font-bold text-lg">Add Payment Method</h2>
              <button onClick={() => setShowPaymentModal(false)} className="text-white/80 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex rounded-xl border border-gray-200 overflow-hidden">
                <button onClick={() => setPayType("card")}
                  className={`flex-1 py-2.5 font-medium text-sm transition-all ${payType === "card" ? "bg-red-500 text-white" : "text-gray-600 hover:bg-gray-50"}`}>
                  💳 Credit / Debit Card
                </button>
                <button onClick={() => setPayType("upi")}
                  className={`flex-1 py-2.5 font-medium text-sm transition-all ${payType === "upi" ? "bg-red-500 text-white" : "text-gray-600 hover:bg-gray-50"}`}>
                  📱 UPI
                </button>
              </div>
              {payType === "card" ? (
                <>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Card Number</label>
                    <input value={cardNumber} onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16))} maxLength={16}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 text-gray-900 transition font-mono tracking-widest"
                      placeholder="1234 5678 9012 3456" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Card Label</label>
                    <input value={cardLabel} onChange={(e) => setCardLabel(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 text-gray-900 transition"
                      placeholder="e.g. My HDFC Visa" />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-50 rounded-xl p-3">
                    <Shield className="w-4 h-4 text-green-500 flex-shrink-0" />
                    Card details are stored locally and never shared.
                  </div>
                </>
              ) : (
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">UPI ID</label>
                  <input value={upiId} onChange={(e) => setUpiId(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 text-gray-900 transition"
                    placeholder="yourname@upi" />
                  <p className="text-xs text-gray-400 mt-1">e.g. rahul@okicici · 9876543210@paytm</p>
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowPaymentModal(false)} className="flex-1 py-3 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors text-gray-700">Cancel</button>
                <button onClick={handleAddPayment} className="flex-1 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity">Add Method</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Modal */}
      {showNotifModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-orange-500 p-5 flex items-center justify-between">
              <h2 className="text-white font-bold text-lg">Notification Settings</h2>
              <button onClick={() => setShowNotifModal(false)} className="text-white/80 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-1">
              {[
                { key: "orderUpdates" as const, icon: Package, label: "Order Updates", desc: "Real-time status of your orders" },
                { key: "offers" as const, icon: Tag, label: "Offers & Deals", desc: "Exclusive discounts and promo codes" },
                { key: "newRestaurants" as const, icon: Star, label: "New Restaurants", desc: "When new places open near you" },
                { key: "appNews" as const, icon: Bell, label: "App News", desc: "Product updates and announcements" },
              ].map(({ key, icon: Icon, label, desc }) => (
                <div key={key} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center">
                      {notifSettings[key] ? <Icon className="w-4 h-4 text-red-500" /> : <BellOff className="w-4 h-4 text-gray-400" />}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{label}</p>
                      <p className="text-xs text-gray-400">{desc}</p>
                    </div>
                  </div>
                  <button onClick={() => toggleNotif(key)}
                    className={`relative w-12 h-6 rounded-full transition-all duration-300 flex-shrink-0 ${notifSettings[key] ? "bg-red-500" : "bg-gray-200"}`}>
                    <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ${notifSettings[key] ? "translate-x-6" : "translate-x-0"}`} />
                  </button>
                </div>
              ))}
              <div className="pt-4">
                <button onClick={() => setShowNotifModal(false)}
                  className="w-full py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity">
                  <Check className="w-4 h-4 inline mr-2" /> Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
