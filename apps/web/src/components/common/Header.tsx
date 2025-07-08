"use client"

import { AppBar, Toolbar, Typography, Button, Box, IconButton, Badge, Menu, MenuItem } from '@mui/material';
import { ShoppingCart, Person, Search } from '@mui/icons-material';
import { useState } from 'react';
import Link from 'next/link';
import { useOrganization } from '../../contexts/OrganizationContext';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { AuthDialog } from '../auth/AuthDialog';
import { CartDrawer } from '../cart/CartDrawer';

interface HeaderProps {
  categories?: any[];
}

export function Header({ categories = [] }: HeaderProps) {
  const { organization } = useOrganization();
  const { user, logout } = useAuth();
  const { items } = useCart();
  const [authOpen, setAuthOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = () => {
    logout();
    handleUserMenuClose();
  };

  const totalItems = items.reduce((sum: number, item: any) => sum + item.quantity, 0);

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              {organization?.name || 'Store'}
            </Link>
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button color="inherit" component={Link} href="/">
              Home
            </Button>
            <Button color="inherit" component={Link} href="/products">
              Products
            </Button>
            <Button color="inherit" component={Link} href="/categories">
              Categories
            </Button>
            <Button color="inherit" component={Link} href="/about">
              About
            </Button>
            <Button color="inherit" component={Link} href="/contact">
              Contact
            </Button>
            
            {/* Cart Button */}
            <IconButton color="inherit" onClick={() => setCartOpen(true)}>
              <Badge badgeContent={totalItems} color="error">
                <ShoppingCart />
              </Badge>
            </IconButton>

            {/* User Menu */}
            {user ? (
              <>
                <IconButton color="inherit" onClick={handleUserMenuOpen}>
                  <Person />
                </IconButton>
                <Menu
                  anchorEl={userMenuAnchor}
                  open={Boolean(userMenuAnchor)}
                  onClose={handleUserMenuClose}
                >
                  <MenuItem component={Link} href="/profile" onClick={handleUserMenuClose}>
                    Profile
                  </MenuItem>
                  <MenuItem component={Link} href="/orders" onClick={handleUserMenuClose}>
                    Orders
                  </MenuItem>
                  <MenuItem component={Link} href="/wishlist" onClick={handleUserMenuClose}>
                    Wishlist
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <Button color="inherit" onClick={() => setAuthOpen(true)}>
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Auth Dialog */}
      <AuthDialog open={authOpen} onClose={() => setAuthOpen(false)} />

      {/* Cart Drawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
