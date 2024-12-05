import cron from 'node-cron';
import { adminFirestore } from '../firebase-server';
import { Timestamp } from 'firebase-admin/firestore';

export async function cleanupExpiredCodes() {
  const now = Timestamp.now().toMillis();
  const snapshot = await adminFirestore.collection('emailVerification')
    .where('createdAt', '<', Timestamp.fromMillis(now - 24 * 60 * 60 * 1000))  // 24 hours in milliseconds
    .get();

  const batch = adminFirestore.batch();
  snapshot.forEach(doc => {
    batch.delete(doc.ref);
  });

  await batch.commit();
  console.log('Expired OOB codes cleaned up');
}

export async function cleanupExpiredPasswordResetCodes() {
  const now = Timestamp.now().toMillis();
  const snapshot = await adminFirestore.collection('emailPasswordReset')
    .where('createdAt', '<', Timestamp.fromMillis(now - 24 * 60 * 60 * 1000))  // 24 hours in milliseconds
    .get();

  const batch = adminFirestore.batch();
  snapshot.forEach(doc => {
    batch.delete(doc.ref);
  });

  await batch.commit();
  console.log('Expired password reset codes cleaned up');
}
