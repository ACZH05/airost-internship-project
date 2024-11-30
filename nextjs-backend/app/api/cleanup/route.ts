import { NextRequest, NextResponse } from "next/server";
import { cleanupExpiredCodes, cleanupExpiredPasswordResetCodes } from '../../../script/cleanUpScript'

export async function POST(req: NextRequest) {
    try {
        await cleanupExpiredCodes();
        await cleanupExpiredPasswordResetCodes();
        return NextResponse.json({ success: true, message: 'Cleanup completed successfully' }, { status: 200 });
    } catch (error) {
        console.error('Cleanup error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}