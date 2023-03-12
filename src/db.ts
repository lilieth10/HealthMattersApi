import { connect } from "mongoose";
require("dotenv").config();
const { MONGODB_URI } = process.env;

(async () => {
  try {
    const db = await connect(MONGODB_URI || "");
    console.log(`db connected to ${db.connection.name}`);
  } catch (err) {
    console.error(err);
  }
})();
