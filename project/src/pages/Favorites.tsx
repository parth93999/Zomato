import { Link } from 'react-router-dom';
import { Heart, Search, ArrowRight, Sparkles } from 'lucide-react';
import RestaurantCard from '../components/RestaurantCard';
import { sampleRestaurants, useApp } from '../context/AppContext';

export default function Favorites() {
  const { favorites } = useApp();
  const favoriteRestaurants = sampleRestaurants.filter((r) => favorites.includes(r.id));

  if (favoriteRestaurants.length === 0) {
    return (
      <div className="min-h-screen bg-[linear-gradient(135deg,_#fff7ed_0%,_#ffffff_45%,_#fef2f2_100%)] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-3xl flex-col items-center rounded-[2rem] border border-slate-200/70 bg-white/80 px-8 py-14 text-center shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:px-12">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-orange-400 text-white shadow-lg">
            <Heart className="h-12 w-12" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900">Your favorites list is empty</h2>
          <p className="mt-3 max-w-xl text-base text-slate-600">
            Save restaurants you love and they will appear here for quick access whenever you are ready to order.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/search"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-500 to-orange-500 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl"
            >
              <Search className="h-4 w-4" />
              Explore restaurants
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 transition-all duration-200 hover:border-red-200 hover:text-red-500"
            >
              <Sparkles className="h-4 w-4" />
              Discover more
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,_#fff7ed_0%,_#ffffff_45%,_#fef2f2_100%)] py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8 rounded-[1.5rem] border border-slate-200/70 bg-white/80 p-6 shadow-[0_16px_60px_rgba(15,23,42,0.06)] backdrop-blur-xl">
          <h1 className="text-2xl font-bold text-slate-900">Your Favorites</h1>
          <p className="mt-2 text-sm text-slate-600">Restaurants you love, saved for fast access.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      </div>
    </div>
  );
}
