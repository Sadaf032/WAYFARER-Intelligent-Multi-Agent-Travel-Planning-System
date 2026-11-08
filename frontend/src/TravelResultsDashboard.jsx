
import {
  BedDouble,
  CalendarDays,
  Camera,
  CheckCircle2,
  Coffee,
  Hotel,
  Info,
  Route,
  Train,
  Utensils,
  Wallet,
  AlertTriangle,
  Lightbulb,
  TrendingDown,
  MapPin,
  Pencil,
  Sun,
  Sunset,
  Moon,
  Users
} from "lucide-react";

export default function TravelResultsDashboard({ result, onEditTrip }) {
  const summary = result?.trip_summary || {};
  const destinationData = result?.destination_recommendations || {};
  const budget = result?.budget_plan || {};
  const transport = result?.transportation_plan || {};
  const stay = result?.accommodation_plan || {};
  const meals = result?.meal_plan || {};
  const itinerary = result?.daily_itinerary || {};

  const money = (value) => {
    if (value === null || value === undefined || value === "") {
      return "Not available";
    }

    const number = Number(value);

    return Number.isFinite(number)
      ? `Rs. ${number.toLocaleString("en-PK", {
          maximumFractionDigits: 0
        })}`
      : "Not available";
  };

  const recommendations = Array.isArray(destinationData.recommendations)
    ? destinationData.recommendations
    : [];

  const transportOptions = Array.isArray(transport.recommendations)
    ? transport.recommendations
    : [];

  const days = Array.isArray(itinerary.itinerary)
    ? itinerary.itinerary
    : [];

  const suggestions =
    Array.isArray(budget.suggestions) && budget.suggestions.length > 0
      ? budget.suggestions
      : Array.isArray(result?.suggestions)
        ? result.suggestions
        : [];

  const budgetTotal = Number(
    budget.total_estimated_budget ??
    budget.estimated_total_budget ??
    summary.estimated_total_budget ??
    result?.estimated_total_budget ??
    0
  );

  const userBudget = Number(
    budget.user_budget ??
    summary.budget_pkr ??
    result?.user_budget ??
    0
  );

  const remainingBudget = Number(
    budget.remaining_budget ??
    result?.remaining_budget ??
    userBudget - budgetTotal
  );

  const overBudgetAmount = Number(
    budget.over_budget_amount ??
    result?.over_budget_amount ??
    Math.max(budgetTotal - userBudget, 0)
  );

  const withinBudget =
    budget.within_budget ??
    result?.within_budget ??
    (userBudget > 0 && budgetTotal <= userBudget);

  const budgetStatus =
    budget.budget_status ||
    result?.budget_status ||
    (withinBudget ? "Within budget" : "Over budget");

  const budgetWarning =
    budget.budget_warning ||
    result?.budget_warning ||
    "";

  // ACCOMMODATION

  const budgetStay = Number(
    budget.accommodation?.estimated_cost ?? 0
  );

  const agentStay = Number(
    stay.total_estimated_cost ?? 0
  );

  const budgetNights = Number(
    budget.accommodation?.nights ?? 0
  );

  const stayNights = Number(
    stay.nights ?? 0
  );

  const stayMismatch =
    budgetStay > 0 &&
    agentStay > 0 &&
    budgetStay !== agentStay;

  const nightsMismatch =
    budgetNights > 0 &&
    stayNights > 0 &&
    budgetNights !== stayNights;

  const travelers = Number(
    summary.travelers ??
    transport.travelers ??
    result?.travelers ??
    0
  );

  const rooms = Number(
    stay.rooms ??
    budget.accommodation?.rooms ??
    1
  );

  // Only compare capacity when backend supplies it.
  const roomCapacity = Number(
    stay.room_capacity ??
    stay.max_guests ??
    stay.guests_per_room ??
    0
  );

  const totalRoomCapacity = roomCapacity > 0
    ? roomCapacity * rooms
    : 0;

  const roomCapacityWarning =
    travelers > 0 &&
    totalRoomCapacity > 0 &&
    travelers > totalRoomCapacity;

  // DESTINATION ESTIMATE

  const destinationEstimate = Number(
    summary.destination_agent_estimate?.estimated_cost ??
    summary.destination_agent_estimate ??
    0
  );

  const destinationEstimateNote =
    summary.destination_agent_estimate?.notice || "";

  const accommodationExplanation =
    stay.cost_explanation ||
    budget.accommodation?.cost_explanation ||
    "";

  const mealExplanation =
    meals.cost_explanation ||
    budget.meals?.cost_explanation ||
    "";

  const destinationFilter =
    destinationData.budget_filter || {};

  // COST BREAKDOWN

  const transportationCost =
    budget.transportation?.estimated_cost ??
    transport.selected_estimated_cost ??
    transport.total_with_local_transport ??
    transport.estimated_cost ??
    0;

  const accommodationCost =
    budget.accommodation?.estimated_cost ??
    stay.total_estimated_cost ??
    0;

  const mealCost =
    budget.meals?.total_estimated_cost ??
    meals.total_meal_cost ??
    0;

  const activityCost =
    budget.activities?.estimated_cost ?? 0;

  // DEPARTURE DATE

  const departureDate =
    summary.departure_date ||
    itinerary.departure_date ||
    result?.departure_date ||
    "";

  // FORMAT ITINERARY DATE

  const getDayDate = (day, index) => {
    const backendDate = day.date || day.calendar_date;

    let date = null;

    if (backendDate) {
      const [year, month, dayNumber] = String(backendDate)
        .slice(0, 10)
        .split("-")
        .map(Number);

      if (year && month && dayNumber) {
        date = new Date(year, month - 1, dayNumber);
      }
    } else if (departureDate) {
      const [year, month, dayNumber] = String(departureDate)
        .slice(0, 10)
        .split("-")
        .map(Number);

      if (year && month && dayNumber) {
        date = new Date(year, month - 1, dayNumber + index);
      }
    }

    if (!date || Number.isNaN(date.getTime())) {
      return "";
    }

    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  // SUPPORT STRING AND OBJECT ACTIVITIES

  const getActivityText = (activity) => {
    if (typeof activity === "string") {
      return activity;
    }

    return (
      activity?.name ||
      activity?.title ||
      activity?.description ||
      "Suggested activity"
    );
  };

  // SUPPORT STRUCTURED DAY SCHEDULE

  const getDayActivities = (day) => {
    if (Array.isArray(day.activities)) {
      return day.activities;
    }

    return [];
  };

  const getSchedule = (day, period) => {
    const schedule = day.schedule || {};

    const aliases = {
      morning: ["morning", "morning_activities"],
      afternoon: ["afternoon", "afternoon_activities"],
      evening: ["evening", "evening_activities"]
    };

    for (const key of aliases[period]) {
      if (Array.isArray(schedule[key])) {
        return schedule[key];
      }

      if (typeof schedule[key] === "string" && schedule[key]) {
        return [schedule[key]];
      }

      if (Array.isArray(day[key])) {
        return day[key];
      }

      if (typeof day[key] === "string" && day[key]) {
        return [day[key]];
      }
    }

    return [];
  };

  const hasStructuredSchedule = (day) => {
    return (
      getSchedule(day, "morning").length > 0 ||
      getSchedule(day, "afternoon").length > 0 ||
      getSchedule(day, "evening").length > 0
    );
  };

  // SEASONAL WARNINGS

  const getDayWarnings = (day) => {
    const warnings = [];

    const possibleWarnings = [
      day.seasonal_warning,
      day.accessibility_warning,
      day.weather_warning
    ];

    possibleWarnings.forEach((warning) => {
      if (typeof warning === "string" && warning.trim()) {
        warnings.push(warning);
      }
    });

    if (Array.isArray(day.warnings)) {
      warnings.push(...day.warnings.filter(
        (warning) => typeof warning === "string"
      ));
    }

    return [...new Set(warnings)];
  };

  const globalSeasonalWarnings = Array.isArray(
    itinerary.seasonal_warnings
  )
    ? itinerary.seasonal_warnings
    : [];

  const hasSeasonalWarnings =
    globalSeasonalWarnings.length > 0 ||
    days.some((day) => getDayWarnings(day).length > 0);

  // MEAL PREFERENCES

  const getMealItem = (meal) => {
    return (
      meals.meals?.[meal] ||
      budget.meals?.[meal] ||
      {}
    );
  };

  const getMealPreference = (item) => {
    return (
      item.preference ||
      item.selection ||
      "Not specified"
    );
  };

  const getMealNotice = (item) => {
    const preference = String(getMealPreference(item)).toLowerCase();

    if (preference === "included") {
      return "Assumed covered; package not verified.";
    }

    if (preference === "skip") {
      return "Excluded from the estimate.";
    }

    return "";
  };

  // TRANSPORT NOTICE
  // Display the backend notice without changing its meaning.

  const transportNotice = transport.notice || "";

  return (
    <div className="travel-results-dashboard">

      {/* HERO */}

      <section className="results-hero-card">
        <div>
          <span className="results-eyebrow">
            YOUR JOURNEY, ORGANIZED
          </span>

          <h2>
            {summary.destination ||
              itinerary.destination ||
              "Your destination"}
          </h2>

          <p>
            {summary.region || stay.region || "Travel destination"}
            <span> · </span>
            {summary.travel_style ||
              itinerary.travel_style ||
              "Personalized travel"}
          </p>
        </div>

        <div className="results-generated-mark">
          <CheckCircle2 size={17} />
          Plan generated
        </div>

        {onEditTrip && (
          <button
            type="button"
            className="outline-button"
            onClick={onEditTrip}
          >
            <Pencil size={16} />
            Edit Trip Details
          </button>
        )}
      </section>

      {/* OVERVIEW */}

      <div className="results-overview-grid">

        <article className="results-metric-card results-budget-metric">
          <span>Estimated total budget</span>
          <strong>{money(budgetTotal)}</strong>
          <small>PKR · illustrative estimate</small>
        </article>

        <article className="results-metric-card">
          <span>Duration</span>
          <strong>
            {summary.days || itinerary.total_days || "—"} days
          </strong>
          <small>Planned journey</small>
        </article>

        <article className="results-metric-card">
          <span>Travelers</span>
          <strong>{travelers || "—"}</strong>
          <small>People</small>
        </article>

        <article className="results-metric-card">
          <span>Travel style</span>
          <strong>
            {summary.travel_style ||
              itinerary.travel_style ||
              "—"}
          </strong>
          <small>Selected preference</small>
        </article>

      </div>

      {/* BUDGET STATUS */}

      {userBudget > 0 && (
        <section className="results-section-card results-budget-status">

          <div className="results-section-heading">
            <div>
              <span className="results-eyebrow">
                YOUR FINANCIAL OVERVIEW
              </span>
              <h3>Budget status</h3>
            </div>

            <span className="results-section-icon">
              <Wallet size={19} />
            </span>
          </div>

          <span
            className={`results-budget-status-label ${
              withinBudget ? "within-budget" : "over-budget"
            }`}
          >
            {budgetStatus}
          </span>

          <div className="results-budget-status-grid">

            <div>
              <span>Your budget</span>
              <strong>{money(userBudget)}</strong>
            </div>

            <div>
              <span>Estimated expenses</span>
              <strong>{money(budgetTotal)}</strong>
            </div>

            <div>
              <span>
                {withinBudget ? "Remaining budget" : "Over budget"}
              </span>

              <strong>
                {withinBudget
                  ? money(Math.max(remainingBudget, 0))
                  : money(overBudgetAmount)}
              </strong>
            </div>

          </div>

          <div className="results-budget-status-message">

            {withinBudget ? (
              <>
                <CheckCircle2 size={19} />

                <div>
                  <strong>Your trip is within budget.</strong>
                  <p>
                    Your estimated expenses are below your selected budget.
                  </p>
                </div>
              </>
            ) : (
              <>
                <AlertTriangle size={19} />

                <div>
                  <strong>Your trip exceeds your budget.</strong>
                  <p>
                    You need approximately {money(overBudgetAmount)}
                    {" "}more to cover the estimated expenses.
                  </p>
                </div>
              </>
            )}

          </div>

          {budgetWarning && (
            <p className="results-disclaimer">
              {budgetWarning}
            </p>
          )}

        </section>
      )}

      {/* COST BREAKDOWN */}

      <section className="results-section-card">

        <div className="results-section-heading">
          <div>
            <span className="results-eyebrow">COST OVERVIEW</span>
            <h3>Budget breakdown</h3>
          </div>

          <span className="results-section-icon">
            <Wallet size={19} />
          </span>
        </div>

        <div className="results-cost-list">

          <div>
            <span>
              <BedDouble size={16} /> Accommodation
            </span>
            <strong>{money(accommodationCost)}</strong>
          </div>

          <div>
            <span>
              <Utensils size={16} /> Meals
            </span>
            <strong>{money(mealCost)}</strong>
          </div>

          <div>
            <span>
              <Route size={16} /> Transportation
            </span>
            <strong>{money(transportationCost)}</strong>
          </div>

          <div>
            <span>
              <Camera size={16} /> Activities
            </span>
            <strong>{money(activityCost)}</strong>
          </div>

          <div className="results-cost-total">
            <span>Estimated total</span>
            <strong>{money(budgetTotal)}</strong>
          </div>

        </div>

        {(stayMismatch || nightsMismatch) && (
          <div className="results-warning">
            <Info size={17} />

            <div>
              <strong>Accommodation estimates need review</strong>

              <p>
                Budget Agent: {money(budgetStay)} for{" "}
                {budgetNights || "—"} nights. Accommodation Agent:{" "}
                {money(agentStay)} for {stayNights || "—"} nights.
                Check the room and night assumptions.
              </p>
            </div>
          </div>
        )}

      </section>

      {/* COST SAVING SUGGESTIONS */}

      {suggestions.length > 0 && (
        <section className="results-section-card">

          <div className="results-section-heading">
            <div>
              <span className="results-eyebrow">SMART TRAVEL TIPS</span>
              <h3>Ways to optimize your budget</h3>
            </div>

            <span className="results-section-icon">
              <Lightbulb size={19} />
            </span>
          </div>

          <div className="results-suggestions-list">

            {suggestions.map((suggestion, index) => (
              <div
                className="results-suggestion-item"
                key={index}
              >
                <TrendingDown size={17} />

                <p>
                  {typeof suggestion === "string"
                    ? suggestion
                    : suggestion.message ||
                      suggestion.description ||
                      suggestion.title ||
                      "Consider reviewing this expense."}
                </p>
              </div>
            ))}

          </div>

        </section>
      )}

      {/* DESTINATION RECOMMENDATIONS */}

      <section className="results-section-card">

        <div className="results-section-heading">
          <div>
            <span className="results-eyebrow">DISCOVER MORE</span>
            <h3>Destination recommendations</h3>
          </div>

          <span className="results-count">
            {destinationData.total_found ?? recommendations.length} found
          </span>
        </div>

        {destinationFilter.message && (
          <p className="results-disclaimer">
            {destinationFilter.message}
          </p>
        )}

        {recommendations.length > 0 ? (
          <div className="results-destination-grid">

            {recommendations.map((place, index) => (
              <article
                className="results-destination-card"
                key={`${place.name || "place"}-${index}`}
              >

                <div className="results-place-top">
                  <span>
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <em
                    className={
                      place.within_budget
                        ? "within-budget"
                        : "over-budget"
                    }
                  >
                    {place.within_budget
                      ? "Within budget"
                      : "Over budget"}
                  </em>
                </div>

                <h4>
                  {place.name || "Suggested destination"}
                </h4>

                <p>
                  {place.description ||
                    place.country ||
                    "Recommended for your trip."}
                </p>

                <div className="results-place-bottom">
                  <span>Estimated for your group</span>
                  <strong>{money(place.estimated_cost)}</strong>
                </div>

              </article>
            ))}

          </div>
        ) : (
          <p className="results-empty-note">
            No destination recommendations were returned.
          </p>
        )}

        {destinationData.notice && (
          <p className="results-disclaimer">
            {destinationData.notice}
          </p>
        )}

      </section>

      {/* SEPARATE DESTINATION ESTIMATE */}

      {destinationEstimate > 0 && (
        <section className="results-section-card">

          <div className="results-section-heading">
            <div>
              <span className="results-eyebrow">DESTINATION ESTIMATE</span>
              <h3>Destination base-cost estimate</h3>
            </div>

            <span className="results-section-icon">
              <MapPin size={19} />
            </span>
          </div>

          <div className="results-destination-estimate">
            <strong>{money(destinationEstimate)}</strong>

            <p>
              This is a separate estimate from the Destination
              Recommendation Agent. It is not included in the
              detailed budget breakdown above. Do not add it
              to the total as an extra expense without checking
              what it covers.
            </p>
          </div>

          {destinationEstimateNote && (
            <p className="results-disclaimer">
              {destinationEstimateNote}
            </p>
          )}

        </section>
      )}

      {/* TRANSPORT AND ACCOMMODATION */}

      <div className="results-two-column">

        {/* TRANSPORTATION */}

        <section className="results-section-card">

          <div className="results-section-heading">
            <div>
              <span className="results-eyebrow">GETTING AROUND</span>
              <h3>Transportation options</h3>
            </div>

            <span className="results-section-icon">
              <Train size={19} />
            </span>
          </div>

          <div className="results-option-list">

            {transportOptions.length > 0 ? (
              transportOptions.map((option, index) => (
                <div
                  className="results-option-row"
                  key={`${option.transport_type || option.name}-${index}`}
                >

                  <div>
                    <strong>
                      {option.name ||
                        option.transport_type ||
                        "Transport"}
                    </strong>

                    <small>
                      {option.description || "Travel option"}
                    </small>
                  </div>

                  <strong>
                    {money(
                      option.total_with_local_transport ??
                      option.estimated_cost
                    )}
                  </strong>

                </div>
              ))
            ) : (
              <p className="results-empty-note">
                No transportation options returned.
              </p>
            )}

          </div>

          {transportNotice && (
            <p className="results-disclaimer">
              {transportNotice}
            </p>
          )}

        </section>

        {/* ACCOMMODATION */}

        <section className="results-section-card">

          <div className="results-section-heading">
            <div>
              <span className="results-eyebrow">WHERE YOU WILL STAY</span>
              <h3>Accommodation</h3>
            </div>

            <span className="results-section-icon">
              <Hotel size={19} />
            </span>
          </div>

          <div className="results-stay-summary">

            <strong>
              {stay.property_type ||
                budget.accommodation?.type ||
                "Accommodation"}
            </strong>

            <span>
              {stay.tier ||
                budget.accommodation?.tier ||
                "Standard"}
              {" · "}
              {stay.room_type ||
                budget.accommodation?.room_type ||
                "Room"}
            </span>

            <div className="results-stay-price">
              {money(stay.total_estimated_cost ?? budgetStay)}
              <small>/ estimated total</small>
            </div>

            <small>
              {stay.nights || budgetNights || "—"} nights
              {" · "}
              {rooms} room(s)
            </small>

            {totalRoomCapacity > 0 && (
              <small>
                <Users size={14} /> Capacity: {totalRoomCapacity} guests
              </small>
            )}

            <em>
              {stay.availability || "Not live verified"}
            </em>

          </div>

          {roomCapacityWarning && (
            <div className="results-warning">
              <AlertTriangle size={17} />

              <div>
                <strong>Room capacity needs review</strong>
                <p>
                  Your trip has {travelers} travelers, but the selected
                  rooms have a stated capacity of {totalRoomCapacity}.
                  Review the number of rooms before booking.
                </p>
              </div>
            </div>
          )}

          {accommodationExplanation && (
            <p className="results-disclaimer">
              {accommodationExplanation}
            </p>
          )}

          {stay.notice && (
            <p className="results-disclaimer">
              {stay.notice}
            </p>
          )}

        </section>

      </div>

      {/* MEAL PLAN */}

      <section className="results-section-card">

        <div className="results-section-heading">
          <div>
            <span className="results-eyebrow">FOOD & DINING</span>
            <h3>Your meal plan</h3>
          </div>

          <span className="results-section-icon">
            <Coffee size={19} />
          </span>
        </div>

        <div className="results-meal-grid">

          {["breakfast", "lunch", "dinner"].map((meal) => {
            const item = getMealItem(meal);

            return (
              <div className="results-meal-card" key={meal}>
                <span>{meal}</span>

                <strong>
                  {getMealPreference(item)}
                </strong>

                <small>
                  {money(
                    item.total_cost ?? item.estimated_cost ?? 0
                  )}
                </small>

                {getMealNotice(item) && (
                  <small>
                    {getMealNotice(item)}
                  </small>
                )}
              </div>
            );
          })}

        </div>

        <div className="results-meal-total">
          <span>Total estimated meal cost</span>
          <strong>{money(mealCost)}</strong>
        </div>

        {mealExplanation && (
          <p className="results-disclaimer">
            {mealExplanation}
          </p>
        )}

        {meals.notice && (
          <p className="results-disclaimer">
            {meals.notice}
          </p>
        )}

      </section>

      {/* SEASONAL ACCESSIBILITY NOTICE */}

      {hasSeasonalWarnings && (
        <section className="results-section-card">

          <div className="results-section-heading">
            <div>
              <span className="results-eyebrow">TRAVEL CONDITIONS</span>
              <h3>Seasonal access and weather warnings</h3>
            </div>

            <span className="results-section-icon">
              <AlertTriangle size={19} />
            </span>
          </div>

          {globalSeasonalWarnings.map((warning, index) => (
            <div className="results-warning" key={index}>
              <Info size={17} />
              <p>
                {typeof warning === "string"
                  ? warning
                  : warning.message || warning.description || "Check local travel conditions."}
              </p>
            </div>
          ))}

          <p className="results-disclaimer">
            Check current weather, road conditions, seasonal closures
            and local travel advice before visiting remote attractions.
            These warnings are not a live access confirmation.
          </p>

        </section>
      )}

      {/* ITINERARY */}

      <section className="results-section-card">

        <div className="results-section-heading">
          <div>
            <span className="results-eyebrow">YOUR DAY-BY-DAY GUIDE</span>

            <h3>
              {days.length || summary.days || "Trip"}-day itinerary
            </h3>
          </div>

          <span className="results-section-icon">
            <CalendarDays size={19} />
          </span>
        </div>

        {days.length > 0 ? (
          <div className="results-itinerary-list">

            {days.map((day, index) => {
              const activities = getDayActivities(day);
              const structured = hasStructuredSchedule(day);
              const dayWarnings = getDayWarnings(day);

              return (
                <article
                  className="results-itinerary-day"
                  key={day.day || index}
                >

                  <div className="results-day-number">
                    {String(day.day || index + 1).padStart(2, "0")}
                  </div>

                  <div className="results-day-content">

                    <h4>
                      {day.title || `Day ${index + 1}`}
                    </h4>

                    {getDayDate(day, index) && (
                      <p className="results-day-date">
                        <CalendarDays size={14} />
                        {getDayDate(day, index)}
                      </p>
                    )}

                    {structured ? (
                      <div className="results-day-schedule">

                        {[
                          {
                            key: "morning",
                            label: "Morning",
                            icon: <Sun size={15} />
                          },
                          {
                            key: "afternoon",
                            label: "Afternoon",
                            icon: <Sunset size={15} />
                          },
                          {
                            key: "evening",
                            label: "Evening",
                            icon: <Moon size={15} />
                          }
                        ].map((period) => {
                          const periodActivities = getSchedule(
                            day,
                            period.key
                          );

                          if (periodActivities.length === 0) {
                            return null;
                          }

                          return (
                            <div
                              className="results-schedule-period"
                              key={period.key}
                            >
                              <strong>
                                {period.icon}
                                {period.label}
                              </strong>

                              <ul>
                                {periodActivities.map((activity, activityIndex) => (
                                  <li key={activityIndex}>
                                    {getActivityText(activity)}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          );
                        })}

                      </div>
                    ) : (
                      <ul>
                        {activities.map((activity, activityIndex) => (
                          <li key={activityIndex}>
                            {getActivityText(activity)}
                          </li>
                        ))}
                      </ul>
                    )}

                    {day.travel_time && (
                      <p className="results-day-date">
                        <Route size={14} />
                        Travel time: {day.travel_time}
                      </p>
                    )}

                    {day.estimated_cost !== undefined && (
                      <p className="results-day-date">
                        <Wallet size={14} />
                        Estimated activities: {money(day.estimated_cost)}
                      </p>
                    )}

                    {dayWarnings.length > 0 && (
                      <div className="results-warning">
                        <AlertTriangle size={17} />

                        <div>
                          <strong>Travel advisory</strong>

                          {dayWarnings.map((warning, warningIndex) => (
                            <p key={warningIndex}>
                              {warning}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>

                </article>
              );
            })}

          </div>
        ) : (
          <p className="results-empty-note">
            No daily itinerary was returned.
          </p>
        )}

        {itinerary.notice && (
          <p className="results-disclaimer">
            {itinerary.notice}
          </p>
        )}

      </section>

      {/* FINAL NOTICE */}

      <div className="results-final-notice">
        <Info size={17} />

        <p>
          {result?.notice ||
            "All costs are illustrative estimates. Live prices, schedules, availability and bookings have not been verified."}
        </p>
      </div>

    </div>
  );
}
