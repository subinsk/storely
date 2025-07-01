import { prisma } from "@/lib";
import sendResponse from "@/lib/response";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const slug = searchParams.get('slug')
    const id = searchParams.get('id')

    let categories: any = []

    if (slug) {
      categories = await prisma.category.findUnique({
        where: {
          slug: slug
        },
        include: {
          subCategories: true,
          parent: true
        }
      });
    }
    else if (id) {
      categories = await prisma.category.findUnique({
        where: {
          id: id
        },
        include: {
          subCategories: true,
          parent: true
        }
      });
    }
    else {
      categories = await prisma.category.findMany({
        include: {
          parent: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });
    }

    return sendResponse({
      data: categories,
      success: true,
      message: 'Categories fetched successfully'
    })
  }
  catch (e: any) {
    return sendResponse({
      data: e.message,
      success: false,
      message: 'Failed to fetch categories'
    })
  }
}
