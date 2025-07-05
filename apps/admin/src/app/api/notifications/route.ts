import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@storely/database';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const type = searchParams.get('type'); // 'all', 'unread', 'archived'
    const notificationType = searchParams.get('notificationType'); // specific notification type

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      userId: session.user.id
    };

    if (type === 'unread') {
      where.isRead = false;
      where.isArchived = false;
    } else if (type === 'archived') {
      where.isArchived = true;
    } else if (type === 'all') {
      where.isArchived = false;
    }

    if (notificationType) {
      where.type = notificationType;
    }

    // Get total count
    const total = await prisma.notification.count({ where });

    // Get notifications
    const notifications = await prisma.notification.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    });

    // Transform notifications to match UI expectations
    const transformedNotifications = notifications.map(notification => ({
      id: notification.id,
      title: notification.title,
      category: notification.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      avatarUrl: null, // We don't have avatars for notifications in our schema
      createdAt: notification.createdAt,
      isUnRead: !notification.isRead,
      type: notification.type,
      description: notification.description,
      actionUrl: notification.actionUrl,
      metadata: notification.metadata
    }));

    // Get counts for tabs
    const counts = await Promise.all([
      prisma.notification.count({
        where: { userId: session.user.id, isArchived: false }
      }),
      prisma.notification.count({
        where: { userId: session.user.id, isRead: false, isArchived: false }
      }),
      prisma.notification.count({
        where: { userId: session.user.id, isArchived: true }
      })
    ]);

    return NextResponse.json({
      notifications: transformedNotifications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      counts: {
        all: counts[0],
        unread: counts[1],
        archived: counts[2]
      }
    });

  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    // Validate required fields
    if (!data.type || !data.title) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const notification = await prisma.notification.create({
      data: {
        userId: session.user.id,
        type: data.type,
        title: data.title,
        description: data.description,
        actionUrl: data.actionUrl,
        metadata: data.metadata
      }
    });

    return NextResponse.json(notification, { status: 201 });

  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { ids, action } = data;

    if (!ids || !Array.isArray(ids) || !action) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }

    const updateData: any = {};
    
    if (action === 'mark_read') {
      updateData.isRead = true;
    } else if (action === 'mark_unread') {
      updateData.isRead = false;
    } else if (action === 'archive') {
      updateData.isArchived = true;
    } else if (action === 'unarchive') {
      updateData.isArchived = false;
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    await prisma.notification.updateMany({
      where: {
        id: { in: ids },
        userId: session.user.id
      },
      data: updateData
    });

    return NextResponse.json({ message: 'Notifications updated successfully' });

  } catch (error) {
    console.error('Error updating notifications:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
