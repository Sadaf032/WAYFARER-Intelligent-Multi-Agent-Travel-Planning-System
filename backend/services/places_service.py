
import httpx
import math


GEOCODING_URL = "https://nominatim.openstreetmap.org/search"
OVERPASS_URL = "https://overpass-api.de/api/interpreter"

HEADERS = {
    "User-Agent": "WAYFARERTravelPlanner/1.0 (educational travel planner)"
}


async def get_places(destination: str, radius: int = 15000):

    # 1. Validate destination
    if not isinstance(destination, str):
        raise ValueError("Destination must be a valid string.")

    destination = destination.strip()

    if not destination:
        raise ValueError("Destination is required.")

    # 2. Validate radius
    if isinstance(radius, bool) or not isinstance(radius, int):
        raise ValueError("Radius must be a valid integer.")

    if not 1000 <= radius <= 50000:
        raise ValueError(
            "Radius must be between 1000 and 50000 meters."
        )

    try:
        async with httpx.AsyncClient(
            timeout=30.0,
            headers=HEADERS
        ) as client:

            # 3. Find destination coordinates
            geo_response = await client.get(
                GEOCODING_URL,
                params={
                    "q": destination,
                    "format": "jsonv2",
                    "limit": 1
                }
            )

            geo_response.raise_for_status()
            geo_results = geo_response.json()

            if not isinstance(geo_results, list):
                raise ValueError("Invalid geocoding response.")

            if not geo_results:
                raise ValueError(
                    f"Could not find destination: {destination}"
                )

            location = geo_results[0]

            if not isinstance(location, dict):
                raise ValueError("Invalid location data.")

            latitude = float(location["lat"])
            longitude = float(location["lon"])

            if not (
                math.isfinite(latitude)
                and math.isfinite(longitude)
                and -90 <= latitude <= 90
                and -180 <= longitude <= 180
            ):
                raise ValueError("Invalid destination coordinates.")

            # 4. Search nearby tourist attractions
            query = f"""
            [out:json][timeout:40];
            (
              nwr(around:{radius},{latitude},{longitude})["tourism"~"attraction|museum|viewpoint|gallery"];
              nwr(around:{radius},{latitude},{longitude})["historic"~"castle|fort|monument|archaeological_site"];
              nwr(around:{radius},{latitude},{longitude})["natural"~"water|peak|beach"];
            );
            out center tags;
            """

            places_response = await client.post(
                OVERPASS_URL,
                data={"data": query}
            )

            places_response.raise_for_status()
            places_data = places_response.json()

            if not isinstance(places_data, dict):
                raise ValueError("Invalid places API response.")

            elements = places_data.get("elements", [])

            if not isinstance(elements, list):
                raise ValueError("Invalid attractions data.")

        # 5. Process attractions
        attractions = []
        seen_ids = set()

        for place in elements:

            if not isinstance(place, dict):
                continue

            place_id = place.get("id")
            place_type = place.get("type")

            if place_id is None or not place_type:
                continue

            unique_id = f"{place_type}_{place_id}"

            if unique_id in seen_ids:
                continue

            tags = place.get("tags", {})

            if not isinstance(tags, dict):
                continue

            coordinates = place.get("center", {})

            if not isinstance(coordinates, dict):
                coordinates = {}

            lat = place.get("lat", coordinates.get("lat"))
            lon = place.get("lon", coordinates.get("lon"))

            if lat is None or lon is None:
                continue

            try:
                lat = float(lat)
                lon = float(lon)
            except (TypeError, ValueError):
                continue

            if not (
                math.isfinite(lat)
                and math.isfinite(lon)
                and -90 <= lat <= 90
                and -180 <= lon <= 180
            ):
                continue

            name = tags.get("name") or tags.get("name:en")

            if not isinstance(name, str) or not name.strip():
                continue

            seen_ids.add(unique_id)

            attractions.append({
                "id": unique_id,
                "name": name,
                "category": (
                    tags.get("tourism")
                    or tags.get("historic")
                    or tags.get("natural")
                    or "attraction"
                ),
                "latitude": lat,
                "longitude": lon,
                "description": tags.get("description"),
                "website": tags.get("website"),
                "opening_hours": tags.get("opening_hours")
            })

        return {
            "service": "WAYFARER Places Service",
            "destination": location.get("display_name"),
            "coordinates": {
                "latitude": latitude,
                "longitude": longitude
            },
            "search_radius_meters": radius,
            "total_attractions": len(attractions),
            "attractions": attractions,
            "source": "OpenStreetMap",
            "notice": (
                "Results depend on OpenStreetMap coverage. "
                "Missing attractions do not necessarily mean "
                "the destination has no tourist attractions."
            ),
            "attribution": "© OpenStreetMap contributors"
        }

    except ValueError:
        raise

    except httpx.TimeoutException:
        raise ValueError(
            "Places API timed out. Please try again."
        )

    except httpx.RequestError:
        raise ValueError(
            "Unable to connect to Places API. "
            "Please check your internet connection."
        )

    except httpx.HTTPStatusError:
        raise ValueError(
            "Places service is temporarily unavailable."
        )

    except (KeyError, TypeError, IndexError):
        raise ValueError(
            "Invalid location or attractions response."
        )
