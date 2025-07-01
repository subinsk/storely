import { prisma } from "@/lib";
import sendResponse from "@/lib/response";
import { validateApiRequest } from "@/lib/validate-api-request";
import { slugify } from "@/utils/slugify";
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

export async function POST(request: Request) {
  try {
    const res: any = await request.json();

    let parentSlugs = []
    let parent = res.parent

    while (parent) {
      const parentCategory = await prisma.category.findUnique({
        where: {
          id: parent
        },
        include: {
          parent: true
        }
      })

      if (!parentCategory) break

      parentSlugs.push(parentCategory.slug)
      parent = parentCategory.parentId
    }

    const createResponse = await prisma.category.create({
      data: {
        name: res.name,
        description: res.description,
        image: res.image,
        slug: slugify(
          parentSlugs.length === 0 ? res.name :
            parentSlugs.reverse().join('-') + '-' + res.name),
        parent: res.parent ? {
          connect: {
            id: res.parent
          }
        } : undefined
      },
    });

    return sendResponse({
      data: createResponse,
      success: true,
      message: 'Category created successfully',
    })
  } catch (e: any) {
    return sendResponse({
      data: e.message,
      success: false,
      message: 'Failed to create category',
    })
  }
}

export async function PUT(request: Request) {
  try {
    const res: any = await request.json();

    let parentSlugs = []
    let parent = res.parent

    while (parent) {
      const parentCategory = await prisma.category.findUnique({
        where: {
          id: parent
        },
        include: {
          parent: true
        }
      })

      if (!parentCategory) break

      parentSlugs.push(parentCategory.slug)
      parent = parentCategory.parentId
    }

    const editResponse = await prisma.category.update({
      where: {
        id: res.id
      },
      data: {
        name: res.name,
        description: res.description,
        image: res.image,
        slug: slugify(
          parentSlugs.length === 0 ? res.name :
            parentSlugs.reverse().join('-') + '-' + res.name),
        parent: res.parent ? {
          connect: {
            id: res.parent
          }
        } : undefined
      }
    });

    return sendResponse({
      data: editResponse,
      success: true,
      message: 'Category updated successfully'
    })
  }
  catch (e: any) {
    return sendResponse({
      data: e.message,
      success: false,
      message: 'Failed to update category'
    })
  }

}

export async function DELETE(request: NextRequest) {
  try {
    const res: any = await request.json()

    const deleteResponse = await prisma.category.delete({
      where: {
        id: res.id
      }
    });

    return sendResponse({
      data: deleteResponse,
      success: true,
      message: 'Category deleted successfully',
    })
  }
  catch (e: any) {
    return sendResponse({
      data: e.message,
      success: false,
      message: 'Failed to create category',
    })
  }
}
