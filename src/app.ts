import "dotenv/config";
import express from "express";
import cors from "cors";
import routerDoctors from "./routes/doctor";
import routerPatients from "./routes/patient.routes";
import routerDates from "./routes/date";
import routerSpecialties from "./routes/specialty"
import routerServices from "./routes/service"

import db from "./config/mongo";
const PORT = process.env.PORT || 3001;
const app = express();
app.use(cors());
app.use(express.json());
app.use("/doctors", routerDoctors);
app.use("/patients", routerPatients);
app.use("/dates", routerDates);

db().then(() => console.log("Conexion DB exitosa"));
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
