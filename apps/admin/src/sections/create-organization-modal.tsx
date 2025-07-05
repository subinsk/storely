import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { useSnackbar } from "@storely/shared/components/snackbar";
import {Iconify} from "@storely/shared/components/iconify";
import { createOrganization } from "@/services/organization.service";

interface CreateOrganizationModalProps {
  open: boolean;
  onClose: () => void;
  onOrganizationCreated?: () => void;
}

const plans = [
  { value: "free", label: "Free" },
  { value: "premium", label: "Premium" },
  { value: "enterprise", label: "Enterprise" },
];

export default function CreateOrganizationModal({ open, onClose, onOrganizationCreated }: CreateOrganizationModalProps) {
  const [name, setName] = useState("");
  const [plan, setPlan] = useState("free");
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async () => {
    if (!name.trim()) {
      enqueueSnackbar("Organization name is required", { variant: "error" });
      return;
    }

    setLoading(true);
    try {
      await createOrganization({ name: name.trim(), plan });
      enqueueSnackbar("Organization created successfully", { variant: "success" });
      onOrganizationCreated && onOrganizationCreated();
      handleClose();
    } catch (error: any) {
      enqueueSnackbar(error?.response?.data?.error || "Failed to create organization", { variant: "error" });
    }
    setLoading(false);
  };

  const handleClose = () => {
    setName("");
    setPlan("free");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Create Organization</DialogTitle>
      <DialogContent>
        <TextField
          label="Organization Name"
          value={name}
          onChange={e => setName(e.target.value)}
          fullWidth
          margin="normal"
          autoFocus
        />
        <TextField
          label="Plan"
          select
          value={plan}
          onChange={e => setPlan(e.target.value)}
          fullWidth
          margin="normal"
        >
          {plans.map(p => (
            <MenuItem key={p.value} value={p.value}>{p.label}</MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading} startIcon={<Iconify icon="solar:close-circle-bold" />}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={loading || !name.trim()}
          startIcon={<Iconify icon="solar:buildings-2-bold" />}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
