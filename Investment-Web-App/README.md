# Investment Portfolio Backend API

A robust Node.js backend API for managing investment portfolios, including stocks, bonds, and precious metals. Built with Express.js and MySQL.

## 🏗️ Project Overview

This backend service provides RESTful APIs for:
- **Stock Management**: Buy, sell, and track stock investments
- **Bond Trading**: Government and corporate bond transactions
- **Precious Metals**: Gold, silver, platinum, and other metals trading
- **Portfolio Analytics**: Real-time portfolio tracking and analytics
- **Transaction History**: Complete transaction logging and reporting

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn package manager

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Investment-Web-App
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   npm run setup
   ```
   This will create a `.env` file with default values. Update the `DB_PASSWORD` with your actual MySQL password.

4. **Configure database**
   - Ensure MySQL is running
   - Create database: `CREATE DATABASE investment_db;`
   - Update `.env` file with your database credentials

5. **Run migrations**
   ```bash
   # For keeping connection pool alive (recommended for development)
   npm run migrate
   
   # OR for ending connection pool after migrations
   npm run migrate:end
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

7. **Verify installation**
   - Server will start on `http://localhost:5000`
   - API endpoints will be available at `http://localhost:5000/api/*`

## 🖥️ Virtual Machine Setup Instructions

### Option 1: Using VirtualBox

1. **Install VirtualBox**
   - Download from [VirtualBox.org](https://www.virtualbox.org/)
   - Install on your host machine

2. **Download Ubuntu Server ISO**
   - Download Ubuntu Server 22.04 LTS from [ubuntu.com](https://ubuntu.com/download/server)
   - Recommended: Ubuntu Server 22.04 LTS (64-bit)

3. **Create Virtual Machine**
   ```bash
   # Open VirtualBox and create new VM
   # Name: Investment-Portfolio-Server
   # Type: Linux
   # Version: Ubuntu (64-bit)
   # Memory: 4GB (4096 MB) minimum
   # Hard disk: 20GB minimum
   ```

4. **Install Ubuntu Server**
   - Boot from Ubuntu ISO
   - Choose "Install Ubuntu Server"
   - Follow installation wizard
   - Enable SSH server during installation
   - Install OpenSSH server: `sudo apt install openssh-server`

5. **Update system**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

6. **Install Node.js**
   ```bash
   # Install Node.js 18.x
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Verify installation
   node --version
   npm --version
   ```

7. **Install MySQL**
   ```bash
   # Install MySQL Server
   sudo apt install mysql-server -y
   
   # Secure MySQL installation
   sudo mysql_secure_installation
   
   # Create database and user
   sudo mysql -u root -p
   ```
   ```sql
   CREATE DATABASE investment_db;
   CREATE USER 'investment_user'@'localhost' IDENTIFIED BY 'your_secure_password';
   GRANT ALL PRIVILEGES ON investment_db.* TO 'investment_user'@'localhost';
   FLUSH PRIVILEGES;
   EXIT;
   ```

8. **Clone and setup project**
   ```bash
   # Install Git
   sudo apt install git -y
   
   # Clone repository
   git clone <repository-url>
   cd Investment-Web-App
   
   # Install dependencies
   npm install
   
   # Setup environment
   npm run setup
   ```

9. **Configure environment**
   ```bash
   # Edit .env file
   nano .env
   ```
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=investment_user
   DB_PASSWORD=your_secure_password
   DB_NAME=investment_db
   ```

10. **Run migrations and start server**
    ```bash
    # Run migrations
    npm run migrate
    
    # Start server
    npm run dev
    ```

### Option 2: Using Docker (Recommended for VM)

1. **Install Docker on VM**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   
   # Add user to docker group
   sudo usermod -aG docker $USER
   
   # Install Docker Compose
   sudo apt install docker-compose -y
   ```

2. **Create Docker Compose file**
   ```bash
   # Create docker-compose.yml in project root
   nano docker-compose.yml
   ```
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
       build: .
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
         - .:/app
         - /app/node_modules
   
   volumes:
     mysql_data:
   ```

3. **Create Dockerfile**
   ```bash
   # Create Dockerfile in project root
   nano Dockerfile
   ```
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   EXPOSE 5000
   CMD ["npm", "run", "dev"]
   ```

4. **Run with Docker Compose**
   ```bash
   # Build and start services
   docker-compose up --build
   ```

## 📁 Project Structure

```
Investment-Web-App/
├── src/
│   ├── controllers/          # Route controllers
│   │   ├── bonds.controllers.js
│   │   ├── dashboard.controllers.js
│   │   ├── investments.controllers.js
│   │   └── metals.controllers.js
│   ├── db/
│   │   └── connections.db.js # Database connection
│   ├── middlewares/
│   │   └── auth.middleware.js
│   ├── migrations/
│   │   ├── migrations.db.js
│   │   └── utility.migrations.js
│   ├── models/
│   │   ├── bonds.models.js
│   │   ├── dashboard.models.js
│   │   ├── investments.models.js
│   │   └── metals.models.js
│   ├── routes/
│   │   ├── bonds.routes.js
│   │   ├── dashboard.routes.js
│   │   ├── investments.routes.js
│   │   └── metals.routes.js
│   ├── app.js               # Express app configuration
│   └── main.js              # Server entry point
├── setup-env.js             # Environment setup script
├── package.json
└── README.md
```

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

### Available Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run migrate` - Run database migrations (keep connection)
- `npm run migrate:end` - Run migrations and end connection
- `npm run setup` - Setup environment variables

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=investment_db
```

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure MySQL is running: `sudo systemctl status mysql`
   - Check credentials in `.env` file
   - Verify database exists: `SHOW DATABASES;`

2. **Port Already in Use**
   - Change PORT in `.env` file
   - Kill process using port: `sudo lsof -ti:5000 | xargs kill -9`

3. **Migration Errors**
   - Ensure database exists
   - Check user permissions
   - Run: `npm run migrate:end` to reset connection

### VM-Specific Issues

1. **Firewall Configuration**
   ```bash
   # Allow port 5000
   sudo ufw allow 5000
   sudo ufw enable
   ```

2. **Network Configuration**
   - Ensure VM has internet access
   - Configure port forwarding if needed
   - Check VM network adapter settings

## 📄 License

This project is licensed under the ISC License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the API documentation
