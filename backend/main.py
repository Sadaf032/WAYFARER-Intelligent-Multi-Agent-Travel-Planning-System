from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# ==========================================
# AGENTS
# ==========================================

from agents.meal_agent import calculate_meal_plan
from agents.itinerary_agent import generate_itinerary
from agents.destination_agent import recommend_destinations
from agents.budget_agent import calculate_trip_budget
from agents.transportation_agent import recommend_transportation
from agents.accommodation_agent import recommend_accommodation
from agents.coordinator_agent import coordinate_travel_plan


# ==========================================
# SERVICES
# ==========================================

from services.weather_service import get_weather
from services.currency_service import convert_currency
from services.places_service import get_places


# ==========================================
# FASTAPI APPLICATION
# ==========================================

app = FastAPI(
    title="WAYFARER API",
    description="Multi-Agent Intelligent Travel Planner",
    version="1.0.0"
)


# ==========================================
# CORS CONFIGURATION
# ==========================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================================
# HOME & HEALTH
# ==========================================

@app.get("/")
async def home():
    return {
        "message": "Welcome to WAYFARER API",
        "status": "Backend is running",
        "agents": 7
    }


@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "project": "WAYFARER",
        "backend": "FastAPI"
    }


# ==========================================
# DESTINATION RECOMMENDATIONS
# ==========================================

class DestinationRequest(BaseModel):
    budget_pkr: int = Field(gt=0)
    days: int = Field(default=5, ge=1, le=30)
    travelers: int = Field(default=1, ge=1, le=20)
    preferred_region: str = "Any"
    travel_style: str = "Adventure"


@app.post("/api/destinations/recommend")
async def get_destination_recommendations(
    request: DestinationRequest
):
    try:
        return recommend_destinations(
            budget_pkr=request.budget_pkr,
            days=request.days,
            travelers=request.travelers,
            preferred_region=request.preferred_region,
            travel_style=request.travel_style
        )

    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))


# ==========================================
# BUDGET PLANNING
# ==========================================

class BudgetRequest(BaseModel):
    days: int = Field(default=5, ge=1, le=30)
    travelers: int = Field(default=2, ge=1, le=20)
    region: str = "Pakistan"

    accommodation_type: str = "Hotel"
    accommodation_tier: str = "Standard"
    room_type: str = "Double"
    rooms: int = Field(default=1, ge=1, le=10)

    breakfast: str = "Included"
    lunch: str = "Separate"
    dinner: str = "Separate"

    include_transport: bool = True
    include_activities: bool = True


@app.post("/api/budget/calculate")
async def get_budget_calculation(request: BudgetRequest):
    try:
        return calculate_trip_budget(
            days=request.days,
            travelers=request.travelers,
            region=request.region,
            accommodation_type=request.accommodation_type,
            accommodation_tier=request.accommodation_tier,
            room_type=request.room_type,
            rooms=request.rooms,
            breakfast=request.breakfast,
            lunch=request.lunch,
            dinner=request.dinner,
            include_transport=request.include_transport,
            include_activities=request.include_activities
        )

    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))


# ==========================================
# TRANSPORTATION
# ==========================================

class TransportationRequest(BaseModel):
    region: str = "Pakistan"
    travelers: int = Field(default=1, ge=1, le=20)
    transport_preference: str = "any"
    include_local_transport: bool = True


@app.post("/api/transportation/recommend")
async def get_transportation_recommendations(
    request: TransportationRequest
):
    try:
        return recommend_transportation(
            region=request.region,
            travelers=request.travelers,
            transport_preference=request.transport_preference,
            include_local_transport=request.include_local_transport
        )

    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))


# ==========================================
# ACCOMMODATION
# ==========================================

class AccommodationRequest(BaseModel):
    region: str = "Pakistan"
    accommodation_type: str = "Hotel"
    tier: str = "Standard"
    room_type: str = "Double"
    rooms: int = Field(default=1, ge=1, le=10)
    nights: int = Field(default=4, ge=0, le=30)


@app.post("/api/accommodation/recommend")
async def get_accommodation_recommendations(
    request: AccommodationRequest
):
    try:
        return recommend_accommodation(
            region=request.region,
            accommodation_type=request.accommodation_type,
            tier=request.tier,
            room_type=request.room_type,
            rooms=request.rooms,
            nights=request.nights
        )

    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))


# ==========================================
# INTELLIGENT MEAL PLANNING AGENT
# ==========================================

class MealRequest(BaseModel):
    region: str = "Pakistan"
    destination: str = ""
    days: int = Field(default=5, ge=1, le=30)
    travelers: int = Field(default=2, ge=1, le=20)

    breakfast: str = "Included"
    lunch: str = "Separate"
    dinner: str = "Separate"

    dietary_preferences: list[str] = Field(
        default_factory=list
    )


@app.post("/api/meals/calculate")
async def get_meal_calculation(request: MealRequest):
    try:
        return calculate_meal_plan(
            region=request.region,
            destination=request.destination,
            days=request.days,
            travelers=request.travelers,
            breakfast=request.breakfast,
            lunch=request.lunch,
            dinner=request.dinner,
            dietary_preferences=request.dietary_preferences
        )

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        )


# ==========================================
# ITINERARY
# ==========================================

class ItineraryRequest(BaseModel):
    destination: str
    days: int = Field(default=5, ge=1, le=30)
    travel_style: str = "Adventure"


@app.post("/api/itinerary/generate")
async def get_itinerary(request: ItineraryRequest):
    try:
        return generate_itinerary(
            destination=request.destination,
            days=request.days,
            travel_style=request.travel_style
        )

    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))


# ==========================================
# COMPLETE MULTI-AGENT TRAVEL PLAN
# ==========================================

class TravelPlanRequest(BaseModel):
    destination: str = Field(min_length=2)
    budget_pkr: int = Field(gt=0)
    days: int = Field(default=5, ge=1, le=30)
    travelers: int = Field(default=2, ge=1, le=20)

    region: str = "Pakistan"
    preferred_region: str = "Pakistan"
    travel_style: str = "Adventure"

    accommodation_type: str = "Hotel"
    accommodation_tier: str = "Standard"
    room_type: str = "Double"
    rooms: int = Field(default=1, ge=1, le=10)

    breakfast: str = "Included"
    lunch: str = "Separate"
    dinner: str = "Separate"
    dietary_preferences: list[str] = Field(default_factory=list)

    transport_preference: str = "any"
    include_local_transport: bool = True
    departure_date: str | None = None
    special_requests: str = ""


@app.post("/api/travel-plan/generate")
def generate_complete_travel_plan(request: TravelPlanRequest):
    try:
        return coordinate_travel_plan(
            destination=request.destination,
            budget_pkr=request.budget_pkr,
            days=request.days,
            travelers=request.travelers,
            region=request.region,
            preferred_region=request.preferred_region,
            travel_style=request.travel_style,
            accommodation_type=request.accommodation_type,
            accommodation_tier=request.accommodation_tier,
            room_type=request.room_type,
            rooms=request.rooms,
            breakfast=request.breakfast,
            lunch=request.lunch,
            dinner=request.dinner,
            dietary_preferences=request.dietary_preferences,
            transport_preference=request.transport_preference,
            include_local_transport=request.include_local_transport,
            departure_date=request.departure_date,
            special_requests=request.special_requests,
        )

    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Travel planning failed: {str(error)}"
        )



# ==========================================
# WEATHER
# ==========================================

@app.get("/api/weather")
async def weather_information(destination: str):
    try:
        return await get_weather(destination)

    except ValueError as error:
        raise HTTPException(
            status_code=404,
            detail=str(error)
        )

    except Exception:
        raise HTTPException(
            status_code=502,
            detail="Weather service is temporarily unavailable."
        )


# ==========================================
# CURRENCY CONVERTER
# ==========================================

class CurrencyRequest(BaseModel):
    amount: float = Field(gt=0)
    from_currency: str = "PKR"
    to_currency: str = "USD"


SUPPORTED_CURRENCIES = [
    "PKR",
    "USD",
    "EUR",
    "GBP",
    "AED",
    "SAR",
    "CNY",
    "KRW"
]


@app.post("/api/currency/convert")
async def currency_conversion(request: CurrencyRequest):

    from_currency = request.from_currency.upper().strip()
    to_currency = request.to_currency.upper().strip()

    if from_currency not in SUPPORTED_CURRENCIES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported source currency: {from_currency}"
        )

    if to_currency not in SUPPORTED_CURRENCIES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported target currency: {to_currency}"
        )

    try:
        result = await convert_currency(
            amount=request.amount,
            from_currency=from_currency,
            to_currency=to_currency
        )

        return result

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        )

    except Exception:
        raise HTTPException(
            status_code=502,
            detail="Currency conversion service is temporarily unavailable."
        )


# ==========================================
# PLACES & ATTRACTIONS
# ==========================================

@app.get("/api/places")
async def places_information(
    destination: str,
    radius: int = Query(
        default=15000,
        ge=1000,
        le=50000
    )
):
    try:
        return await get_places(
            destination=destination,
            radius=radius
        )

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        )

    except Exception:
        raise HTTPException(
            status_code=502,
            detail="Places service is temporarily unavailable."
        )

# ==========================================
# VALIDATION ERROR HANDLER
# ==========================================

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):

    print("\n========== VALIDATION ERROR ==========")
    print("URL:", request.url)
    print("ERROR DETAILS:", exc.errors())
    print("======================================\n")

    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "message": "Invalid request data. Please check your payload.",
            "errors": exc.errors()
        }
    )