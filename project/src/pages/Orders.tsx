import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, ChefHat, Truck, CheckCircle, Clock, ArrowRight, ShoppingBag, X, MapPin, CreditCard, Coins, Check } from 'lucide-react';
import { useApp, Order } from '../context/AppContext';

const statusConfig = {
  preparing: {
    icon: ChefHat,
    label: 'Preparing',
    color: 'text-amber-500',
    bgColor: 'bg-amber-50',
  },
  'on-the-way': {
    icon: Truck,
    label: 'On the Way',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
  },
  delivered: {
    icon: CheckCircle,
    label: 'Delivered',
    color: 'text-green-500',
    bgColor: 'bg-green-50',
  },
};

export default function Orders() {
  const { orders, fetchOrders } = useApp();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(() => Boolean(localStorage.getItem('token')));
  const [selectedOrderDetail, setSelectedOrderDetail] = useState<Order | null>(null);

  useEffect(() => {
    const syncAuthState = () => setIsLoggedIn(Boolean(localStorage.getItem('token')));
    syncAuthState();
    window.addEventListener('storage', syncAuthState);
    return () => window.removeEventListener('storage', syncAuthState);
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchOrders();
    }
  }, [isLoggedIn]);

  if (!isLoggedIn || orders.length === 0) {
    return (
      <div className="min-h-screen bg-[linear-gradient(135deg,_#fff7ed_0%,_#ffffff_45%,_#fef2f2_100%)] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-3xl flex-col items-center rounded-[2rem] border border-slate-200/70 bg-white/80 px-8 py-14 text-center shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:px-12">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-orange-400 text-white shadow-lg">
            <Package className="h-12 w-12" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900">No recent orders</h2>
          <p className="mt-3 max-w-xl text-base text-slate-600">
            {isLoggedIn
              ? 'Your order history will appear here once you place your first delivery.'
              : 'Sign in to view your past orders, track deliveries, and reorder your favorites.'}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-500 to-orange-500 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl"
            >
              <ShoppingBag className="h-4 w-4" />
              Start ordering
            </Link>
            {!isLoggedIn && (
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 transition-all duration-200 hover:border-red-200 hover:text-red-500"
              >
                Sign in
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Calculate progress index for visual tracker
  const getStatusStep = (status: string) => {
    if (status === 'preparing') return 1;
    if (status === 'on-the-way') return 2;
    if (status === 'delivered') return 3;
    return 0; // Default pending
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Orders</h1>
        <div className="space-y-4">
          {orders.map((order) => {
            const status = statusConfig[order.status] || {
              icon: Clock,
              label: order.status || 'Pending',
              color: 'text-gray-500',
              bgColor: 'bg-gray-50',
            };
            const StatusIcon = status.icon;

            return (
              <div key={order.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{order.restaurantName}</h3>
                    <p className="text-gray-500 text-sm">Order ID: {order.id}</p>
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${status.bgColor}`}>
                    <StatusIcon className={`w-4 h-4 ${status.color}`} />
                    <span className={`text-sm font-medium ${status.color}`}>{status.label}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="text-gray-600 text-sm">
                      {item.quantity}x {item.name}
                      {index < order.items.length - 1 && <span className="mx-1 text-gray-300">•</span>}
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-red-500" />
                    <span>Ordered on: {order.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-gray-900">Total Paid: ₹{order.total}</span>
                  </div>
                </div>

                {order.status !== 'delivered' && (
                  <div className="relative pt-2 pb-4">
                    <div className="absolute top-1/2 transform -translate-y-1/2 left-0 right-0 h-1 bg-gray-100 rounded-full">
                      <div
                        className="h-1 bg-red-500 rounded-full transition-all duration-500"
                        style={{
                          width:
                            order.status === 'preparing'
                              ? '33%'
                              : order.status === 'on-the-way'
                              ? '66%'
                              : '100%',
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex gap-4 mt-4 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => setSelectedOrderDetail(order)}
                    className="flex-1 py-2 border border-gray-200 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => navigate(`/restaurant/${order.vendorId || '1'}`)}
                    className="flex-1 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
                  >
                    Reorder Items
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Professional Order Details Modal */}
      {selectedOrderDetail && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative border border-gray-100 animate-scale-up">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-red-500 to-orange-500 p-6 text-white flex justify-between items-start">
              <div>
                <p className="text-xs uppercase tracking-wider text-red-100 font-bold mb-1">Receipt Summary</p>
                <h2 className="text-2xl font-black">{selectedOrderDetail.restaurantName}</h2>
                <p className="text-sm text-red-500/90 mt-1 bg-white/10 rounded-full px-3 py-0.5 inline-block border border-white/10">
                  Order ID: {selectedOrderDetail.id}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrderDetail(null)}
                className="bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-colors border border-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[70vh] space-y-6">
              
              {/* Tracker Pipeline */}
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200/50">
                <h3 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Order Status Tracker</h3>
                <div className="flex items-center justify-between relative">
                  {/* Background Bar */}
                  <div className="absolute left-6 right-6 top-5 h-0.5 bg-gray-200 -z-10" />
                  {/* Progress Fill Bar */}
                  <div 
                    className="absolute left-6 top-5 h-0.5 bg-green-500 -z-10 transition-all duration-500" 
                    style={{
                      width: `${(getStatusStep(selectedOrderDetail.status) / 3) * 100}%`
                    }}
                  />

                  {/* Step 1: Placed */}
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center border-4 border-white shadow-sm font-bold text-sm">
                      <Check className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-semibold text-gray-800 mt-2">Ordered</span>
                  </div>

                  {/* Step 2: Preparing */}
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-sm font-bold text-sm transition-colors ${
                      getStatusStep(selectedOrderDetail.status) >= 1
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-400'
                    }`}>
                      <ChefHat className="w-5 h-5" />
                    </div>
                    <span className={`text-xs font-semibold mt-2 ${
                      getStatusStep(selectedOrderDetail.status) >= 1 ? 'text-gray-800' : 'text-gray-400'
                    }`}>Preparing</span>
                  </div>

                  {/* Step 3: On The Way */}
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-sm font-bold text-sm transition-colors ${
                      getStatusStep(selectedOrderDetail.status) >= 2
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-400'
                    }`}>
                      <Truck className="w-5 h-5" />
                    </div>
                    <span className={`text-xs font-semibold mt-2 ${
                      getStatusStep(selectedOrderDetail.status) >= 2 ? 'text-gray-800' : 'text-gray-400'
                    }`}>On the Way</span>
                  </div>

                  {/* Step 4: Delivered */}
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-sm font-bold text-sm transition-colors ${
                      getStatusStep(selectedOrderDetail.status) >= 3
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-400'
                    }`}>
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <span className={`text-xs font-semibold mt-2 ${
                      getStatusStep(selectedOrderDetail.status) >= 3 ? 'text-gray-800' : 'text-gray-400'
                    }`}>Delivered</span>
                  </div>

                </div>
              </div>

              {/* Delivery Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-100 rounded-2xl p-4 bg-gray-50/50 flex gap-3 items-start">
                  <MapPin className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-gray-850 text-sm">Delivery Address</h4>
                    <p className="text-gray-600 text-sm mt-1">{selectedOrderDetail.address}</p>
                  </div>
                </div>

                <div className="border border-gray-100 rounded-2xl p-4 bg-gray-50/50 flex gap-3 items-start">
                  {selectedOrderDetail.paymentMode === 'ONLINE' ? (
                    <CreditCard className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  ) : (
                    <Coins className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <h4 className="font-bold text-gray-850 text-sm">Payment Details</h4>
                    <p className="text-gray-650 text-sm mt-1">
                      Mode: <span className="font-semibold">{selectedOrderDetail.paymentMode || 'COD'}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">Status: Authorized / Confirmed</p>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-100 flex justify-between text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <span>Item Details</span>
                  <span>Amount</span>
                </div>
                <div className="divide-y divide-gray-150">
                  {selectedOrderDetail.items.map((item, idx) => (
                    <div key={idx} className="px-4 py-3 flex justify-between items-center text-sm">
                      <div>
                        <p className="font-semibold text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-500">₹{item.price} x {item.quantity}</p>
                      </div>
                      <span className="font-bold text-gray-900">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200/50 space-y-2 text-sm text-gray-650">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">
                    ₹{selectedOrderDetail.subtotal ?? (selectedOrderDetail.total - (selectedOrderDetail.deliveryFee || 40) - (selectedOrderDetail.taxes || 0) - (selectedOrderDetail.tip || 0) + (selectedOrderDetail.discount || 0))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charge</span>
                  <span className="font-semibold text-gray-900">₹{selectedOrderDetail.deliveryFee ?? 40}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST & Restaurant Charges</span>
                  <span className="font-semibold text-gray-900">₹{selectedOrderDetail.taxes ?? 0}</span>
                </div>
                {(selectedOrderDetail.tip ?? 0) > 0 && (
                  <div className="flex justify-between">
                    <span>Driver Tip</span>
                    <span className="font-semibold text-gray-900">₹{selectedOrderDetail.tip}</span>
                  </div>
                )}
                {(selectedOrderDetail.discount ?? 0) > 0 && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Promo Discount</span>
                    <span>-₹{selectedOrderDetail.discount}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-3 flex justify-between text-base font-extrabold text-gray-900">
                  <span>Grand Total</span>
                  <span className="text-red-500">₹{selectedOrderDetail.total}</span>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 p-4 border-t border-gray-150 flex gap-3">
              <button
                onClick={() => setSelectedOrderDetail(null)}
                className="flex-1 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-colors text-center"
              >
                Close Receipt
              </button>
              <button
                onClick={() => {
                  setSelectedOrderDetail(null);
                  navigate(`/restaurant/${selectedOrderDetail.vendorId || '1'}`);
                }}
                className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all shadow-md shadow-red-100 text-center"
              >
                Reorder Dishes
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
