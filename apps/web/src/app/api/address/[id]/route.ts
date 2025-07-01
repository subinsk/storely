import { prisma } from "@/lib";
import sendResponse from "@/lib/response";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest,  { params }: { params: { id: string } },) {
    const {id} = params;

    try{
        const address = await prisma.address.findUnique({
            where: {
                id: id
            }
        });

        return sendResponse({
            data: address,
            success: true,
            message: 'Address fetched successfully'
        });
    }
    catch(e: any){
        return sendResponse({
            data: e.message,
            success: false,
            message: 'Failed to fetch address'
        });
    }
}

export async function PUT(request: NextRequest) {
    try{
        const res: any = await request.json();
        const { id, ...data } = res;

        const searchParams = request.nextUrl.searchParams
        const item = searchParams.get('item')

        if(item === 'default'){
            const addresses = await prisma.address.updateMany({
                where: {
                    userId: data.userId
                },
                data: {
                    default: false
                }
            });
        }

        const address = await prisma.address.update({
            where: {
                id: id
            },
            data: data
        });

        return sendResponse({
            data: address,
            success: true,
            message: 'Address updated successfully'
        });
    }
    catch(e: any){
        return sendResponse({
            data: e.message,
            success: false,
            message: 'Failed to update address'
        });
    }
}

export async function DELETE(request: NextRequest,  { params }: { params: { id: string } },) {
    const {id} = params;

    try{
        const address = await prisma.address.delete({
            where: {
                id: id
            }
        });

        return sendResponse({
            data: address,
            success: true,
            message: 'Address deleted successfully'
        });
    }
    catch(e: any){
        return sendResponse({
            data: e.message,
            success: false,
            message: 'Failed to delete address'
        });
    }
}