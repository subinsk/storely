"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getOrganizationUsers, getOrganizationById } from "@/services/organization.service";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import InviteUserModal from "@/components/invite-user-modal";
import UserTable from "@/components/user-table";

export default function OrganizationDetailsPage() {
  const { id } = useParams();
  const [org, setOrg] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [inviteOpen, setInviteOpen] = useState(false);

  useEffect(() => {
    if (id) {
      getOrganizationById(id as string).then(setOrg);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      getOrganizationUsers(id as string).then(setUsers);
    }
  }, [id, inviteOpen]);

  return (
    <Stack spacing={3}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h4" fontWeight={700}>{org?.name || "Organization"}</Typography>
        <Button variant="contained" onClick={() => setInviteOpen(true)}>
          Invite User
        </Button>
      </Stack>
      <UserTable users={users} orgId={id as string} onUsersChange={setUsers} />
      <InviteUserModal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        orgId={id as string}
        onUserInvited={() => getOrganizationUsers(id as string).then(setUsers)}
      />
    </Stack>
  );
}
