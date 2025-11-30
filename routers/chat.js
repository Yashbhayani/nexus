const express = require('express');
const router = express.Router();

// Import controller
const chatController = require('../controller/chatcontroller');
const fetchUser = require('../midlewere/fetchuser'); 

/**
 * POST /api/chat
 * Main chat endpoint - handles user messages and returns AI responses
 */
router.post('/', fetchUser, chatController.handleChat); 

/**
 * GET /api/chat/health
 * Health check endpoint
 */
router.get('/health', chatController.healthCheck);

module.exports = router;
