// Mock API service for demo deployment
const MOCK_FOOD_DATA = [
  {
    "CategoryName": "Pizza",
    "items": [
      {
        "_id": "1",
        "name": "Margherita Pizza",
        "img": "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        "options": [{"Regular": 299, "Medium": 499, "Large": 699}],
        "CategoryName": "Pizza",
        "description": "Fresh tomatoes, mozzarella, and basil"
      },
      {
        "_id": "2", 
        "name": "Veggie Supreme Pizza",
        "img": "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        "options": [{"Regular": 399, "Medium": 599, "Large": 799}],
        "CategoryName": "Pizza",
        "description": "Bell peppers, olives, onions, and cheese"
      }
    ]
  },
  {
    "CategoryName": "Burgers",
    "items": [
      {
        "_id": "3",
        "name": "Veggie Burger",
        "img": "https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        "options": [{"Single": 199, "Double": 299}],
        "CategoryName": "Burgers", 
        "description": "Plant-based patty with fresh vegetables"
      },
      {
        "_id": "4",
        "name": "Cheese Burger",
        "img": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        "options": [{"Single": 249, "Double": 349}],
        "CategoryName": "Burgers",
        "description": "Juicy patty with melted cheese"
      }
    ]
  }
];

const MOCK_CATEGORIES = [
  {"CategoryName": "Pizza"},
  {"CategoryName": "Burgers"},
  {"CategoryName": "Starters"},
  {"CategoryName": "Drinks"}
];

export const mockApiService = {
  // Mock food data API
  getFoodData: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const foodItems = MOCK_FOOD_DATA.flatMap(category => category.items);
        resolve([foodItems, MOCK_CATEGORIES]);
      }, 500); // Simulate network delay
    });
  },

  // Mock login API
  login: async (credentials) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (credentials.email && credentials.password) {
          resolve({
            success: true,
            authToken: "mock-jwt-token-12345",
            message: "Login successful (Demo Mode)"
          });
        } else {
          resolve({
            success: false,
            message: "Invalid credentials"
          });
        }
      }, 1000);
    });
  },

  // Mock signup API
  signup: async (userData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: "Account created successfully (Demo Mode)"
        });
      }, 1000);
    });
  },

  // Mock order API
  orderData: async (orderData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: "Order placed successfully (Demo Mode)",
          orderId: `ORDER-${Date.now()}`
        });
      }, 1000);
    });
  },

  // Mock get orders API
  getMyOrders: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          orderData: [
            {
              _id: "1",
              order_date: new Date().toISOString(),
              order_data: [
                {
                  name: "Margherita Pizza",
                  qty: 1,
                  size: "Regular",
                  price: 299
                }
              ]
            }
          ]
        });
      }, 500);
    });
  }
};

// Check if we're in production and should use mock data
export const USE_MOCK_DATA = process.env.NODE_ENV === 'production' && !process.env.REACT_APP_API_URL;
