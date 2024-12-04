import { adminAuth, adminFirestore } from "@/firebase-server";
import { NextRequest, NextResponse } from "next/server";

const db = adminFirestore;

// Get members of a group
export async function GET(req: NextRequest) {
    try {
        const groupId = req.nextUrl.searchParams.get('groupId');
        const authHeader = req.headers.get('authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split('Bearer ')[1];
        await adminAuth.verifyIdToken(token);

        if (!groupId) {
            return NextResponse.json({ error: 'Group ID is required' }, { status: 400 });
        }
        const groupDoc = await db.collection('groups').doc(groupId).get();
        if (!groupDoc.exists) {
            return NextResponse.json({ error: 'Group not found' }, { status: 404 });
        }

        const memberIds = groupDoc.data()?.members || [];
        const memberPromises = memberIds.map(async (uid: string) => {
            const userRecord = await adminAuth.getUser(uid);
            return {
                uid: userRecord.uid,
                email: userRecord.email,
                isAdmin: groupDoc.data()?.admins?.includes(uid) || false
            };
        });

        const members = await Promise.all(memberPromises);
        return NextResponse.json({ success: true, members }, { status: 200 });
    } catch (error: unknown) {
        console.error('Error getting members:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

interface CustomError {
    code: string;
    message: string;
}

// Add member to group
export async function POST(req: NextRequest) {
    try {
        const { groupId, email } = await req.json();
        const authHeader = req.headers.get('authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split('Bearer ')[1];
        await adminAuth.verifyIdToken(token);

        const userRecord = await adminAuth.getUserByEmail(email);
        const groupRef = db.collection('groups').doc(groupId);
        const groupDoc = await groupRef.get();

        if (!groupDoc.exists) {
            return NextResponse.json({ error: 'Group not found' }, { status: 404 });
        }

        if (groupDoc.data()?.members?.includes(userRecord.uid)) {
            return NextResponse.json({ error: 'User already in group' }, { status: 400 });
        }

        await groupRef.update({
            members: [...(groupDoc.data()?.members || []), userRecord.uid]
        });

        return NextResponse.json({ 
            success: true, 
            message: 'Member added successfully' 
        }, { status: 200 });
    } catch (error: unknown) {
        if ((error as CustomError).code === 'auth/user-not-found') {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        console.error('Error adding member:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// Leave group
export async function DELETE(req: NextRequest) {
    try {
        const groupId = req.nextUrl.searchParams.get('groupId');
        const authHeader = req.headers.get('authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split('Bearer ')[1];
        const decodedToken = await adminAuth.verifyIdToken(token);

        const groupRef = db.collection('groups').doc(groupId!);
        const groupDoc = await groupRef.get();

        if (!groupDoc.exists) {
            return NextResponse.json({ error: 'Group not found' }, { status: 404 });
        }

        const groupData = groupDoc.data()!;
        
        // Check if user is the last admin
        if (groupData.admins.includes(decodedToken.uid) && groupData.admins.length === 1) {
            // If there are other members, make someone else admin
            if (groupData.members.length > 1) {
                const newAdmin = groupData.members.find((m: string) => m !== decodedToken.uid);
                await groupRef.update({
                    members: groupData.members.filter((m: string) => m !== decodedToken.uid),
                    admins: [newAdmin]
                });
            } else {
                // If user is the last member, delete the group
                await groupRef.delete();
            }
        } else {
            // Remove user from members and admins
            await groupRef.update({
                members: groupData.members.filter((m: string) => m !== decodedToken.uid),
                admins: groupData.admins.filter((a: string) => a !== decodedToken.uid)
            });
        }

        return NextResponse.json({ 
            success: true, 
            message: 'Left group successfully' 
        }, { status: 200 });
    } catch (error) {
        console.error('Error leaving group:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}