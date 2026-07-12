require("dotenv").config();

const app = require("./src/app");
const connectDatabase = require("./src/config/database");

connectDatabase();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 SAMIS API running on http://localhost:${PORT}`);
});
