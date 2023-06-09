import express from "express";
import cors from "cors";
import db from "./config/mongo";
import routerDoctors from "./routes/doctor";
import routerPatients from "./routes/patient.routes";
import routerSpecialties from "./routes/specialty";
import routerServices from "./routes/service";
import routerDates from "./routes/date";
import routerUsers from "./routes/user";
import checkoutRouter from "./routes/checkout";
import notificationRouter from "./routes/checkout";
import { loginCtrl, registerCtrl } from "./controllers/auth";
import { profileAdmin, profileDoctors, profilePatient, profile } from "./controllers/profiles";
import { config } from "dotenv";
import { googleLoginController } from "./googleAuth/googleAuth";
import { logOut } from "./controllers/logout";
import { checkJwt } from "./middlewares/session";
import cookieParser from "cookie-parser";
config();

const PORT = process.env.PORT || 3001;

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/doctors", routerDoctors);
app.use("/patients", routerPatients);
app.use("/specialties", routerSpecialties);
app.use("/services", routerServices);
app.use("/dates", routerDates);
app.use("/checkout", checkoutRouter);
app.use("/notification", notificationRouter);
app.use("/auth/register", registerCtrl);
app.use("/auth/login", loginCtrl);
app.use("/profile/doctor", checkJwt, profileDoctors);
app.use("/profile/patient", checkJwt, profilePatient);
app.use("/profile/admin", checkJwt, profileAdmin);
app.use("/profile", checkJwt, profile);
app.use("/auth/google", googleLoginController);
app.use("/logout", logOut);
app.use("/users", routerUsers);

db().then(() => console.log("Successful database connection!"));
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
