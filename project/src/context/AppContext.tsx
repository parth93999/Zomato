import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface MenuItem {
  id: string;
  backendProductId?: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isVeg: boolean;
  isBestseller?: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  image: string;
  cuisine: string[];
  rating: number;
  deliveryTime: string;
  priceRange: string;
  distance: string;
  address: string;
  menu: MenuItem[];
  offers?: string[];
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  restaurantId: string;
  restaurantName: string;
}

export interface Order {
  id: string;
  restaurantName: string;
  vendorId?: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  status: 'preparing' | 'on-the-way' | 'delivered';
  date: string;
  address: string;
  tip?: number;
  paymentMode?: string;
  subtotal?: number;
  deliveryFee?: number;
  taxes?: number;
  discount?: number;
}

interface AppContextType {
  cart: CartItem[];
  favorites: string[];
  orders: Order[];
  currentRestaurant: Restaurant | null;
  addToCart: (item: MenuItem, restaurantId: string, restaurantName: string) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  toggleFavorite: (restaurantId: string) => void;
  isFavorite: (restaurantId: string) => boolean;
  setCurrentRestaurant: (restaurant: Restaurant | null) => void;
  placeOrder: (address: string, paymentMode?: string, tip?: number, discount?: number) => Promise<any>;
  fetchOrders: () => Promise<void>;
  getCartTotal: () => number;
  getCartItemCount: () => number;
  clearAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const DEFAULT_FOOD_IMAGE = 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80';
export const DEFAULT_RESTAURANT_IMAGE = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80';

const sampleRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Paradise Biryani',
    image: 'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?auto=compress&cs=tinysrgb&w=600',
    cuisine: ['Biryani', 'Hyderabadi', 'North Indian'],
    rating: 4.5,
    deliveryTime: '30-35 mins',
    priceRange: '₹300 for two',
    distance: '3.2 km',
    address: 'Banjara Hills, Hyderabad',
    offers: ['50% off up to ₹100', 'Free delivery on orders above ₹199'],
    menu: [
      {
        id: 'm1',
        name: 'Chicken Biryani',
        description: 'Aromatic basmati rice layered with tender chicken pieces and spices',
        price: 320,
        image: 'https://images.pexels.com/photos/12737656/pexels-photo-12737656.jpeg?auto=compress&cs=tinysrgb&w=600',
        category: 'Biryani',
        isVeg: false,
        isBestseller: true,
      },
      {
        id: 'm2',
        name: 'Mutton Biryani',
        description: 'Succulent mutton pieces cooked with fragrant rice',
        price: 380,
        image: 'https://images.pexels.com/photos/12737656/pexels-photo-12737656.jpeg?auto=compress&cs=tinysrgb&w=600',
        category: 'Biryani',
        isVeg: false,
        isBestseller: true,
      },
      {
        id: 'm3',
        name: 'Veg Biryani',
        description: 'Garden fresh vegetables cooked with aromatic spices and rice',
        price: 220,
        image: 'https://images.pexels.com/photos/12737656/pexels-photo-12737656.jpeg?auto=compress&cs=tinysrgb&w=600',
        category: 'Biryani',
        isVeg: true,
      },
      {
        id: 'm4',
        name: 'Mirchi Ka Salan',
        description: 'Traditional Hyderabadi curry with green chilies',
        price: 180,
        image: 'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?auto=compress&cs=tinysrgb&w=600',
        category: 'Sides',
        isVeg: true,
      },
    ],
  },
  {
    id: '2',
    name: 'Pizza Hut',
    image: 'https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?auto=compress&cs=tinysrgb&w=600',
    cuisine: ['Pizza', 'Italian', 'Fast Food'],
    rating: 4.2,
    deliveryTime: '25-30 mins',
    priceRange: '₹400 for two',
    distance: '2.1 km',
    address: 'Hitech City, Hyderabad',
    offers: ['Buy 1 Get 1 Free on Medium Pizzas'],
    menu: [
      {
        id: 'p1',
        name: 'Margherita Pizza',
        description: 'Classic cheese pizza with tangy tomato sauce',
        price: 299,
        image: 'https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?auto=compress&cs=tinysrgb&w=600',
        category: 'Pizza',
        isVeg: true,
        isBestseller: true,
      },
      {
        id: 'p2',
        name: 'Pepperoni Pizza',
        description: 'Loaded with spicy pepperoni and mozzarella',
        price: 399,
        image: 'https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?auto=compress&cs=tinysrgb&w=600',
        category: 'Pizza',
        isVeg: false,
        isBestseller: true,
      },
      {
        id: 'p3',
        name: 'Garlic Bread',
        description: 'Toasted bread with garlic butter and herbs',
        price: 149,
        image: 'https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?auto=compress&cs=tinysrgb&w=600',
        category: 'Sides',
        isVeg: true,
      },
      {
        id: 'p4',
        name: 'Pasta Alfredo',
        description: 'Creamy white sauce pasta with vegetables',
        price: 249,
        image: 'https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?auto=compress&cs=tinysrgb&w=600',
        category: 'Pasta',
        isVeg: true,
      },
    ],
  },
  {
    id: '3',
    name: 'Chai Point',
    image: 'https://images.pexels.com/photos/3014562/pexels-photo-3014562.jpeg?auto=compress&cs=tinysrgb&w=600',
    cuisine: ['Beverages', 'Snacks', 'Cafe'],
    rating: 4.6,
    deliveryTime: '15-20 mins',
    priceRange: '₹150 for two',
    distance: '1.5 km',
    address: 'Madhapur, Hyderabad',
    offers: ['₹50 off on first order'],
    menu: [
      {
        id: 'c1',
        name: 'Masala Chai',
        description: 'Traditional Indian spiced tea',
        price: 45,
        image: 'https://images.pexels.com/photos/3014562/pexels-photo-3014562.jpeg?auto=compress&cs=tinysrgb&w=600',
        category: 'Chai',
        isVeg: true,
        isBestseller: true,
      },
      {
        id: 'c2',
        name: 'Ginger Chai',
        description: 'Tea with fresh ginger',
        price: 49,
        image: 'https://images.pexels.com/photos/3014562/pexels-photo-3014562.jpeg?auto=compress&cs=tinysrgb&w=600',
        category: 'Chai',
        isVeg: true,
      },
      {
        id: 'c3',
        name: 'Samosa',
        description: 'Crispy pastry filled with spiced potatoes',
        price: 29,
        image: 'https://images.pexels.com/photos/3014562/pexels-photo-3014562.jpeg?auto=compress&cs=tinysrgb&w=600',
        category: 'Snacks',
        isVeg: true,
        isBestseller: true,
      },
      {
        id: 'c4',
        name: 'Vada Pav',
        description: 'Mumbai style potato fritter in a bun',
        price: 45,
        image: 'https://images.pexels.com/photos/3014562/pexels-photo-3014562.jpeg?auto=compress&cs=tinysrgb&w=600',
        category: 'Snacks',
        isVeg: true,
      },
    ],
  },
  {
    id: '4',
    name: 'Burger King',
    image: 'https://images.pexels.com/photos/1633565/pexels-photo-1633565.jpeg?auto=compress&cs=tinysrgb&w=600',
    cuisine: ['Burgers', 'American', 'Fast Food'],
    rating: 4.1,
    deliveryTime: '20-25 mins',
    priceRange: '₹350 for two',
    distance: '2.8 km',
    address: 'Kukatpally, Hyderabad',
    offers: ['Free Whopper on orders above ₹400'],
    menu: [
      {
        id: 'b1',
        name: 'Whopper',
        description: 'Flame-grilled beef patty with fresh vegetables',
        price: 199,
        image: 'https://images.pexels.com/photos/1633565/pexels-photo-1633565.jpeg?auto=compress&cs=tinysrgb&w=600',
        category: 'Burgers',
        isVeg: false,
        isBestseller: true,
      },
      {
        id: 'b2',
        name: 'Veg Whopper',
        description: 'Crispy veggie patty with fresh veggies',
        price: 169,
        image: 'https://images.pexels.com/photos/1633565/pexels-photo-1633565.jpeg?auto=compress&cs=tinysrgb&w=600',
        category: 'Burgers',
        isVeg: true,
        isBestseller: true,
      },
      {
        id: 'b3',
        name: 'Chicken Fries',
        description: 'Crispy chicken strips',
        price: 129,
        image: 'https://images.pexels.com/photos/1633565/pexels-photo-1633565.jpeg?auto=compress&cs=tinysrgb&w=600',
        category: 'Sides',
        isVeg: false,
      },
      {
        id: 'b4',
        name: 'Loaded Fries',
        description: 'Fries topped with cheese and jalapenos',
        price: 149,
        image: 'https://images.pexels.com/photos/1633565/pexels-photo-1633565.jpeg?auto=compress&cs=tinysrgb&w=600',
        category: 'Sides',
        isVeg: true,
      },
    ],
  },
  {
    id: '5',
    name: 'Chinese Wok',
    image: 'https://images.pexels.com/photos/2347311/pexels-photo-2347311.jpeg?auto=compress&cs=tinysrgb&w=600',
    cuisine: ['Chinese', 'Asian', 'Noodles'],
    rating: 4.3,
    deliveryTime: '35-40 mins',
    priceRange: '₹450 for two',
    distance: '4.1 km',
    address: 'Gachibowli, Hyderabad',
    offers: ['20% off on orders above ₹299'],
    menu: [
      {
        id: 'ch1',
        name: 'Hakka Noodles',
        description: 'Stir-fried noodles with vegetables',
        price: 180,
        image: 'https://images.pexels.com/photos/2347311/pexels-photo-2347311.jpeg?auto=compress&cs=tinysrgb&w=600',
        category: 'Noodles',
        isVeg: true,
      },
      {
        id: 'ch2',
        name: 'Chilli Chicken',
        description: 'Spicy chicken in Indo-Chinese style',
        price: 280,
        image: 'https://images.pexels.com/photos/2347311/pexels-photo-2347311.jpeg?auto=compress&cs=tinysrgb&w=600',
        category: 'Chicken',
        isVeg: false,
        isBestseller: true,
      },
      {
        id: 'ch3',
        name: 'Manchurian',
        description: 'Crispy veggie balls in tangy sauce',
        price: 200,
        image: 'https://images.pexels.com/photos/2347311/pexels-photo-2347311.jpeg?auto=compress&cs=tinysrgb&w=600',
        category: 'Appetizers',
        isVeg: true,
        isBestseller: true,
      },
      {
        id: 'ch4',
        name: 'Fried Rice',
        description: 'Classic fried rice with choice of veggies or chicken',
        price: 175,
        image: 'https://images.pexels.com/photos/2347311/pexels-photo-2347311.jpeg?auto=compress&cs=tinysrgb&w=600',
        category: 'Rice',
        isVeg: true,
      },
    ],
  },
  {
    id: '6',
    name: 'Haldiram\'s',
    image: 'https://images.pexels.com/photos/5408352/pexels-photo-5408352.jpeg?auto=compress&cs=tinysrgb&w=600',
    cuisine: ['North Indian', 'Mithai', 'Snacks'],
    rating: 4.4,
    deliveryTime: '40-45 mins',
    priceRange: '₹500 for two',
    distance: '5.2 km',
    address: 'Secunderabad, Hyderabad',
    offers: ['Free Gulab Jamun on orders above ₹500'],
    menu: [
      {
        id: 'h1',
        name: 'Chole Bhature',
        description: 'Spiced chickpeas with fluffy fried bread',
        price: 180,
        image: 'https://images.pexels.com/photos/5408352/pexels-photo-5408352.jpeg?auto=compress&cs=tinysrgb&w=600',
        category: 'Main Course',
        isVeg: true,
        isBestseller: true,
      },
      {
        id: 'h2',
        name: 'Pav Bhaji',
        description: 'Spiced vegetable mash served with buttered bread',
        price: 150,
        image: 'https://images.pexels.com/photos/5408352/pexels-photo-5408352.jpeg?auto=compress&cs=tinysrgb&w=600',
        category: 'Main Course',
        isVeg: true,
      },
      {
        id: 'h3',
        name: 'Gulab Jamun',
        description: 'Sweet milk dumplings in sugar syrup',
        price: 80,
        image: 'https://images.pexels.com/photos/5408352/pexels-photo-5408352.jpeg?auto=compress&cs=tinysrgb&w=600',
        category: 'Desserts',
        isVeg: true,
        isBestseller: true,
      },
      {
        id: 'h4',
        name: 'Dal Makhani',
        description: 'Creamy black lentils slow-cooked overnight',
        price: 220,
        image: 'https://images.pexels.com/photos/5408352/pexels-photo-5408352.jpeg?auto=compress&cs=tinysrgb&w=600',
        category: 'Main Course',
        isVeg: true,
      },
    ],
  },
  {
    id: '7',
    name: 'The Curry House',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    cuisine: ['Indian', 'North Indian', 'Casual Dining'],
    rating: 4.7,
    deliveryTime: '32-38 mins',
    priceRange: '₹450 for two',
    distance: '4.8 km',
    address: 'Jubilee Hills, Hyderabad',
    offers: ['15% off on family meals'],
    menu: [
      {
        id: 'th1',
        name: 'Butter Chicken',
        description: 'Creamy tomato gravy with tender chicken pieces',
        price: 280,
        image: 'https://images.unsplash.com/photo-1592351750512-4f8f2c8e5c0e?auto=format&fit=crop&w=900&q=80',
        category: 'Main Course',
        isVeg: false,
        isBestseller: true,
      },
      {
        id: 'th2',
        name: 'Paneer Tikka Masala',
        description: 'Chargrilled paneer in a rich spiced gravy',
        price: 240,
        image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=900&q=80',
        category: 'Main Course',
        isVeg: true,
      },
      {
        id: 'th3',
        name: 'Garlic Naan',
        description: 'Soft naan layered with garlic butter',
        price: 70,
        image: 'https://images.unsplash.com/photo-1549449397-5f5c9b1a6b89?auto=format&fit=crop&w=900&q=80',
        category: 'Sides',
        isVeg: true,
      },
      {
        id: 'th4',
        name: 'Masala Papad',
        description: 'Crispy papad topped with onion and spice',
        price: 60,
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80',
        category: 'Starters',
        isVeg: true,
      },
    ],
  },
  {
    id: '8',
    name: 'Sushi & Co.',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1200&q=80',
    cuisine: ['Japanese', 'Sushi', 'Asian'],
    rating: 4.6,
    deliveryTime: '28-32 mins',
    priceRange: '₹650 for two',
    distance: '3.7 km',
    address: 'Gachibowli, Hyderabad',
    offers: ['Free miso soup on orders above ₹500'],
    menu: [
      {
        id: 'su1',
        name: 'California Roll',
        description: 'Crisp cucumber and avocado sushi roll',
        price: 260,
        image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=900&q=80',
        category: 'Sushi',
        isVeg: true,
        isBestseller: true,
      },
      {
        id: 'su2',
        name: 'Spicy Tuna Roll',
        description: 'Fresh tuna layered with chili sauce',
        price: 320,
        image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=900&q=80',
        category: 'Sushi',
        isVeg: false,
      },
      {
        id: 'su3',
        name: 'Miso Soup',
        description: 'Warm soup with tofu and seaweed',
        price: 110,
        image: 'https://images.unsplash.com/photo-1547592166-23ac7d5cf1f0?auto=format&fit=crop&w=900&q=80',
        category: 'Soup',
        isVeg: true,
      },
      {
        id: 'su4',
        name: 'Veg Tempura',
        description: 'Lightly battered vegetables with dipping sauce',
        price: 190,
        image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=80',
        category: 'Sides',
        isVeg: true,
      },
    ],
  },
  {
    id: '9',
    name: 'Wrap & Roll',
    image: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=1200&q=80',
    cuisine: ['Wraps', 'Healthy', 'Fast Food'],
    rating: 4.3,
    deliveryTime: '20-25 mins',
    priceRange: '₹280 for two',
    distance: '2.3 km',
    address: 'Kondapur, Hyderabad',
    offers: ['Free drink with wraps'],
    menu: [
      {
        id: 'wr1',
        name: 'Chicken Caesar Wrap',
        description: 'Grilled chicken wrapped with greens and dressing',
        price: 180,
        image: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=900&q=80',
        category: 'Wraps',
        isVeg: false,
        isBestseller: true,
      },
      {
        id: 'wr2',
        name: 'Paneer Roll',
        description: 'Paneer kebab wrap with crunchy veggies',
        price: 160,
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80',
        category: 'Wraps',
        isVeg: true,
      },
      {
        id: 'wr3',
        name: 'Loaded Fries',
        description: 'Crispy fries with cheese and herbs',
        price: 120,
        image: 'https://images.unsplash.com/photo-1576107232684-2f4e0f7d2d46?auto=format&fit=crop&w=900&q=80',
        category: 'Sides',
        isVeg: true,
      },
      {
        id: 'wr4',
        name: 'Mint Cooler',
        description: 'Refreshing mint lemonade',
        price: 70,
        image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=900&q=80',
        category: 'Beverages',
        isVeg: true,
      },
    ],
  },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentRestaurant, setCurrentRestaurant] = useState<Restaurant | null>(null);

  const API_URL = 'http://localhost:8001/api';

  const addToCart = (item: MenuItem, restaurantId: string, restaurantName: string) => {
    setCart((prev) => {
      const existing = prev.find((ci) => ci.menuItem.id === item.id);
      if (existing) {
        return prev.map((ci) =>
          ci.menuItem.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
        );
      }
      return [...prev, { menuItem: item, quantity: 1, restaurantId, restaurantName }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((ci) => ci.menuItem.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((ci) => (ci.menuItem.id === itemId ? { ...ci, quantity } : ci))
    );
  };

  const clearCart = () => setCart([]);

  const getProductIdFromMenuItem = (menuItem: MenuItem) => {
    if (typeof menuItem.backendProductId === 'number') return menuItem.backendProductId;
    const match = String(menuItem.id).match(/(\d+)$/);
    return match ? Number(match[1]) : 0;
  };

  const toggleFavorite = (restaurantId: string) => {
    setFavorites((prev) =>
      prev.includes(restaurantId)
        ? prev.filter((id) => id !== restaurantId)
        : [...prev, restaurantId]
    );
  };

  const isFavorite = (restaurantId: string) => favorites.includes(restaurantId);

  const fetchOrders = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/orders/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok && Array.isArray(data)) {
        const formattedOrders: Order[] = data.map((o: any) => ({
          id: o.id,
          restaurantName: o.restaurantName,
          vendorId: o.vendorId,
          items: o.items,
          total: o.total,
          status: o.status,
          date: o.date,
          address: o.address,
          tip: o.tip || 0,
          paymentMode: o.paymentMode || 'COD',
          subtotal: o.subtotal,
          deliveryFee: o.deliveryFee,
          taxes: o.taxes,
          discount: o.discount,
        }));
        setOrders(formattedOrders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const placeOrder = async (address: string, paymentMode: string = 'COD', tip: number = 0, discount: number = 0) => {
    if (cart.length === 0) return;

    const payload = {
      items: cart.map((ci) => ({
        productId: getProductIdFromMenuItem(ci.menuItem),
        name: ci.menuItem.name,
        price: ci.menuItem.price,
        quantity: ci.quantity,
      })),
      address,
      paymentMode,
      deliveryFee: 40,
      discount,
      tip,
      restaurantName: cart[0].restaurantName,
      vendorId: cart[0].restaurantId,
    };

    let data;
    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify(payload),
      });

      data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Unable to place order');
      }
    } catch (error) {
      console.warn('Backend unavailable, simulating order placement:', error);
      const subtotal = payload.items.reduce((s, i) => s + i.price * i.quantity, 0);
      const taxes = Math.round(subtotal * 0.05);
      data = {
        id: `ORD${Date.now()}`,
        restaurantName: payload.restaurantName,
        items: payload.items,
        total: subtotal + 40 + taxes + tip - discount,
        status: 'preparing',
        date: new Date().toISOString().split('T')[0],
        address,
        tip,
        paymentMode,
        subtotal,
        deliveryFee: 40,
        taxes,
        discount,
        payment: paymentMode === 'ONLINE' ? {
          key: 'rzp_test_demo',
          amount: Math.round((subtotal + 40 + taxes + tip - discount) * 100),
          currency: 'INR',
          orderId: `ORD${Date.now()}`,
          name: 'Zamato Clone',
          description: 'Food order payment',
          prefill: { name: 'Customer', email: 'customer@example.com', contact: '9999999999' }
        } : undefined
      };
    }

    const newOrder: Order = {
      id: data.id,
      restaurantName: data.restaurantName,
      vendorId: data.vendorId || payload.vendorId,
      items: data.items,
      total: data.total,
      status: data.status,
      date: data.date,
      address: data.address,
      tip: data.tip || 0,
      paymentMode: data.paymentMode || 'COD',
      subtotal: data.subtotal,
      deliveryFee: data.deliveryFee,
      taxes: data.taxes,
      discount: data.discount,
    };

    setOrders((prev) => [newOrder, ...prev]);
    if (!data.payment) {
      clearCart();
    }
    return data;
  };

  const getCartTotal = () =>
    cart.reduce((sum, ci) => sum + ci.menuItem.price * ci.quantity, 0);

  const getCartItemCount = () =>
    cart.reduce((sum, ci) => sum + ci.quantity, 0);

  const clearAllData = () => {
    setCart([]);
    setOrders([]);
    setFavorites([]);
  };

  return (
    <AppContext.Provider
      value={{
        cart,
        favorites,
        orders,
        currentRestaurant,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleFavorite,
        isFavorite,
        setCurrentRestaurant,
        placeOrder,
        fetchOrders,
        getCartTotal,
        getCartItemCount,
        clearAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}

export { sampleRestaurants };
