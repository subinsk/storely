import { NextResponse, NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

// Mock data for demonstration
const mockBackups = [
  {
    id: '1',
    name: 'Full System Backup - 2024-01-15',
    type: 'full',
    size: '2.4 GB',
    createdAt: new Date().toISOString(),
    status: 'completed',
    downloadUrl: '#',
    description: 'Complete system backup including database, files, and configuration',
    duration: '45 minutes'
  },
  {
    id: '2',
    name: 'Database Backup - 2024-01-15',
    type: 'database',
    size: '120 MB',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    status: 'completed',
    downloadUrl: '#',
    description: 'Database backup including all product and order data',
    duration: '5 minutes'
  },
];

const mockSchedules = [
  {
    id: '1',
    name: 'Daily Database Backup',
    type: 'database',
    frequency: 'daily',
    time: '02:00',
    isEnabled: true,
    lastRun: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    nextRun: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    retention: 7
  },
];

const mockRestoreJobs = [
  {
    id: '1',
    backupId: '1',
    backupName: 'Full System Backup - 2024-01-15',
    status: 'in_progress',
    progress: 65,
    startedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (type === 'backups') {
      return NextResponse.json({
        success: true,
        data: mockBackups
      });
    }

    if (type === 'schedules') {
      return NextResponse.json({
        success: true,
        data: mockSchedules
      });
    }

    if (type === 'restore-jobs') {
      return NextResponse.json({
        success: true,
        data: mockRestoreJobs
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        backups: mockBackups,
        schedules: mockSchedules,
        restoreJobs: mockRestoreJobs
      }
    });
  } catch (error) {
    console.error('Backup restore API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'create_backup') {
      const { name, type, includeDatabase, includeFiles, includeConfig } = body;

      if (!name || !type) {
        return NextResponse.json(
          { success: false, error: 'Name and type are required' },
          { status: 400 }
        );
      }

      // In a real implementation, this would start the backup process
      const newBackup = {
        id: Date.now().toString(),
        name,
        type,
        size: 'Calculating...',
        createdAt: new Date().toISOString(),
        status: 'in_progress',
        description: `${type} backup created manually`,
        duration: 'In progress...'
      };

      return NextResponse.json({
        success: true,
        message: 'Backup started successfully',
        data: newBackup
      });
    }

    if (action === 'start_restore') {
      const { backupId, stopServices, sendNotification } = body;

      if (!backupId) {
        return NextResponse.json(
          { success: false, error: 'Backup ID is required' },
          { status: 400 }
        );
      }

      // In a real implementation, this would start the restore process
      const newRestoreJob = {
        id: Date.now().toString(),
        backupId,
        status: 'pending',
        progress: 0,
        startedAt: new Date().toISOString(),
        options: {
          stopServices,
          sendNotification
        }
      };

      return NextResponse.json({
        success: true,
        message: 'Restore started successfully',
        data: newRestoreJob
      });
    }

    if (action === 'toggle_schedule') {
      const { scheduleId, enabled } = body;

      if (!scheduleId) {
        return NextResponse.json(
          { success: false, error: 'Schedule ID is required' },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        message: `Schedule ${enabled ? 'enabled' : 'disabled'} successfully`,
        data: {
          scheduleId,
          isEnabled: enabled,
          updatedAt: new Date().toISOString()
        }
      });
    }

    if (action === 'delete_backup') {
      const { backupId } = body;

      if (!backupId) {
        return NextResponse.json(
          { success: false, error: 'Backup ID is required' },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Backup deleted successfully',
        data: {
          backupId,
          deletedAt: new Date().toISOString()
        }
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Backup restore API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
