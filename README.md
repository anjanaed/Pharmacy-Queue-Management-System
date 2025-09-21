# Pharmacy Queue Management System

A full-stack web application for managing pharmacy queues, employee registrations, and order processing. Built with React (frontend) and Node.js/Express (backend), using MongoDB for data storage and Firebase for authentication.

## Features

- **Employee Management**: Register, view, edit, and delete employees.
- **Order Management**: Create, update, and track orders with status (Pending, Completed, Cancelled).
- **Authentication**: Firebase-based login for admins and employees.
- **Queue System**: Daily order numbering with automatic reset at midnight.
- **Reports**: View order history and aggregated statistics by employee (daily, weekly, monthly).
- **Responsive UI**: Bootstrap and Tailwind CSS for mobile-friendly design.
- **Notifications**: In-app notifications for user feedback.

## Tech Stack

### Frontend
- **React 18** with Vite for fast development and building.
- **React Router** for client-side routing.
- **Firebase Auth** for user authentication.
- **Axios** for API calls.
- **Bootstrap 5** and **Tailwind CSS** for styling.
- **FontAwesome** and **React Icons** for icons.
- **React Toastify** for notifications.
- **jsPDF** for generating reports.

### Backend
- **Node.js** with Express.js for the server.
- **MongoDB** with Mongoose for database and schema management.
- **CORS** for cross-origin requests.
- **Dotenv** for environment variables.

### Other
- **Firebase** for authentication and potential future features.
- **Vercel** for deployment (configured in vercel.json).

## Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud, e.g., MongoDB Atlas)
- Firebase project with Authentication enabled

### Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `backend` directory with the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   VITE_REACT_APP_API_BASE_URL=http://localhost:3000
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   ```

4. Start the server:
   - Development mode: `npm run dev`
   - Production mode: `npm run serve`

   The server will run on `http://localhost:3000`.

### Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `frontend` directory with the following variables:
   ```
   VITE_REACT_APP_API_BASE_URL=http://localhost:3000
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

   The app will run on `http://localhost:5173`.

### Building for Production
1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. The built files will be in `frontend/dist`. Serve them using a static server or integrate with the backend (see deployment section).

## Usage

### User Roles
- **Admin**: Can manage employees, view all orders, and access reports.
- **Employee**: Can view their assigned orders and update status.

### Key Routes
- `/`: Auto-routing based on authentication status.
- `/employees`: Employee management (admin only).
- `/pending-order`: View and manage pending orders (admin only).
- `/user`: Employee interface for order management.
- `/order-history`: View order history and reports.
- `/login`: Login page.
- `/register`: Register new employees (admin only).

### API Endpoints

#### Employees
- `GET /api/employee`: Get all employees.
- `GET /api/employee/:empID`: Get employee by ID.
- `POST /api/employee`: Create new employee (body: {empID, name, email}).
- `PUT /api/employee/:empID`: Update employee.
- `DELETE /api/employee/:empID`: Delete employee.
- `GET /api/employee/check/:id`: Check if employee exists.

#### Orders
- `GET /api/order`: Get all orders.
- `GET /api/order/:orderID`: Get order by ID.
- `POST /api/order`: Create new order (body: {orderID, orderDate, orderTime, orderStatus, EmpID}).
- `PUT /api/order/:orderID/:orderDate`: Update order.
- `DELETE /api/order/:orderID`: Delete order.
- `GET /api/order/employee/:empID`: Get aggregated order stats for employee.

#### Utilities
- `GET /api/orderNumber`: Get current order number.
- `POST /api/orderNumber/increment`: Increment order number.

## Database Schema

### Employee
- `empID` (String, required, unique)
- `name` (String, required)
- `email` (String, unique, validated)

### Order
- `orderID` (String, required)
- `orderDate` (Date, required)
- `orderTime` (String, required)
- `orderStatus` (String, enum: Pending/Completed/Cancelled, required)
- `EmpID` (String, required)

## Deployment

### Backend
- Deploy to services like Heroku, Railway, or Vercel.
- Ensure `MONGODB_URI` points to a production database.
- Set environment variables in the deployment platform.

### Frontend
- Build the app: `npm run build`.
- Serve `dist` folder via static hosting (e.g., Vercel, Netlify) or integrate with backend Express server by adding static middleware.

### Full-Stack Deployment
- For a single server, modify `backend/index.js` to serve the frontend:
  ```js
  import path from 'path';
  import { fileURLToPath } from 'url';

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const distPath = path.resolve(__dirname, '../frontend/dist');

  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api/')) return res.status(404).end();
    res.sendFile(path.join(distPath, 'index.html'));
  });
  ```
- Then deploy the backend with the built frontend included.

## Contributing

1. Fork the repository.
2. Create a feature branch.
3. Commit changes.
4. Push to the branch.
5. Open a Pull Request.

## License

ISC License.