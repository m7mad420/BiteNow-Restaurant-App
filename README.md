# 🍔 BiteNow - Restaurant Delivery App


<p align="center">
  A full-featured food delivery mobile application built with React Native and Expo
</p>

---

## 📱 Overview

**BiteNow** is a comprehensive restaurant ordering application that provides a seamless food delivery experience. The app features separate interfaces for customers and restaurant administrators, complete with real-time order tracking, shopping cart management, and user authentication.

## ✨ Features

### 👤 Customer Features
- 🔍 **Restaurant Discovery** - Browse restaurants with search and cuisine filtering
- 📋 **Menu Browsing** - View categorized menu items with descriptions, prices, and allergen info
- 🛒 **Shopping Cart** - Add/remove items, quantity controls, special instructions
- 💳 **Checkout Flow** - Delivery address entry with validation, payment method selection
- 📦 **Order Tracking** - Real-time order status updates
- 📜 **Order History** - View past orders with complete details
- 👤 **Profile Management** - Manage account settings and saved addresses

### 👨‍💼 Admin Features
- 📋 **Order Management** - View and manage incoming orders
- 🔄 **Status Updates** - Update order status through the workflow
- 🍽️ **Menu Management** - View and manage restaurant menu items
- 📊 **Dashboard** - Overview of restaurant operations

### 🔐 General Features
- 📱 **Onboarding** - First-launch carousel introducing app features
- 🔑 **Authentication** - Email/password login and registration with form validation
- 👥 **Role-based Access** - Automatic navigation based on user role
- 💾 **Persistent State** - Cart and auth state persisted across app restarts

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | React Native with Expo SDK 52 |
| **Language** | TypeScript |
| **Navigation** | React Navigation v6 (Native Stack + Bottom Tabs) |
| **UI Library** | React Native Paper (Material Design 3) |
| **State Management** | Zustand with persist middleware |
| **Forms** | React Hook Form + Zod validation |
| **HTTP Client** | Axios |
| **Storage** | AsyncStorage + Expo SecureStore |
| **Icons** | React Native Vector Icons |

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Generic UI (LoadingScreen, EmptyState, ErrorState)
│   ├── CartItemRow.tsx
│   ├── MenuItemRow.tsx
│   ├── OrderCard.tsx
│   ├── RestaurantCard.tsx
│   └── OrderStatusBadge.tsx
│
├── constants/           # App configuration
│   ├── config.ts       # API URL, app settings, order statuses
│   ├── theme.ts        # Colors, spacing, typography
│   └── mockData.ts     # Development mock data
│
├── navigation/          # Navigation setup
│   ├── index.tsx       # RootNavigator
│   ├── AuthNavigator.tsx
│   ├── CustomerNavigator.tsx
│   ├── AdminNavigator.tsx
│   └── types.ts        # Navigation type definitions
│
├── screens/             # Screen components
│   ├── OnboardingScreen.tsx
│   ├── auth/           # Login, Register
│   ├── customer/       # Restaurant browsing, Cart, Checkout, Orders
│   ├── admin/          # Order management, Menu, Profile
│   └── shared/         # Shared screens (OrderDetail)
│
├── services/            # API layer
│   ├── api.ts          # Axios instance with interceptors
│   ├── auth.service.ts
│   ├── restaurant.service.ts
│   └── order.service.ts
│
├── stores/              # State management (Zustand)
│   ├── auth.store.ts   # User auth state
│   ├── cart.store.ts   # Shopping cart
│   └── onboarding.store.ts
│
├── types/               # TypeScript definitions
│   ├── user.types.ts
│   ├── restaurant.types.ts
│   ├── menu.types.ts
│   ├── order.types.ts
│   └── cart.types.ts
│
└── utils/               # Helpers
    ├── formatters.ts
    ├── validators.ts
    └── storage.ts
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Emulator

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/m7mad420/BiteNow-Restaurant-App.git
   cd BiteNow-Restaurant-App
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your API URL
   ```

4. **Start the development server**
   ```bash
   npx expo start
   ```

5. **Run on your device**
   - Press `a` for Android emulator
   - Press `i` for iOS simulator
   - Scan QR code with Expo Go app for physical device

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start Expo dev server |
| `npm run android` | Run on Android |
| `npm run ios` | Run on iOS |
| `npm run web` | Run on web |
| `npm run lint` | ESLint check |
| `npm run typecheck` | TypeScript check |

## 🔌 API Configuration

The app connects to a REST API backend. Configure the API URL in your `.env` file:

```env
API_URL=http://localhost:3001
```

### Expected API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/login` | POST | User login |
| `/auth/register` | POST | User registration |
| `/auth/refresh` | POST | Refresh access token |
| `/auth/me` | GET | Get current user |
| `/restaurants` | GET | List restaurants |
| `/restaurants/:id` | GET | Get restaurant details |
| `/restaurants/:id/menu` | GET | Get restaurant menu |
| `/orders` | GET | Get user's orders |
| `/orders` | POST | Create new order |
| `/orders/:id` | GET | Get order details |
| `/orders/:id/status` | PATCH | Update order status |

## 🧪 Demo Credentials

For testing with mock data:

| Role | Email | Password |
|------|-------|----------|
| Customer | `customer@example.com` | `password123` |
| Admin | `admin@example.com` | `admin123` |

## 🎨 Theme & Design

- **Primary Color**: Vibrant Orange (#FF6B35)
- **Secondary Color**: Deep Teal (#2E8B8B)
- **Accent**: Golden Yellow (#FFB800)
- **Design System**: Material Design 3 via React Native Paper

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**m7mad420**

Made with ❤️ using React Native and Expo

---

<p align="center">
  <sub>Built with React Native • Powered by Expo</sub>
</p>
