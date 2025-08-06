# Investment Portfolio Management System

A comprehensive full-stack application for managing investment portfolios, featuring stocks, bonds, and precious metals trading with a modern, professional UI.

## 🏗️ Project Overview

This is a complete investment portfolio management system consisting of:

- **Backend API** (`Investment-Web-App/`): Node.js/Express.js REST API with MySQL database
- **Frontend Application** (`Investment-Web-App-Frontend/`): React/Next.js modern web application

### Key Features

- 📊 **Real-time Portfolio Analytics**: Interactive charts and metrics
- 🏛️ **Stock Trading**: Buy, sell, and track stock investments
- 📈 **Bond Management**: Government and corporate bond trading
- 🥇 **Precious Metals**: Gold, silver, platinum, and other metals
- 🎨 **Modern UI/UX**: Glassmorphism design with smooth animations
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile
- 🔒 **Secure API**: RESTful endpoints with proper error handling

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- MySQL (v8.0 or higher)
- npm or yarn package manager

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd investment-portfolio-system
   ```

2. **Setup Backend**
   ```bash
   cd Investment-Web-App
   npm install
   npm run setup
   # Update .env file with your MySQL credentials
   npm run migrate
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd ../Investment-Web-App-Frontend
   npm install
   npm run setup
   npm run dev
   ```

4. **Access the Application**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:5000](http://localhost:5000)

## 🖥️ Virtual Machine Setup

### Option 1: Complete VM Setup (Recommended)

Follow the detailed VM setup instructions in each project directory:

- **[Backend VM Setup](Investment-Web-App/README.md#virtual-machine-setup-instructions)**
- **[Frontend VM Setup](Investment-Web-App-Frontend/README.md#virtual-machine-setup-instructions)**

### Option 2: Docker Setup (Easiest)

1. **Install Docker and Docker Compose**
   ```bash
   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   
   # Install Docker Compose
   sudo apt install docker-compose -y
   ```

2. **Create docker-compose.yml in root directory**
   ```yaml
   version: '3.8'
   services:
     mysql:
       image: mysql:8.0
       environment:
         MYSQL_ROOT_PASSWORD: rootpassword
         MYSQL_DATABASE: investment_db
         MYSQL_USER: investment_user
         MYSQL_PASSWORD: userpassword
       ports:
         - "3306:3306"
       volumes:
         - mysql_data:/var/lib/mysql
   
     backend:
       build: ./Investment-Web-App
       ports:
         - "5000:5000"
       environment:
         - DB_HOST=mysql
         - DB_USER=investment_user
         - DB_PASSWORD=userpassword
         - DB_NAME=investment_db
       depends_on:
         - mysql
       volumes:
         - ./Investment-Web-App:/app
         - /app/node_modules
   
     frontend:
       build: ./Investment-Web-App-Frontend
       ports:
         - "3000:3000"
       environment:
         - BACKEND_URL=http://backend:5000
       depends_on:
         - backend
       volumes:
         - ./Investment-Web-App-Frontend:/app
         - /app/node_modules
   
   volumes:
     mysql_data:
   ```

3. **Run the entire system**
   ```bash
   docker-compose up --build
   ```

## 📁 Project Structure

```
investment-portfolio-system/
├── Investment-Web-App/              # Backend API
│   ├── src/
│   │   ├── controllers/            # Route controllers
│   │   ├── db/                     # Database connection
│   │   ├── middlewares/            # Express middlewares
│   │   ├── migrations/             # Database migrations
│   │   ├── models/                 # Data models
│   │   ├── routes/                 # API routes
│   │   ├── app.js                  # Express app
│   │   └── main.js                 # Server entry
│   ├── setup-env.js                # Environment setup
│   ├── package.json
│   └── README.md
├── Investment-Web-App-Frontend/     # Frontend Application
│   ├── src/
│   │   ├── app/                    # Next.js app directory
│   │   ├── components/             # React components
│   │   └── lib/                    # Utility libraries
│   ├── public/                     # Static assets
│   ├── setup-env.js                # Environment setup
│   ├── package.json
│   └── README.md
└── README.md                        # This file
```

## 🎯 Key Features

### Backend Features
- **RESTful API**: Complete CRUD operations for investments
- **Database Management**: MySQL with migrations
- **Real-time Data**: Integration with financial APIs
- **Error Handling**: Comprehensive error management
- **Security**: Input validation and sanitization

### Frontend Features
- **Modern UI**: Glassmorphism design with blur effects
- **Interactive Charts**: Real-time portfolio visualization
- **Responsive Design**: Mobile-first approach
- **Smooth Animations**: Professional user experience
- **Type Safety**: TypeScript ready

### Investment Types
- **Stocks**: Real-time stock trading and tracking
- **Bonds**: Government and corporate bond management
- **Precious Metals**: Gold, silver, platinum trading

## 🔧 API Endpoints

### Stocks
- `GET /api/stocks` - Get all stocks
- `GET /api/search?q={query}` - Search stocks
- `GET /api/owned` - Get owned stocks
- `POST /api/buy` - Buy stocks
- `POST /api/sell` - Sell stocks
- `GET /api/transactions` - Get transaction history

### Bonds
- `GET /api/bonds/search?q={query}` - Search bonds
- `GET /api/bonds/owned` - Get owned bonds
- `POST /api/bonds/buy` - Buy bonds
- `POST /api/bonds/sell` - Sell bonds
- `GET /api/bonds/transactions` - Get bond transactions

### Metals
- `GET /api/metals/search` - Get available metals
- `GET /api/metals/owned` - Get owned metals
- `POST /api/metals/buy` - Buy metals
- `POST /api/metals/sell` - Sell metals
- `GET /api/metals/transactions` - Get metal transactions

### Dashboard
- `GET /api/dashboard` - Get portfolio summary
- `GET /api/dashboard/analytics` - Get portfolio analytics

## 🛠️ Development

### Backend Development
```bash
cd Investment-Web-App
npm run dev          # Start development server
npm run migrate      # Run migrations
npm run migrate:end  # Run migrations and end connection
```

### Frontend Development
```bash
cd Investment-Web-App-Frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
```

### Environment Variables

#### Backend (.env)
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=investment_db
```

#### Frontend (.env.local)
```env
BACKEND_URL=http://localhost:5000
```

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection**
   - Ensure MySQL is running
   - Check credentials in `.env` file
   - Verify database exists

2. **Port Conflicts**
   - Backend: Change PORT in `.env`
   - Frontend: Use `npm run dev -- -p 3001`

3. **Dependencies**
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Clear cache: `npm cache clean --force`

### VM-Specific Issues

1. **Network Configuration**
   ```bash
   # Allow required ports
   sudo ufw allow 3000
   sudo ufw allow 5000
   sudo ufw allow 3306
   sudo ufw enable
   ```

2. **Performance Issues**
   - Increase VM memory (8GB minimum)
   - Enable multiple CPU cores
   - Use SSD storage

## 📄 License

- Backend: ISC License
- Frontend: MIT License

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting sections in individual READMEs
- Review the API documentation

## 🔗 Quick Links

- **[Backend Documentation](Investment-Web-App/README.md)**
- **[Frontend Documentation](Investment-Web-App-Frontend/README.md)**
- **[API Endpoints](#api-endpoints)**
- **[VM Setup Instructions](#virtual-machine-setup)**

## 🎉 Getting Started Video

[Coming Soon] - Video tutorial for setting up the entire system

---

**Happy Investing! 📈💰** 