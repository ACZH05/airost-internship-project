import { adminAuth, adminFirestore } from "@/firebase-server";
import { NextRequest, NextResponse } from "next/server";

const db = adminFirestore;

// Get groups for a user
export async function GET(req: NextRequest) {
    try {
        const authHeader = req.headers.get('authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split('Bearer ')[1];
        const decodedToken = await adminAuth.verifyIdToken(token);

        // Get all groups where user is a member
        const groupsSnapshot = await db.collection('groups')
            .where('members', 'array-contains', decodedToken.uid)
            .get();

        // Fetch last message for each group
        const groups = await Promise.all(groupsSnapshot.docs.map(async (doc) => {
            const groupData = doc.data();
            
            // Get last message
            const lastMessageQuery = await db.collection('messages')
                .where('groupId', '==', doc.id)
                .orderBy('timestamp', 'desc')
                .limit(1)
                .get();

            let lastMessage = null;
            if (!lastMessageQuery.empty) {
                const messageData = lastMessageQuery.docs[0].data();
                // Get sender's profile and info
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
                
                lastMessage = {
                    text: messageData.text,
                    timestamp: messageData.timestamp.toDate(),
                    sender: displayName,
                    fileName: messageData.fileName,
                    fileType: messageData.fileType,
                    isFile: !!messageData.fileId
                };
            }

            return {
                id: doc.id,
                name: groupData.name,
                profileUrl: groupData.profileUrl,
                createdAt: groupData.createdAt,
                createdBy: groupData.createdBy,
                admins: groupData.admins,
                members: groupData.members,
                lastMessage
            };
        }));

        return NextResponse.json({ 
            success: true, 
            groups 
        }, { status: 200 });
    } catch (error: any) {
        console.error('Error fetching groups:', error?.message || 'Unknown error');
        return NextResponse.json({ 
            success: false, 
            error: 'Internal Server Error' 
        }, { status: 500 });
    }
}

// Create a new group
export async function POST(req: NextRequest) {
    try {
        const { name } = await req.json();
        const authHeader = req.headers.get('authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split('Bearer ')[1];
        const decodedToken = await adminAuth.verifyIdToken(token);

        // Create new group with default profile
        const groupRef = await db.collection('groups').add({
            name,
            createdBy: decodedToken.uid,
            createdAt: new Date(),
            members: [decodedToken.uid],
            admins: [decodedToken.uid],
            profileUrl: null // You can set a default profile URL here
        });

        return NextResponse.json({ 
            success: true,
            groupId: groupRef.id,
            message: 'Group created successfully'
        }, { status: 200 });
    } catch (error) {
        console.error('Error creating group:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}



