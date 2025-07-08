import { prisma } from "@storely/database";
import sendResponse from "@/lib/response";
import { slugify } from "@storely/shared/utils/slugify";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.organizationId) {
      return sendResponse({
        data: null,
        success: false,
        message: 'Unauthorized access'
      });
    }

    console.log("Session org:", session.user.organizationId);

    const searchParams = request.nextUrl.searchParams
    const slug = searchParams.get('slug')
    const id = searchParams.get('id')

    let categories: any = []

    if (slug) {
      categories = await prisma.category.findFirst({
        where: {
          slug: slug,
          organizationId: session.user.organizationId
        },
        include: {
          subCategories: {
            where: {
              organizationId: session.user.organizationId
            },
            include: {
              _count: {
                select: {
                  products: true
                }
              }
            }
          },
          parent: true,
          _count: {
            select: {
              products: true
            }
          }
        }
      });
    }
    else if (id) {
      categories = await prisma.category.findFirst({
        where: {
          id: id,
          organizationId: session.user.organizationId
        },
        include: {
          subCategories: {
            where: {
              organizationId: session.user.organizationId
            },
            include: {
              _count: {
                select: {
                  products: true
                }
              }
            }
          },
          parent: true,
          _count: {
            select: {
              products: true
            }
          }
        }
      });
    }
    else {
      categories = await prisma.category.findMany({
        where: {
          organizationId: session.user.organizationId
        },
        include: {
          parent: {
            select: {
              id: true,
              name: true
            }
          },
          _count: {
            select: {
              products: true,
              subCategories: true
            }
          }
        },
        orderBy: [
          { parentId: { sort: 'asc', nulls: 'first' } },
          { name: 'asc' }
        ]
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
    const session = await getServerSession(authOptions);
    if (!session?.user?.organizationId) {
      return sendResponse({
        data: null,
        success: false,
        message: 'Unauthorized access'
      });
    }

    const res: any = await request.json();

    // Validate required fields
    if (!res.name) {
      return sendResponse({
        data: null,
        success: false,
        message: 'Category name is required'
      });
    }

    let parentSlugs = []
    let parent = res.parent

    while (parent) {
      const parentCategory = await prisma.category.findFirst({
        where: {
          id: parent,
          organizationId: session.user.organizationId
        },
        include: {
          parent: true
        }
      })

      if (!parentCategory) break

      parentSlugs.push(parentCategory.slug)
      parent = parentCategory.parentId
    }

    const slug = slugify(
      parentSlugs.length === 0 ? res.name :
        parentSlugs.reverse().join('-') + '-' + res.name
    );

    // Check for duplicate slug
    const existingCategory = await prisma.category.findFirst({
      where: {
        slug,
        organizationId: session.user.organizationId
      }
    });

    if (existingCategory) {
      return sendResponse({
        data: null,
        success: false,
        message: 'A category with this name already exists'
      });
    }

    const createResponse = await prisma.category.create({
      data: {
        name: res.name,
        description: res.description,
        image: res.image,
        slug,
        organizationId: session.user.organizationId,
        parentId: res.parent || null
      },
      include: {
        parent: {
          select: {
            id: true,
            name: true
          }
        },
        _count: {
          select: {
            products: true,
            subCategories: true
          }
        }
      }
    });

    return sendResponse({
      data: createResponse,
      success: true,
      message: 'Category created successfully',
    })
  } catch (e: any) {
    console.error('Category creation error:', e);
    return sendResponse({
      data: e.message,
      success: false,
      message: 'Failed to create category',
    })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.organizationId) {
      return sendResponse({
        data: null,
        success: false,
        message: 'Unauthorized access'
      });
    }

    const res: any = await request.json();

    // Validate required fields
    if (!res.id || !res.name) {
      return sendResponse({
        data: null,
        success: false,
        message: 'Category ID and name are required'
      });
    }

    // Check if category exists and belongs to organization
    const existingCategory = await prisma.category.findFirst({
      where: {
        id: res.id,
        organizationId: session.user.organizationId
      }
    });

    if (!existingCategory) {
      return sendResponse({
        data: null,
        success: false,
        message: 'Category not found'
      });
    }

    let parentSlugs = []
    let parent = res.parent

    while (parent) {
      const parentCategory = await prisma.category.findFirst({
        where: {
          id: parent,
          organizationId: session.user.organizationId
        },
        include: {
          parent: true
        }
      })

      if (!parentCategory) break

      parentSlugs.push(parentCategory.slug)
      parent = parentCategory.parentId
    }

    const slug = slugify(
      parentSlugs.length === 0 ? res.name :
        parentSlugs.reverse().join('-') + '-' + res.name
    );

    // Check for duplicate slug (excluding current category)
    const duplicateSlug = await prisma.category.findFirst({
      where: {
        slug,
        organizationId: session.user.organizationId,
        id: { not: res.id }
      }
    });

    if (duplicateSlug) {
      return sendResponse({
        data: null,
        success: false,
        message: 'A category with this name already exists'
      });
    }

    const editResponse = await prisma.category.update({
      where: {
        id: res.id
      },
      data: {
        name: res.name,
        description: res.description,
        image: res.image,
        slug,
        parentId: res.parent || null
      },
      include: {
        parent: {
          select: {
            id: true,
            name: true
          }
        },
        _count: {
          select: {
            products: true,
            subCategories: true
          }
        }
      }
    });

    return sendResponse({
      data: editResponse,
      success: true,
      message: 'Category updated successfully'
    })
  }
  catch (e: any) {
    console.error('Category update error:', e);
    return sendResponse({
      data: e.message,
      success: false,
      message: 'Failed to update category'
    })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.organizationId) {
      return sendResponse({
        data: null,
        success: false,
        message: 'Unauthorized access'
      });
    }

    const res: any = await request.json()

    if (!res.id) {
      return sendResponse({
        data: null,
        success: false,
        message: 'Category ID is required'
      });
    }

    // Check if category exists and belongs to organization
    const existingCategory = await prisma.category.findFirst({
      where: {
        id: res.id,
        organizationId: session.user.organizationId
      },
      include: {
        _count: {
          select: {
            products: true,
            subCategories: true
          }
        }
      }
    });

    console.log("existingCategory:", existingCategory);

    if (!existingCategory) {
      return sendResponse({
        data: null,
        success: false,
        message: 'Category not found'
      });
    }

    // Check if category has products or subcategories
    if (existingCategory._count.products > 0) {
      return sendResponse({
        data: null,
        success: false,
        message: 'Cannot delete category with products. Please move or delete all products first.'
      });
    }

    if (existingCategory._count.subCategories > 0) {
      return sendResponse({
        data: null,
        success: false,
        message: 'Cannot delete category with subcategories. Please move or delete all subcategories first.'
      });
    }

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
    console.error('Category deletion error:', e);
    return sendResponse({
      data: e.message,
      success: false,
      message: 'Failed to delete category',
    })
  }
}
