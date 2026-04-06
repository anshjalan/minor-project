import app from "./app.js";
import { connectDatabase } from "./config/db.js";

const PORT = process.env.PORT || 5000;

connectDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Backend running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start backend:", error.message);
    process.exit(1);
  });

