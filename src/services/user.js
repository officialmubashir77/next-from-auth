import { error } from "console";
import fs from "fs";
import { compare, hash } from "bcryptjs";
import path from "path";


const filePath = path.join(process.cwd(), "src", "data", "users.json");

export function getAll() {
  const data = fs.readFileSync(filePath);
  return JSON.parse(data);
}

export function getID(id) {
  const data = getAll();
  return data.find(p => p.id === Number(id));
}

export function getEmail(email) {
  const data = getAll();
  return data.find(p => p.email.toLowerCase() === email.toLowerCase());
}

export async function verifyPassword(hashPassword, password) {
  const isValid = await compare(password, hashPassword);
  return isValid;
}

export async function save(email, password) {
  const emailFound = getEmail(email); // Pass the 'email' parameter here
  if (emailFound) {
    throw new Error("User already exists");
  }
  const data = getAll();
  const hashPassword = await hash(password, 12);
  const newUser = {
    id: generateUniqueId(data), // Use a function to generate a unique ID
    email,
    password: hashPassword,
  };
  data.push(newUser);
  fs.writeFileSync(filePath, JSON.stringify(data));
}

function generateUniqueId(data) {
  // Function to generate a unique ID based on the existing data
  const ids = data.map(item => item.id);
  const maxId = Math.max(...ids);
  return maxId + 1;
}
