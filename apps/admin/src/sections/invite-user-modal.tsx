import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { inviteUser, updateUser } from "@/services/user.service";
import { getOrganizations } from "@/services/organization.service";
import Iconify from "@/components/iconify";
import { useSnackbar } from "@/components/snackbar";

interface InviteUserModalProps {
  open: boolean;
  onClose: () => void;
  orgId?: string;
  user?: any;
  onUserInvited?: () => void;
}

const roles = [
  { value: "org_admin", label: "Org Admin" },
  { value: "org_user", label: "Org User" },
];

export default function InviteUserModal({ open, onClose, orgId, user, onUserInvited }: InviteUserModalProps) {
  const [email, setEmail] = useState(user?.email || "");
  const [role, setRole] = useState(user?.role || "org_user");
  const [organization, setOrganization] = useState(orgId || user?.organizationId || "");
  const [orgs, setOrgs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (!orgId) {
      getOrganizations().then(setOrgs);
    }
  }, [orgId]);

  useEffect(() => {
    setEmail(user?.email || "");
    setRole(user?.role || "org_user");
    setOrganization(orgId || user?.organizationId || "");
  }, [user, orgId]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (user) {
        await updateUser(user.id, { email, role, organizationId: organization });
        enqueueSnackbar("User updated successfully", { variant: "success" });
      } else {
        await inviteUser({ email, role, organizationId: organization });
        enqueueSnackbar("Invitation sent successfully", { variant: "success" });
      }
      onUserInvited && onUserInvited();
      onClose();
    } catch (e: any) {
      let errorMsg = "Something went wrong. Please try again.";
      if (e?.response?.data?.error) {
        errorMsg = e.response.data.error;
      } else if (e?.error) {
        errorMsg = e.error;
      } else if (typeof e === "string") {
        errorMsg = e;
      }
      enqueueSnackbar(errorMsg, { variant: "error" });
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{user ? "Edit User" : "Invite User"}</DialogTitle>
      <DialogContent>
        <TextField
          label="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          fullWidth
          margin="normal"
          disabled={!!user}
        />
        <TextField
          label="Role"
          select
          value={role}
          onChange={e => setRole(e.target.value)}
          fullWidth
          margin="normal"
        >
          {roles.map(r => (
            <MenuItem key={r.value} value={r.value}>{r.label}</MenuItem>
          ))}
        </TextField>
        <TextField
          label="Organization"
          select
          value={organization}
          onChange={e => setOrganization(e.target.value)}
          fullWidth
          margin="normal"
          disabled={!!orgId}
        >
          {orgId
            ? <MenuItem value={orgId}>Current Organization</MenuItem>
            : orgs.map(org => (
              <MenuItem key={org.id} value={org.id}>{org.name}</MenuItem>
            ))}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading} startIcon={<Iconify icon="solar:close-circle-bold" />}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading || !email || !organization} startIcon={<Iconify icon={user ? "solar:pen-bold" : "solar:user-plus-bold"} />}>
          {user ? "Save" : "Invite"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
