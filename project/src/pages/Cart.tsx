import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ShoppingBag, MapPin, ChevronRight, Tag, Percent, Trash2, CreditCard, Coins, CheckCircle2, Clock } from 'lucide-react';
import CartItem from '../components/CartItem';

export default function Cart() {
  const { cart, getCartTotal, placeOrder } = useApp();
  const navigate = useNavigate();
  const [address, setAddress] = useState('123 Main Street, Banjara Hills, Hyderabad');
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [paymentMode, setPaymentMode] = useState<'COD' | 'ONLINE'>('COD');
  
  // Tipping states
  const [selectedTip, setSelectedTip] = useState<number>(0);
  const [customTip, setCustomTip] = useState<string>('');
  const [placedOrderDetails, setPlacedOrderDetails] = useState<any | null>(null);

  const subtotal = getCartTotal();
  const deliveryFee = 40;
  const taxes = Math.round(subtotal * 0.05);
  const discount = appliedPromo ? 100 : 0;
  const total = subtotal + deliveryFee + taxes + selectedTip - discount;

  if (cart.length === 0 && !showOrderSuccess) {
    return (
      <div className="min-h-screen bg-[linear-gradient(135deg,_#fff7ed_0%,_#ffffff_45%,_#fef2f2_100%)] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-3xl flex-col items-center rounded-[2rem] border border-slate-200/70 bg-white/80 px-8 py-14 text-center shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:px-12">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-orange-400 text-white shadow-lg">
            <ShoppingBag className="h-12 w-12" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900">Your cart is empty</h2>
          <p className="mt-3 max-w-xl text-base text-slate-600">
            Looks like you haven't added anything yet. Explore restaurants and add your favorite dishes to get started!
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-500 to-orange-500 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl"
            >
              <ShoppingBag className="h-4 w-4" />
              Browse Restaurants
            </Link>
            <Link
              to="/search"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 transition-all duration-200 hover:border-red-200 hover:text-red-500"
            >
              Search for food
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (showOrderSuccess && placedOrderDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50/50 py-12 px-4 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-red-500 to-orange-500 p-8 text-center text-white">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight">Order Placed Successfully!</h2>
            <p className="text-red-100 mt-2 font-medium">Thank you for dining with Zamato</p>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200/50">
                <p className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-1">Order Number</p>
                <p className="text-lg font-bold text-gray-900">{placedOrderDetails.id}</p>
                <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <span>Delivery in 30 - 45 mins</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200/50">
                <p className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-1">Payment Method</p>
                <p className="text-lg font-bold text-gray-900">
                  {placedOrderDetails.paymentMode === 'ONLINE' ? 'Paid Online' : 'Cash on Delivery (COD)'}
                </p>
                <p className="text-sm text-gray-500 mt-4">Deliver to: <span className="font-semibold text-gray-700">{placedOrderDetails.address}</span></p>
              </div>
            </div>

            <div className="border border-gray-100 rounded-2xl p-6 mb-8 bg-white shadow-sm">
              <h3 className="font-bold text-gray-900 text-lg mb-4 pb-2 border-b border-gray-100">
                {placedOrderDetails.restaurantName}
              </h3>
              <div className="space-y-3 mb-6">
                {placedOrderDetails.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center text-sm">
                    <span className="text-gray-700 font-medium">
                      {item.quantity}x <span className="text-gray-900">{item.name}</span>
                    </span>
                    <span className="font-semibold text-gray-900">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">₹{placedOrderDetails.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-semibold text-gray-900">₹{placedOrderDetails.deliveryFee}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes (5%)</span>
                  <span className="font-semibold text-gray-900">₹{placedOrderDetails.taxes}</span>
                </div>
                {placedOrderDetails.tip > 0 && (
                  <div className="flex justify-between">
                    <span>Driver Tip</span>
                    <span className="font-semibold text-gray-900">₹{placedOrderDetails.tip}</span>
                  </div>
                )}
                {placedOrderDetails.discount > 0 && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Discount Applied</span>
                    <span>-₹{placedOrderDetails.discount}</span>
                  </div>
                )}
                <div className="border-t border-gray-100 pt-3 flex justify-between text-base font-extrabold text-gray-900">
                  <span>Grand Total</span>
                  <span className="text-red-500">₹{placedOrderDetails.total}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('/orders')}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3.5 px-6 rounded-2xl transition-all shadow-md shadow-red-200 text-center"
              >
                Track Order history
              </button>
              <Link
                to="/"
                className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-3.5 px-6 rounded-2xl transition-all text-center"
              >
                Order Something Else
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === 'ZOMATO100') {
      setAppliedPromo('ZOMATO100');
      setPromoCode('');
    }
  };

  const handlePlaceOrder = async () => {
    try {
      const paymentData = await placeOrder(address, paymentMode, selectedTip, discount);
      if (paymentData?.payment) {
        navigate('/payment', { state: { paymentData, address } });
        return;
      }

      setPlacedOrderDetails(paymentData);
      setShowOrderSuccess(true);
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : 'Unable to place order');
    }
  };

  const selectPreconfiguredTip = (val: number) => {
    setSelectedTip(val);
    setCustomTip('');
  };

  const handleCustomTipChange = (val: string) => {
    setCustomTip(val);
    const num = Number(val);
    if (!isNaN(num) && num >= 0) {
      setSelectedTip(num);
    } else {
      setSelectedTip(0);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items & Details */}
          <div className="lg:col-span-2 space-y-4">
            {/* Delivery Address */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-red-500" />
                Delivery Address
              </h3>
              <button
                onClick={() => setShowAddressModal(true)}
                className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="text-left">
                  <p className="text-gray-500 text-sm">Delivery Address</p>
                  <p className="text-gray-900 font-medium">{address}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Restaurant Info */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="font-semibold text-gray-900 mb-2">{cart[0].restaurantName}</p>
              <div className="space-y-3">
                {cart.map((item) => (
                  <CartItem key={item.menuItem.id} item={item} />
                ))}
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-red-500" />
                Select Payment Mode
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMode('COD')}
                  className={`flex flex-col items-center gap-2 p-4 border rounded-xl transition-all ${
                    paymentMode === 'COD'
                      ? 'border-red-500 bg-red-50/50 text-red-500 font-semibold'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Coins className="w-6 h-6" />
                  <span>Cash on Delivery</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMode('ONLINE')}
                  className={`flex flex-col items-center gap-2 p-4 border rounded-xl transition-all ${
                    paymentMode === 'ONLINE'
                      ? 'border-red-500 bg-red-50/50 text-red-500 font-semibold'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <CreditCard className="w-6 h-6" />
                  <span>Online Payment</span>
                </button>
              </div>
            </div>

            {/* Promo Code */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Tag className="w-5 h-5 mr-2 text-red-500" />
                Apply Promo Code
              </h3>
              {appliedPromo ? (
                <div className="flex items-center justify-between bg-green-50 text-green-700 px-4 py-3 rounded-lg">
                  <span className="font-medium">₹100 discount applied!</span>
                  <button
                    onClick={() => setAppliedPromo(null)}
                    className="text-green-700 hover:text-green-900"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter promo code"
                    className="flex-1 border border-gray-200 rounded-lg px-4 py-2 outline-none focus:border-red-500"
                  />
                  <button
                    onClick={handleApplyPromo}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors"
                  >
                    Apply
                  </button>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-2">Try ZOMATO100 for ₹100 off</p>
            </div>

            {/* Tip Selection */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Percent className="w-5 h-5 mr-2 text-amber-500" />
                Add a tip for your delivery partner
              </h3>
              <p className="text-xs text-gray-500 mb-3">
                100% of the tip goes directly to your delivery partner to support their hard work.
              </p>
              <div className="flex flex-wrap gap-2 items-center">
                {[10, 20, 50, 100].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => selectPreconfiguredTip(val)}
                    className={`px-4 py-2 border rounded-lg text-sm font-medium transition-all ${
                      selectedTip === val && customTip === ''
                        ? 'border-amber-500 bg-amber-50 text-amber-700'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    ₹{val}
                  </button>
                ))}
                <div className="relative max-w-[120px] flex items-center">
                  <span className="absolute left-3 text-gray-400 text-sm font-semibold">₹</span>
                  <input
                    type="text"
                    value={customTip}
                    onChange={(e) => handleCustomTipChange(e.target.value)}
                    placeholder="Custom"
                    className={`w-full pl-6 pr-3 py-2 border rounded-lg text-sm outline-none transition-colors ${
                      customTip !== '' ? 'border-amber-500 bg-amber-50 text-amber-700 font-semibold' : 'border-gray-200 text-gray-600 focus:border-amber-500'
                    }`}
                  />
                </div>
                {selectedTip > 0 && (
                  <button
                    onClick={() => {
                      setSelectedTip(0);
                      setCustomTip('');
                    }}
                    className="text-xs text-red-500 font-semibold hover:underline"
                  >
                    Clear tip
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4 text-lg">Order Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900 font-medium">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="text-gray-900 font-medium">₹{deliveryFee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxes (5%)</span>
                  <span className="text-gray-900 font-medium">₹{taxes}</span>
                </div>
                {selectedTip > 0 && (
                  <div className="flex justify-between text-amber-600 font-medium">
                    <span>Driver Tip</span>
                    <span>₹{selectedTip}</span>
                  </div>
                )}
                {appliedPromo && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Promo Discount</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                <hr className="my-2" />
                <div className="flex justify-between text-base font-bold">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">₹{total}</span>
                </div>
              </div>
              <button
                onClick={handlePlaceOrder}
                className="w-full bg-red-500 text-white py-3 rounded-xl font-semibold mt-6 hover:bg-red-600 transition-colors shadow-md shadow-red-100"
              >
                Place Order ({paymentMode === 'ONLINE' ? 'Pay Online' : 'COD'})
              </button>
              <p className="text-xs text-gray-500 text-center mt-4">
                By placing your order, you agree to{' '}
                <Link to="/terms" className="text-red-500">
                  Terms of Service
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Change Delivery Address</h3>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border border-gray-200 rounded-lg p-3 outline-none focus:border-red-500 resize-none"
              rows={3}
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowAddressModal(false)}
                className="flex-1 py-2 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowAddressModal(false)}
                className="flex-1 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
