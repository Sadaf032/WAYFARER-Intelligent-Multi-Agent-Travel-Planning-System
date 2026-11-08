import { useEffect, useMemo, useState } from "react";
import {Compass,MapPin,
  Plane,
  Wallet,
  CalendarDays,
  Users,
  Search,
  Heart,
  ArrowUpRight,
  ArrowRight,
  Sparkles,
  Bot,
  CloudSun,
  Bookmark,
  LayoutDashboard,
  Globe2,
  Menu,
  X,
  CheckCircle2,
  Clock3,
  Mountain,
  Waves,
  Landmark,
  ChevronDown,
  SlidersHorizontal,
  Navigation,
  Sun,
  Cloud,
  RefreshCw,
  Plus,
  Trash2,
  Send,
  ShieldCheck,
  Map,
  Hotel,
  Train,
  CircleDollarSign,
  MessageCircle,
  Star,
  Camera,
  CalendarCheck,
  PlaneTakeoff,
  Route,
  Info,
  BedDouble,
  Utensils,
  Coffee,
} from "lucide-react";
import "./index.css";
import "./App.css";
import TravelResultsDashboard from "./TravelResultsDashboard.jsx";
import {
  generateTravelPlan,
  convertCurrency,
  getWeather,
  calculateMeals,
} from "./services/api.js";

const destinations = [
  {
    id: 1,
    name: "Hunza Valley",
    country: "Pakistan",
    region: "Pakistan",
    price: 45000,
    days: 5,
    rating: "4.9",
    tag: "Mountain Escape",
    description:
      "Discover beautiful valleys, peaceful villages and breathtaking mountain views.",
    image:
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1000&q=85",
    icon: Mountain,
  },
  {
    id: 2,
    name: "Skardu",
    country: "Pakistan",
    region: "Pakistan",
    price: 55000,
    days: 5,
    rating: "4.9",
    tag: "Adventure",
    description:
      "Explore lakes, mountains and unforgettable landscapes in northern Pakistan.",
    image:
      "https://images.unsplash.com/photo-1597074866923-dc0589150358?w=1000&q=85",
    icon: Mountain,
  },
  {
    id: 3,
    name: "Swat Valley",
    country: "Pakistan",
    region: "Pakistan",
    price: 30000,
    days: 5,
    rating: "4.8",
    tag: "Nature",
    description: "Enjoy green valleys, rivers and relaxing mountain scenery.",
    image:
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1000&q=85",
    icon: Waves,
  },
  {
    id: 4,
    name: "Murree",
    country: "Pakistan",
    region: "Pakistan",
    price: 25000,
    days: 5,
    rating: "4.7",
    tag: "Relaxation",
    description:
      "A refreshing hill-station escape with pine forests and cool weather.",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1000&q=85",
    icon: Mountain,
  },
  {
    id: 5,
    name: "Paris",
    country: "France",
    region: "International",
    price: 280000,
    days: 5,
    rating: "4.9",
    tag: "Romantic",
    description:
      "Experience iconic landmarks, charming streets and world-famous culture.",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1000&q=85",
    icon: Landmark,
  },
  {
    id: 6,
    name: "Rome",
    country: "Italy",
    region: "International",
    price: 260000,
    days: 5,
    rating: "4.9",
    tag: "History",
    description:
      "Explore ancient architecture, historic streets and Italian cuisine.",
    image:
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1000&q=85",
    icon: Landmark,
  },
  {
    id: 7,
    name: "Venice",
    country: "Italy",
    region: "International",
    price: 290000,
    days: 5,
    rating: "4.8",
    tag: "Romantic",
    description:
      "Discover canals, bridges and the unique atmosphere of Venice.",
    image:
      "https://images.unsplash.com/photo-1514890547357-a9ee288728e0?w=1000&q=85",
    icon: Waves,
  },
  {
    id: 8,
    name: "London",
    country: "United Kingdom",
    region: "International",
    price: 320000,
    days: 5,
    rating: "4.8",
    tag: "City Life",
    description: "Explore historic attractions, museums and vibrant city life.",
    image:
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1000&q=85",
    icon: Landmark,
  },
  {
    id: 9,
    name: "Swiss Alps",
    country: "Switzerland",
    region: "International",
    price: 390000,
    days: 5,
    rating: "5.0",
    tag: "Nature",
    description:
      "Experience alpine villages, mountain views and beautiful lakes.",
    image:
      "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1000&q=85",
    icon: Mountain,
  },
  {
    id: 10,
    name: "Amsterdam",
    country: "Netherlands",
    region: "International",
    price: 300000,
    days: 5,
    rating: "4.8",
    tag: "Culture",
    description:
      "Enjoy canals, art museums and beautiful European architecture.",
    image:
      "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?w=1000&q=85",
    icon: Landmark,
  },
  {
    id: 11,
    name: "Barcelona",
    country: "Spain",
    region: "International",
    price: 275000,
    days: 5,
    rating: "4.8",
    tag: "Culture",
    description: "Discover architecture, beaches and lively Spanish culture.",
    image:
      "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=1000&q=85",
    icon: Waves,
  },
  {
    id: 12,
    name: "Berlin",
    country: "Germany",
    region: "International",
    price: 270000,
    days: 5,
    rating: "4.7",
    tag: "City Life",
    description: "Explore modern culture, history and creative neighborhoods.",
    image:
      "https://images.unsplash.com/photo-1560969184-10fe8719e047?w=1000&q=85",
    icon: Landmark,
  },
  {
    id: 13,
    name: "Santorini",
    country: "Greece",
    region: "International",
    price: 350000,
    days: 5,
    rating: "4.9",
    tag: "Beach",
    description: "Enjoy whitewashed buildings, blue domes and sunset views.",
    image:
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1000&q=85",
    icon: Waves,
  },
  {
    id: 14,
    name: "Prague",
    country: "Czech Republic",
    region: "International",
    price: 245000,
    days: 5,
    rating: "4.8",
    tag: "History",
    description:
      "Walk through beautiful old streets and historic architecture.",
    image:
      "https://images.unsplash.com/photo-1541849546-216549ae216d?w=1000&q=85",
    icon: Landmark,
  },
  {
    id: 15,
    name: "Vienna",
    country: "Austria",
    region: "International",
    price: 285000,
    days: 5,
    rating: "4.8",
    tag: "Culture",
    description: "Discover elegant palaces, music and classic European charm.",
    image:
      "https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=1000&q=85",
    icon: Landmark,
  },
  {
    id: 16,
    name: "Istanbul",
    country: "Turkey",
    region: "International",
    price: 190000,
    days: 5,
    rating: "4.9",
    tag: "Culture",
    description:
      "Experience a unique blend of historic landmarks and modern life.",
    image:
      "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1000&q=85",
    icon: Landmark,
  },
  {
    id: 17,
    name: "Beijing",
    country: "China",
    region: "International",
    price: 230000,
    days: 5,
    rating: "4.8",
    tag: "History",
    description: "Visit remarkable historic sites and explore Chinese culture.",
    image:
      "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=1000&q=85",
    icon: Landmark,
  },
  {
    id: 18,
    name: "Shanghai",
    country: "China",
    region: "International",
    price: 250000,
    days: 5,
    rating: "4.8",
    tag: "City Life",
    description: "Discover modern skylines, shopping and waterfront views.",
    image:
      "https://images.unsplash.com/photo-1538428494232-9c0d8a3ab403?w=1000&q=85",
    icon: Landmark,
  },
  {
    id: 19,
    name: "Seoul",
    country: "South Korea",
    region: "International",
    price: 280000,
    days: 5,
    rating: "4.9",
    tag: "City Life",
    description:
      "Explore Korean culture, modern neighborhoods and food markets.",
    image:
      "https://images.unsplash.com/photo-1538485399081-7191377e8241?w=1000&q=85",
    icon: Landmark,
  },
  {
    id: 20,
    name: "Busan",
    country: "South Korea",
    region: "International",
    price: 260000,
    days: 5,
    rating: "4.8",
    tag: "Beach",
    description: "Enjoy coastal scenery, beaches and vibrant local markets.",
    image:
      "https://images.unsplash.com/photo-1570789210967-2cac24afeb00?w=1000&q=85",
    icon: Waves,
  },
  {
    id: 21,
    name: "Pyongyang",
    country: "North Korea",
    region: "International",
    price: 450000,
    days: 5,
    rating: "—",
    tag: "Restricted",
    description:
      "Travel is highly restricted and subject to official authorization and current entry rules.",
    image:
      "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1000&q=85",
    icon: Landmark,
  },
  {
    id: 22,
    name: "Bali",
    country: "Indonesia",
    region: "International",
    price: 220000,
    days: 5,
    rating: "4.9",
    tag: "Beach",
    description:
      "Discover tropical beaches, temples and peaceful island escapes.",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1000&q=85",
    icon: Waves,
  },
  {
    id: 23,
    name: "Dubai",
    country: "UAE",
    region: "International",
    price: 180000,
    days: 5,
    rating: "4.8",
    tag: "Luxury",
    description:
      "Experience iconic architecture, desert adventures and shopping.",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1000&q=85",
    icon: Landmark,
  },
  {
    id: 24,
    name: "Malaysia",
    country: "Malaysia",
    region: "International",
    price: 170000,
    days: 5,
    rating: "4.8",
    tag: "Nature",
    description: "Explore tropical landscapes, modern cities and local food.",
    image:
      "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=1000&q=85",
    icon: Waves,
  },
  {
    id: 25,
    name: "Tokyo",
    country: "Japan",
    region: "International",
    price: 310000,
    days: 5,
    rating: "4.9",
    tag: "City Life",
    description:
      "Discover technology, traditional culture and exciting neighborhoods.",
    image:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1000&q=85",
    icon: Landmark,
  },
  {
    id: 26,
    name: "Bangkok",
    country: "Thailand",
    region: "International",
    price: 190000,
    days: 5,
    rating: "4.8",
    tag: "Culture",
    description: "Explore temples, street food and energetic city markets.",
    image:
      "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=1000&q=85",
    icon: Landmark,
  },
  {
    id: 27,
    name: "Zurich",
    country: "Switzerland",
    region: "International",
    price: 370000,
    days: 5,
    rating: "4.9",
    tag: "Nature",
    description:
      "Enjoy lakeside views, beautiful streets and nearby mountain escapes.",
    image:
      "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=1000&q=85",
    icon: Mountain,
  },
];

const agents = [
  {
    number: "01",
    name: "Destination Recommendation",
    role: "Find your perfect destination",
    description:
      "Analyzes your interests, travel style and budget to recommend suitable destinations.",
    icon: Compass,
  },
  {
    number: "02",
    name: "Budget Planning",
    role: "Make every rupee count",
    description:
      "Estimates trip expenses and helps balance your travel budget.",
    icon: Wallet,
  },
  {
    number: "03",
    name: "Transportation",
    role: "Plan your journey",
    description:
      "Helps compare transportation options and organize travel routes.",
    icon: Plane,
  },
  {
    number: "04",
    name: "Accommodation",
    role: "Find your ideal stay",
    description:
      "Plans accommodation according to property type, category, room selection and number of nights.",
    icon: Hotel,
  },
  {
    number: "05",
    name: "Meal Planning",
    role: "Organize your meals",
    description:
      "Calculates meal expenses according to breakfast, lunch and dinner preferences.",
    icon: Utensils,
  },
  {
    number: "06",
    name: "Itinerary Planning",
    role: "Build your daily schedule",
    description:
      "Organizes activities and sightseeing into a practical daily itinerary.",
    icon: CalendarDays,
  },
  {
    number: "07",
    name: "Travel Coordinator",
    role: "Bring everything together",
    description:
      "Coordinates the agents and combines their results into one complete travel plan.",
    icon: Bot,
  },
];

const formatPKR = (amount) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [saved, setSaved] = useState(() => readStorage("travelmate_saved", []));
  const [trips, setTrips] = useState(() => readStorage("travelmate_trips", []));
  const [selectedDestination, setSelectedDestination] =
    useState("Hunza Valley");
  const [budget, setBudget] = useState("100000");
  const [travelers, setTravelers] = useState("2");
  const [days, setDays] = useState("5");
  const [startDate, setStartDate] = useState("");
  const [travelStyle, setTravelStyle] = useState("Adventure");
  const [tripMessage, setTripMessage] = useState("");
  const [agentLoading, setAgentLoading] = useState(false);
  const [agentError, setAgentError] = useState("");
  const [agentResult, setAgentResult] = useState(null);
  const [agentRunAt, setAgentRunAt] = useState("");
  const [agentChatStep, setAgentChatStep] = useState(0);
  const [agentChatAnswers, setAgentChatAnswers] = useState({});
  const [agentChatMessages, setAgentChatMessages] = useState([]);
  const [agentChatInput, setAgentChatInput] = useState("");
  const [agentChatDietary, setAgentChatDietary] = useState([]);
  const [agentChatStarted, setAgentChatStarted] = useState(false);
  const [editingAgentAnswer, setEditingAgentAnswer] = useState(null);
  const [agentChatReturnStep, setAgentChatReturnStep] = useState(0);
  const [editingHadResult, setEditingHadResult] = useState(false);

  const [accommodationType, setAccommodationType] = useState("Hotel");
  const [hotelCategory, setHotelCategory] = useState("Standard");
  const [roomType, setRoomType] = useState("Double Room");
  const [rooms, setRooms] = useState("1");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [breakfast, setBreakfast] = useState("Included");
  const [lunch, setLunch] = useState("Separate");
  const [dinner, setDinner] = useState("Separate");

  const [dietaryPreferences, setDietaryPreferences] = useState([]);
  const [mealAgentResult, setMealAgentResult] = useState(null);
  const [mealAgentLoading, setMealAgentLoading] = useState(false);
  const [mealAgentError, setMealAgentError] = useState("");

  const [currencyAmount, setCurrencyAmount] = useState("100");
  const [currencyFrom, setCurrencyFrom] = useState("USD");
  const [currencyTo, setCurrencyTo] = useState("PKR");
  const [currencyResult, setCurrencyResult] = useState(null);
  const [currencyLoading, setCurrencyLoading] = useState(false);
  const [currencyError, setCurrencyError] = useState("");

  const [weatherDestination, setWeatherDestination] = useState("Hunza Valley");
  const [weatherResult, setWeatherResult] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState("");

  useEffect(() => {
    localStorage.setItem("travelmate_saved", JSON.stringify(saved));
  }, [saved]);

  useEffect(() => {
    localStorage.setItem("travelmate_trips", JSON.stringify(trips));
  }, [trips]);

  const selected =
    destinations.find(
      (destination) => destination.name === selectedDestination,
    ) || destinations[0];

  const suggestedBudget = Math.round(
    selected.price *
      (Math.max(1, Number(days) || 1) / 5) *
      Math.max(1, Number(travelers) || 1),
  );

  const accommodationRates = {
    Hotel: { Budget: 5000, Standard: 10000, Premium: 20000 },
    "Guest House": { Budget: 3000, Standard: 6000, Premium: 12000 },
    Resort: { Budget: 8000, Standard: 15000, Premium: 30000 },
  };

  const roomMultipliers = {
    "Single Room": 0.75,
    "Double Room": 1,
    "Family Room": 1.5,
    Suite: 2,
  };

  const validDates =
    checkIn && checkOut && new Date(checkOut) > new Date(checkIn);

  const accommodationNights = validDates
    ? Math.ceil((new Date(checkOut) - new Date(checkIn)) / 86400000)
    : Math.max(1, Number(days) || 1);

  const roomCount = Math.min(10, Math.max(1, Number(rooms) || 1));

  const accommodationCost = Math.round(
    accommodationRates[accommodationType][hotelCategory] *
      roomMultipliers[roomType] *
      accommodationNights *
      roomCount,
  );

  const mealRates = {
    breakfast: 1000,
    lunch: 1500,
    dinner: 1800,
  };

  const mealCost =
    ((breakfast === "Separate" ? mealRates.breakfast : 0) +
      (lunch === "Separate" ? mealRates.lunch : 0) +
      (dinner === "Separate" ? mealRates.dinner : 0)) *
    accommodationNights *
    Math.max(1, Number(travelers) || 1);

  const completeTripEstimate = suggestedBudget + accommodationCost + mealCost;

  const filteredDestinations = useMemo(() => {
    return destinations.filter((destination) => {
      const matchesSearch =
        `${destination.name} ${destination.country} ${destination.tag}`
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesFilter =
        filter === "All" ||
        destination.region === filter ||
        destination.tag === filter;

      return matchesSearch && matchesFilter;
    });
  }, [search, filter]);

  const goTo = (page) => {
    setActivePage(page);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleSaved = (id) => {
    setSaved((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id],
    );
  };

  const agentChatQuestions = [
    { key: "destination", question: "Where would you like to travel?", type: "select", options: ["Hunza Valley", "Skardu", "Swat Valley", "Murree", "Istanbul", "Dubai", "Bangkok", "Kuala Lumpur", "Beijing", "Seoul", "Rome", "Paris"] },
    { key: "travel_style", question: "What kind of trip are you looking for?", type: "choice", options: ["Adventure", "Family", "Relaxation", "Luxury", "Culture", "Shopping"] },
    { key: "days", question: "How many days will your trip last?", type: "number", placeholder: "For example, 5", min: 1, max: 30 },
    { key: "travelers", question: "How many people will be traveling?", type: "number", placeholder: "For example, 2", min: 1, max: 20 },
    { key: "transport_preference", question: "Which main transportation would you prefer?", type: "choice", options: ["Car", "Bus", "Train", "Flight"] },
    { key: "include_local_transport", question: "Should I include local transportation at your destination?", type: "choice", options: ["Yes", "No"] },
    { key: "accommodation_type", question: "What type of accommodation would you prefer?", type: "choice", options: ["Hotel", "Guest House", "Resort"] },
    { key: "accommodation_tier", question: "Which accommodation category suits you?", type: "choice", options: ["Budget", "Standard", "Premium"] },
    { key: "room_type", question: "What kind of room do you need?", type: "choice", options: ["Single", "Double", "Twin", "Family"] },
    { key: "breakfast", question: "How would you like to handle breakfast?", type: "choice", options: ["Included", "Separate", "Skip"] },
    { key: "lunch", question: "How would you like to handle lunch?", type: "choice", options: ["Included", "Separate", "Skip"] },
    { key: "dinner", question: "How would you like to handle dinner?", type: "choice", options: ["Included", "Separate", "Skip"] },
    { key: "dietary_preferences", question: "Do you have any dietary preferences? Select all that apply.", type: "multi", options: ["Vegetarian", "Vegan", "Halal", "Gluten-free", "Dairy-free", "No preference"] },
    { key: "budget_pkr", question: "What is your total trip budget in PKR?", type: "number", placeholder: "For example, 150000", min: 1 },
    { key: "departure_date", question: "What is your departure date? (Optional)", type: "date", optional: true },
    { key: "special_requests", question: "Any special requests? (Optional)", type: "text", placeholder: "Tell me anything else I should consider...", optional: true },
  ];

  const startAgentConversation = () => {
    setAgentChatAnswers({});
    setAgentChatStep(0);
    setAgentChatMessages([
      { role: "assistant", text: "Hello! I'm WAYFARER, your travel-planning assistant. I'll ask a few questions one at a time to build your trip." },
    ]);
    setAgentChatInput("");
    setAgentChatDietary([]);
    setAgentError("");
    setAgentResult(null);
    setEditingAgentAnswer(null);
    setAgentChatReturnStep(0);
    setEditingHadResult(false);
    setAgentChatStarted(true);
  };

  const beginEditAgentAnswer = (answerKey) => {
    const questionIndex = agentChatQuestions.findIndex((item) => item.key === answerKey);
    if (questionIndex < 0) return;
    const currentValue = agentChatAnswers[answerKey];
    // Keep the current position so editing an earlier answer doesn't repeat its question.
    setAgentChatReturnStep(agentChatStep);
    setEditingHadResult(Boolean(agentResult));
    setAgentChatStep(questionIndex);
    setAgentChatInput(currentValue == null || Array.isArray(currentValue) ? "" : String(currentValue));
    setAgentChatDietary(Array.isArray(currentValue) ? currentValue : []);
    setEditingAgentAnswer(answerKey);
    setAgentError("");
    setAgentResult(null);
    setAgentChatStarted(true);
  };

  
const submitAgentConversation = async (answers) => {
  const destinationInfo = destinations.find(
    (item) => item.name === answers.destination
  );

  if (!destinationInfo) {
    setAgentError("Please choose a supported destination from the list.");
    return;
  }

  // Safely convert numeric values
  const budget = Number(
    String(answers.budget_pkr ?? answers.budget ?? "").replace(/[,\s]/g, "")
  );

  const daysCount = Number(answers.days);
  const travelerCount = Number(answers.travelers);

  const roomType = answers.room_type || "Double";

  const roomCapacity =
    roomType === "Single" ? 1 :
    roomType === "Family" ? 4 : 2;

  const rooms = Math.max(
    1,
    Math.ceil(travelerCount / roomCapacity)
  );

  // Validate before sending request
  if (!Number.isFinite(budget) || budget <= 0) {
    setAgentError("Please enter a valid budget.");
    return;
  }

  if (!Number.isInteger(daysCount) || daysCount < 1 || daysCount > 30) {
    setAgentError("Days must be between 1 and 30.");
    return;
  }

  if (!Number.isInteger(travelerCount) || travelerCount < 1 || travelerCount > 20) {
    setAgentError("Travelers must be between 1 and 20.");
    return;
  }

  const payload = {
    destination: answers.destination,
    budget_pkr: Math.round(budget),
    days: daysCount,
    travelers: travelerCount,

    region: destinationInfo.region,
    preferred_region: destinationInfo.region,
    travel_style: answers.travel_style || "Adventure",

    accommodation_type: answers.accommodation_type || "Hotel",
    accommodation_tier: answers.accommodation_tier || "Standard",
    room_type: roomType,
    rooms,

    breakfast: answers.breakfast || "Included",
    lunch: answers.lunch || "Separate",
    dinner: answers.dinner || "Separate",

    dietary_preferences: Array.isArray(answers.dietary_preferences)
      ? answers.dietary_preferences.filter(
          (item) => item !== "No preference"
        )
      : [],

    transport_preference: String(
      answers.transport_preference || "any"
    ).toLowerCase(),

    include_local_transport:
      answers.include_local_transport === true ||
      answers.include_local_transport === "Yes",

    departure_date: answers.departure_date || null,
    special_requests: answers.special_requests || "",
  };

  console.log("FINAL TRAVEL PLAN PAYLOAD:", payload);

  setAgentLoading(true);
  setAgentError("");
  setAgentResult(null);
  setEditingAgentAnswer(null);

  try {
    const response = await generateTravelPlan(payload);

    setAgentResult(response);
    setAgentRunAt(new Date().toLocaleString());

    setAgentChatMessages((previous) => [
      ...previous.filter(
        (message) =>
          !message.text?.startsWith("Your trip plan is ready.")
      ),
      {
        role: "assistant",
        text: "Your trip plan is ready. I've combined the recommendations from the WAYFARER planning agents below.",
      },
    ]);
  } catch (error) {
    console.error("Travel Plan API Error:", error.response?.data || error);

    const message =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.message ||
      "Unable to generate travel plan.";

    setAgentError(
      typeof message === "string" ? message : JSON.stringify(message)
    );
  } finally {
    setAgentLoading(false);
  }
};

  
const answerAgentQuestion = async (rawValue) => {
  const question = agentChatQuestions[agentChatStep];

  if (!question) return;

  const value =
    question.type === "number"
      ? Number(rawValue)
      : rawValue;

  // Number validation
  if (
    question.type === "number" &&
    (
      !Number.isFinite(value) ||
      !Number.isInteger(value) ||
      value < question.min ||
      (question.max && value > question.max)
    )
  ) {
    setAgentError(
      question.max
        ? `Please enter a whole number between ${question.min} and ${question.max}.`
        : "Please enter a valid amount greater than zero."
    );
    return;
  }

  // Required field validation
  if (
    !question.optional &&
    (
      value === "" ||
      value == null ||
      (Array.isArray(value) && value.length === 0)
    )
  ) {
    setAgentError("Please answer this question to continue.");
    return;
  }

  const updatedAnswers = {
    ...agentChatAnswers,
    [question.key]: value,
  };

  setAgentChatAnswers(updatedAnswers);
  setAgentError("");
  setAgentChatInput("");

  const displayValue = Array.isArray(value)
    ? value.join(", ") || "No preference"
    : String(value) || "Skipped";

  // EDIT EXISTING ANSWER
  if (editingAgentAnswer === question.key) {

    setAgentChatMessages((previous) =>
      previous.map((message) =>
        message.role === "user" &&
        message.answerKey === question.key
          ? { ...message, text: displayValue }
          : message
      )
    );

    setEditingAgentAnswer(null);

    setAgentChatDietary(
      Array.isArray(value) ? value : []
    );

    // Regenerate an already-created plan; otherwise return to the previous question.
    if (editingHadResult) {
      setEditingHadResult(false);
      await submitAgentConversation(updatedAnswers);
    } else {
      setAgentChatStep(agentChatReturnStep);
      setAgentChatInput("");
    }

    return;
  }

  // ADD NEW ANSWER
  setAgentChatMessages((previous) => [
    ...previous,
    {
      role: "assistant",
      text: question.question,
    },
    {
      role: "user",
      answerKey: question.key,
      text: displayValue,
    },
  ]);

  // LAST QUESTION
  if (agentChatStep === agentChatQuestions.length - 1) {
    await submitAgentConversation(updatedAnswers);
    return;
  }

  // NEXT QUESTION
  setAgentChatStep((step) => step + 1);
};


  const toggleDietaryPreference = (preference) => {
    setDietaryPreferences((previous) =>
      previous.includes(preference)
        ? previous.filter((item) => item !== preference)
        : [...previous, preference],
    );
  };

  const handleMealPlanning = async () => {
    if (
      !Number.isInteger(Number(days)) ||
      Number(days) < 1 ||
      Number(days) > 30
    ) {
      setMealAgentError("Trip duration must be between 1 and 30 days.");
      return;
    }

    if (
      !Number.isInteger(Number(travelers)) ||
      Number(travelers) < 1 ||
      Number(travelers) > 20
    ) {
      setMealAgentError("Please enter between 1 and 20 travelers.");
      return;
    }

    try {
      setMealAgentLoading(true);
      setMealAgentError("");
      setMealAgentResult(null);

      const payload = {
        destination: selected.name,
        region: selected.region,
        days: Number(days),
        travelers: Number(travelers),
        breakfast,
        lunch,
        dinner,
        dietary_preferences: dietaryPreferences,
      };

      const result = await calculateMeals(payload);
      setMealAgentResult(result);
    } catch (error) {
      const detail = error.response?.data?.detail;

      setMealAgentError(
        typeof detail === "string"
          ? detail
          : error.message || "Unable to generate meal plan.",
      );
    } finally {
      setMealAgentLoading(false);
    }
  };

  const createTrip = (event) => {
    event.preventDefault();

    const travelerCount = Number(travelers);
    const duration = Number(days);
    const totalBudget = Number(budget);

    if (
      !Number.isInteger(travelerCount) ||
      travelerCount < 1 ||
      travelerCount > 20
    ) {
      setTripMessage("Please enter between 1 and 20 travelers.");
      return;
    }

    if (!Number.isInteger(duration) || duration < 1 || duration > 30) {
      setTripMessage("Trip duration must be between 1 and 30 days.");
      return;
    }

    if (!Number.isFinite(totalBudget) || totalBudget <= 0) {
      setTripMessage("Please enter a valid travel budget.");
      return;
    }

    if (Number(rooms) < 1 || Number(rooms) > 10) {
      setTripMessage("Please select between 1 and 10 rooms.");
      return;
    }

    if ((checkIn && !checkOut) || (!checkIn && checkOut)) {
      setTripMessage("Please select both check-in and check-out dates.");
      return;
    }

    if (checkIn && checkOut && !validDates) {
      setTripMessage("Check-out date must be after check-in date.");
      return;
    }

    const newTrip = {
      id: Date.now(),
      destination: selected.name,
      country: selected.country,
      budget: totalBudget,
      travelers: travelerCount,
      days: duration,
      date: startDate,
      style: travelStyle,
      accommodation: {
        type: accommodationType,
        category: hotelCategory,
        roomType,
        rooms: roomCount,
        checkIn,
        checkOut,
        nights: accommodationNights,
        estimatedCost: accommodationCost,
        availability: "Not live verified",
      },
      meals: {
        breakfast,
        lunch,
        dinner,
        estimatedCost: mealCost,
      },
      estimate: completeTripEstimate,
      budgetStatus: totalBudget >= completeTripEstimate ? "within" : "over",
      createdAt: new Date().toISOString(),
    };

    setTrips((previous) => [newTrip, ...previous]);

    setTripMessage(
      totalBudget >= completeTripEstimate
        ? "Your complete travel plan has been saved successfully!"
        : "Trip saved! Your budget is below the complete estimated cost.",
    );
  };

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard },
    { label: "Discover Destinations", icon: Compass },
    { label: "Plan a Trip", icon: Plane },
    { label: "AI Agents", icon: Bot },
    { label: "My Itineraries", icon: CalendarDays },
    { label: "Saved Destinations", icon: Heart },
    { label: "Weather & Currency", icon: CloudSun },
  ];

  const destinationCard = (destination) => {
    const Icon = destination.icon;
    const isSaved = saved.includes(destination.id);

    return (
      <article className="destination-card" key={destination.id}>
        <div className="destination-image-wrap">
          <img src={destination.image} alt={destination.name} />
          <span className="destination-tag">{destination.tag}</span>
          <button
            className={`save-button ${isSaved ? "is-saved" : ""}`}
            onClick={() => toggleSaved(destination.id)}
            aria-label="Save destination"
          >
            <Heart size={17} fill={isSaved ? "currentColor" : "none"} />
          </button>
        </div>

        <div className="destination-card-content">
          <div className="destination-location">
            <MapPin size={13} /> {destination.country}
          </div>

          <div className="destination-title-row">
            <h3>{destination.name}</h3>
            <span className="rating">
              <Star size={13} fill="currentColor" /> {destination.rating}
            </span>
          </div>

          <p>{destination.description}</p>

          <div className="destination-card-bottom">
            <div>
              <small>Estimated from</small>
              <strong>{formatPKR(destination.price)}</strong>
            </div>

            <button
              className="icon-arrow-button"
              onClick={() => {
                setSelectedDestination(destination.name);
                goTo("Plan a Trip");
              }}
              aria-label={`Plan trip to ${destination.name}`}
            >
              <ArrowUpRight size={18} />
            </button>
          </div>

          <span className="destination-icon">
            <Icon size={15} />
          </span>
        </div>
      </article>
    );
  };

  const renderDashboard = () => (
    <>
      <section className="hero-section">
        <div className="hero-background" />
        <div className="hero-overlay" />

        <div className="hero-content">
          <div className="hero-left">
            <div className="hero-tag">
              <span className="hero-tag-dot" />
              YOUR JOURNEY, INTELLIGENTLY PLANNED
            </div>

            <h1>
              Explore the world.
              <br />
              <em>We plan the details.</em>
            </h1>

            <p>
              Your personal AI travel companion. Discover destinations, organize
              your budget and create journeys that feel truly yours.
            </p>

            <div className="hero-actions">
              <button
                className="hero-primary-btn"
                onClick={() => goTo("Plan a Trip")}
              >
                Plan your trip <ArrowRight size={17} />
              </button>

              <button
                className="hero-secondary-btn"
                onClick={() => goTo("Discover Destinations")}
              >
                Explore destinations
              </button>
            </div>

            <div className="hero-stats">
              <div>
                <strong>27+</strong>
                <span>Destinations</span>
              </div>
              <div>
                <strong>07</strong>
                <span>AI Agents</span>
              </div>
              <div>
                <strong>01</strong>
                <span>Smart Planner</span>
              </div>
            </div>
          </div>

          <div className="hero-right">
            <div className="hero-image-main">
              <img
                src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1100&q=90"
                alt="Beautiful mountain landscape in Hunza"
              />
            </div>

            <div className="hero-image-small">
              <img
                src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=700&q=85"
                alt="Scenic travel destination"
              />
            </div>

            <div className="floating-budget-card">
              <span className="budget-card-icon">
                <Wallet size={17} />
              </span>
              <div>
                <small>Smart budget planning</small>
                <strong>Travel within your budget</strong>
              </div>
              <CheckCircle2 size={18} className="budget-check" />
            </div>

            <div className="floating-location">
              <MapPin size={14} /> Hunza Valley, Pakistan
            </div>
          </div>
        </div>

        <div className="hero-bottom-text">
          MADE FOR CURIOUS MINDS AND OPEN ROADS
        </div>
      </section>

      <section className="welcome-row">
        <div>
          <span className="eyebrow">YOUR TRAVEL OVERVIEW</span>
          <h2>Plan smarter, travel better.</h2>
          <p>Everything you need to organize your next adventure.</p>
        </div>

        <button className="outline-button" onClick={() => goTo("Plan a Trip")}>
          Create a trip <Plus size={16} />
        </button>
      </section>

      <section className="stats-grid">
        <div className="stat-card">
          <span className="stat-icon green">
            <Globe2 />
          </span>
          <div>
            <small>Destinations</small>
            <strong>27</strong>
            <span>Pakistan & worldwide</span>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-icon gold">
            <Bot />
          </span>
          <div>
            <small>AI Agents</small>
            <strong>07</strong>
            <span>Collaborative planning</span>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-icon peach">
            <CalendarCheck />
          </span>
          <div>
            <small>My Itineraries</small>
            <strong>{trips.length}</strong>
            <span>Your saved travel plans</span>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-icon pink">
            <Heart />
          </span>
          <div>
            <small>Saved Places</small>
            <strong>{saved.length}</strong>
            <span>Your favorite destinations</span>
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <span className="eyebrow">HANDPICKED FOR YOU</span>
            <h2>Popular destinations</h2>
            <p>Find inspiration for your next escape.</p>
          </div>

          <button
            className="text-link"
            onClick={() => goTo("Discover Destinations")}
          >
            View all destinations <ArrowRight size={16} />
          </button>
        </div>

        <div className="destination-grid">
          {destinations.slice(0, 4).map(destinationCard)}
        </div>
      </section>

      <section className="agent-highlight">
        <div className="agent-highlight-copy">
          <span className="eyebrow light">
            INTELLIGENCE BEHIND YOUR JOURNEY
          </span>
          <h2>
            Seven AI agents.
            <br />
            <em>One seamless trip.</em>
          </h2>
          <p>
            Seven specialized agents work together to help you discover, plan
            and organize your travel experience.
          </p>
          <button className="light-button" onClick={() => goTo("AI Agents")}>
            Meet your AI agents <ArrowRight size={16} />
          </button>
        </div>

        <div className="agent-orbit">
          <div className="orbit-center">
            <Bot size={35} />
            <span>TRAVEL AI</span>
          </div>

          {agents.map((agent, index) => {
            const Icon = agent.icon;
            return (
              <div
                className={`orbit-agent orbit-agent-${index + 1}`}
                key={agent.number}
              >
                <Icon size={20} />
              </div>
            );
          })}
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <span className="eyebrow">HOW IT WORKS</span>
            <h2>Your next trip, simplified.</h2>
          </div>
        </div>

        <div className="steps-grid">
          <div className="step-card">
            <span>01</span>
            <Compass />
            <h3>Choose a destination</h3>
            <p>Explore places that match your interests and travel style.</p>
          </div>
          <div className="step-card">
            <span>02</span>
            <Wallet />
            <h3>Set your budget</h3>
            <p>Tell us your budget, duration and number of travelers.</p>
          </div>
          <div className="step-card">
            <span>03</span>
            <Sparkles />
            <h3>Plan with AI</h3>
            <p>Organize your journey with the help of specialized agents.</p>
          </div>
        </div>
      </section>
    </>
  );

  const renderDiscover = () => (
    <section className="page-content">
      <div className="page-intro">
        <span className="eyebrow">FIND YOUR NEXT ESCAPE</span>
        <h1>Discover destinations</h1>
        <p>From Pakistan's beautiful valleys to iconic international cities.</p>
      </div>

      <div className="discover-toolbar">
        <div className="search-box">
          <Search size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search destinations or countries..."
          />
        </div>

        <div className="filter-box">
          <SlidersHorizontal size={16} />
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option>All</option>
            <option>Pakistan</option>
            <option>International</option>
            <option>Adventure</option>
            <option>Nature</option>
            <option>Culture</option>
            <option>Beach</option>
            <option>History</option>
            <option>City Life</option>
            <option>Romantic</option>
            <option>Luxury</option>
            <option>Restricted</option>
            <option>Relaxation</option>
          </select>
          <ChevronDown size={15} />
        </div>
      </div>

      <div className="results-line">
        <span>{filteredDestinations.length} destinations found</span>
        <span>Estimated budgets are per person for 5 days</span>
      </div>

      {filteredDestinations.length ? (
        <div className="destination-grid discover-grid">
          {filteredDestinations.map(destinationCard)}
        </div>
      ) : (
        <div className="empty-state">
          <Search size={30} />
          <h3>No destinations found</h3>
          <p>Try a different search or filter.</p>
          <button
            className="outline-button"
            onClick={() => {
              setSearch("");
              setFilter("All");
            }}
          >
            Clear filters
          </button>
        </div>
      )}
    </section>
  );

  const renderPlanner = () => (
    <section className="page-content">
      <div className="page-intro">
        <span className="eyebrow">YOUR JOURNEY STARTS HERE</span>
        <h1>Plan your next trip</h1>
        <p>Share a few details and let your travel planning begin.</p>
      </div>

      <div className="planner-layout">
        <form className="planner-form" onSubmit={createTrip}>
          <div className="form-heading">
            <span className="form-heading-icon">
              <PlaneTakeoff />
            </span>
            <div>
              <h2>Build your travel plan</h2>
              <p>Tell us what your ideal trip looks like.</p>
            </div>
          </div>

          <label className="field-label">Destination</label>
          <div className="field-wrap">
            <MapPin size={17} />
            <select
              value={selectedDestination}
              onChange={(e) => {
                setSelectedDestination(e.target.value);
                setTripMessage("");
              }}
            >
              {destinations.map((destination) => (
                <option key={destination.id} value={destination.name}>
                  {destination.name}, {destination.country}
                </option>
              ))}
            </select>
            <ChevronDown size={16} />
          </div>

          <div className="form-two-columns">
            <div>
              <label className="field-label">Number of travelers</label>
              <div className="field-wrap">
                <Users size={17} />
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={travelers}
                  onChange={(e) => setTravelers(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="field-label">Trip duration (days)</label>
              <div className="field-wrap">
                <CalendarDays size={17} />
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                />
              </div>
            </div>
          </div>

          <label className="field-label">Departure date</label>
          <div className="field-wrap">
            <CalendarDays size={17} />
            <input
              type="date"
              value={startDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <label className="field-label">Your total budget (PKR)</label>
          <div className="field-wrap">
            <Wallet size={17} />
            <input
              type="number"
              min="1"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="Enter your budget"
            />
          </div>

          <label className="field-label">Travel style</label>
          <div className="style-options">
            {["Adventure", "Relaxation", "Culture", "Luxury"].map((style) => (
              <button
                type="button"
                key={style}
                className={`style-option ${travelStyle === style ? "active" : ""}`}
                onClick={() => setTravelStyle(style)}
              >
                {style}
              </button>
            ))}
          </div>

          {/* ACCOMMODATION SECTION */}

          <div className="accommodation-section">
            <div className="form-heading accommodation-heading">
              <span className="form-heading-icon">
                <BedDouble />
              </span>
              <div>
                <h2>Accommodation & Meals</h2>
                <p>Choose your stay and organize your daily meals.</p>
              </div>
            </div>

            <label className="field-label">Accommodation type</label>
            <div className="field-wrap">
              <Hotel size={17} />
              <select
                value={accommodationType}
                onChange={(e) => setAccommodationType(e.target.value)}
              >
                <option>Hotel</option>
                <option>Guest House</option>
                <option>Resort</option>
              </select>
              <ChevronDown size={16} />
            </div>

            <label className="field-label">Accommodation category</label>
            <div className="style-options">
              {["Budget", "Standard", "Premium"].map((category) => (
                <button
                  type="button"
                  key={category}
                  className={`style-option ${hotelCategory === category ? "active" : ""}`}
                  onClick={() => setHotelCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="form-two-columns">
              <div>
                <label className="field-label">Check-in date</label>
                <div className="field-wrap">
                  <CalendarDays size={17} />
                  <input
                    type="date"
                    value={checkIn}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => {
                      setCheckIn(e.target.value);
                      if (checkOut && e.target.value >= checkOut) {
                        setCheckOut("");
                      }
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="field-label">Check-out date</label>
                <div className="field-wrap">
                  <CalendarDays size={17} />
                  <input
                    type="date"
                    value={checkOut}
                    min={checkIn || new Date().toISOString().split("T")[0]}
                    onChange={(e) => setCheckOut(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="form-two-columns">
              <div>
                <label className="field-label">Room type</label>
                <div className="field-wrap">
                  <BedDouble size={17} />
                  <select
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value)}
                  >
                    <option>Single Room</option>
                    <option>Double Room</option>
                    <option>Family Room</option>
                    <option>Suite</option>
                  </select>
                  <ChevronDown size={16} />
                </div>
              </div>

              <div>
                <label className="field-label">Number of rooms</label>
                <div className="field-wrap">
                  <Users size={17} />
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={rooms}
                    onChange={(e) => setRooms(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="meal-planning-heading">
              <Utensils size={19} />
              <div>
                <h3>Meal preferences</h3>
                <p>Select which meals are part of your hotel package.</p>
              </div>
            </div>

            {[
              {
                label: "Breakfast",
                value: breakfast,
                setter: setBreakfast,
                icon: Coffee,
              },
              {
                label: "Lunch",
                value: lunch,
                setter: setLunch,
                icon: Utensils,
              },
              {
                label: "Dinner",
                value: dinner,
                setter: setDinner,
                icon: Utensils,
              },
            ].map((meal) => {
              const MealIcon = meal.icon;

              return (
                <div className="meal-option-row" key={meal.label}>
                  <div className="meal-option-title">
                    <MealIcon size={17} />
                    <strong>{meal.label}</strong>
                  </div>

                  <select
                    value={meal.value}
                    onChange={(e) => meal.setter(e.target.value)}
                  >
                    <option value="Included">Included in hotel</option>
                    <option value="Separate">Separate cost</option>
                    <option value="Skip">Not required</option>
                  </select>
                </div>
              );
            })}

            {/* DIETARY PREFERENCES */}

            <div className="meal-planning-heading">
              <Utensils size={19} />
              <div>
                <h3>Dietary preferences</h3>
                <p>
                  Choose your food preferences for personalized recommendations.
                </p>
              </div>
            </div>

            <div className="style-options">
              {[
                "Halal",
                "Vegetarian",
                "Vegan",
                "Gluten-Free",
                "No Seafood",
              ].map((preference) => (
                <button
                  type="button"
                  key={preference}
                  className={`style-option ${
                    dietaryPreferences.includes(preference) ? "active" : ""
                  }`}
                  onClick={() => toggleDietaryPreference(preference)}
                >
                  {dietaryPreferences.includes(preference) && (
                    <CheckCircle2 size={14} />
                  )}
                  {preference}
                </button>
              ))}
            </div>

            <button
              className="submit-trip-button"
              type="button"
              onClick={handleMealPlanning}
              disabled={mealAgentLoading}
            >
              {mealAgentLoading ? (
                <>
                  <RefreshCw size={17} className="agent-loading-icon" />
                  Generating meal plan...
                </>
              ) : (
                <>
                  <Sparkles size={17} />
                  Get AI Meal Plan
                  <ArrowRight size={17} />
                </>
              )}
            </button>

            {mealAgentError && (
              <div className="trip-message error">
                <Info size={15} />
                {mealAgentError}
              </div>
            )}

            {mealAgentResult && (
              <div className="agent-result meal-agent-result">
                <div className="tool-card-heading">
                  <span className="tool-icon">
                    <Utensils />
                  </span>
                  <div>
                    <h2>AI Meal Plan</h2>
                    <p>
                      Personalized meal recommendations for{" "}
                      {mealAgentResult.destination}.
                    </p>
                  </div>
                </div>

                <div className="preview-cost-breakdown">
                  <div>
                    <span>Destination</span>
                    <strong>{mealAgentResult.destination}</strong>
                  </div>
                  <div>
                    <span>Duration</span>
                    <strong>{mealAgentResult.days} days</strong>
                  </div>
                  <div>
                    <span>Travelers</span>
                    <strong>{mealAgentResult.travelers}</strong>
                  </div>
                  <div>
                    <span>Dietary preferences</span>
                    <strong>
                      {mealAgentResult.dietary_preferences?.join(", ") ||
                        "None"}
                    </strong>
                  </div>
                </div>

                <h3>Meal cost breakdown</h3>

                {Object.entries(mealAgentResult.meals || {}).map(
                  ([mealName, meal]) => (
                    <div className="meal-option-row" key={mealName}>
                      <div className="meal-option-title">
                        <Utensils size={16} />
                        <strong>
                          {mealName.charAt(0).toUpperCase() + mealName.slice(1)}
                        </strong>
                      </div>
                      <div>
                        <strong>{formatPKR(meal.total_cost)}</strong>
                        <small> ({meal.preference})</small>
                      </div>
                    </div>
                  ),
                )}

                <div className="accommodation-total">
                  <span>Total estimated meal cost</span>
                  <strong>{formatPKR(mealAgentResult.total_meal_cost)}</strong>
                </div>

                <h3>Recommended meals</h3>

                {Object.entries(mealAgentResult.recommendations || {}).map(
                  ([mealName, foods]) => (
                    <div className="meal-recommendation-group" key={mealName}>
                      <h4>
                        {mealName.charAt(0).toUpperCase() + mealName.slice(1)}
                      </h4>

                      {(Array.isArray(foods) ? foods : []).map(
                        (food, index) => (
                          <div
                            className="meal-recommendation-card"
                            key={`${mealName}-${index}`}
                          >
                            <strong>{food.name}</strong>
                            <p>{food.description}</p>

                            {food.dietary_tags?.length > 0 && (
                              <small>{food.dietary_tags.join(" · ")}</small>
                            )}

                            {food.local_specialty && (
                              <small>
                                Local specialty: {food.local_specialty}
                              </small>
                            )}
                          </div>
                        ),
                      )}
                    </div>
                  ),
                )}

                <p className="disclaimer-note">
                  <Info size={14} />
                  {mealAgentResult.notice ||
                    "Meal prices are estimates and may vary by location and restaurant."}
                </p>

                <small>
                  Source: {mealAgentResult.source || "WAYFARER Meal Agent"}
                </small>
              </div>
            )}

            <div className="accommodation-estimate">
              <div>
                <span>Accommodation estimate</span>
                <strong>{formatPKR(accommodationCost)}</strong>
              </div>

              <div>
                <span>Separate meal estimate</span>
                <strong>{formatPKR(mealCost)}</strong>
              </div>

              <div className="accommodation-total">
                <span>Accommodation + meals</span>
                <strong>{formatPKR(accommodationCost + mealCost)}</strong>
              </div>

              <p>
                <Info size={14} />
                Estimated costs only. Hotel prices, availability and meal
                packages are not live verified.
              </p>
            </div>
          </div>

          {tripMessage && (
            <div
              className={`trip-message ${
                tripMessage.includes("below")
                  ? "warning"
                  : tripMessage.includes("successfully")
                    ? "success"
                    : "error"
              }`}
            >
              {tripMessage}
            </div>
          )}

          <button className="submit-trip-button" type="submit">
            Create my travel plan <ArrowRight size={17} />
          </button>
        </form>

        <aside className="planner-preview">
          <div className="preview-image">
            <img src={selected.image} alt={selected.name} />
            <span>
              <MapPin size={13} /> YOUR SELECTED DESTINATION
            </span>
          </div>

          <div className="preview-content">
            <span className="eyebrow">TRIP OVERVIEW</span>
            <h2>{selected.name}</h2>
            <p>{selected.description}</p>

            <div className="preview-details">
              <div>
                <Users size={16} />
                <span>{travelers || 0} travelers</span>
              </div>
              <div>
                <CalendarDays size={16} />
                <span>{days || 0} days</span>
              </div>
              <div>
                <Compass size={16} />
                <span>{travelStyle}</span>
              </div>
            </div>

            <div className="estimate-box">
              <span>Complete estimated trip budget</span>
              <strong>{formatPKR(completeTripEstimate)}</strong>
              <small>
                Includes destination estimate, accommodation and separately paid
                meals. This is not a live quote.
              </small>
            </div>

            <div className="preview-cost-breakdown">
              <div>
                <span>Base trip estimate</span>
                <strong>{formatPKR(suggestedBudget)}</strong>
              </div>
              <div>
                <span>Accommodation</span>
                <strong>{formatPKR(accommodationCost)}</strong>
              </div>
              <div>
                <span>Separate meals</span>
                <strong>{formatPKR(mealCost)}</strong>
              </div>
              <div>
                <span>Stay duration</span>
                <strong>{accommodationNights} nights</strong>
              </div>
            </div>

            <div
              className={`budget-comparison ${
                Number(budget) >= completeTripEstimate ? "good" : "low"
              }`}
            >
              <Info size={15} />
              {Number(budget) >= completeTripEstimate
                ? "Your entered budget covers this estimate."
                : "Your entered budget is below this estimate."}
            </div>

            <div className="availability-notice">
              <ShieldCheck size={16} />
              <span>Hotel availability: Not live verified</span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );

  const renderAgents = () => {
    const question = agentChatQuestions[agentChatStep];
    return (
      <section className="page-content">
        <div className="page-intro">
          <span className="eyebrow">THE TEAM BEHIND YOUR TRIP</span>
          <h1>Your AI travel assistant</h1>
          <p>Tell WAYFARER about your journey. I'll ask one question at a time and prepare a complete travel plan.</p>
        </div>

        <div className="agent-intro-banner">
          <div className="agent-intro-icon"><Bot size={34} /></div>
          <div>
            <span className="eyebrow light">MULTI-AGENT TRAVEL PLANNING</span>
            <h2>One conversation. Your complete trip.</h2>
            <p>The coordinator combines destination, budget, transport, accommodation, meals and itinerary planning.</p>
          </div>
        </div>

        <div className="agent-list">
          {agents.map((agent) => {
            const Icon = agent.icon;
            return (
              <article className="agent-card" key={agent.number}>
                <div className="agent-number">{agent.number}</div>
                <div className="agent-card-icon"><Icon size={23} /></div>
                <div className="agent-card-copy"><h3>{agent.name}</h3><strong>{agent.role}</strong><p>{agent.description}</p></div>
                <span className="agent-status"><span />Ready</span>
              </article>
            );
          })}
        </div>

        <div className="tool-card agent-run-panel wayfarer-chat-card">
          <div className="tool-card-heading">
            <span className="tool-icon"><MessageCircle /></span>
            <div><h2>Let's plan your journey</h2><p>Answer the questions below to personalize your travel plan.</p></div>
          </div>

          {!agentChatStarted ? (
            <div className="wayfarer-chat-start">
              <div className="wayfarer-chat-avatar"><Bot size={28} /></div>
              <h3>Ready to plan your next trip?</h3>
              <p>I'll ask about your destination, travel style, budget, stay, meals and transport.</p>
              <button className="submit-trip-button" type="button" onClick={startAgentConversation}><Sparkles size={17} /> Start conversation <ArrowRight size={17} /></button>
            </div>
          ) : (
            <>
              <div className="wayfarer-chat-progress"><span>TRIP DETAILS</span><strong>{Math.min(agentChatStep + (agentResult ? 1 : 0), agentChatQuestions.length)} / {agentChatQuestions.length}</strong><div><span style={{ width: `${agentResult ? 100 : (agentChatStep / agentChatQuestions.length) * 100}%` }} /></div></div>
              <div className="wayfarer-chat-messages">
                {agentChatMessages.map((message, index) => (
                  <div className={`wayfarer-chat-message ${message.role}`} key={`${message.role}-${index}`}>
                    {message.role === "assistant" && <span className="wayfarer-chat-mini-avatar"><Bot size={16} /></span>}
                    <p>{message.text}</p>
                    {message.role === "user" && message.answerKey && !agentLoading && (
                      <button type="button" className="wayfarer-chat-edit-answer" style={{ marginLeft: 8, border: "1px solid #cbd5e1", borderRadius: 8, padding: "4px 9px", background: "transparent", color: "inherit", cursor: "pointer", fontSize: 12 }} onClick={() => beginEditAgentAnswer(message.answerKey)}>
                        Edit
                      </button>
                    )}
                  </div>
                ))}
                {question && !agentResult && !agentLoading && (
                  <div className="wayfarer-chat-message assistant">
                    <span className="wayfarer-chat-mini-avatar"><Bot size={16} /></span>
                    <div className="wayfarer-chat-question">
                      {editingAgentAnswer && <div className="wayfarer-chat-editing-note" style={{ marginBottom: 10, padding: "9px 12px", borderRadius: 8, background: "#eff6ff", color: "#1d4ed8", fontSize: 13 }}>Editing your previous answer. Saving will regenerate the trip plan with all other answers preserved.</div>}
                      <p>{question.question}</p>
                      {question.type === "choice" || question.type === "select" ? (
                        <div className="wayfarer-chat-options">{question.options.map((option) => <button type="button" key={option} onClick={() => answerAgentQuestion(option)}>{option}</button>)}</div>
                      ) : question.type === "multi" ? (
                        <><div className="wayfarer-chat-options multi">{question.options.map((option) => <button type="button" key={option} className={agentChatDietary.includes(option) ? "selected" : ""} onClick={() => setAgentChatDietary((previous) => previous.includes(option) ? previous.filter((item) => item !== option) : [...previous.filter((item) => item !== "No preference" && option !== "No preference"), option])}>{option}</button>)}</div><button className="wayfarer-chat-send" type="button" onClick={() => answerAgentQuestion(agentChatDietary)}>Continue <ArrowRight size={15} /></button></>
                      ) : (
                        <div className="wayfarer-chat-input-row"><input type={question.type === "date" ? "date" : question.type === "number" ? "number" : "text"} min={question.min} max={question.max} placeholder={question.placeholder} value={agentChatInput} onChange={(event) => setAgentChatInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") answerAgentQuestion(agentChatInput); }} /><button className="wayfarer-chat-send" type="button" onClick={() => answerAgentQuestion(agentChatInput)}><Send size={15} /></button>{question.optional && <button className="wayfarer-chat-skip" type="button" onClick={() => answerAgentQuestion("")}>Skip</button>}</div>
                      )}
                    </div>
                  </div>
                )}
                {agentLoading && <div className="wayfarer-chat-message assistant"><span className="wayfarer-chat-mini-avatar"><Bot size={16} /></span><p>I'm coordinating your travel plan. This may take a moment...</p></div>}
              </div>
              {agentError && <div className="trip-message error"><Info size={15} />{agentError}</div>}
              <div className="wayfarer-chat-footer"><button type="button" className="wayfarer-chat-reset" onClick={startAgentConversation}>Start over</button><span>Your answers are used to create this trip plan.</span></div>
            </>
          )}

          {agentResult && <div className="agent-result">
            <div className="tool-card-heading"><span className="tool-icon"><CheckCircle2 /></span><div><h2>Your complete trip is ready</h2><p>Generated by the WAYFARER multi-agent coordinator.</p></div></div>
            <div className="results-line"><span>Execution completed</span><span>{agentRunAt}</span></div>
            <div className="wayfarer-trip-edit-actions" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", margin: "18px 0", padding: 14, border: "1px solid #e2e8f0", borderRadius: 12 }}>
              <p style={{ margin: 0 }}>Want to change your destination, dates, budget, stay, meals or transport?</p>
              <button type="button" className="primary-button" onClick={() => { setAgentResult(null); setAgentChatStarted(true); setEditingAgentAnswer(null); setAgentChatStep(0); setAgentChatInput(""); setAgentChatDietary([]); setAgentError(""); }}>
                <SlidersHorizontal size={16} /> Edit trip details
              </button>
            </div>
            <TravelResultsDashboard result={agentResult} />
          </div>}
        </div>

        <p className="disclaimer-note"><Info size={15} />The coordinator returns a combined result after processing the agents. This guided chat is a structured questionnaire, not a live LLM conversation. Hotel availability and prices are estimates and should be verified before booking.</p>
      </section>
    );
  };

  const renderItineraries = () => (
    <section className="page-content">
      <div className="page-intro page-intro-row">
        <div>
          <span className="eyebrow">YOUR TRAVEL COLLECTION</span>
          <h1>My itineraries</h1>
          <p>All the trips you have created are collected here.</p>
        </div>

        <button className="primary-button" onClick={() => goTo("Plan a Trip")}>
          <Plus size={17} /> New trip
        </button>
      </div>

      {trips.length === 0 ? (
        <div className="empty-state">
          <CalendarDays size={34} />
          <h3>Your travel plans will appear here</h3>
          <p>
            You haven't created a trip yet. Start planning your next adventure.
          </p>
          <button
            className="primary-button"
            onClick={() => goTo("Plan a Trip")}
          >
            Create your first trip <ArrowRight size={16} />
          </button>
        </div>
      ) : (
        <div className="itinerary-grid">
          {trips.map((trip) => {
            const destination = destinations.find(
              (item) => item.name === trip.destination,
            );

            return (
              <article className="itinerary-card" key={trip.id}>
                <div className="itinerary-image">
                  <img
                    src={destination?.image || destinations[0].image}
                    alt={trip.destination}
                  />
                  <span>{trip.style}</span>
                </div>

                <div className="itinerary-body">
                  <div className="itinerary-title-row">
                    <div>
                      <span className="destination-location">
                        <MapPin size={13} /> {trip.country}
                      </span>
                      <h3>{trip.destination}</h3>
                    </div>

                    <button
                      className="delete-trip"
                      title="Delete trip"
                      onClick={() =>
                        setTrips((previous) =>
                          previous.filter((item) => item.id !== trip.id),
                        )
                      }
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>

                  <div className="itinerary-meta">
                    <span>
                      <Users size={14} /> {trip.travelers} travelers
                    </span>
                    <span>
                      <Clock3 size={14} /> {trip.days} days
                    </span>
                  </div>

                  <div className="itinerary-meta">
                    <span>
                      <CalendarDays size={14} />{" "}
                      {trip.date || "Date not selected"}
                    </span>
                  </div>

                  {trip.accommodation && (
                    <div className="saved-accommodation">
                      <div className="saved-section-title">
                        <BedDouble size={16} />
                        <strong>Accommodation</strong>
                      </div>

                      <p>
                        {trip.accommodation.category} {trip.accommodation.type}
                        {" · "}
                        {trip.accommodation.roomType}
                      </p>

                      <p>
                        {trip.accommodation.rooms} room(s) ·{" "}
                        {trip.accommodation.nights} nights
                      </p>

                      <p>
                        Check-in: {trip.accommodation.checkIn || "Not selected"}
                      </p>

                      <p>
                        Check-out:{" "}
                        {trip.accommodation.checkOut || "Not selected"}
                      </p>

                      <div className="saved-meals">
                        <div className="saved-section-title">
                          <Utensils size={15} />
                          <strong>Meal plan</strong>
                        </div>

                        <p>
                          Breakfast: {trip.meals?.breakfast || "Not selected"}
                        </p>
                        <p>Lunch: {trip.meals?.lunch || "Not selected"}</p>
                        <p>Dinner: {trip.meals?.dinner || "Not selected"}</p>
                      </div>

                      <span className="saved-verification">
                        <Info size={13} /> Not live verified
                      </span>
                    </div>
                  )}

                  <div className="itinerary-cost">
                    <div>
                      <small>Your budget</small>
                      <strong>{formatPKR(trip.budget)}</strong>
                    </div>

                    <div>
                      <small>Estimated cost</small>
                      <strong>{formatPKR(trip.estimate)}</strong>
                    </div>
                  </div>

                  <div
                    className={`itinerary-budget-status ${trip.budgetStatus || "within"}`}
                  >
                    {trip.budgetStatus === "over"
                      ? "Below estimated budget"
                      : "Within estimated budget"}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );

  const renderSaved = () => {
    const savedDestinations = destinations.filter((destination) =>
      saved.includes(destination.id),
    );

    return (
      <section className="page-content">
        <div className="page-intro">
          <span className="eyebrow">YOUR PERSONAL COLLECTION</span>
          <h1>Saved destinations</h1>
          <p>Keep the places you love close to your next travel plan.</p>
        </div>

        {savedDestinations.length ? (
          <div className="destination-grid">
            {savedDestinations.map(destinationCard)}
          </div>
        ) : (
          <div className="empty-state">
            <Heart size={34} />
            <h3>No saved destinations yet</h3>
            <p>
              Save destinations you like and find them here whenever you return.
            </p>
            <button
              className="primary-button"
              onClick={() => goTo("Discover Destinations")}
            >
              Explore destinations <ArrowRight size={16} />
            </button>
          </div>
        )}
      </section>
    );
  };

  const handleCurrencyConvert = async () => {
    const amount = Number(currencyAmount);

    if (!Number.isFinite(amount) || amount <= 0) {
      setCurrencyError("Please enter a valid amount greater than zero.");
      setCurrencyResult(null);
      return;
    }

    if (currencyFrom === currencyTo) {
      setCurrencyResult({
        amount,
        from_currency: currencyFrom,
        to_currency: currencyTo,
        exchange_rate: 1,
        converted_amount: amount,
        notice: "No conversion required.",
      });
      setCurrencyError("");
      return;
    }

    try {
      setCurrencyLoading(true);
      setCurrencyError("");
      setCurrencyResult(null);

      const result = await convertCurrency(amount, currencyFrom, currencyTo);
      setCurrencyResult(result);
    } catch (error) {
      const detail = error.response?.data?.detail;
      setCurrencyError(
        typeof detail === "string"
          ? detail
          : error.message || "Currency conversion failed. Please try again.",
      );
    } finally {
      setCurrencyLoading(false);
    }
  };

  const handleWeatherSearch = async (event) => {
    event?.preventDefault();
    const query = weatherDestination.trim();

    if (!query) {
      setWeatherError("Please enter a city, place or country.");
      setWeatherResult(null);
      return;
    }

    try {
      setWeatherLoading(true);
      setWeatherError("");
      setWeatherResult(null);
      const result = await getWeather(query);
      setWeatherResult(result);
    } catch (error) {
      const detail = error.response?.data?.detail;
      setWeatherError(
        typeof detail === "string"
          ? detail
          : error.message ||
              "Unable to load weather. Please try another location.",
      );
    } finally {
      setWeatherLoading(false);
    }
  };

  const weatherDescription = (code) => {
    if (code === 0) return "Clear sky";
    if ([1, 2].includes(code)) return "Mainly clear / partly cloudy";
    if (code === 3) return "Overcast";
    if ([45, 48].includes(code)) return "Foggy";
    if ([51, 53, 55, 56, 57].includes(code)) return "Drizzle";
    if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "Rain showers";
    if ([71, 73, 75, 77, 85, 86].includes(code)) return "Snow";
    if ([95, 96, 99].includes(code)) return "Thunderstorm";
    return "Weather information";
  };

  const renderWeather = () => {
    const current = weatherResult?.current_weather;
    const daily = weatherResult?.daily_forecast;

    return (
      <section className="page-content">
        <div className="page-intro">
          <span className="eyebrow">TRAVEL INFORMATION</span>
          <h1>Weather & currency</h1>
          <p>
            Check live weather conditions for destinations in Pakistan and
            around the world.
          </p>
        </div>

        <div className="tools-grid">
          <div className="tool-card">
            <div className="tool-card-heading">
              <span className="tool-icon">
                <CloudSun />
              </span>
              <div>
                <h2>Destination weather</h2>
                <p>Search any city, valley or place worldwide.</p>
              </div>
            </div>

            <form className="currency-form" onSubmit={handleWeatherSearch}>
              <label className="field-label" htmlFor="weather-destination">
                City or destination
              </label>
              <div className="search-box">
                <MapPin size={18} />
                <input
                  id="weather-destination"
                  type="text"
                  value={weatherDestination}
                  onChange={(e) => setWeatherDestination(e.target.value)}
                  placeholder="e.g. Karachi, Hunza, Dubai, London"
                  autoComplete="off"
                />
              </div>

              <div
                className="style-options"
                aria-label="Popular weather destinations"
              >
                {[
                  "Karachi",
                  "Lahore",
                  "Hunza",
                  "Skardu",
                  "Dubai",
                  "London",
                ].map((place) => (
                  <button
                    type="button"
                    key={place}
                    className="style-option"
                    onClick={() => setWeatherDestination(place)}
                  >
                    {place}
                  </button>
                ))}
              </div>

              <button
                className="submit-trip-button"
                type="submit"
                disabled={weatherLoading}
              >
                {weatherLoading ? (
                  <>
                    <RefreshCw size={17} className="agent-loading-icon" />{" "}
                    Checking weather...
                  </>
                ) : (
                  <>
                    <Search size={17} /> Check Weather <ArrowRight size={17} />
                  </>
                )}
              </button>
            </form>

            {weatherError && (
              <div className="trip-message error">
                <Info size={15} />
                {weatherError}
              </div>
            )}

            {current && weatherResult && (
              <div className="currency-result weather-result">
                <div className="tool-card-heading">
                  <span className="tool-icon">
                    <CloudSun />
                  </span>
                  <div>
                    <small>Current weather</small>
                    <h2>
                      {weatherResult.location?.name},{" "}
                      {weatherResult.location?.country}
                    </h2>
                    <span>
                      {weatherResult.location?.timezone || "Local time zone"}
                    </span>
                  </div>
                </div>

                <div className="weather-current-reading">
                  <strong>{Math.round(current.temperature_2m)}°C</strong>
                  <span>{weatherDescription(current.weather_code)}</span>
                </div>

                <div className="preview-cost-breakdown">
                  <div>
                    <span>Feels like</span>
                    <strong>{current.apparent_temperature ?? "—"}°C</strong>
                  </div>
                  <div>
                    <span>Humidity</span>
                    <strong>{current.relative_humidity_2m ?? "—"}%</strong>
                  </div>
                  <div>
                    <span>Wind speed</span>
                    <strong>{current.wind_speed_10m ?? "—"} km/h</strong>
                  </div>
                  <div>
                    <span>Precipitation</span>
                    <strong>{current.precipitation ?? "—"} mm</strong>
                  </div>
                </div>

                {daily?.time?.length > 0 && (
                  <div className="weather-forecast">
                    <h3>7-day forecast</h3>
                    <div className="weather-forecast-list">
                      {daily.time.map((date, index) => (
                        <div className="weather-forecast-day" key={date}>
                          <span>
                            {new Date(`${date}T12:00:00`).toLocaleDateString(
                              "en",
                              { weekday: "short", day: "numeric" },
                            )}
                          </span>
                          <small>
                            {weatherDescription(daily.weather_code?.[index])}
                          </small>
                          <strong>
                            {Math.round(daily.temperature_2m_max?.[index] ?? 0)}
                            ° /{" "}
                            {Math.round(daily.temperature_2m_min?.[index] ?? 0)}
                            °C
                          </strong>
                          <small>
                            Rain:{" "}
                            {daily.precipitation_probability_max?.[index] ?? 0}%
                          </small>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <small>
                  {weatherResult.source || "Open-Meteo"} ·{" "}
                  {weatherResult.notice}
                </small>
              </div>
            )}
          </div>

          <div className="tool-card">
            <div className="tool-card-heading">
              <span className="tool-icon gold">
                <CircleDollarSign />
              </span>
              <div>
                <h2>Currency converter</h2>
                <p>Prepare for international travel expenses.</p>
              </div>
            </div>

            <div className="currency-form">
              <label className="field-label">Amount</label>
              <input
                type="number"
                min="0"
                value={currencyAmount}
                onChange={(e) => setCurrencyAmount(e.target.value)}
              />

              <div className="currency-selects">
                <div>
                  <label className="field-label">From</label>
                  <select
                    value={currencyFrom}
                    onChange={(e) => setCurrencyFrom(e.target.value)}
                  >
                    {[
                      "USD",
                      "EUR",
                      "GBP",
                      "AED",
                      "PKR",
                      "CNY",
                      "KRW",
                      "JPY",
                    ].map((currency) => (
                      <option key={currency}>{currency}</option>
                    ))}
                  </select>
                </div>

                <button
                  className="swap-currency"
                  type="button"
                  onClick={() => {
                    setCurrencyFrom(currencyTo);
                    setCurrencyTo(currencyFrom);
                  }}
                >
                  <RefreshCw size={16} />
                </button>

                <div>
                  <label className="field-label">To</label>
                  <select
                    value={currencyTo}
                    onChange={(e) => setCurrencyTo(e.target.value)}
                  >
                    {[
                      "PKR",
                      "USD",
                      "EUR",
                      "GBP",
                      "AED",
                      "CNY",
                      "KRW",
                      "JPY",
                    ].map((currency) => (
                      <option key={currency}>{currency}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                className="submit-trip-button"
                type="button"
                onClick={handleCurrencyConvert}
                disabled={currencyLoading}
              >
                {currencyLoading ? (
                  <>
                    <RefreshCw size={17} className="agent-loading-icon" />{" "}
                    Converting...
                  </>
                ) : (
                  <>
                    <CircleDollarSign size={17} /> Convert Currency{" "}
                    <ArrowRight size={17} />
                  </>
                )}
              </button>

              {currencyError && (
                <div className="trip-message error">
                  <Info size={15} />
                  {currencyError}
                </div>
              )}

              {currencyResult && (
                <div className="currency-result">
                  <small>Converted Amount</small>
                  <strong>
                    {new Intl.NumberFormat("en", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(currencyResult.converted_amount)}{" "}
                    {currencyResult.to_currency}
                  </strong>
                  <span>
                    {currencyResult.amount} {currencyResult.from_currency} ={" "}
                    {currencyResult.converted_amount}{" "}
                    {currencyResult.to_currency}
                  </span>
                  <span>
                    Exchange rate: 1 {currencyFrom} ={" "}
                    {currencyResult.exchange_rate} {currencyTo}
                  </span>
                  {currencyResult.rate_date && (
                    <span>Rate date: {currencyResult.rate_date}</span>
                  )}
                  <small>
                    {currencyResult.notice ||
                      "Reference exchange rate. Actual bank rates may differ."}
                  </small>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="disclaimer-note">
          <Info size={15} />
          Weather data and forecasts are provided by Open-Meteo. Search for a
          city or specific destination for its local conditions; a country does
          not have one single temperature.
        </div>
      </section>
    );
  };

  const renderPage = () => {
    switch (activePage) {
      case "Discover Destinations":
        return renderDiscover();
      case "Plan a Trip":
        return renderPlanner();
      case "AI Agents":
        return renderAgents();
      case "My Itineraries":
        return renderItineraries();
      case "Saved Destinations":
        return renderSaved();
      case "Weather & Currency":
        return renderWeather();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="app-shell">
      {mobileOpen && (
        <button
          className="mobile-backdrop"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        />
      )}

      <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">
            <Compass size={24} />
          </div>
          <div>
            <strong>
              WAYFARER<span>.</span>
            </strong>
            <small>INTELLIGENT TRAVEL</small>
          </div>
          <button className="mobile-close" onClick={() => setMobileOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="sidebar-label">WORKSPACE</div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                className={`nav-item ${activePage === item.label ? "active" : ""}`}
                onClick={() => goTo(item.label)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
                {item.label === "Saved Destinations" && saved.length > 0 && (
                  <small>{saved.length}</small>
                )}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-help-icon">
            <Sparkles size={19} />
          </div>
          <strong>Ready for a new adventure?</strong>
          <p>Your next journey is only a plan away.</p>
          <button onClick={() => goTo("Plan a Trip")}>
            Start planning <ArrowUpRight size={15} />
          </button>
          <div className="sidebar-footer">WAYFARER AI · 2026</div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button className="mobile-menu" onClick={() => setMobileOpen(true)}>
              <Menu size={21} />
            </button>
            <div className="breadcrumb">
              Workspace <span>/</span> <strong>{activePage}</strong>
            </div>
          </div>

          <div className="topbar-right">
            <span className="system-status">
              <span /> Travel planning workspace
            </span>
            <div className="topbar-compass">
              <Compass size={18} />
            </div>
          </div>
        </header>

        <div className="page-wrapper">{renderPage()}</div>

        <footer className="main-footer">
          <span>© 2026 WAYFARER AI</span>
          <span>Thoughtful journeys start here.</span>
          <button onClick={() => goTo("Dashboard")}>Back to top ↑</button>
        </footer>
      </main>
    </div>
  );
}

export default App;
