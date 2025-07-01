import { prisma } from "@/lib";
import sendResponse from "@/lib/response";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')

    try{
        if(userId)
        {
                const addresses = await prisma.address.findMany({
                    where: {
                        userId: userId
                    },
                    orderBy: {
                        default: 'desc'
                    }
                });

            return sendResponse({
                data: addresses,
                success: true,
                message: 'Address fetched successfully'
            });
        }

        const addresses = await prisma.address.findMany({
            orderBy: {
                default: 'desc'
            }
        });

        return sendResponse({
            data: addresses,
            success: true,
            message: 'Addresses fetched successfully'
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

export async function POST(request: NextRequest) {
    try{
        const res: any = await request.json();
        const { userId, ...data } = res;

        const address = await prisma.address.create({
            data:{
                users:{
                    connect:{
                        id: userId
                    }
                },
                ...data
            },

        });

        return sendResponse({
            data: address,
            success: true,
            message: 'Address created successfully'
        });
    }
    catch(e: any){
        console.log(e)
        return sendResponse({
            data: e.message,
            success: false,
            message: 'Failed to create address'
        });
    }
}