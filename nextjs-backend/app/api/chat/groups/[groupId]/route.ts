import { adminAuth, adminFirestore } from "@/firebase-server";
import { NextRequest, NextResponse } from "next/server";
import { uploadGroupPicture } from "@/lib/uploadUtils";

const db = adminFirestore;

export async function PATCH(
    req: NextRequest,
    { params } : { params: Promise<{ groupId: string }> }
) {
    try {
        const { groupId } = await params;
        const formData = await req.formData();
       
        const authHeader = req.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split('Bearer ')[1];
        const decodedToken = await adminAuth.verifyIdToken(token);

        // Verify user is admin
        const groupRef = await db.collection('groups').doc(groupId).get();
        if (!groupRef.exists) {
            return NextResponse.json({ error: 'Group not found' }, { status: 404 });
        }

        const groupData = groupRef.data();
        if (!groupData?.admins.includes(decodedToken.uid)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        if (formData.has('name')) {
            await db.collection('groups').doc(groupId).update({
                name:formData.get('name')
            });
        } 
        
        if (formData.has('file')) {
            const file = formData.get('file') as File;

            await uploadGroupPicture(file, groupId);
        }
    
        return NextResponse.json({ 
            success: true,
            message: 'Group updated successfully'
        }, { status: 200 });
    } catch (error: any) {
        console.error('Error updating group:', error?.message || 'Unknown error');
        return NextResponse.json({ 
            success: false, 
            error: 'Internal Server Error' 
        }, { status: 500 });
    }
}
