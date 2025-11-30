const { GoogleGenerativeAI } = require('@google/generative-ai');
const { Sequelize } = require('sequelize');
const sequelize = require('../db');

// Import your credentials file
const { Gemini_full } = require('../credentials');

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(Gemini_full.API_KEY);

/**
 * Gathers context from your Nexus MySQL database using Sequelize
 */
async function gatherDatabaseContext(message, userId) {
  const context = {
    user: null,
    userInfo: null,
    upcomingEvents: [],
    organizations: [],
    blogs: [],
    buildings: [],
    rooms: [],
    savedEvents: [],
    userInterests: [],
    userSkills: [],
    userOrganizations: [],
    likedBlogs: [],
    relevantContent: { events: [], organizations: [], blogs: [] }
  };

  try {
    // ===== USER-SPECIFIC DATA (if logged in) =====
    if (userId) {
      // Get user basic info
      const [userRows] = await sequelize.query(`
        SELECT u.ID, u.FirstName, u.LastName, u.Email, u.MobileNumber,
               ut.Name as UserType
        FROM user u
        LEFT JOIN usertype ut ON u.UTID = ut.ID
        WHERE u.ID = :userId
      `, { 
        replacements: { userId },
        type: Sequelize.QueryTypes.SELECT 
      });
      
      if (userRows) {
        context.user = userRows;
      }

      // Get user extended info (bio, major, etc.)
      const [userInfoRows] = await sequelize.query(`
        SELECT ui.BIO, ui.Minor, ui.GraduationYear,
               st.Name as StudentType,
               m.Name as Major,
               g.Name as Gender
        FROM userinfo ui
        LEFT JOIN status st ON ui.StudentType = st.ID
        LEFT JOIN status m ON ui.Majors = m.ID
        LEFT JOIN status g ON ui.Gender = g.ID
        WHERE ui.UID = :userId AND ui.IsDeleted = 0
      `, { 
        replacements: { userId },
        type: Sequelize.QueryTypes.SELECT 
      });
      
      if (userInfoRows) {
        context.userInfo = userInfoRows;
      }

      // Get user's saved events
      const savedEvents = await sequelize.query(`
        SELECT e.ID, e.EventActivityName, e.EventDate, e.StartingTime, e.EndingTime,
               e.Overview, e.Capacity,
               b.BuildingName, b.Location as BuildingLocation,
               r.RoomName,
               o.OrganizationName,
               s.Name as EventType
        FROM saveevents se
        JOIN eventsandactivities e ON se.EAAID = e.ID
        LEFT JOIN building b ON e.BuildingID = b.ID
        LEFT JOIN rooms r ON e.RoomID = r.ID
        LEFT JOIN organization o ON e.OID = o.ID
        LEFT JOIN status s ON e.EventType = s.ID
        WHERE se.UID = :userId AND se.IsDeleted = 0 AND e.IsDeleted = 0
        ORDER BY e.EventDate ASC
        LIMIT 5
      `, { 
        replacements: { userId },
        type: Sequelize.QueryTypes.SELECT 
      });
      context.savedEvents = savedEvents;

      // Get user's interests
      const interests = await sequelize.query(`
        SELECT i.Interest, s.Name as Category
        FROM interesttable i
        LEFT JOIN status s ON i.SID = s.ID
        WHERE i.UID = :userId
      `, { 
        replacements: { userId },
        type: Sequelize.QueryTypes.SELECT 
      });
      context.userInterests = interests;

      // Get user's skills
      const skills = await sequelize.query(`
        SELECT sk.Skill, s.Name as Category
        FROM skillstable sk
        LEFT JOIN status s ON sk.SID = s.ID
        WHERE sk.UID = :userId
      `, { 
        replacements: { userId },
        type: Sequelize.QueryTypes.SELECT 
      });
      context.userSkills = skills;

      // Get organizations user is part of
      const userOrgs = await sequelize.query(`
        SELECT o.OrganizationName, o.OrganizationUserName, 
               s.Name as MemberStatus
        FROM manageorganization mo
        JOIN organization o ON mo.OID = o.ID
        JOIN status s ON mo.SID = s.ID
        WHERE mo.UID = :userId AND mo.IsRemove = 0 AND o.IsDeleted = 0
      `, { 
        replacements: { userId },
        type: Sequelize.QueryTypes.SELECT 
      });
      context.userOrganizations = userOrgs;

      // Get blogs user has liked
      const likedBlogs = await sequelize.query(`
        SELECT b.PostTitle, 
               LEFT(b.Content, 200) as ContentPreview
        FROM \`like\` l
        JOIN blogtable b ON l.BID = b.ID
        WHERE l.UID = :userId AND l.IsDeleted = 0 AND b.IsDeleted = 0
        ORDER BY l.CreatedByDate DESC
        LIMIT 5
      `, { 
        replacements: { userId },
        type: Sequelize.QueryTypes.SELECT 
      });
      context.likedBlogs = likedBlogs;

      // Get user's followers count
      const followersCount = await sequelize.query(`
        SELECT 
          (SELECT COUNT(*) FROM followers WHERE FollowingID = :userId AND IsDeleted = 0) as FollowersCount,
          (SELECT COUNT(*) FROM followers WHERE FollowerID = :userId AND IsDeleted = 0) as FollowingCount
      `, { 
        replacements: { userId },
        type: Sequelize.QueryTypes.SELECT 
      });
      context.userFollowers = followersCount[0];
    }

    // ===== GENERAL DATA (for all users) =====

    // Get upcoming events (next 30 days)
    const events = await sequelize.query(`
      SELECT e.ID, e.EventActivityName, e.EventDate, e.StartingTime, e.EndingTime,
             e.Overview, e.Capacity, e.EstimatedCostAverage,
             b.BuildingName, b.Code as BuildingCode, b.Location as BuildingLocation,
             r.RoomName, r.Code as RoomCode, r.Capacity as RoomCapacity,
             o.OrganizationName, o.OrganizationUserName,
             s.Name as EventType
      FROM eventsandactivities e
      LEFT JOIN building b ON e.BuildingID = b.ID
      LEFT JOIN rooms r ON e.RoomID = r.ID
      LEFT JOIN organization o ON e.OID = o.ID
      LEFT JOIN status s ON e.EventType = s.ID
      WHERE e.EventDate >= CURDATE() 
      AND e.EventDate <= DATE_ADD(CURDATE(), INTERVAL 30 DAY)
      AND e.IsDeleted = 0 
      AND e.Isrejected = 0
      ORDER BY e.EventDate ASC
      LIMIT 15
    `, { type: Sequelize.QueryTypes.SELECT });
    context.upcomingEvents = events;

    // Get approved organizations with their info
    const orgs = await sequelize.query(`
      SELECT o.ID, o.OrganizationName, o.OrganizationUserName,
             oi.email, oi.phone, 
             LEFT(oi.AboutUs, 300) as AboutUs, 
             LEFT(oi.Mission, 300) as Mission,
             b.BuildingName, b.Location as BuildingLocation,
             r.RoomName,
             s.Name as OrgType,
             (SELECT COUNT(*) FROM manageorganization mo WHERE mo.OID = o.ID AND mo.IsRemove = 0) as MemberCount
      FROM organization o
      LEFT JOIN organizationinfo oi ON o.ID = oi.OID AND oi.IsDeleted = 0
      LEFT JOIN building b ON oi.BID = b.ID
      LEFT JOIN rooms r ON oi.RID = r.ID
      LEFT JOIN status s ON o.OrganizationType = s.ID
      WHERE o.IsApproved = 1 AND o.IsDeleted = 0
      ORDER BY o.OrganizationName
      LIMIT 20
    `, { type: Sequelize.QueryTypes.SELECT });
    context.organizations = orgs;

    // Get recent blog posts
    const blogs = await sequelize.query(`
      SELECT b.ID, b.PostTitle, 
             LEFT(b.Content, 200) as ContentPreview, 
             b.CreatedDate,
             u.FirstName, u.LastName,
             o.OrganizationName,
             s.Name as Category,
             (SELECT COUNT(*) FROM \`like\` l WHERE l.BID = b.ID AND l.IsDeleted = 0) as LikeCount,
             (SELECT COUNT(*) FROM comments c WHERE c.BID = b.ID AND c.IsDeleted = 0) as CommentCount
      FROM blogtable b
      JOIN user u ON b.UID = u.ID
      LEFT JOIN organization o ON b.OID = o.ID
      LEFT JOIN status s ON b.CategoryID = s.ID
      WHERE b.IsDeleted = 0
      ORDER BY b.CreatedDate DESC
      LIMIT 10
    `, { type: Sequelize.QueryTypes.SELECT });
    context.blogs = blogs;

    // Get buildings
    const buildings = await sequelize.query(`
      SELECT b.ID, b.Code, b.BuildingName, b.Location,
             (SELECT COUNT(*) FROM rooms r WHERE r.BID = b.ID AND r.IsDeleted = 0) as RoomCount
      FROM building b
      WHERE b.IsDeleted = 0
      ORDER BY b.BuildingName
    `, { type: Sequelize.QueryTypes.SELECT });
    context.buildings = buildings;

    // Get rooms with capacity
    const rooms = await sequelize.query(`
      SELECT r.ID, r.Code, r.RoomName, r.Capacity,
             b.BuildingName, b.Code as BuildingCode, b.Location
      FROM rooms r
      JOIN building b ON r.BID = b.ID
      WHERE r.IsDeleted = 0 AND b.IsDeleted = 0
      ORDER BY b.BuildingName, r.RoomName
      LIMIT 30
    `, { type: Sequelize.QueryTypes.SELECT });
    context.rooms = rooms;

    // ===== SEARCH FOR RELEVANT CONTENT =====
    const keywords = message.toLowerCase()
      .split(' ')
      .filter(word => word.length > 3)
      .slice(0, 3);

    if (keywords.length > 0) {
      const searchPattern = `%${keywords[0]}%`;

      // Search events by name or overview
      const relevantEvents = await sequelize.query(`
        SELECT e.EventActivityName, e.EventDate, e.Overview,
               b.BuildingName, o.OrganizationName
        FROM eventsandactivities e
        LEFT JOIN building b ON e.BuildingID = b.ID
        LEFT JOIN organization o ON e.OID = o.ID
        WHERE (LOWER(e.EventActivityName) LIKE :searchPattern OR LOWER(e.Overview) LIKE :searchPattern)
        AND e.EventDate >= CURDATE()
        AND e.IsDeleted = 0 AND e.Isrejected = 0
        LIMIT 5
      `, { 
        replacements: { searchPattern },
        type: Sequelize.QueryTypes.SELECT 
      });
      context.relevantContent.events = relevantEvents;

      // Search organizations
      const relevantOrgs = await sequelize.query(`
        SELECT o.OrganizationName, oi.AboutUs, oi.Mission
        FROM organization o
        LEFT JOIN organizationinfo oi ON o.ID = oi.OID
        WHERE (LOWER(o.OrganizationName) LIKE :searchPattern 
               OR LOWER(oi.AboutUs) LIKE :searchPattern 
               OR LOWER(oi.Mission) LIKE :searchPattern)
        AND o.IsApproved = 1 AND o.IsDeleted = 0
        LIMIT 5
      `, { 
        replacements: { searchPattern },
        type: Sequelize.QueryTypes.SELECT 
      });
      context.relevantContent.organizations = relevantOrgs;

      // Search blogs
      const relevantBlogs = await sequelize.query(`
        SELECT b.PostTitle, LEFT(b.Content, 150) as ContentPreview, 
               o.OrganizationName
        FROM blogtable b
        LEFT JOIN organization o ON b.OID = o.ID
        WHERE (LOWER(b.PostTitle) LIKE :searchPattern OR LOWER(b.Content) LIKE :searchPattern)
        AND b.IsDeleted = 0
        LIMIT 5
      `, { 
        replacements: { searchPattern },
        type: Sequelize.QueryTypes.SELECT 
      });
      context.relevantContent.blogs = relevantBlogs;
    }

  } catch (error) {
    console.error('Error gathering database context:', error);
  }

  return context;
}

/**
 * Builds the system prompt with database context
 */
function buildSystemPrompt(context) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Helper to truncate long text
  const truncate = (text, maxLength = 100) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  // Helper to format time
  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    return timeStr.toString().slice(0, 5);
  };

  return `You are a helpful AI assistant for Nexus - a campus engagement platform. You help students find events, discover organizations, read blog posts, locate buildings/rooms, and navigate campus resources.

TODAY'S DATE: ${currentDate}

IMPORTANT GUIDELINES:
- Be friendly, helpful, and concise
- Use emojis sparingly to make responses engaging (🎉 for events, 🏛️ for organizations, 📍 for locations, 📝 for blogs)
- Format information clearly
- You can ONLY provide information - you CANNOT perform actions like RSVPing, joining organizations, saving events, or following users
- If asked to perform an action, explain what steps the user needs to take themselves in the app
- If information isn't in the provided data, say you don't have that specific information
- Suggest related topics the user might find helpful

${context.user ? `
═══════════════════════════════════════
CURRENT USER PROFILE
═══════════════════════════════════════
Name: ${context.user.FirstName} ${context.user.LastName || ''}
Email: ${context.user.Email}
Phone: ${context.user.MobileNumber || 'Not provided'}
User Type: ${context.user.UserType || 'Student'}

${context.userInfo ? `
Bio: ${context.userInfo.BIO || 'Not set'}
Major: ${context.userInfo.Major || 'Not specified'}
Minor: ${context.userInfo.Minor || 'Not specified'}
Student Type: ${context.userInfo.StudentType || 'Not specified'}
Graduation Year: ${context.userInfo.GraduationYear || 'Not specified'}
` : ''}

${context.userFollowers ? `
Followers: ${context.userFollowers.FollowersCount} | Following: ${context.userFollowers.FollowingCount}
` : ''}

${context.userInterests?.length > 0 ? `
User's Interests: ${context.userInterests.map(i => i.Interest).join(', ')}
` : ''}

${context.userSkills?.length > 0 ? `
User's Skills: ${context.userSkills.map(s => s.Skill).join(', ')}
` : ''}

${context.userOrganizations?.length > 0 ? `
Member of Organizations:
${context.userOrganizations.map(o => `• ${o.OrganizationName} (@${o.OrganizationUserName}) - ${o.MemberStatus}`).join('\n')}
` : 'Not a member of any organizations yet.'}

${context.savedEvents?.length > 0 ? `
Saved Events:
${context.savedEvents.map(e => {
  const date = new Date(e.EventDate).toLocaleDateString();
  const location = [e.BuildingName, e.RoomName].filter(Boolean).join(' - ') || 'TBA';
  return `• "${e.EventActivityName}" - ${date} at ${location}`;
}).join('\n')}
` : 'No saved events yet.'}

${context.likedBlogs?.length > 0 ? `
Recently Liked Posts:
${context.likedBlogs.map(b => `• "${b.PostTitle}"`).join('\n')}
` : ''}
` : 'User is not logged in. Provide general information only.'}

═══════════════════════════════════════
UPCOMING EVENTS (Next 30 Days)
═══════════════════════════════════════
${context.upcomingEvents.length > 0 
  ? context.upcomingEvents.map(e => {
      const date = new Date(e.EventDate).toLocaleDateString();
      const time = e.StartingTime ? `${formatTime(e.StartingTime)} - ${formatTime(e.EndingTime)}` : 'Time TBA';
      const location = [e.BuildingName, e.RoomName].filter(Boolean).join(' - ') || 'Location TBA';
      const org = e.OrganizationName ? `Hosted by: ${e.OrganizationName}` : '';
      const cost = e.EstimatedCostAverage ? `Cost: $${e.EstimatedCostAverage}` : 'Free';
      return `🎉 "${e.EventActivityName}"
   📅 ${date} | ⏰ ${time}
   📍 ${location}
   ${e.EventType ? `[${e.EventType}]` : ''} ${e.Capacity ? `| Capacity: ${e.Capacity}` : ''} | ${cost}
   ${org}
   ${truncate(e.Overview, 120)}`;
    }).join('\n\n')
  : 'No upcoming events found in the next 30 days.'
}

═══════════════════════════════════════
STUDENT ORGANIZATIONS
═══════════════════════════════════════
${context.organizations.length > 0
  ? context.organizations.map(o => {
      const location = [o.BuildingName, o.RoomName].filter(Boolean).join(' - ');
      return `🏛️ ${o.OrganizationName} (@${o.OrganizationUserName})
   ${o.OrgType ? `Type: ${o.OrgType}` : ''}
   ${o.MemberCount ? `Members: ${o.MemberCount}` : ''}
   ${location ? `📍 Office: ${location}` : ''}
   ${o.email ? `📧 ${o.email}` : ''} ${o.phone ? `| 📞 ${o.phone}` : ''}
   ${truncate(o.AboutUs, 120)}`;
    }).join('\n\n')
  : 'No approved organizations found.'
}

═══════════════════════════════════════
RECENT BLOG POSTS
═══════════════════════════════════════
${context.blogs.length > 0
  ? context.blogs.map(b => {
      const author = `${b.FirstName} ${b.LastName || ''}`.trim();
      const date = new Date(b.CreatedDate).toLocaleDateString();
      return `📝 "${b.PostTitle}"
   By: ${author} ${b.OrganizationName ? `(${b.OrganizationName})` : ''} | ${date}
   ${b.Category ? `[${b.Category}]` : ''} | ❤️ ${b.LikeCount || 0} likes | 💬 ${b.CommentCount || 0} comments
   ${truncate(b.ContentPreview, 100)}`;
    }).join('\n\n')
  : 'No blog posts found.'
}

═══════════════════════════════════════
CAMPUS BUILDINGS
═══════════════════════════════════════
${context.buildings.length > 0
  ? context.buildings.map(b => 
      `🏢 ${b.BuildingName} (${b.Code})
   📍 ${b.Location || 'Location not specified'}
   🚪 ${b.RoomCount} rooms available`
    ).join('\n\n')
  : 'No buildings found.'
}

═══════════════════════════════════════
AVAILABLE ROOMS
═══════════════════════════════════════
${context.rooms?.length > 0
  ? context.rooms.map(r => 
      `• ${r.RoomName} (${r.Code}) - ${r.BuildingName} | Capacity: ${r.Capacity || 'N/A'}`
    ).join('\n')
  : 'No rooms found.'
}

${context.relevantContent.events.length > 0 || context.relevantContent.organizations.length > 0 || context.relevantContent.blogs.length > 0 ? `
═══════════════════════════════════════
SEARCH RESULTS MATCHING USER'S QUERY
═══════════════════════════════════════
${context.relevantContent.events.length > 0 ? `Events:\n${context.relevantContent.events.map(e => `• "${e.EventActivityName}" on ${new Date(e.EventDate).toLocaleDateString()}`).join('\n')}` : ''}
${context.relevantContent.organizations.length > 0 ? `\nOrganizations:\n${context.relevantContent.organizations.map(o => `• "${o.OrganizationName}"`).join('\n')}` : ''}
${context.relevantContent.blogs.length > 0 ? `\nBlog Posts:\n${context.relevantContent.blogs.map(b => `• "${b.PostTitle}"`).join('\n')}` : ''}
` : ''}

Remember: Be helpful and informative. Keep responses concise but complete. Always suggest follow-up questions or related topics the user might find interesting.`;
}

/**
 * Generate contextual suggestions based on the query and user context
 */
function generateSuggestions(userMessage, context) {
  const lowerMessage = userMessage.toLowerCase();
  
  // Default suggestions
  let suggestions = [
    "What events are happening this week?",
    "Show me student organizations",
    "Find a study room",
    "Recent blog posts"
  ];

  if (lowerMessage.includes('event')) {
    suggestions = [
      "Events this weekend",
      "Free events",
      "How do I save an event?",
      "Events by category"
    ];
  } else if (lowerMessage.includes('organization') || lowerMessage.includes('club') || lowerMessage.includes('org')) {
    suggestions = [
      "How do I join an organization?",
      "Academic organizations",
      "Sports and recreation clubs",
      "Cultural organizations"
    ];
  } else if (lowerMessage.includes('room') || lowerMessage.includes('building') || lowerMessage.includes('location') || lowerMessage.includes('where')) {
    suggestions = [
      "Large meeting rooms",
      "Study spaces",
      "All buildings on campus",
      "Room capacity info"
    ];
  } else if (lowerMessage.includes('blog') || lowerMessage.includes('post') || lowerMessage.includes('news')) {
    suggestions = [
      "Latest announcements",
      "Most liked posts",
      "Organization updates",
      "How to write a post"
    ];
  } else if (lowerMessage.includes('my') || lowerMessage.includes('profile')) {
    suggestions = [
      "My saved events",
      "My organizations",
      "Update my profile",
      "Events matching my interests"
    ];
  } else if (context.user) {
    // Personalized suggestions for logged-in users
    suggestions = [
      "Events matching my interests",
      "My saved events",
      "Organizations I might like",
      "What's happening today?"
    ];
  }

  return suggestions.slice(0, 4);
}

/**
 * Main chat handler
 * POST /api/chat
 */
const handleChat = async (req, res) => {
  const { message, conversationHistory = [] } = req.body;
  const userId = req.user?.id || null;

  // Validate input
  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({ 
      error: 'Message is required and must be a non-empty string' 
    });
  }

  // Limit conversation history to last 10 messages
  const trimmedHistory = conversationHistory.slice(-10);

  try {
    // Gather context from database using Sequelize
    const context = await gatherDatabaseContext(message, userId);

    // Build system prompt
    const systemPrompt = buildSystemPrompt(context);

    // Initialize the Gemini model
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash',
      systemInstruction: systemPrompt
    });

    // Convert conversation history to Gemini format
    const history = trimmedHistory.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    // Start chat with history
    const chat = model.startChat({ history });

    // Send the new message
    const result = await chat.sendMessage(message);
    const assistantMessage = result.response.text();

    // Generate contextual suggestions
    const suggestions = generateSuggestions(message, context);

    // Return response
    res.json({
      reply: assistantMessage,
      suggestions: suggestions,
      conversationHistory: [
        ...trimmedHistory,
        { role: 'user', content: message },
        { role: 'assistant', content: assistantMessage }
      ]
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    
    if (error.message?.includes('API_KEY') || error.message?.includes('API key')) {
      return res.status(500).json({ 
        error: 'AI service configuration error. Please contact support.' 
      });
    }
    
    if (error.status === 429 || error.message?.includes('quota')) {
      return res.status(429).json({ 
        error: 'Too many requests. Please wait a moment and try again.' 
      });
    }

    res.status(500).json({ 
      error: 'Failed to process your message. Please try again.' 
    });
  }
};

/**
 * Health check handler
 * GET /api/chat/health
 */
const healthCheck = (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'Nexus AI Chat'
  });
};

module.exports = {
  handleChat,
  healthCheck
};
