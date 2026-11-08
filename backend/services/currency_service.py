
import httpx
import math

CURRENCY_API = "https://api.frankfurter.dev/v2"

SUPPORTED_CURRENCIES = {
    "PKR", "USD", "EUR", "GBP",
    "AED", "SAR", "CNY", "KRW"
}


async def convert_currency(
    amount: float,
    from_currency: str = "PKR",
    to_currency: str = "USD"
):
    # Validate amount
    if not isinstance(amount, (int, float)):
        raise ValueError("Amount must be a valid number.")

    if not math.isfinite(amount) or amount <= 0:
        raise ValueError("Amount must be greater than zero.")

    from_currency = from_currency.upper().strip()
    to_currency = to_currency.upper().strip()

    if from_currency not in SUPPORTED_CURRENCIES:
        raise ValueError(f"Unsupported currency: {from_currency}")

    if to_currency not in SUPPORTED_CURRENCIES:
        raise ValueError(f"Unsupported currency: {to_currency}")

    if from_currency == to_currency:
        return {
            "amount": amount,
            "from_currency": from_currency,
            "to_currency": to_currency,
            "exchange_rate": 1,
            "converted_amount": round(amount, 2),
            "rate_date": None,
            "source": "Frankfurter",
            "notice": "No conversion required."
        }

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.get(
                f"{CURRENCY_API}/rate/{from_currency}/{to_currency}"
            )

            if response.status_code == 404:
                raise ValueError(
                    f"{from_currency}/{to_currency} "
                    "is not supported by Frankfurter."
                )

            response.raise_for_status()
            data = response.json()

        # Validate API response
        if not isinstance(data, dict) or "rate" not in data:
            raise ValueError("Invalid exchange-rate response.")

        rate = float(data["rate"])

        if not math.isfinite(rate) or rate <= 0:
            raise ValueError("Invalid exchange rate received.")

        return {
            "amount": amount,
            "from_currency": from_currency,
            "to_currency": to_currency,
            "exchange_rate": rate,
            "converted_amount": round(amount * rate, 2),
            "rate_date": data.get("date"),
            "source": "Frankfurter",
            "notice": (
                "Reference exchange rate. Actual bank and "
                "money-exchange rates may differ."
            )
        }

    except ValueError:
        raise

    except httpx.TimeoutException:
        raise ValueError(
            "Currency API timed out. Please try again."
        )

    except httpx.RequestError:
        raise ValueError(
            "Currency API connection failed. Please check your internet."
        )

    except httpx.HTTPStatusError:
        raise ValueError(
            "Unable to retrieve exchange rates."
        )

    except (KeyError, TypeError):
        raise ValueError(
            "Invalid exchange-rate response."
        )
