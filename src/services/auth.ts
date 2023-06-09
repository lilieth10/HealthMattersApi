import { Auth } from "../interface/auth.interface";
import { User } from "../interface/user.interface";
import DoctorModel from "../models/doctor";
import PatientModel from "../models/patient";
import { encrypt, verified } from "../utils/bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "token.01010101";

const registerNewUser = async ({ name, lastname, specialties, phoneNumber, medicalLicense, email, password, address }: User) => {
	const query = {
	  $or: [
		{ email }
	  ]
	};
  
	const existingUser = await Promise.all([
	  DoctorModel.findOne(query),
	  PatientModel.findOne(query)
	]);
  
	if (existingUser[0] || existingUser[1]) throw new Error("Email already exists");
  
	const passHash = await encrypt(password);
  
	let newUser;
	let token;
  
	if (medicalLicense) {
	  newUser = await DoctorModel.create({
		email,
		lastname,
		specialties,
		phoneNumber,
		password: passHash,
		name,
		medicalLicense,
	  });
	  token = jwt.sign({ email: newUser.email, isDoctor: true }, JWT_SECRET, { expiresIn: "60d" });
	} else {
	  newUser = await PatientModel.create({
		email,
		password: passHash,
		name,
		address,
		lastname,
		phoneNumber,
	  });
	  token = jwt.sign({ email: newUser.email, isDoctor: false }, JWT_SECRET, { expiresIn: "60d" });
	}
  
	return { user: newUser, token };
  };
  

const loginUser = async ({ email, password, medicalLicense }: Auth) => {
	const checkIsDoctor = await DoctorModel.findOne({ email });
	const checkIsPatient = await PatientModel.findOne({ email });

	if (!checkIsDoctor && !checkIsPatient) throw new Error("Not found user");

	const user = checkIsDoctor || checkIsPatient;

	if (!user) throw new Error("User not found");

	const passwordHash = user.password;
	const isCorrect = await verified(password, passwordHash);

	if (!isCorrect) throw new Error("Password incorrect");

	const isDoctor = !!checkIsDoctor;
	const token = jwt.sign({ email: user.email, isDoctor: isDoctor || !!medicalLicense }, JWT_SECRET, { expiresIn: "60d" });

	return {
		user,
		token,
	};
};

export { registerNewUser, loginUser };
