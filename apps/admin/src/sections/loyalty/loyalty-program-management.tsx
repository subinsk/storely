"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Switch,
  FormControlLabel,
  TextField,
  Alert,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  LinearProgress,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { format } from 'date-fns';
import { fCurrency, fNumber, fPercent } from '@/utils/format-number';
import Iconify from '@/components/iconify';

interface LoyaltyProgram {
  id: string;
  name: string;
  type: 'points' | 'tiers' | 'cashback' | 'hybrid';
  description: string;
  isActive: boolean;
  pointsPerDollar: number;
  pointsValue: number; // 1 point = $X
  minimumRedemption: number;
  expirationMonths: number;
  bonusEvents: BonusEvent[];
  tiers: LoyaltyTier[];
  rewards: LoyaltyReward[];
  members: number;
  totalPointsAwarded: number;
  totalPointsRedeemed: number;
  createdAt: string;
}

interface LoyaltyTier {
  id: string;
  name: string;
  level: number;
  requiredPoints: number;
  benefits: string[];
  pointsMultiplier: number;
  color: string;
  memberCount: number;
}

interface LoyaltyReward {
  id: string;
  name: string;
  type: 'discount' | 'free_product' | 'free_shipping' | 'gift_card' | 'custom';
  pointsCost: number;
  value: number;
  description: string;
  isActive: boolean;
  timesRedeemed: number;
  expirationDays?: number;
}

interface BonusEvent {
  id: string;
  name: string;
  type: 'signup' | 'birthday' | 'anniversary' | 'referral' | 'purchase_milestone' | 'seasonal';
  pointsAwarded: number;
  multiplier?: number;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
}

interface LoyaltyMember {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  points: number;
  tier: string;
  tierLevel: number;
  totalSpent: number;
  joinDate: string;
  lastActivity: string;
  lifetimePoints: number;
  redeemedPoints: number;
  referrals: number;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`loyalty-tabpanel-${index}`}
      aria-labelledby={`loyalty-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

const TIER_COLORS = ['#E3F2FD', '#BBDEFB', '#90CAF9', '#42A5F5', '#1E88E5'];

export default function LoyaltyProgramManagement() {
  const [tabValue, setTabValue] = useState(0);
  const [program, setProgram] = useState<LoyaltyProgram | null>(null);
  const [members, setMembers] = useState<LoyaltyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [programDialogOpen, setProgramDialogOpen] = useState(false);
  const [rewardDialogOpen, setRewardDialogOpen] = useState(false);
  const [tierDialogOpen, setTierDialogOpen] = useState(false);

  useEffect(() => {
    loadLoyaltyData();
  }, []);

  const loadLoyaltyData = async () => {
    try {
      setLoading(true);
      
      // Mock data - replace with actual API calls
      const mockProgram: LoyaltyProgram = {
        id: '1',
        name: 'Furnerio Rewards',
        type: 'hybrid',
        description: 'Earn points for every purchase and unlock exclusive benefits',
        isActive: true,
        pointsPerDollar: 10,
        pointsValue: 0.01, // $0.01 per point
        minimumRedemption: 500,
        expirationMonths: 24,
        members: 1284,
        totalPointsAwarded: 2580000,
        totalPointsRedeemed: 890000,
        createdAt: '2025-01-15',
        bonusEvents: [
          {
            id: '1',
            name: 'Welcome Bonus',
            type: 'signup',
            pointsAwarded: 500,
            isActive: true
          },
          {
            id: '2',
            name: 'Birthday Bonus',
            type: 'birthday',
            pointsAwarded: 1000,
            isActive: true
          },
          {
            id: '3',
            name: 'Referral Bonus',
            type: 'referral',
            pointsAwarded: 2000,
            isActive: true
          }
        ],
        tiers: [
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
        ],
        rewards: [
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
        ]
      };

      const mockMembers: LoyaltyMember[] = [
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

      setProgram(mockProgram);
      setMembers(mockMembers);
    } catch (error) {
      console.error('Error loading loyalty data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleToggleProgram = async () => {
    if (program) {
      setProgram({ ...program, isActive: !program.isActive });
    }
  };

  const getLoyaltyMetrics = () => {
    if (!program) return {};

    const engagementRate = (program.totalPointsRedeemed / program.totalPointsAwarded) * 100;
    const avgPointsPerMember = program.totalPointsAwarded / program.members;
    const programValue = program.totalPointsAwarded * program.pointsValue;

    return {
      engagementRate: Math.round(engagementRate * 10) / 10,
      avgPointsPerMember: Math.round(avgPointsPerMember),
      programValue
    };
  };

  const metrics = getLoyaltyMetrics();

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
        <Typography variant="body2" sx={{ mt: 2 }}>
          Loading loyalty program...
        </Typography>
      </Box>
    );
  }

  if (!program) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Failed to load loyalty program data</Alert>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h4" gutterBottom>
            Loyalty Program Management
          </Typography>
          <Stack direction="row" spacing={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={program.isActive}
                  onChange={handleToggleProgram}
                />
              }
              label="Program Active"
            />
            <Button
              variant="outlined"
              startIcon={<Iconify icon="eva:settings-outline" />}
              onClick={() => setProgramDialogOpen(true)}
            >
              Program Settings
            </Button>
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-outline" />}
              onClick={() => setRewardDialogOpen(true)}
            >
              Add Reward
            </Button>
          </Stack>
        </Stack>

        {/* Program Overview */}
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Typography variant="h6" gutterBottom>
                  {program.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {program.description}
                </Typography>
                <Stack direction="row" spacing={2}>
                  <Chip
                    label={program.type.toUpperCase()}
                    color="primary"
                    variant="outlined"
                  />
                  <Chip
                    label={`${program.pointsPerDollar} pts per $1`}
                    color="info"
                    variant="outlined"
                  />
                  <Chip
                    label={`1 pt = ${fCurrency(program.pointsValue)}`}
                    color="success"
                    variant="outlined"
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} md={4}>
                <Stack spacing={1}>
                  <Typography variant="body2" color="text.secondary">
                    Members: {fNumber(program.members)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Points Awarded: {fNumber(program.totalPointsAwarded)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Points Redeemed: {fNumber(program.totalPointsRedeemed)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Engagement Rate: {fPercent(metrics.engagementRate || 0)}
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    bgcolor: 'primary.lighter',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Iconify icon="eva:people-outline" width={24} height={24} color="primary.main" />
                </Box>
                <Box>
                  <Typography variant="h3" component="div">
                    {fNumber(program.members)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Members
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    bgcolor: 'success.lighter',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Iconify icon="eva:star-outline" width={24} height={24} color="success.main" />
                </Box>
                <Box>
                  <Typography variant="h3" component="div">
                    {fNumber(program.totalPointsAwarded)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Points Awarded
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    bgcolor: 'warning.lighter',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Iconify icon="eva:gift-outline" width={24} height={24} color="warning.main" />
                </Box>
                <Box>
                  <Typography variant="h3" component="div">
                    {fNumber(program.totalPointsRedeemed)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Points Redeemed
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    bgcolor: 'info.lighter',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Iconify icon="eva:trending-up-outline" width={24} height={24} color="info.main" />
                </Box>
                <Box>
                  <Typography variant="h3" component="div">
                    {fPercent(metrics.engagementRate || 0)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Engagement Rate
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab
              label={
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Iconify icon="eva-layers-outline" />
                  <span>Tiers</span>
                </Stack>
              }
            />
            <Tab
              label={
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Iconify icon="eva:gift-outline" />
                  <span>Rewards</span>
                </Stack>
              }
            />
            <Tab
              label={
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Iconify icon="eva:people-outline" />
                  <span>Members</span>
                </Stack>
              }
            />
            <Tab
              label={
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Iconify icon="eva:bar-chart-outline" />
                  <span>Analytics</span>
                </Stack>
              }
            />
          </Tabs>
        </Box>

        {/* Tiers Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ p: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
              <Typography variant="h6">
                Loyalty Tiers
              </Typography>
              <Button
                variant="contained"
                startIcon={<Iconify icon="eva:plus-outline" />}
                onClick={() => setTierDialogOpen(true)}
              >
                Add Tier
              </Button>
            </Stack>

            <Grid container spacing={3}>
              {program.tiers.map((tier, index) => (
                <Grid item xs={12} md={6} lg={3} key={tier.id}>
                  <Card
                    variant="outlined"
                    sx={{
                      position: 'relative',
                      border: `2px solid ${tier.color}`,
                      '&:hover': { boxShadow: 3 }
                    }}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          position: 'absolute',
                          top: -1,
                          right: -1,
                          width: 0,
                          height: 0,
                          borderLeft: '20px solid transparent',
                          borderTop: `20px solid ${tier.color}`
                        }}
                      />
                      
                      <Stack spacing={2}>
                        <Box textAlign="center">
                          <Avatar
                            sx={{
                              width: 60,
                              height: 60,
                              bgcolor: tier.color,
                              color: 'white',
                              mx: 'auto',
                              mb: 1
                            }}
                          >
                            {tier.level}
                          </Avatar>
                          <Typography variant="h6" gutterBottom>
                            {tier.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {fNumber(tier.requiredPoints)}+ points
                          </Typography>
                        </Box>

                        <Divider />

                        <Box>
                          <Typography variant="subtitle2" gutterBottom>
                            Benefits:
                          </Typography>
                          <List dense>
                            {tier.benefits.map((benefit, idx) => (
                              <ListItem key={idx} sx={{ py: 0, px: 0 }}>
                                <ListItemText
                                  primary={benefit}
                                  primaryTypographyProps={{ variant: 'body2' }}
                                />
                              </ListItem>
                            ))}
                          </List>
                        </Box>

                        <Box textAlign="center">
                          <Typography variant="body2" color="text.secondary">
                            {fNumber(tier.memberCount)} members
                          </Typography>
                          <Typography variant="body2" color="primary">
                            {tier.pointsMultiplier}x points multiplier
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </TabPanel>

        {/* Rewards Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ p: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
              <Typography variant="h6">
                Available Rewards
              </Typography>
              <Button
                variant="contained"
                startIcon={<Iconify icon="eva:plus-outline" />}
                onClick={() => setRewardDialogOpen(true)}
              >
                Add Reward
              </Button>
            </Stack>

            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Reward</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Points Cost</TableCell>
                    <TableCell>Value</TableCell>
                    <TableCell>Times Redeemed</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {program.rewards.map((reward) => (
                    <TableRow key={reward.id}>
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle2">
                            {reward.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {reward.description}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={reward.type.replace('_', ' ').toUpperCase()}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2">
                          {fNumber(reward.pointsCost)} pts
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2">
                          {fCurrency(reward.value)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {fNumber(reward.timesRedeemed)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={reward.isActive ? 'Active' : 'Inactive'}
                          color={reward.isActive ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <IconButton size="small">
                            <Iconify icon="eva:edit-outline" />
                          </IconButton>
                          <Switch
                            checked={reward.isActive}
                            size="small"
                            onChange={() => {/* Handle toggle */}}
                          />
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </TabPanel>

        {/* Members Tab */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Loyalty Members
            </Typography>
            
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Member</TableCell>
                    <TableCell>Current Points</TableCell>
                    <TableCell>Tier</TableCell>
                    <TableCell>Total Spent</TableCell>
                    <TableCell>Lifetime Points</TableCell>
                    <TableCell>Join Date</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {members.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            {member.customerName[0]}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2">
                              {member.customerName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {member.customerEmail}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2">
                          {fNumber(member.points)} pts
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={member.tier}
                          color={
                            member.tierLevel === 1 ? 'default' :
                            member.tierLevel === 2 ? 'info' :
                            member.tierLevel === 3 ? 'warning' : 'error'
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2">
                          {fCurrency(member.totalSpent)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {fNumber(member.lifetimePoints)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {format(new Date(member.joinDate), 'MMM dd, yyyy')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <Tooltip title="View Details">
                            <IconButton size="small">
                              <Iconify icon="eva:eye-outline" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Adjust Points">
                            <IconButton size="small">
                              <Iconify icon="eva:edit-outline" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </TabPanel>

        {/* Analytics Tab */}
        <TabPanel value={tabValue} index={3}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Loyalty Program Analytics
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      Member Distribution by Tier
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={program.tiers.map(tier => ({
                            name: tier.name,
                            value: tier.memberCount,
                            color: tier.color
                          }))}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value}`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {program.tiers.map((tier, index) => (
                            <Cell key={`cell-${index}`} fill={tier.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      Reward Redemption Popularity
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={program.rewards}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <RechartsTooltip />
                        <Bar dataKey="timesRedeemed" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </TabPanel>
      </Card>
    </Box>
  );
}
