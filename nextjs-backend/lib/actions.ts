import { adminFirestore } from "@/firebase-server";
import { v4 as uuidv4 } from 'uuid'; 
import nodemailer from 'nodemailer';

const db = adminFirestore

export async function generateOOBCode(email: string, uid:string) { 
  const oobCode = uuidv4(); 
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

export async function sendVerificationEmail(email: string, oobCode: string) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_NAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  
    const mailOptions = {
      from: process.env.EMAIL_NAME,
      to: email,
      subject: 'Verify your email',
      text: `Click this link to verify your email: ${process.env.NEXT_PUBLIC_APP_URL}/verify?oobCode=${oobCode}`
    };
  
    await transporter.sendMail(mailOptions);
}

export async function generateResetCode(email: string) { 
  const resetCode = uuidv4(); 
  const expiryDuration = 1 * 60 * 60 * 1000; 

  console.log(resetCode);
  await db.collection('emailPasswordReset').doc(resetCode).set({ 
    email: email, 
    createdAt: new Date(),
    expiryDuration: expiryDuration,
  }); 

  return resetCode; 
}

export async function sendPasswordResetEmail(email: string, resetCode: string) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_NAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_NAME,
    to: email,
    subject: 'Reset your password',
    text: `Click this link to reset your password: ${process.env.NEXT_PUBLIC_APP_URL}/reset?resetCode=${resetCode}`
  };

  await transporter.sendMail(mailOptions);
}