import { NextResponse, NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

// Mock data for demonstration
const mockTwoFactorMethods = [
  {
    id: '1',
    type: 'authenticator',
    name: 'Authenticator App',
    isEnabled: true,
    isSetup: true,
    lastUsed: new Date().toISOString(),
    icon: 'eva:smartphone-fill',
    description: 'Use Google Authenticator or similar apps'
  },
  {
    id: '2',
    type: 'sms',
    name: 'SMS',
    isEnabled: false,
    isSetup: false,
    icon: 'eva:message-square-fill',
    description: 'Receive codes via text message'
  },
];

const mockUserStatuses = [
  {
    userId: '1',
    userName: 'John Admin',
    userEmail: 'admin@furnerio.com',
    isEnabled: true,
    methods: ['authenticator', 'email'],
    lastLogin: new Date().toISOString(),
    backupCodesUsed: 2,
    totalBackupCodes: 10
  },
];

const mockTwoFactorLogs = [
  {
    id: '1',
    userId: '1',
    userName: 'John Admin',
    action: 'login',
    method: 'authenticator',
    status: 'success',
    timestamp: new Date().toISOString(),
    ipAddress: '192.168.1.100'
  },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const userId = searchParams.get('userId');

    if (type === 'methods') {
      // Return user's 2FA methods
      return NextResponse.json({
        success: true,
        data: mockTwoFactorMethods
      });
    }

    if (type === 'users') {
      // Return all users' 2FA status
      return NextResponse.json({
        success: true,
        data: mockUserStatuses
      });
    }

    if (type === 'logs') {
      // Return 2FA activity logs
      return NextResponse.json({
        success: true,
        data: mockTwoFactorLogs
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        methods: mockTwoFactorMethods,
        users: mockUserStatuses,
        logs: mockTwoFactorLogs
      }
    });
  } catch (error) {
    console.error('Two-factor auth API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, methodId, userId, verificationCode } = body;

    if (action === 'setup_method') {
      // In a real implementation, this would setup a 2FA method
      return NextResponse.json({
        success: true,
        message: '2FA method setup successfully',
        data: {
          methodId,
          setupAt: new Date().toISOString(),
          backupCodes: action === 'setup_backup_codes' 
            ? Array.from({ length: 10 }, () => Math.random().toString(36).substring(2, 8).toUpperCase())
            : undefined
        }
      });
    }

    if (action === 'toggle_method') {
      // In a real implementation, this would enable/disable a 2FA method
      return NextResponse.json({
        success: true,
        message: '2FA method updated successfully',
        data: {
          methodId,
          isEnabled: body.enabled,
          updatedAt: new Date().toISOString()
        }
      });
    }

    if (action === 'verify_setup') {
      // In a real implementation, this would verify the setup code
      if (!verificationCode || verificationCode.length !== 6) {
        return NextResponse.json(
          { success: false, error: 'Invalid verification code' },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        message: '2FA method verified and enabled',
        data: {
          methodId,
          verifiedAt: new Date().toISOString()
        }
      });
    }

    if (action === 'generate_backup_codes') {
      // Generate new backup codes
      const backupCodes = Array.from({ length: 10 }, () => 
        Math.random().toString(36).substring(2, 8).toUpperCase()
      );

      return NextResponse.json({
        success: true,
        message: 'Backup codes generated successfully',
        data: {
          backupCodes,
          generatedAt: new Date().toISOString()
        }
      });
    }

    if (action === 'reset_user_2fa') {
      // In a real implementation, this would reset a user's 2FA
      return NextResponse.json({
        success: true,
        message: '2FA reset for user successfully',
        data: {
          userId,
          resetAt: new Date().toISOString()
        }
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Two-factor auth API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
