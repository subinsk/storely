'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  Menu,
  MenuItem,
  Typography,
  Avatar,
  Divider,
  Chip,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { KeyboardArrowDown, Store, CheckCircle, Cancel } from '@mui/icons-material';
import { useAdmin } from '../contexts/AdminContext';
import { useSession } from 'next-auth/react';

export default function OrganizationSwitcher() {
  const { data: session } = useSession();
  const { currentOrganization, organizations, switchOrganization } = useAdmin();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (orgId: string) => {
    switchOrganization(orgId);
    handleClose();
  };

  // Only show for super admin
  if (session?.user?.role !== 'super_admin') {
    return null;
  }

  return (
    <>
      <Button
        onClick={handleClick}
        variant="outlined"
        startIcon={<Store />}
        endIcon={<KeyboardArrowDown />}
        sx={{ mb: 2 }}
      >
        <Box sx={{ textAlign: 'left' }}>
          <Typography variant="body2" noWrap>
            {currentOrganization?.name || 'Select Organization'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {currentOrganization?.subdomain || 'No subdomain'}
          </Typography>
        </Box>
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: { width: 300, maxHeight: 400 }
        }}
      >
        <Typography variant="subtitle2" sx={{ px: 2, py: 1 }}>
          Switch Organization
        </Typography>
        <Divider />
        
        {organizations.map((org) => (
          <MenuItem
            key={org.id}
            onClick={() => handleSelect(org.id)}
            selected={org.id === currentOrganization?.id}
          >
            <ListItemIcon>
              <Avatar src={org.logo || undefined} sx={{ width: 24, height: 24 }}>
                {org.name.charAt(0)}
              </Avatar>
            </ListItemIcon>
            <ListItemText
              primary={org.name}
              secondary={org.subdomain || 'No subdomain'}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
              <Chip
                size="small"
                label={org.plan}
                color={org.plan === 'enterprise' ? 'primary' : 'default'}
              />
              <Chip
                size="small"
                icon={org.isActive ? <CheckCircle /> : <Cancel />}
                label={org.isActive ? 'Active' : 'Inactive'}
                color={org.isActive ? 'success' : 'error'}
              />
            </Box>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
