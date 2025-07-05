import { prisma } from '@storely/database';

export async function GET(){
    try{
        const response = await prisma.user.findMany();

        return Response.json({
            success: true,
            message: "Users fetched successfully",
            data: response
        });
    }
    catch(e: any){
        return Response.json({
            success: false,
            message: e.message
        });
    }
}
