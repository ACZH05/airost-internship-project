import { adminAuth, adminFirestore } from "@/firebase-server";
import { Timestamp } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";

const db = adminFirestore;

export async function POST(req: NextRequest) {
    const { oobCode } = await req.json();

    if (!oobCode) {
      return new NextResponse(JSON.stringify({error: "Missing oobCode"}), {status:400});
    }

    try {
      const doc = await db.collection('emailVerification').doc(oobCode).get();
      if (!doc.exists) {
          return new NextResponse(JSON.stringify({error: "Invalid/Expired Code"}), {status:400});
      } 
      
      const data = doc.data();
      if (!data) {
        return new NextResponse(JSON.stringify({error: "Invalid/Expired Code"}), {status:400});
      }

      const { email, uid, createdAt, expiryDuration } = data;
      
      const currentTime = Timestamp.now().toMillis();
      const expiryTime = createdAt.toMillis() + expiryDuration;
      
      if (currentTime > expiryTime) {
        await db.collection('emailVerification').doc(oobCode).delete();
        return new NextResponse(JSON.stringify({error: "Code has expired"}), {status:400});
      }

      await adminAuth.updateUser(uid, { 
        emailVerified: true })
      await db.collection('users').doc(uid).update({
        emailVerified: true
      });

      await db.collection('emailVerification').doc(oobCode).delete();
      
      return new NextResponse(JSON.stringify({message: `Email ${email} successfully verified`}), {status:200});
    } catch (error) {
      console.error('Error verifying email: ', error);
      return new NextResponse(JSON.stringify({error: "Error verifying email"}), {status:500});
    }
}


