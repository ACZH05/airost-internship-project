
import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminFirestore } from "@/firebase-server";

export async function GET(request: NextRequest) {
    try {
        // Verify authentication
        const authHeader = request.headers.get('authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split('Bearer ')[1];
        const decodedToken = await adminAuth.verifyIdToken(token);

        // Query files for the user
        const filesSnapshot = await adminFirestore
            .collection('files')
            .where('uploadedBy', '==', decodedToken.uid)
            .orderBy('uploadedAt', 'desc')
            .get();

        const files = filesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return NextResponse.json({ files });
    } catch (error) {
        console.error('List files error:', error);
        return NextResponse.json(
            { error: "Failed to list files" },
            { status: 500 }
        );
    }
}