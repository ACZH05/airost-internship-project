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

        // Get last message for the group
        const lastMessageQuery = await db.collection('messages')
            .where('groupId', '==', groupId)
            .orderBy('timestamp', 'desc')
            .limit(1)
            .get();

        if (lastMessageQuery.empty) {
            return NextResponse.json({ 
                success: true, 
                lastMessage: null 
            }, { status: 200 });
        }

        const messageData = lastMessageQuery.docs[0].data();
        const senderProfile = await db.collection('profiles')
                    .doc(messageData.userId)
                    .get();
                
                const senderInfo = await db.collection('users')
                    .doc(messageData.userId)
                    .collection('profile')
                    .doc('info')
                    .get();

                const senderData = senderInfo.data();
                const displayName = senderData ? 
                    `${senderData.firstName} ${senderData.lastName}` : 
                    (senderProfile.data()?.username || messageData.userId);

        const lastMessage = {
            id: lastMessageQuery.docs[0].id,
            ...messageData,
            sender: displayName,
            timestamp: {
                seconds: messageData.timestamp.seconds,
                nanoseconds: messageData.timestamp.nanoseconds
            },
            fileName: messageData.fileName,
            fileType: messageData.fileType,
            isFile: !!messageData.fileId
        };

        return NextResponse.json({ 
            success: true, 
            lastMessage 
        }, { status: 200 });
    } catch (error) {
        console.error('Error fetching last message:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
