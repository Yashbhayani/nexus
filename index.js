const express = require("express");
const cors = require("cors");
require("./db");
// Load associations (VERY IMPORTANT)
const Organization  = require('./models/organization');
const User  = require('./models/user');
const Status  = require('./models/status');
const Images   = require('./models/images');
const UserInfo   = require('./models/userinfo');
const EventsAndActivities   = require('./models/eventsandactivities');
const StatusType   = require('./models/statustype');
const ThirdPartyHandleApi   = require('./models/thirdpartyhandleapi');
const OrganizationType   = require('./models/organizationtype');
const Room   = require('./models/rooms');
const OrganizationInfo   = require('./models/organizationinfo');
const ManageHashtags   = require('./models/managehashtags');
const ManageEventAndActivities   = require('./models/manageeventandactivities');
const Like   = require('./models/like');
const Hashtags   = require('./models/hashtags');
const Followers   = require('./models/followers');
const Feedback   = require('./models/feedback');
const Comments   = require('./models/comments');
const Building   = require('./models/building');
const BlogTable   = require('./models/blogtable');

  
  
  

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.use("/api/usertype", require("./routers/usertype"));
app.use("/api/auth", require("./routers/auth"));

const PORT = process.env.PORT;
app.listen(PORT, () =>
  console.log(`✅ Server started on http://localhost:${PORT}`)
);
