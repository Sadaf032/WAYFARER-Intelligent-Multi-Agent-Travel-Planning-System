
import httpx
import math


GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search"
WEATHER_URL = "https://api.open-meteo.com/v1/forecast"


async def get_weather(destination: str):

    # 1. Validate destination
    if not isinstance(destination, str):
        raise ValueError("Destination must be a valid string.")

    destination = destination.strip()

    if not destination:
        raise ValueError("Please provide a destination.")

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:

            # 2. Find destination coordinates
            geo_response = await client.get(
                GEOCODING_URL,
                params={
                    "name": destination,
                    "count": 5,
                    "language": "en",
                    "format": "json"
                }
            )

            geo_response.raise_for_status()
            geo_data = geo_response.json()

            if not isinstance(geo_data, dict):
                raise ValueError("Invalid geocoding response.")

            locations = geo_data.get("results", [])

            if not locations:
                raise ValueError(
                    f"No location found for {destination}."
                )

            location = locations[0]

            if not isinstance(location, dict):
                raise ValueError("Invalid location data.")

            latitude = float(location["latitude"])
            longitude = float(location["longitude"])

            if not (
                math.isfinite(latitude)
                and math.isfinite(longitude)
                and -90 <= latitude <= 90
                and -180 <= longitude <= 180
            ):
                raise ValueError("Invalid destination coordinates.")

            # 3. Fetch current weather and forecast
            weather_response = await client.get(
                WEATHER_URL,
                params={
                    "latitude": latitude,
                    "longitude": longitude,
                    "current": (
                        "temperature_2m,"
                        "relative_humidity_2m,"
                        "apparent_temperature,"
                        "precipitation,"
                        "weather_code,"
                        "wind_speed_10m"
                    ),
                    "daily": (
                        "weather_code,"
                        "temperature_2m_max,"
                        "temperature_2m_min,"
                        "precipitation_probability_max,"
                        "sunrise,"
                        "sunset"
                    ),
                    "forecast_days": 7,
                    "timezone": "auto"
                }
            )

            weather_response.raise_for_status()
            weather_data = weather_response.json()

            if not isinstance(weather_data, dict):
                raise ValueError("Invalid weather API response.")

            current_weather = weather_data.get("current")
            daily_forecast = weather_data.get("daily")

            if not isinstance(current_weather, dict):
                raise ValueError("Current weather data unavailable.")

            if not isinstance(daily_forecast, dict):
                raise ValueError("Daily forecast data unavailable.")

            return {
                "agent": "Weather Information Service",
                "location": {
                    "name": location.get("name"),
                    "country": location.get("country"),
                    "latitude": latitude,
                    "longitude": longitude,
                    "timezone": weather_data.get("timezone")
                },
                "current_weather": current_weather,
                "daily_forecast": daily_forecast,
                "units": {
                    "temperature": "°C",
                    "wind_speed": "km/h",
                    "precipitation": "mm"
                },
                "source": "Open-Meteo",
                "notice": (
                    "Weather forecast can change. "
                    "Check again before travelling."
                )
            }

    except ValueError:
        raise

    except httpx.TimeoutException:
        raise ValueError(
            "Weather API timed out. Please try again."
        )

    except httpx.RequestError:
        raise ValueError(
            "Unable to connect to Weather API. "
            "Please check your internet connection."
        )

    except httpx.HTTPStatusError:
        raise ValueError(
            "Weather service is temporarily unavailable."
        )

    except (KeyError, TypeError, IndexError):
        raise ValueError(
            "Invalid weather or location data received."
        )
