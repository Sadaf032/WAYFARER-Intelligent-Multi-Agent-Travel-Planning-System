
import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 1. Health Check
export const checkBackend = async () => {
  const { data } = await API.get("/api/health");
  return data;
};

// 2. Destination Recommendation Agent
export const recommendDestinations = async (details) => {
  const { data } = await API.post(
    "/api/destinations/recommend",
    details
  );
  return data;
};

// 3. Budget Planning Agent
export const calculateBudget = async (details) => {
  const { data } = await API.post(
    "/api/budget/calculate",
    details
  );
  return data;
};

// 4. Transportation Agent
export const recommendTransportation = async (details) => {
  const { data } = await API.post(
    "/api/transportation/recommend",
    details
  );
  return data;
};

// 5. Accommodation Agent
export const recommendAccommodation = async (details) => {
  const { data } = await API.post(
    "/api/accommodation/recommend",
    details
  );
  return data;
};

// 6. Meal Planning Agent
export const calculateMeals = async (details) => {
  const { data } = await API.post(
    "/api/meals/calculate",
    details
  );
  return data;
};

// 7. Itinerary Planning Agent
export const generateItinerary = async (details) => {
  const { data } = await API.post(
    "/api/itinerary/generate",
    details
  );
  return data;
};

// 8. Complete Travel Coordinator
export const generateTravelPlan = async (tripDetails) => {
  const { data } = await API.post(
    "/api/travel-plan/generate",
    tripDetails
  );
  return data;
};

// 9. Weather Service
export const getWeather = async (destination) => {
  const { data } = await API.get("/api/weather", {
    params: { destination },
  });
  return data;
};

// 10. Currency Conversion
export const convertCurrency = async (
  amount,
  fromCurrency = "PKR",
  toCurrency = "USD"
) => {
  const { data } = await API.post(
    "/api/currency/convert",
    {
      amount,
      from_currency: fromCurrency,
      to_currency: toCurrency,
    }
  );
  return data;
};

// 11. Places & Attractions
export const getPlaces = async (
  destination,
  radius = 15000
) => {
  const { data } = await API.get("/api/places", {
    params: {
      destination,
      radius,
    },
  });
  return data;
};

export default API;
