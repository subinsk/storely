"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getOrganizationUsers } from "@/services/organization.service";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import InviteUserModal from "@/components/invite-user-modal";
import UserTable from "@/components/user-table";

export default function UsersPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<any[]>([]);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const currentUser = session?.user;
  const currentUserRole = currentUser?.role || "member";
  const userOrgId = currentUser?.organizationId;

  // Only org_admin and super_admin can access this page
  const canAccessUsers = ["org_admin", "super_admin"].includes(currentUserRole);

  useEffect(() => {
    if (canAccessUsers && userOrgId) {
      fetchUsers();
    } else {
      setLoading(false);
    }
  }, [canAccessUsers, userOrgId]);

  const fetchUsers = async () => {
    if (!userOrgId) return;
    setLoading(true);
    try {
      const data = await getOrganizationUsers(userOrgId);
      setUsers(data);
    } catch (error) {
      setUsers([]);
    }
    setLoading(false);
  };

  if (!canAccessUsers) {
    return (
      <Stack spacing={3}>
        <Typography variant="h4" fontWeight={700}>Users</Typography>
        <Alert severity="warning">
          You don&apos;t have permission to access user management. Only organization admins can manage users.
        </Alert>
      </Stack>
    );
  }

  if (loading) {
    return (
      <Stack spacing={3}>
        <Typography variant="h4" fontWeight={700}>Users</Typography>
        <Typography>Loading...</Typography>
      </Stack>
    );
  }

  return (
    <Stack spacing={3}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h4" fontWeight={700}>Users</Typography>
        <Button variant="contained" onClick={() => setInviteOpen(true)}>
          Invite User
        </Button>
      </Stack>
      <UserTable 
        users={users} 
        orgId={userOrgId!} 
        onUsersChange={setUsers} 
      />
      <InviteUserModal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        orgId={userOrgId}
        onUserInvited={fetchUsers}
      />
    </Stack>
  );
}
