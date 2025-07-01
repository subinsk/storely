import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib';
import { z } from 'zod';

// Validation schemas
const LoyaltyProgramSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['points', 'tiers', 'cashback', 'hybrid']),
  description: z.string(),
  pointsPerDollar: z.number().min(0),
  pointsValue: z.number().min(0),
  minimumRedemption: z.number().min(0),
  expirationMonths: z.number().min(1)
});

const LoyaltyTierSchema = z.object({
  name: z.string().min(1),
  level: z.number().min(1),
  requiredPoints: z.number().min(0),
  benefits: z.array(z.string()),
  pointsMultiplier: z.number().min(1),
  color: z.string()
});

const LoyaltyRewardSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['discount', 'free_product', 'free_shipping', 'gift_card', 'custom']),
  pointsCost: z.number().min(1),
  value: z.number().min(0),
  description: z.string(),
  expirationDays: z.number().optional()
});

// GET /api/loyalty - Get loyalty program data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'program' | 'members' | 'analytics' | 'tiers' | 'rewards'

    if (type === 'program') {
      // Get main program details
      const program = {
        id: '1',
        name: 'Furnerio Rewards',
        type: 'hybrid',
        description: 'Earn points for every purchase and unlock exclusive benefits',
        isActive: true,
        pointsPerDollar: 10,
        pointsValue: 0.01,
        minimumRedemption: 500,
        expirationMonths: 24,
        members: 1284,
        totalPointsAwarded: 2580000,
        totalPointsRedeemed: 890000,
        createdAt: '2025-01-15'
      };

      return NextResponse.json({ program });
    }

    if (type === 'members') {
      // Get loyalty members
      const limit = parseInt(searchParams.get('limit') || '50');
      const offset = parseInt(searchParams.get('offset') || '0');

      // In real implementation, get from database
      const members = [
        {
          id: '1',
          customerId: 'cust-1',
          customerName: 'John Smith',
          customerEmail: 'john@example.com',
          points: 12450,
          tier: 'Silver',
          tierLevel: 2,
          totalSpent: 2840.50,
          joinDate: '2025-02-15',
          lastActivity: '2025-06-25',
          lifetimePoints: 28400,
          redeemedPoints: 15950,
          referrals: 3
        },
        {
          id: '2',
          customerId: 'cust-2',
          customerName: 'Sarah Johnson',
          customerEmail: 'sarah@example.com',
          points: 18750,
          tier: 'Gold',
          tierLevel: 3,
          totalSpent: 4250.75,
          joinDate: '2025-01-20',
          lastActivity: '2025-06-28',
          lifetimePoints: 42500,
          redeemedPoints: 23750,
          referrals: 5
        }
      ];

      return NextResponse.json({ 
        members: members.slice(offset, offset + limit),
        total: members.length,
        pagination: {
          limit,
          offset,
          hasMore: offset + limit < members.length
        }
      });
    }

    if (type === 'tiers') {
      // Get loyalty tiers
      const tiers = [
        {
          id: '1',
          name: 'Bronze',
          level: 1,
          requiredPoints: 0,
          benefits: ['Standard shipping', 'Birthday bonus'],
          pointsMultiplier: 1,
          color: '#CD7F32',
          memberCount: 756
        },
        {
          id: '2',
          name: 'Silver',
          level: 2,
          requiredPoints: 5000,
          benefits: ['Free shipping on $50+', 'Early sale access', 'Birthday bonus'],
          pointsMultiplier: 1.2,
          color: '#C0C0C0',
          memberCount: 398
        },
        {
          id: '3',
          name: 'Gold',
          level: 3,
          requiredPoints: 15000,
          benefits: ['Free shipping', 'Priority support', 'Exclusive products', 'Birthday bonus'],
          pointsMultiplier: 1.5,
          color: '#FFD700',
          memberCount: 108
        },
        {
          id: '4',
          name: 'Platinum',
          level: 4,
          requiredPoints: 35000,
          benefits: ['Free expedited shipping', 'Personal shopper', 'VIP events', 'Birthday bonus'],
          pointsMultiplier: 2,
          color: '#E5E4E2',
          memberCount: 22
        }
      ];

      return NextResponse.json({ tiers });
    }

    if (type === 'rewards') {
      // Get available rewards
      const rewards = [
        {
          id: '1',
          name: '$5 Off Your Order',
          type: 'discount',
          pointsCost: 500,
          value: 5,
          description: '$5 discount on any order',
          isActive: true,
          timesRedeemed: 234
        },
        {
          id: '2',
          name: 'Free Shipping',
          type: 'free_shipping',
          pointsCost: 200,
          value: 10,
          description: 'Free standard shipping on any order',
          isActive: true,
          timesRedeemed: 567
        },
        {
          id: '3',
          name: '$25 Gift Card',
          type: 'gift_card',
          pointsCost: 2500,
          value: 25,
          description: '$25 gift card for future purchases',
          isActive: true,
          timesRedeemed: 89
        }
      ];

      return NextResponse.json({ rewards });
    }

    if (type === 'analytics') {
      // Get loyalty analytics
      const analytics = {
        totalMembers: 1284,
        activeMembers: 1156,
        engagementRate: 34.5,
        avgPointsPerMember: 2010,
        totalPointsAwarded: 2580000,
        totalPointsRedeemed: 890000,
        redemptionRate: 34.5,
        tierDistribution: [
          { tier: 'Bronze', count: 756, percentage: 58.9 },
          { tier: 'Silver', count: 398, percentage: 31.0 },
          { tier: 'Gold', count: 108, percentage: 8.4 },
          { tier: 'Platinum', count: 22, percentage: 1.7 }
        ],
        rewardPopularity: [
          { reward: 'Free Shipping', redemptions: 567 },
          { reward: '$5 Off Your Order', redemptions: 234 },
          { reward: '$25 Gift Card', redemptions: 89 }
        ]
      };

      return NextResponse.json({ analytics });
    }

    // Default: return summary
    const summary = {
      programActive: true,
      totalMembers: 1284,
      totalPointsAwarded: 2580000,
      totalPointsRedeemed: 890000,
      engagementRate: 34.5,
      activeTiers: 4,
      activeRewards: 8
    };

    return NextResponse.json(summary);
  } catch (error) {
    console.error('Loyalty API GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/loyalty - Create program, tier, or reward
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, ...data } = body;

    if (type === 'program') {
      const validatedData = LoyaltyProgramSchema.parse(data);
      
      // In real implementation, save to database
      const newProgram = {
        id: Date.now().toString(),
        ...validatedData,
        isActive: true,
        members: 0,
        totalPointsAwarded: 0,
        totalPointsRedeemed: 0,
        createdAt: new Date().toISOString()
      };

      return NextResponse.json({ 
        success: true, 
        program: newProgram 
      });
    }

    if (type === 'tier') {
      const validatedData = LoyaltyTierSchema.parse(data);
      
      const newTier = {
        id: Date.now().toString(),
        ...validatedData,
        memberCount: 0,
        createdAt: new Date().toISOString()
      };

      return NextResponse.json({ 
        success: true, 
        tier: newTier 
      });
    }

    if (type === 'reward') {
      const validatedData = LoyaltyRewardSchema.parse(data);
      
      const newReward = {
        id: Date.now().toString(),
        ...validatedData,
        isActive: true,
        timesRedeemed: 0,
        createdAt: new Date().toISOString()
      };

      return NextResponse.json({ 
        success: true, 
        reward: newReward 
      });
    }

    if (type === 'award_points') {
      // Award points to customer
      const { customerId, points, reason } = data;
      
      if (!customerId || !points) {
        return NextResponse.json(
          { error: 'Customer ID and points are required' },
          { status: 400 }
        );
      }

      // In real implementation, update customer points in database
      const result = {
        success: true,
        customerId,
        pointsAwarded: points,
        newBalance: 15000 + points, // Mock calculation
        reason,
        timestamp: new Date().toISOString()
      };

      return NextResponse.json(result);
    }

    if (type === 'redeem_reward') {
      // Redeem reward for customer
      const { customerId, rewardId, pointsCost } = data;
      
      if (!customerId || !rewardId || !pointsCost) {
        return NextResponse.json(
          { error: 'Customer ID, reward ID, and points cost are required' },
          { status: 400 }
        );
      }

      // In real implementation, validate customer has enough points and process redemption
      const result = {
        success: true,
        customerId,
        rewardId,
        pointsRedeemed: pointsCost,
        newBalance: 15000 - pointsCost, // Mock calculation
        redemptionCode: `REWARD-${Date.now()}`,
        timestamp: new Date().toISOString()
      };

      return NextResponse.json(result);
    }

    return NextResponse.json(
      { error: 'Invalid type specified' },
      { status: 400 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Loyalty API POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/loyalty - Update program, tier, or reward
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, id, ...updateData } = body;

    if (!type || !id) {
      return NextResponse.json(
        { error: 'Type and ID are required' },
        { status: 400 }
      );
    }

    // In real implementation, update in database
    console.log(`Updating ${type} ${id}:`, updateData);

    return NextResponse.json({ 
      success: true, 
      message: `${type} updated successfully` 
    });
  } catch (error) {
    console.error('Loyalty API PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/loyalty - Delete tier or reward
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    if (!type || !id) {
      return NextResponse.json(
        { error: 'Type and ID are required' },
        { status: 400 }
      );
    }

    // In real implementation, delete from database
    console.log(`Deleting ${type} ${id}`);

    return NextResponse.json({ 
      success: true, 
      message: `${type} deleted successfully` 
    });
  } catch (error) {
    console.error('Loyalty API DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
