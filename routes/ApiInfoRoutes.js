const express = require("express");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: API Info
 *   description: API information and endpoints
 */

/**
 * @swagger
 * /api/info:
 *   get:
 *     description: Get all available API endpoints and their information
 *     tags: [API Info]
 *     responses:
 *       200:
 *         description: Success
 */
router.get("/", (req, res) => {
  const apiInfo = {
    baseUrl: "http://localhost:5000",
    version: "1.0.0",
    authentication: {
      methods: [
        {
          type: "Bearer Token",
          header: "Authorization",
          format: "Bearer <token>",
          description: "Standard JWT Bearer token (recommended)"
        },
        {
          type: "Custom Header",
          header: "x-auth-token", 
          format: "<token>",
          description: "Custom header format"
        }
      ]
    },
    endpoints: {
      users: {
        baseUrl: "/api/users",
        auth: false,
        endpoints: [
          {
            method: "POST",
            path: "/register",
            description: "Register new user",
            body: {
              fullname: "string (required)",
              dob: "string (YYYY-MM-DD, required)",
              email: "string (required)",
              phone: "string (required)", 
              password: "string (required)",
              role: "string (admin|giangvien|hocsinh, default: hocsinh)"
            }
          },
          {
            method: "POST", 
            path: "/login",
            description: "User login",
            body: {
              email: "string (required)",
              password: "string (required)"
            }
          }
        ]
      },
      categories: {
        baseUrl: "/api/categories",
        auth: true,
        endpoints: [
          {
            method: "GET",
            path: "/",
            description: "Get all categories"
          },
          {
            method: "POST",
            path: "/", 
            description: "Create new category",
            body: {
              name: "string (required)"
            }
          }
        ]
      },
      courses: {
        baseUrl: "/api/courses",
        auth: true,
        endpoints: [
          {
            method: "GET",
            path: "/",
            description: "Get all courses (sorted by students and rating)"
          },
          {
            method: "GET",
            path: "/:id", 
            description: "Get course by ID",
            params: {
              id: "string (course ID)"
            }
          },
          {
            method: "POST",
            path: "/",
            description: "Create new course",
            body: {
              title: "string (required)",
              price: "number (required)",
              category: "string (category ID, required)"
            }
          },
          {
            method: "PUT",
            path: "/:id",
            description: "Update course by ID", 
            params: {
              id: "string (course ID)"
            },
            body: {
              title: "string (optional)",
              price: "number (optional)",
              category: "string (optional)"
            }
          },
          {
            method: "DELETE",
            path: "/:id",
            description: "Delete course by ID",
            params: {
              id: "string (course ID)"
            }
          },
          {
            method: "GET",
            path: "/category/:id",
            description: "Get courses by category ID",
            params: {
              id: "string (category ID)"
            }
          },
          {
            method: "GET",
            path: "/:courseId/recordings",
            description: "Get all recordings for a course",
            params: {
              courseId: "string (course ID)"
            }
          }
        ]
      },
      sessions: {
        baseUrl: "/api/sessions",
        auth: true,
        endpoints: [
          {
            method: "GET",
            path: "/",
            description: "Get all video call sessions"
          },
          {
            method: "POST",
            path: "/",
            description: "Create new video call session"
          }
        ]
      },
      recordings: {
        baseUrl: "/api/recordings", 
        auth: true,
        endpoints: [
          {
            method: "GET",
            path: "/",
            description: "Get all recordings"
          },
          {
            method: "POST",
            path: "/",
            description: "Create new recording"
          }
        ]
      }
    },
    models: {
      User: {
        fullname: "string",
        dob: "string (YYYY-MM-DD)",
        email: "string",
        phone: "string",
        password: "string", 
        role: "string (admin|giangvien|hocsinh)"
      },
      Category: {
        _id: "ObjectId",
        name: "string"
      },
      Course: {
        _id: "ObjectId",
        title: "string",
        price: "number",
        category: "ObjectId (ref: Category)",
        rating: "number (default: 0)",
        students: "number (default: 0)"
      }
    },
    errorCodes: {
      "401": "Unauthorized - No token or invalid token",
      "404": "Not Found - Resource not found",
      "500": "Internal Server Error"
    }
  };

  res.json(apiInfo);
});

/**
 * @swagger
 * /api/info/endpoints:
 *   get:
 *     description: Get simplified list of all endpoints
 *     tags: [API Info]
 *     responses:
 *       200:
 *         description: Success
 */
router.get("/endpoints", (req, res) => {
  const endpoints = [
    // Users (no auth)
    { method: "POST", path: "/api/users/register", auth: false },
    { method: "POST", path: "/api/users/login", auth: false },
    
    // Categories (auth required)
    { method: "GET", path: "/api/categories", auth: true },
    { method: "POST", path: "/api/categories", auth: true },
    
    // Courses (auth required)  
    { method: "GET", path: "/api/courses", auth: true },
    { method: "GET", path: "/api/courses/:id", auth: true },
    { method: "POST", path: "/api/courses", auth: true },
    { method: "PUT", path: "/api/courses/:id", auth: true },
    { method: "DELETE", path: "/api/courses/:id", auth: true },
    { method: "GET", path: "/api/courses/category/:id", auth: true },
    { method: "GET", path: "/api/courses/:courseId/recordings", auth: true },
    
    // Sessions (auth required)
    { method: "GET", path: "/api/sessions", auth: true },
    { method: "POST", path: "/api/sessions", auth: true },
    
    // Recordings (auth required)
    { method: "GET", path: "/api/recordings", auth: true },
    { method: "POST", path: "/api/recordings", auth: true }
  ];

  res.json({
    total: endpoints.length,
    endpoints: endpoints
  });
});

module.exports = router;