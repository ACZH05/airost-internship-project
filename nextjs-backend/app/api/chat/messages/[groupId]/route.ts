import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { adminAuth, adminFirestore } from "@/firebase-server";

const db = adminFirestore;

export async function GET(
    req: NextRequest,
    { params } : { params: Promise<{ groupId: string }> }
) {
    try {
        const {groupId} = await params;

        const authHeader = req.headers.get('authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split('Bearer ')[1];
        const decodedToken = await adminAuth.verifyIdToken(token);

        // Verify user is member of group
        const groupDoc = await db.collection('groups').doc(groupId).get();
        if (!groupDoc.exists || !groupDoc.data()?.members?.includes(decodedToken.uid)) {
            return NextResponse.json({ error: 'Not a member of this group' }, { status: 403 });
        }

        // Get messages for the group
        const messagesSnapshot = await db.collection('messages')
            .where('groupId', '==', groupId)
            .orderBy('timestamp', 'asc')
            .get();

        const messages = messagesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            timestamp: {
                seconds: doc.data().timestamp.seconds,
                nanoseconds: doc.data().timestamp.nanoseconds
            }
        }));

        return NextResponse.json({ 
            success: true, 
            messages 
        }, { status: 200 });
    } catch (error) {
        console.error('Error fetching messages:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
