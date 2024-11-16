# FantasyBasketAuctionHelper 🏀

FantasyBasketAuctionHelper is a web application designed to assist users during fantasy basketball auctions. It combines a user-friendly interface with a powerful machine learning backend to optimize auction choices.

## 🎯 Key Features

- **Budget Management**: Input and track available budget per player
- **Live Auction Tracking**: Real-time recording of purchased players and prices
- **AI Suggestions**: Generation of two optimized teams based on:
  - ML predictions of fantasy points for the next season
  - Remaining budget
  - Available players
  - Expected prices


https://github.com/user-attachments/assets/05dd6fdc-98f2-4d9e-914f-e24fa46c6037


## 🛠️ Technology Stack

### Frontend
- **Vite**: Build tool and dev server
- **React**: UI Framework
- **ShadCN UI**: Modern, customizable UI components
- **Docker**: Application containerization

### Backend (Submodule)
- **Python**: Core backend language
- **Flask**: Web server framework
- **Docker**: Application containerization
- **XGBoost**: ML model for fantasy points prediction
- **Linear Optimization**: Algorithms for optimal player selection

## 📋 Prerequisites

- Docker
- Docker Compose
- Git

## 🚀 Installation

1. Clone the repository with submodules:
```bash
git clone --recurse-submodules https://github.com/Simi24/FantasyBasketAuctionHelper.git
```

2. If you've already cloned the repository without submodules, initialize the backend submodule:
```bash
git submodule init
git submodule update
```

3. Start the application with Docker Compose:
```bash
docker compose up
```

The application will be accessible at `http://localhost:3000`

## 🔄 Backend Dependencies

This project requires the `FantasyBasketAuctionHelper_BackEnd` to function properly. The backend is included as a Git submodule and is responsible for:
- Predicting NBA players' fantasy points
- Generating optimized teams
- Managing optimization algorithms

The backend server is built with Python and Flask, providing a RESTful API for the frontend to consume.

For more details about backend functionality and configuration, please refer to the [backend README](https://github.com/Simi24/FantasyBasketAuctionHelper_BackEnd).

## 💡 How It Works

1. **Initial Setup**
   - Input available budget per player
   - Add auction participants

2. **During the Auction**
   - Record purchased players and their prices
   - Monitor remaining budget
   - Request suggestions for optimized teams based on:
     - ML predictions for fantasy points
     - Available budget
     - Players still on the market

3. **AI Suggestions**
   - The backend uses an XGBoost model trained on 6 seasons of NBA data
   - Optimization algorithms generate two optimal teams considering budget and roster constraints

## 🔍 System Architecture

```
FantasyBasketAuctionHelper/
├── Frontend (Vite + React + ShadCN UI)
│   ├── User Interface
│   ├── Auction Management
│   └── Team Suggestions Display
│
└── Backend (Python + Flask) [Submodule]
    ├── ML Model (XGBoost)
    ├── Optimization Algorithms
    └── RESTful API
```

## 🤝 Contributing

Interested in contributing? Great! Please:
1. Fork the repository
2. Create a new branch for your modifications
3. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
