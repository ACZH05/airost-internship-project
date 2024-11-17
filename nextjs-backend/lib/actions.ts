import { adminFirestore } from "@/firebase-server";
import { v4 as uuidv4 } from 'uuid'; 
import nodemailer from 'nodemailer';

const db = adminFirestore

export async function generateOOBCode(email: string, uid:string) { 
  const oobCode = uuidv4(); // Generate a unique code await
  const expiryDuration = 1 * 60 * 60 * 1000; 

  console.log(oobCode);
  await db.collection('emailVerification').doc(oobCode).set({ 
    uid: uid,
    email: email, 
    createdAt: new Date(),
    expiryDuration: expiryDuration,
  }); 

  return oobCode; 
}

export async function sendVerificationEmail(email:string, oobCode:string) {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_NAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  
    let mailOptions = {
      from: process.env.EMAIL_NAME,
      to: email,
      subject: 'Verify your email',
      text: `Click this link to verify your email: http://localhost:5173/verify?oobCode=${oobCode}`
    };
  
    await transporter.sendMail(mailOptions);
}