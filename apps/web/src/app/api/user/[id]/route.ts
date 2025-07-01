import { prisma } from "@/lib";
import sendResponse from "@/lib/response";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest,  { params }: { params: { id: string } },) {
    const {id} = params;

    try{
        const user = await prisma.user.findUnique({
            where: {
                id: id
            },
            include: {
                addresses: true,
                orders: true,
                reviews: true
            }
        });

        return sendResponse({
            data: user,
            success: true,
            message: 'User fetched successfully'
        });
    }
    catch(e: any){
        return sendResponse({
            data: e.message,
            success: false,
            message: 'Failed to fetch user'
        });
    }
}

export async function PUT(request: NextRequest) {
    try{
        const res: any = await request.json();
        const { id, ...data } = res;

        const user = await prisma.user.update({
            where: {
                id: id
            },
            data
        });

        return sendResponse({
            data: user,
            success: true,
            message: 'User updated successfully'
        });
    }
    catch(e: any){
        return sendResponse({
            data: e.message,
            success: false,
            message: 'Failed to update user'
        });
    }
}