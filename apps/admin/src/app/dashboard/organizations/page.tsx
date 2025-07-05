"use client";

export const dynamic = 'force-dynamic';


import { useEffect, useState } from "react";
import { getOrganizations } from "@/services/organization.service";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { debounce } from "lodash";
import { useRouter } from "next/navigation";
import Button from "@mui/material/Button";
import {Iconify} from "@storely/shared/components";
import CreateOrganizationModal from "@/sections/create-organization-modal";

export default function OrganizationsPage() {
  const [orgs, setOrgs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const router = useRouter();

  const fetchOrgs = async (searchValue?: string) => {
    setLoading(true);
    try {
      const data = await getOrganizations(searchValue);
      setOrgs(data);
    } catch {
      setOrgs([]);
    }
    setLoading(false);
  };

  // Debounced search
  const handleSearch = debounce((value: string) => {
    fetchOrgs(value);
  }, 400);

  useEffect(() => {
    fetchOrgs();
    // eslint-disable-next-line
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" fontWeight={700} color="primary.main" gutterBottom>
          Organizations
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage and monitor all organizations in your Furnerio platform
        </Typography>
      </Box>

      {/* Actions Section */}
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
        <CardContent>
          <Stack direction={{ xs: 'column', md: 'row' }} alignItems="center" justifyContent="space-between" spacing={2}>
            <TextField
              label="Search organizations"
              variant="outlined"
              size="medium"
              onChange={e => {
                setSearch(e.target.value);
                handleSearch(e.target.value);
              }}
              value={search}
              sx={{ 
                maxWidth: 400,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'background.paper',
                  borderRadius: 2,
                }
              }}
              InputProps={{
                startAdornment: <Iconify icon="solar:magnifer-bold" sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
            <Button 
              variant="contained" 
              size="large"
              onClick={() => setCreateOpen(true)}
              startIcon={<Iconify icon="solar:buildings-2-bold" />}
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1.5,
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(139, 69, 19, 0.3)',
                '&:hover': {
                  boxShadow: '0 6px 20px rgba(139, 69, 19, 0.4)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              Create Organization
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Table Section */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'grey.50' }}>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Organization</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Members</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Plan</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Created</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Updated</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <TableRow key={idx}>
                    <TableCell><Skeleton variant="text" width={120} height={24} /></TableCell>
                    <TableCell><Skeleton variant="text" width={60} height={24} /></TableCell>
                    <TableCell><Skeleton variant="rounded" width={80} height={24} /></TableCell>
                    <TableCell><Skeleton variant="text" width={140} height={24} /></TableCell>
                    <TableCell><Skeleton variant="text" width={140} height={24} /></TableCell>
                  </TableRow>
                ))
              ) : orgs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                    <Stack alignItems="center" spacing={2}>
                      <Iconify icon="solar:buildings-2-broken" sx={{ fontSize: 48, color: 'text.disabled' }} />
                      <Typography variant="h6" color="text.secondary">
                        No organizations found
                      </Typography>
                      <Typography variant="body2" color="text.disabled">
                        {search ? 'Try adjusting your search criteria' : 'Get started by creating your first organization'}
                      </Typography>
                    </Stack>
                  </TableCell>
                </TableRow>
              ) : (
                orgs.map((org) => (
                  <TableRow 
                    key={org.id} 
                    hover 
                    sx={{ 
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'primary.lighter',
                      },
                      transition: 'background-color 0.2s ease',
                    }} 
                    onClick={() => router.push(`/dashboard/organizations/${org.id}`)}
                  >
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {org.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={org.membersCount} 
                        size="small" 
                        color="info"
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={org.plan} 
                        size="small"
                        color={org.plan === 'premium' ? 'warning' : org.plan === 'enterprise' ? 'error' : 'default'}
                        sx={{ 
                          textTransform: 'capitalize', 
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(org.createdAt).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(org.updatedAt).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <CreateOrganizationModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onOrganizationCreated={() => {
          setCreateOpen(false);
          fetchOrgs();
        }}
      />
    </Box>
  );
}
