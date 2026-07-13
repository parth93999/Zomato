import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, ChevronRight } from 'lucide-react';
import CategoryCard from '../components/CategoryCard';
import RestaurantCard from '../components/RestaurantCard';
import { Restaurant, sampleRestaurants } from '../context/AppContext';
import { fetchCategories, fetchRestaurants, restaurantsToList } from '../lib/api';

const categories = [
  { name: 'Biryani', image: 'https://images.pexels.com/photos/12737656/pexels-photo-12737656.jpeg?auto=compress&cs=tinysrgb&w=150', count: 254 },
  { name: 'Pizza', image: 'https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?auto=compress&cs=tinysrgb&w=150', count: 187 },
  { name: 'Burgers', image: 'https://images.pexels.com/photos/1633565/pexels-photo-1633565.jpeg?auto=compress&cs=tinysrgb&w=150', count: 143 },
  { name: 'Chinese', image: 'https://images.pexels.com/photos/2347311/pexels-photo-2347311.jpeg?auto=compress&cs=tinysrgb&w=150', count: 221 },
  { name: 'North Indian', image: 'https://images.pexels.com/photos/5408352/pexels-photo-5408352.jpeg?auto=compress&cs=tinysrgb&w=150', count: 312 },
  { name: 'South Indian', image: 'https://images.pexels.com/photos/3014562/pexels-photo-3014562.jpeg?auto=compress&cs=tinysrgb&w=150', count: 178 },
  { name: 'Desserts', image: 'https://images.pexels.com/photos/5408352/pexels-photo-5408352.jpeg?auto=compress&cs=tinysrgb&w=150', count: 89 },
  { name: 'Beverages', image: 'https://images.pexels.com/photos/3014562/pexels-photo-3014562.jpeg?auto=compress&cs=tinysrgb&w=150', count: 156 },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('Hyderabad');
  const [homeCategories, setHomeCategories] = useState(categories);
  const [restaurants, setRestaurants] = useState<Restaurant[]>(sampleRestaurants);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadBackendMenu() {
      const [apiCategories, apiRestaurants] = await Promise.all([fetchCategories(), fetchRestaurants()]);
      setHomeCategories(apiCategories
        .filter((category) => category.active)
        .map((category) => ({
          name: category.name,
          image: category.image || 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=150',
          count: category.items,
        })));

      const backendRestaurants = restaurantsToList(apiRestaurants);
      setRestaurants(backendRestaurants.length > 0 ? [...backendRestaurants, ...sampleRestaurants] : sampleRestaurants);
    }

    loadBackendMenu().catch(() => {
      setHomeCategories(categories);
      setRestaurants(sampleRestaurants);
    });
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    const loc = location.trim();
    let url = '/search';
    const params = [];
    if (query) params.push(`q=${encodeURIComponent(query)}`);
    if (loc) params.push(`l=${encodeURIComponent(loc)}`);
    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }
    navigate(url);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative -mt-20 min-h-[100dvh] overflow-hidden pt-20 sm:pt-24 lg:pt-28">
        <div className="absolute inset-0">
          <video
            className="h-full w-full object-cover brightness-[1.1]"
            src="https://b.zmtcdn.com/data/file_assets/2627bbed9d6c068e50d2aadcca11ddbb1743095925.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/55" />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 py-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 text-center">
            Discover the best food
          </h1>
          <p className="text-xl text-gray-200 mb-8">in your neighborhood</p>

          <form onSubmit={handleSearchSubmit} className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl p-3 flex flex-col md:flex-row gap-3">
            <div className="flex items-center gap-2 md:border-r md:pr-4 flex-1 md:flex-none">
              <MapPin className="w-5 h-5 text-red-500 flex-shrink-0" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full outline-none text-gray-800 font-medium"
                placeholder="Enter your location"
              />
            </div>
            <div className="flex items-center gap-2 flex-1">
              <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full outline-none text-gray-650"
                placeholder="Search for restaurant, cuisine or a dish"
              />
              <button
                type="submit"
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl font-semibold transition-colors flex-shrink-0"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">What's on your mind?</h2>
            <Link
              to="/search"
              className="text-red-500 hover:text-red-600 font-medium flex items-center"
            >
              See all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
            {homeCategories.map((category) => (
              <CategoryCard key={category.name} {...category} />
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Quick Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white shadow-lg">
              <h3 className="text-xl font-bold mb-2">Order Online</h3>
              <p className="text-red-100 mb-4">Get your favorite food delivered to your doorstep</p>
              <Link to="/search" className="inline-block bg-white text-red-500 px-4 py-2 rounded-lg font-semibold hover:bg-red-50 transition-colors">
                Order Now
              </Link>
            </div>
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
              <h3 className="text-xl font-bold mb-2">Dining Out</h3>
              <p className="text-emerald-100 mb-4">Explore the best restaurants for dine-in experiences</p>
              <Link to="/search" className="inline-block bg-white text-emerald-500 px-4 py-2 rounded-lg font-semibold hover:bg-emerald-50 transition-colors">
                Explore
              </Link>
            </div>
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-6 text-white shadow-lg">
              <h3 className="text-xl font-bold mb-2">Offers & Deals</h3>
              <p className="text-amber-100 mb-4">Discover amazing discounts on food delivery</p>
              <Link to="/search" className="inline-block bg-white text-amber-500 px-4 py-2 rounded-lg font-semibold hover:bg-amber-50 transition-colors">
                View Offers
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Top Restaurants */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Top Restaurants Near You</h2>
            <Link
              to="/search"
              className="text-red-500 hover:text-red-600 font-medium flex items-center"
            >
              See all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        </div>
      </section>

      {/* Popular Restaurants */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Collections</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link to="/search?q=Biryani" className="relative h-48 rounded-xl overflow-hidden group cursor-pointer block">
              <img
                src="https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Best Biryani"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="font-bold text-lg">Best Biryani Places</h3>
                <p className="text-sm text-gray-300">23 Places</p>
              </div>
            </Link>
            <Link to="/search?q=Pizza" className="relative h-48 rounded-xl overflow-hidden group cursor-pointer block">
              <img
                src="https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Pizza Places"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="font-bold text-lg">Top Pizza Places</h3>
                <p className="text-sm text-gray-300">19 Places</p>
              </div>
            </Link>
            <Link to="/search?q=Beverages" className="relative h-48 rounded-xl overflow-hidden group cursor-pointer block">
              <img
                src="https://images.pexels.com/photos/3014562/pexels-photo-3014562.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Cafe"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="font-bold text-lg">Trending Cafes</h3>
                <p className="text-sm text-gray-300">31 Places</p>
              </div>
            </Link>
            <Link to="/search?q=Burgers" className="relative h-48 rounded-xl overflow-hidden group cursor-pointer block">
              <img
                src="https://images.pexels.com/photos/1633565/pexels-photo-1633565.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Burger"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="font-bold text-lg">Late Night Cravings</h3>
                <p className="text-sm text-gray-300">17 Places</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* App Download */}
      <section className="py-16 bg-gradient-to-r from-red-500 to-red-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 text-white text-center md:text-left">
              <h2 className="text-3xl font-bold mb-4">Get the Zomato App</h2>
              <p className="text-red-100 mb-6">
                We will send you a link, open it on your phone to download the app
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <button className="bg-white text-red-500 px-6 py-2.5 rounded-xl font-semibold hover:bg-red-50 transition-colors shadow-md">
                  Download iOS App
                </button>
                <button className="bg-white text-red-500 px-6 py-2.5 rounded-xl font-semibold hover:bg-red-50 transition-colors shadow-md">
                  Download Android App
                </button>
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="relative mx-auto border-gray-900 bg-gray-900 border-[12px] rounded-[2.5rem] h-[400px] w-[200px] shadow-2xl hover:scale-105 hover:rotate-1 transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-4 bg-black flex items-center justify-center z-20">
                  <div className="w-14 h-2.5 bg-black rounded-b-xl"></div>
                </div>
                <div className="rounded-[1.8rem] overflow-hidden w-full h-full bg-white relative flex flex-col">
                  {/* Smartphone screen interface */}
                  <div className="flex-1 flex flex-col pt-5 pb-2 px-3 overflow-hidden bg-gradient-to-b from-red-50 to-white text-left select-none">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-black text-red-500 text-xs italic">zomato</span>
                      <span className="text-[8px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-bold">App Active</span>
                    </div>
                    
                    <div className="bg-red-500 rounded-xl p-3 text-white text-left mb-3 shadow-md">
                      <p className="text-[9px] font-semibold text-red-100">Flash Deal</p>
                      <p className="font-extrabold text-sm leading-tight">50% OFF</p>
                      <p className="text-[8px] text-red-100 mt-1">on your first order</p>
                    </div>

                    <p className="text-[10px] font-bold text-slate-800 mb-2">Popular Categories</p>
                    <div className="grid grid-cols-3 gap-1.5 mb-3">
                      <div className="bg-slate-50 border border-slate-100 rounded-lg p-1.5 flex flex-col items-center hover:bg-red-50 cursor-pointer transition-colors">
                        <span className="text-md">🍔</span>
                        <span className="text-[7px] font-semibold text-slate-600 mt-1">Burger</span>
                      </div>
                      <div className="bg-slate-50 border border-slate-100 rounded-lg p-1.5 flex flex-col items-center hover:bg-red-50 cursor-pointer transition-colors">
                        <span className="text-md">🍕</span>
                        <span className="text-[7px] font-semibold text-slate-600 mt-1">Pizza</span>
                      </div>
                      <div className="bg-slate-50 border border-slate-100 rounded-lg p-1.5 flex flex-col items-center hover:bg-red-50 cursor-pointer transition-colors">
                        <span className="text-md">🍛</span>
                        <span className="text-[7px] font-semibold text-slate-600 mt-1">Biryani</span>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-2">
                      <p className="text-[10px] font-bold text-slate-800">Track Order</p>
                      <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-1.5 flex items-center gap-1.5 mt-1.5">
                        <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-[9px] text-white">🛵</div>
                        <div className="flex-1">
                          <p className="text-[8px] font-bold text-emerald-800 leading-tight">Valet on the way</p>
                          <p className="text-[7px] text-emerald-600 leading-none">Arriving in 12 mins</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
