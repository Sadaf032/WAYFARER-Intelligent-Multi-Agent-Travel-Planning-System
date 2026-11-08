# ✈️ WAYFARER
### Intelligent Multi-Agent Travel Planning System

<p align="center">
  <b>Making Travel Planning Smarter and Simpler</b>
  <br>
  A Web-Based Intelligent Travel Planning Application
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Project-WAYFARER-blue">
  <img src="https://img.shields.io/badge/Frontend-React.js-61DAFB">
  <img src="https://img.shields.io/badge/Backend-FastAPI-009688">
  <img src="https://img.shields.io/badge/Language-Python-yellow">
  <img src="https://img.shields.io/badge/System-Multi--Agent-purple">
</p>

---

## 📌 About The Project

WAYFARER is an **Intelligent Multi-Agent Travel Planning System** developed to make travel planning easier, smarter, and more organized.

It is a web-based application that helps users organize their trips according to their travel preferences, destination, budget, and requirements.

WAYFARER provides two different trip-planning approaches:

1. **Manual Trip Planning:** Allows users to enter trip details manually, calculate estimated travel expenses, and view a complete trip overview.

2. **AI-Guided Multi-Agent Planning:** Uses a structured 16-question chatbot and a Multi-Agent System (MAS) to generate a personalized travel plan through collaboration between specialized agents.

The system combines manual planning logic, agent-based task specialization, coordination, and external APIs to support the travel-planning process.

---

## 🎯 Project Objectives

- Simplify the travel-planning process.
- Provide manual and AI-guided planning methods.
- Recommend suitable travel destinations.
- Estimate trip budgets and expenses.
- Suggest transportation and accommodation options.
- Organize meal plans.
- Generate day-wise travel itineraries.
- Provide weather information and currency conversion.
- Demonstrate coordination between multiple intelligent agents.

---

## ✨ Key Features

### 🧭 Manual Trip Planning

- Enter trip information manually.
- Provide travel preferences.
- Calculate estimated trip expenses.
- View the complete trip overview.

### 🤖 AI-Guided Travel Planning

- Structured 16-question chatbot.
- Personalized travel preferences.
- Multi-agent task coordination.
- Combined travel-planning results.

### 🌍 Destination Recommendations

- Destination suggestions based on travel preferences.
- Alternative destination recommendations.
- Travel-related information.

### 💰 Budget Planning

- Estimated total trip budget.
- Remaining budget calculation.
- Expense breakdown.
- Budget-based travel suggestions.

### 🚗 Transportation Planning

- Transportation suggestions.
- Travel-related cost estimates.

### 🏨 Accommodation Planning

- Accommodation recommendations.
- Hotel and room preference handling.

### 🍽️ Meal Planning

- Meal recommendations.
- Meal planning according to trip preferences.

### 📅 Itinerary Generation

- Day-wise travel itinerary.
- Suggested activities.
- Organized travel schedule.

### 🌤️ Weather & Currency

- Weather information using Open-Meteo.
- Currency conversion using Frankfurter.

---

## 🏗️ Multi-Agent Architecture

WAYFARER uses a **Multi-Agent System (MAS)** consisting of seven agents.

Each agent has a specific responsibility in the AI-guided travel-planning workflow.

| # | Agent | Responsibility |
|---|---|---|
| 1 | Coordinator Agent | Coordinates the complete planning workflow |
| 2 | Destination Recommendation Agent | Suggests suitable travel destinations |
| 3 | Budget Planning Agent | Estimates travel expenses |
| 4 | Transportation Agent | Suggests transportation options |
| 5 | Accommodation Agent | Provides accommodation suggestions |
| 6 | Meal Planning Agent | Organizes meal recommendations |
| 7 | Itinerary Planning Agent | Generates day-wise travel activities |

### How Multi-Agent Coordination Works

1. The user provides travel preferences through the chatbot.
2. The frontend sends the collected information to the backend.
3. The Coordinator Agent manages the planning workflow.
4. The Coordinator Agent assigns tasks to specialized agents.
5. Each specialized agent processes its assigned task.
6. The Coordinator Agent combines the generated outputs.
7. The final travel plan is displayed on the dashboard.

---

## 🔄 System Workflow

### 1. Manual Trip Planning Workflow

```text
User
  |
  v
React.js Frontend
  |
  v
Plan a Trip Form
  |
  v
Manual Planning Logic
  |
  v
Calculate Trip Estimates
  |
  v
Prepare Trip Overview
  |
  v
Display Results
```

### 2. AI-Guided Multi-Agent Workflow

```text
User
  |
  v
React.js Frontend
  |
  v
16-Question Chatbot
  |
  v
Python FastAPI Backend
  |
  v
Coordinator Agent
  |
  +---------------------------+
  |            |              |
  v            v              v
Destination   Budget       Transportation
Agent         Agent        Agent
  |
  +---------------------------+
  |            |              |
  v            v              v
Accommodation Meal          Itinerary
Agent         Agent         Agent
  |
  v
Combine Agent Outputs
  |
  v
Final Travel Plan
  |
  v
Results Dashboard
```

---

## 🛠️ Technology Stack

### Frontend

- React.js
- JavaScript
- CSS

### Backend

- Python
- FastAPI

### External APIs

| API | Purpose |
|---|---|
| Open-Meteo API | Weather information |
| Frankfurter API | Currency conversion |

---

## 📂 Main Application Modules

WAYFARER includes the following application modules:

1. Dashboard
2. Discover Destinations
3. Plan a Trip
4. AI Agents
5. My Itineraries
6. Saved Destinations
7. Weather & Currency

---

## 📋 Development Methodology

WAYFARER follows a **Hybrid Development Methodology** combining:

- Manual Rule-Based Planning
- AI-Guided Multi-Agent System (MAS)

The AI-guided methodology consists of the following stages:

1. **Input Collection:** Collecting traveller preferences through the structured chatbot.
2. **Task Decomposition:** Dividing the travel-planning problem into smaller tasks.
3. **Agent Specialization:** Assigning tasks to specialized agents.
4. **Coordination:** Managing the workflow through the Coordinator Agent.
5. **Result Integration:** Combining the outputs of specialized agents.
6. **Presentation:** Displaying the final travel plan through the frontend.

---

## 🔁 Software Development Model

WAYFARER follows the **Iterative and Incremental Development Model**.

The system is developed in smaller increments, with each increment adding new functionality.

The development increments include:

1. Frontend Development
2. Manual Trip Planning
3. AI-Guided Planning
4. Multi-Agent System Implementation
5. External API Integration
6. Testing and Improvement

---

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites

Make sure the following tools are installed:

- Node.js
- npm
- Python 3
- Git

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Open the Project Folder

```bash
cd WAYFARER-Intelligent-Multi-Agent-Travel-Planning-System
```

### 3. Frontend Setup

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the frontend development server:

```bash
npm run dev
```

### 4. Backend Setup

Open another terminal and navigate to the backend directory:

```bash
cd backend
```

Create a Python virtual environment:

```bash
python -m venv venv
```

Activate the virtual environment.

**Windows:**

```bash
venv\Scripts\activate
```

Install the required dependencies:

```bash
pip install -r requirements.txt
```

Start the FastAPI server using the application module and entry point configured in your project.

> **Note:** Frontend and backend folder names, dependency files, and startup commands should match your actual project structure.

---

## 📊 Expected System Outputs

WAYFARER generates travel-planning results that may include:

- Recommended destinations.
- Estimated total travel budget.
- Remaining budget.
- Expense breakdown.
- Transportation suggestions.
- Accommodation recommendations.
- Meal plans.
- Day-wise itineraries.
- Alternative destination suggestions.

---

## ⚠️ Limitations

- Travel prices and expenses are illustrative estimates.
- Transportation suggestions are not confirmed bookings.
- Accommodation information does not guarantee availability.
- Generated itineraries may repeat activities for longer trips.
- The system does not perform verified live flight or hotel bookings.

---

## 🔮 Future Enhancements

- Real-time flight booking integration.
- Hotel booking integration.
- Live travel price updates.
- More destination recommendations.
- Improved itinerary personalization.
- Advanced travel preference handling.
- Enhanced user account and trip management features.

---

## 👩‍💻 Project Information

| Detail | Information |
|---|---|
| Project Name | WAYFARER |
| Full Title | Intelligent Multi-Agent Travel Planning System |
| Subject | Agent-Based Intelligent Systems |
| Department | Software Engineering |
| Developed By | Sadaf Kareem |
| Roll Number | K24SW-023 |

---

## 📚 References

- [React.js Documentation](https://react.dev/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Python Documentation](https://docs.python.org/3/)
- [Open-Meteo Documentation](https://open-meteo.com/en/docs)
- [Frankfurter API](https://frankfurter.dev/)

---

<p align="center">
  <b>✈️ WAYFARER</b>
  <br>
  <i>Making Travel Planning Smarter and Simpler.</i>
</p>
