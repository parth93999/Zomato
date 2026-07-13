import { useMemo, useState } from 'react';
import {
  Activity,
  ArrowUpRight,
  Bell,
  Box,
  Clock3,
  CreditCard,
  LayoutDashboard,
  PackageCheck,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react';

type RangeKey = '7d' | '30d' | '90d';
type OrderStatus = 'Pending' | 'Preparing' | 'Out for delivery' | 'Delivered';

type Order = {
  id: string;
  customer: string;
  item: string;
  amount: number;
  status: OrderStatus;
  eta: string;
  priority: 'High' | 'Medium' | 'Low';
};

const statsByRange: Record<RangeKey, { revenue: number; orders: number; growth: number; diners: number }> = {
  '7d': { revenue: 18240, orders: 148, growth: 12.8, diners: 92 },
  '30d': { revenue: 56420, orders: 612, growth: 18.4, diners: 241 },
  '90d': { revenue: 162380, orders: 1821, growth: 27.1, diners: 614 },
};

const quickActions = [
  { title: 'Launch campaign', text: 'Promote dinner specials to nearby users.', accent: 'from-red-500 to-orange-500' },
  { title: 'Restock essentials', text: 'Keep top-selling dishes ready for peak hour.', accent: 'from-emerald-500 to-teal-500' },
  { title: 'Review payouts', text: 'Check settlement status for the recent week.', accent: 'from-sky-500 to-indigo-500' },
];

const initialOrders: Order[] = [
  { id: '#1024', customer: 'Aarav', item: 'Paneer Butter Masala', amount: 320, status: 'Preparing', eta: '12 min', priority: 'High' },
  { id: '#1025', customer: 'Nisha', item: 'Loaded Burger', amount: 480, status: 'Pending', eta: '18 min', priority: 'Medium' },
  { id: '#1026', customer: 'Rohan', item: 'Veg Biryani', amount: 260, status: 'Out for delivery', eta: '5 min', priority: 'High' },
  { id: '#1027', customer: 'Maya', item: 'Chocolate Lava Cake', amount: 180, status: 'Delivered', eta: 'Delivered', priority: 'Low' },
];

const nextStatus: Record<OrderStatus, OrderStatus> = {
  Pending: 'Preparing',
  Preparing: 'Out for delivery',
  'Out for delivery': 'Delivered',
  Delivered: 'Delivered',
};

export default function Admin() {
  const [range, setRange] = useState<RangeKey>('30d');
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'inventory'>('overview');
  const [search, setSearch] = useState('');
  const [orders, setOrders] = useState(initialOrders);

  const metrics = statsByRange[range];

  const filteredOrders = useMemo(() => {
    const needle = search.trim().toLowerCase();
    if (!needle) return orders;
    return orders.filter((order) => {
      return [order.id, order.customer, order.item, order.status].some((value) => value.toLowerCase().includes(needle));
    });
  }, [orders, search]);

  const pendingCount = orders.filter((order) => order.status !== 'Delivered').length;

  const advanceOrder = (id: string) => {
    setOrders((current) =>
      current.map((order) => {
        if (order.id !== id) return order;
        return { ...order, status: nextStatus[order.status] };
      })
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="relative overflow-hidden bg-gradient-to-br from-red-600 via-orange-500 to-amber-400 px-4 py-12 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.25),transparent_45%)]" />
        <div className="relative mx-auto max-w-7xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-sm font-medium text-white/90 backdrop-blur">
                <ShieldCheck className="h-4 w-4" />
                Admin control center
              </div>
              <h1 className="text-3xl font-black text-white sm:text-4xl">
                Keep your restaurant running smoothly.
              </h1>
              <p className="mt-3 text-lg text-red-50">
                Monitor performance, act on urgent orders, and launch amazing offers from one polished dashboard.
              </p>
            </div>
            <div className="rounded-2xl border border-white/30 bg-white/15 p-4 text-white shadow-lg backdrop-blur">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Bell className="h-4 w-4" />
                3 priority alerts
              </div>
              <p className="mt-2 text-sm text-red-50">Peak traffic is building around 8 PM.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex rounded-full bg-white p-1 shadow-sm ring-1 ring-slate-200">
            {(['overview', 'orders', 'inventory'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-4 py-2 text-sm font-semibold capitalize transition ${
                  activeTab === tab ? 'bg-red-500 text-white shadow' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-full bg-white p-1 shadow-sm ring-1 ring-slate-200">
              {(['7d', '30d', '90d'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setRange(period)}
                  className={`rounded-full px-3 py-2 text-sm font-semibold transition ${range === period ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  {period}
                </button>
              ))}
            </div>
            <label className="flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-sm ring-1 ring-slate-200">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search orders"
                className="w-32 bg-transparent text-sm outline-none"
              />
            </label>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Revenue</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">₹{metrics.revenue.toLocaleString()}</p>
              </div>
              <div className="rounded-2xl bg-red-50 p-3 text-red-500">
                <CreditCard className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm font-medium text-emerald-600">
              <ArrowUpRight className="h-4 w-4" />
              +{metrics.growth}% vs last period
            </div>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Orders</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">{metrics.orders}</p>
              </div>
              <div className="rounded-2xl bg-orange-50 p-3 text-orange-500">
                <PackageCheck className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 text-sm text-slate-500">{pendingCount} currently in progress</div>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Active diners</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">{metrics.diners}</p>
              </div>
              <div className="rounded-2xl bg-amber-50 p-3 text-amber-500">
                <Users className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm font-medium text-slate-500">
              <TrendingUp className="h-4 w-4" />
              Growing daily demand
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Performance snapshot</h2>
                <p className="text-sm text-slate-500">A quick pulse of the kitchen and delivery flow.</p>
              </div>
              <div className="rounded-full bg-emerald-50 p-2 text-emerald-600">
                <Activity className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-6 space-y-4">
              {[
                { label: 'Kitchen prep', value: 82 },
                { label: 'Delivery coverage', value: 74 },
                { label: 'Customer satisfaction', value: 91 },
              ].map((item) => (
                <div key={item.label}>
                  <div className="mb-2 flex items-center justify-between text-sm font-medium text-slate-600">
                    <span>{item.label}</span>
                    <span>{item.value}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div className="h-2 rounded-full bg-gradient-to-r from-red-500 to-orange-400" style={{ width: `${item.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-red-500" />
              <h2 className="text-xl font-bold text-slate-900">Quick actions</h2>
            </div>
            <div className="mt-5 space-y-3">
              {quickActions.map((action) => (
                <div key={action.title} className={`rounded-2xl bg-gradient-to-r ${action.accent} p-4 text-white`}>
                  <h3 className="font-semibold">{action.title}</h3>
                  <p className="mt-1 text-sm text-white/90">{action.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Live order queue</h2>
                <p className="text-sm text-slate-500">Advance orders as your team finishes them.</p>
              </div>
              <div className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600">
                {filteredOrders.length} shown
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {filteredOrders.map((order) => (
                <div key={order.id} className="flex flex-col gap-3 rounded-2xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-slate-900">{order.customer}</p>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">{order.id}</span>
                    </div>
                    <p className="mt-1 text-sm text-slate-600">{order.item}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-red-600">
                        <Clock3 className="h-3.5 w-3.5" />
                        {order.eta}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1">
                        <Box className="h-3.5 w-3.5" />
                        {order.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-900">₹{order.amount}</p>
                      <p className="text-xs text-slate-500">{order.priority} priority</p>
                    </div>
                    <button
                      onClick={() => advanceOrder(order.id)}
                      className="rounded-full bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-500"
                    >
                      {order.status === 'Delivered' ? 'Completed' : 'Advance'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center gap-2">
              <LayoutDashboard className="h-5 w-5 text-red-500" />
              <h2 className="text-xl font-bold text-slate-900">Kitchen highlights</h2>
            </div>
            <div className="mt-5 space-y-4">
              {[
                { item: 'Best seller', value: 'Paneer Wrap' },
                { item: 'Low stock', value: 'Biryani base' },
                { item: 'Next promo', value: 'Weekend combo' },
              ].map((entry) => (
                <div key={entry.item} className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-500">{entry.item}</p>
                  <p className="mt-1 font-semibold text-slate-900">{entry.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
