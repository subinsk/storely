import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import InviteUserModal from "./invite-user-modal";
import { deleteUser, resendInvitation } from "@/services/user.service";
import { useSnackbar } from "@storely/shared/components/snackbar";
import { Iconify } from "@storely/shared/components/iconify";
import { ROLE_LABEL_MAP, ROLE_LEVEL_MAP } from "@/constants/role-label-map";
import { useSession } from "next-auth/react";

interface UserTableProps {
  users: any[];
  orgId: string;
  onUsersChange: (users: any[]) => void;
}

export default function UserTable({ users, orgId, onUsersChange }: UserTableProps) {
  const [search, setSearch] = useState("");
  const [editUser, setEditUser] = useState<any>(null);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { data: session } = useSession();
  const { enqueueSnackbar } = useSnackbar();
  const currentUser = session?.user;
  const currentUserRole = currentUser?.role || "member";
  const currentUserId = currentUser?.id;
  const currentUserLevel = ROLE_LEVEL_MAP[currentUserRole] ?? 0;

  const handleDelete = async () => {
    if (deleteUserId) {
      try {
        await deleteUser(deleteUserId);
        onUsersChange(users.filter(u => u.id !== deleteUserId));
        enqueueSnackbar("User deleted successfully", { variant: "success" });
      } catch (error) {
        enqueueSnackbar("Failed to delete user", { variant: "error" });
      }
      setDeleteUserId(null);
      setConfirmOpen(false);
    }
  };

  const handleResendInvite = async (invitationId: string) => {
    try {
      await resendInvitation(invitationId);
      enqueueSnackbar("Invitation resent successfully", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Failed to resend invitation", { variant: "error" });
    }
  };

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Stack spacing={2}>
      <TextField
        label="Search users"
        value={search}
        onChange={e => setSearch(e.target.value)}
        size="small"
        sx={{ maxWidth: 320 }}
      />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map(user => {
              const userLevel = ROLE_LEVEL_MAP[user.role] ?? 0;
              const canEditOrDelete =
                user.id !== currentUserId &&
                currentUserLevel >= userLevel;
              return (
                <TableRow
                  key={user.id}
                  hover
                  sx={{
                    '&:hover .user-actions': { opacity: 1 },
                  }}
                >
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell sx={{ textTransform: 'capitalize' }}>{user.role ? ROLE_LABEL_MAP[user.role] || user.role : ''}</TableCell>
                  <TableCell>
                    {user.status === 'invited' ? (
                      <Chip label="Invited" color="warning" size="small" />
                    ) : (
                      <Chip label="Active" color="success" size="small" />
                    )}
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} className="user-actions" sx={{ opacity: 0, transition: 'opacity 0.2s' }}>
                      {canEditOrDelete && (
                        <>
                          <Tooltip title="Edit">
                            <IconButton onClick={() => setEditUser(user)}>
                              <Iconify icon="solar:pen-bold" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton onClick={() => { setDeleteUserId(user.id); setConfirmOpen(true); }}>
                              <Iconify icon="solar:trash-bin-trash-bold" />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                      {user.status === 'invited' && canEditOrDelete && (
                        <Tooltip title="Resend Invitation">
                          <IconButton onClick={() => handleResendInvite(user.id)}>
                            <Iconify icon="solar:letter-bold" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <InviteUserModal
        open={!!editUser}
        onClose={() => setEditUser(null)}
        user={editUser}
        orgId={orgId}
        onUserInvited={() => setEditUser(null)}
      />
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>Are you sure you want to delete this user?</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button color="error" onClick={handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
