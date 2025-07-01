'use client';

import { useState, useCallback } from 'react';
import {
  Box,
  Card,
  Button,
  Typography,
  Grid,
  TextField,
  Stack,
  IconButton,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Alert
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Iconify } from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';

// ----------------------------------------------------------------------

interface FooterSection {
  id: string;
  title: string;
  links: FooterLink[];
  isVisible: boolean;
  order: number;
}

interface FooterLink {
  id: string;
  text: string;
  url: string;
  isExternal: boolean;
  isVisible: boolean;
}

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
  isVisible: boolean;
}

interface FooterConfig {
  companyInfo: {
    name: string;
    description: string;
    address: string;
    phone: string;
    email: string;
  };
  sections: FooterSection[];
  socialLinks: SocialLink[];
  newsletter: {
    enabled: boolean;
    title: string;
    description: string;
    placeholder: string;
  };
  copyright: {
    text: string;
    showYear: boolean;
    customText: string;
  };
  appearance: {
    backgroundColor: string;
    textColor: string;
    linkColor: string;
    layout: 'default' | 'minimal' | 'expanded';
  };
}

const mockFooterConfig: FooterConfig = {
  companyInfo: {
    name: 'Storely',
    description: 'Premium furniture for modern living spaces',
    address: '123 Design Street, Furniture City, FC 12345',
    phone: '+1 (555) 123-4567',
    email: 'hello@storely.com'
  },
  sections: [
    {
      id: '1',
      title: 'Shop',
      order: 1,
      isVisible: true,
      links: [
        { id: '1', text: 'All Products', url: '/products', isExternal: false, isVisible: true },
        { id: '2', text: 'Living Room', url: '/category/living-room', isExternal: false, isVisible: true },
        { id: '3', text: 'Bedroom', url: '/category/bedroom', isExternal: false, isVisible: true },
        { id: '4', text: 'Dining Room', url: '/category/dining-room', isExternal: false, isVisible: true }
      ]
    },
    {
      id: '2',
      title: 'Customer Service',
      order: 2,
      isVisible: true,
      links: [
        { id: '5', text: 'Contact Us', url: '/contact', isExternal: false, isVisible: true },
        { id: '6', text: 'FAQ', url: '/faq', isExternal: false, isVisible: true },
        { id: '7', text: 'Shipping Info', url: '/shipping', isExternal: false, isVisible: true },
        { id: '8', text: 'Returns', url: '/returns', isExternal: false, isVisible: true }
      ]
    },
    {
      id: '3',
      title: 'Company',
      order: 3,
      isVisible: true,
      links: [
        { id: '9', text: 'About Us', url: '/about', isExternal: false, isVisible: true },
        { id: '10', text: 'Careers', url: '/careers', isExternal: false, isVisible: true },
        { id: '11', text: 'Press', url: '/press', isExternal: false, isVisible: true },
        { id: '12', text: 'Sustainability', url: '/sustainability', isExternal: false, isVisible: true }
      ]
    }
  ],
  socialLinks: [
    { id: '1', platform: 'Facebook', url: 'https://facebook.com/storely', icon: 'eva:facebook-fill', isVisible: true },
    { id: '2', platform: 'Instagram', url: 'https://instagram.com/storely', icon: 'eva:instagram-fill', isVisible: true },
    { id: '3', platform: 'Twitter', url: 'https://twitter.com/storely', icon: 'eva:twitter-fill', isVisible: true },
    { id: '4', platform: 'LinkedIn', url: 'https://linkedin.com/company/storely', icon: 'eva:linkedin-fill', isVisible: true }
  ],
  newsletter: {
    enabled: true,
    title: 'Stay in the loop',
    description: 'Subscribe to our newsletter for the latest updates and exclusive offers.',
    placeholder: 'Enter your email address'
  },
  copyright: {
    text: '© {year} Storely. All rights reserved.',
    showYear: true,
    customText: 'Built with care for furniture lovers everywhere.'
  },
  appearance: {
    backgroundColor: '#1a1a1a',
    textColor: '#ffffff',
    linkColor: '#3f51b5',
    layout: 'default'
  }
};

const socialPlatforms = [
  { value: 'facebook', label: 'Facebook', icon: 'eva:facebook-fill' },
  { value: 'instagram', label: 'Instagram', icon: 'eva:instagram-fill' },
  { value: 'twitter', label: 'Twitter', icon: 'eva:twitter-fill' },
  { value: 'linkedin', label: 'LinkedIn', icon: 'eva:linkedin-fill' },
  { value: 'youtube', label: 'YouTube', icon: 'eva:youtube-fill' },
  { value: 'tiktok', label: 'TikTok', icon: 'eva:video-fill' },
  { value: 'pinterest', label: 'Pinterest', icon: 'eva:pin-fill' }
];

// ----------------------------------------------------------------------

export default function FooterConfiguration() {
  const { enqueueSnackbar } = useSnackbar();
  
  const [config, setConfig] = useState<FooterConfig>(mockFooterConfig);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [openLinkDialog, setOpenLinkDialog] = useState(false);
  const [openSectionDialog, setOpenSectionDialog] = useState(false);
  const [editingLink, setEditingLink] = useState<{ sectionId: string; link: FooterLink | null }>({ sectionId: '', link: null });
  const [editingSection, setEditingSection] = useState<FooterSection | null>(null);
  
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    content: string;
    action: () => void;
  }>({
    open: false,
    title: '',
    content: '',
    action: () => {}
  });

  const [linkForm, setLinkForm] = useState({
    text: '',
    url: '',
    isExternal: false
  });

  const [sectionForm, setSectionForm] = useState({
    title: ''
  });

  const handleSaveConfig = useCallback(async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      enqueueSnackbar('Footer configuration saved successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to save footer configuration', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  const handleOpenLinkDialog = useCallback((sectionId: string, link?: FooterLink) => {
    setEditingLink({ sectionId, link: link || null });
    setLinkForm({
      text: link?.text || '',
      url: link?.url || '',
      isExternal: link?.isExternal || false
    });
    setOpenLinkDialog(true);
  }, []);

  const handleSaveLink = useCallback(() => {
    const { sectionId, link } = editingLink;
    
    setConfig(prev => ({
      ...prev,
      sections: prev.sections.map(section => 
        section.id === sectionId
          ? {
              ...section,
              links: link
                ? section.links.map(l => l.id === link.id ? { ...l, ...linkForm } : l)
                : [...section.links, {
                    id: Date.now().toString(),
                    ...linkForm,
                    isVisible: true
                  }]
            }
          : section
      )
    }));
    
    setOpenLinkDialog(false);
    enqueueSnackbar(`Link ${link ? 'updated' : 'added'} successfully`, { variant: 'success' });
  }, [editingLink, linkForm, enqueueSnackbar]);

  const handleDeleteLink = useCallback((sectionId: string, linkId: string) => {
    setConfig(prev => ({
      ...prev,
      sections: prev.sections.map(section => 
        section.id === sectionId
          ? { ...section, links: section.links.filter(link => link.id !== linkId) }
          : section
      )
    }));
    enqueueSnackbar('Link deleted successfully', { variant: 'success' });
  }, [enqueueSnackbar]);

  const handleOpenSectionDialog = useCallback((section?: FooterSection) => {
    setEditingSection(section || null);
    setSectionForm({
      title: section?.title || ''
    });
    setOpenSectionDialog(true);
  }, []);

  const handleSaveSection = useCallback(() => {
    if (editingSection) {
      setConfig(prev => ({
        ...prev,
        sections: prev.sections.map(section => 
          section.id === editingSection.id
            ? { ...section, title: sectionForm.title }
            : section
        )
      }));
      enqueueSnackbar('Section updated successfully', { variant: 'success' });
    } else {
      const newSection: FooterSection = {
        id: Date.now().toString(),
        title: sectionForm.title,
        links: [],
        isVisible: true,
        order: config.sections.length + 1
      };
      setConfig(prev => ({
        ...prev,
        sections: [...prev.sections, newSection]
      }));
      enqueueSnackbar('Section added successfully', { variant: 'success' });
    }
    setOpenSectionDialog(false);
  }, [editingSection, sectionForm, config.sections.length, enqueueSnackbar]);

  const handleDeleteSection = useCallback((sectionId: string) => {
    setConfirmDialog({
      open: true,
      title: 'Delete Section',
      content: 'Are you sure you want to delete this section? All links in this section will be removed.',
      action: () => {
        setConfig(prev => ({
          ...prev,
          sections: prev.sections.filter(section => section.id !== sectionId)
        }));
        enqueueSnackbar('Section deleted successfully', { variant: 'success' });
        setConfirmDialog({ ...confirmDialog, open: false });
      }
    });
  }, [confirmDialog, enqueueSnackbar]);

  const handleAddSocialLink = useCallback(() => {
    const newSocialLink: SocialLink = {
      id: Date.now().toString(),
      platform: 'facebook',
      url: '',
      icon: 'eva:facebook-fill',
      isVisible: true
    };
    setConfig(prev => ({
      ...prev,
      socialLinks: [...prev.socialLinks, newSocialLink]
    }));
  }, []);

  const handleUpdateSocialLink = useCallback((id: string, field: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.map(link => 
        link.id === id ? { ...link, [field]: value } : link
      )
    }));
  }, []);

  const handleDeleteSocialLink = useCallback((id: string) => {
    setConfig(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.filter(link => link.id !== id)
    }));
  }, []);

  const renderCompanyInfoTab = () => (
    <Stack spacing={3}>
      <Alert severity="info">
        Configure your company information displayed in the footer.
      </Alert>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Company Name"
            value={config.companyInfo.name}
            onChange={(e) => setConfig(prev => ({
              ...prev,
              companyInfo: { ...prev.companyInfo, name: e.target.value }
            }))}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={config.companyInfo.email}
            onChange={(e) => setConfig(prev => ({
              ...prev,
              companyInfo: { ...prev.companyInfo, email: e.target.value }
            }))}
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={3}
            value={config.companyInfo.description}
            onChange={(e) => setConfig(prev => ({
              ...prev,
              companyInfo: { ...prev.companyInfo, description: e.target.value }
            }))}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Phone"
            value={config.companyInfo.phone}
            onChange={(e) => setConfig(prev => ({
              ...prev,
              companyInfo: { ...prev.companyInfo, phone: e.target.value }
            }))}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Address"
            multiline
            rows={2}
            value={config.companyInfo.address}
            onChange={(e) => setConfig(prev => ({
              ...prev,
              companyInfo: { ...prev.companyInfo, address: e.target.value }
            }))}
          />
        </Grid>
      </Grid>
    </Stack>
  );

  const renderSectionsTab = () => (
    <Stack spacing={3}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h6">Footer Sections</Typography>
        <Button
          variant="contained"
          size="small"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={() => handleOpenSectionDialog()}
        >
          Add Section
        </Button>
      </Stack>
      
      {config.sections.map((section) => (
        <Card key={section.id} sx={{ p: 3 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="h6">{section.title}</Typography>
              <Switch
                checked={section.isVisible}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  sections: prev.sections.map(s => 
                    s.id === section.id ? { ...s, isVisible: e.target.checked } : s
                  )
                }))}
                size="small"
              />
            </Stack>
            <Stack direction="row" spacing={1}>
              <IconButton
                size="small"
                onClick={() => handleOpenLinkDialog(section.id)}
              >
                <Iconify icon="eva:plus-fill" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => handleOpenSectionDialog(section)}
              >
                <Iconify icon="eva:edit-fill" />
              </IconButton>
              <IconButton
                size="small"
                color="error"
                onClick={() => handleDeleteSection(section.id)}
              >
                <Iconify icon="eva:trash-2-fill" />
              </IconButton>
            </Stack>
          </Stack>
          
          <List dense>
            {section.links.map((link) => (
              <ListItem key={link.id}>
                <ListItemIcon>
                  <Iconify icon={link.isExternal ? 'eva:external-link-fill' : 'eva:link-fill'} />
                </ListItemIcon>
                <ListItemText
                  primary={link.text}
                  secondary={link.url}
                />
                <ListItemSecondaryAction>
                  <Stack direction="row" spacing={0.5}>
                    <Switch
                      checked={link.isVisible}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        sections: prev.sections.map(s => 
                          s.id === section.id
                            ? {
                                ...s,
                                links: s.links.map(l => 
                                  l.id === link.id ? { ...l, isVisible: e.target.checked } : l
                                )
                              }
                            : s
                        )
                      }))}
                      size="small"
                    />
                    <IconButton
                      size="small"
                      onClick={() => handleOpenLinkDialog(section.id, link)}
                    >
                      <Iconify icon="eva:edit-fill" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteLink(section.id, link.id)}
                    >
                      <Iconify icon="eva:trash-2-fill" />
                    </IconButton>
                  </Stack>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
            {section.links.length === 0 && (
              <ListItem>
                <ListItemText secondary="No links added yet" />
              </ListItem>
            )}
          </List>
        </Card>
      ))}
    </Stack>
  );

  const renderSocialLinksTab = () => (
    <Stack spacing={3}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h6">Social Media Links</Typography>
        <Button
          variant="contained"
          size="small"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={handleAddSocialLink}
        >
          Add Social Link
        </Button>
      </Stack>
      
      <Grid container spacing={2}>
        {config.socialLinks.map((social) => (
          <Grid item xs={12} md={6} key={social.id}>
            <Card sx={{ p: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Platform</InputLabel>
                    <Select
                      value={social.platform}
                      label="Platform"
                      onChange={(e) => {
                        const platform = socialPlatforms.find(p => p.value === e.target.value);
                        handleUpdateSocialLink(social.id, 'platform', e.target.value);
                        handleUpdateSocialLink(social.id, 'icon', platform?.icon || '');
                      }}
                    >
                      {socialPlatforms.map((platform) => (
                        <MenuItem key={platform.value} value={platform.value}>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Iconify icon={platform.icon} width={16} />
                            <span>{platform.label}</span>
                          </Stack>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    label="URL"
                    value={social.url}
                    onChange={(e) => handleUpdateSocialLink(social.id, 'url', e.target.value)}
                  />
                </Grid>
                
                <Grid item xs={12} sm={2}>
                  <Stack direction="row" spacing={0.5}>
                    <Switch
                      checked={social.isVisible}
                      onChange={(e) => handleUpdateSocialLink(social.id, 'isVisible', e.target.checked)}
                      size="small"
                    />
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteSocialLink(social.id)}
                    >
                      <Iconify icon="eva:trash-2-fill" />
                    </IconButton>
                  </Stack>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );

  const renderNewsletterTab = () => (
    <Stack spacing={3}>
      <FormControlLabel
        control={
          <Switch
            checked={config.newsletter.enabled}
            onChange={(e) => setConfig(prev => ({
              ...prev,
              newsletter: { ...prev.newsletter, enabled: e.target.checked }
            }))}
          />
        }
        label="Enable Newsletter Signup"
      />
      
      {config.newsletter.enabled && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Title"
              value={config.newsletter.title}
              onChange={(e) => setConfig(prev => ({
                ...prev,
                newsletter: { ...prev.newsletter, title: e.target.value }
              }))}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Placeholder Text"
              value={config.newsletter.placeholder}
              onChange={(e) => setConfig(prev => ({
                ...prev,
                newsletter: { ...prev.newsletter, placeholder: e.target.value }
              }))}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={2}
              value={config.newsletter.description}
              onChange={(e) => setConfig(prev => ({
                ...prev,
                newsletter: { ...prev.newsletter, description: e.target.value }
              }))}
            />
          </Grid>
        </Grid>
      )}
    </Stack>
  );

  const renderAppearanceTab = () => (
    <Stack spacing={3}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Layout</InputLabel>
            <Select
              value={config.appearance.layout}
              label="Layout"
              onChange={(e) => setConfig(prev => ({
                ...prev,
                appearance: { ...prev.appearance, layout: e.target.value as any }
              }))}
            >
              <MenuItem value="default">Default</MenuItem>
              <MenuItem value="minimal">Minimal</MenuItem>
              <MenuItem value="expanded">Expanded</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Background Color"
            type="color"
            value={config.appearance.backgroundColor}
            onChange={(e) => setConfig(prev => ({
              ...prev,
              appearance: { ...prev.appearance, backgroundColor: e.target.value }
            }))}
          />
        </Grid>
        
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Text Color"
            type="color"
            value={config.appearance.textColor}
            onChange={(e) => setConfig(prev => ({
              ...prev,
              appearance: { ...prev.appearance, textColor: e.target.value }
            }))}
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Copyright Text"
            value={config.copyright.text}
            onChange={(e) => setConfig(prev => ({
              ...prev,
              copyright: { ...prev.copyright, text: e.target.value }
            }))}
            helperText="Use {year} to automatically insert the current year"
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Custom Text"
            value={config.copyright.customText}
            onChange={(e) => setConfig(prev => ({
              ...prev,
              copyright: { ...prev.copyright, customText: e.target.value }
            }))}
          />
        </Grid>
      </Grid>
    </Stack>
  );

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography variant="h4">Footer Configuration</Typography>
        <LoadingButton
          variant="contained"
          loading={loading}
          onClick={handleSaveConfig}
        >
          Save Configuration
        </LoadingButton>
      </Stack>

      <Card>
        <Tabs 
          value={activeTab} 
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Company Info" />
          <Tab label="Sections" />
          <Tab label="Social Links" />
          <Tab label="Newsletter" />
          <Tab label="Appearance" />
        </Tabs>
        
        <Box sx={{ p: 3 }}>
          {activeTab === 0 && renderCompanyInfoTab()}
          {activeTab === 1 && renderSectionsTab()}
          {activeTab === 2 && renderSocialLinksTab()}
          {activeTab === 3 && renderNewsletterTab()}
          {activeTab === 4 && renderAppearanceTab()}
        </Box>
      </Card>

      {/* Add/Edit Link Dialog */}
      <Dialog open={openLinkDialog} onClose={() => setOpenLinkDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingLink.link ? 'Edit Link' : 'Add New Link'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Link Text"
              value={linkForm.text}
              onChange={(e) => setLinkForm({ ...linkForm, text: e.target.value })}
            />
            
            <TextField
              fullWidth
              label="URL"
              value={linkForm.url}
              onChange={(e) => setLinkForm({ ...linkForm, url: e.target.value })}
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={linkForm.isExternal}
                  onChange={(e) => setLinkForm({ ...linkForm, isExternal: e.target.checked })}
                />
              }
              label="External Link"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLinkDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveLink}>
            {editingLink.link ? 'Update' : 'Add'} Link
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add/Edit Section Dialog */}
      <Dialog open={openSectionDialog} onClose={() => setOpenSectionDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingSection ? 'Edit Section' : 'Add New Section'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Section Title"
              value={sectionForm.title}
              onChange={(e) => setSectionForm({ ...sectionForm, title: e.target.value })}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSectionDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveSection}>
            {editingSection ? 'Update' : 'Add'} Section
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}
        title={confirmDialog.title}
        content={confirmDialog.content}
        action={confirmDialog.action}
      />
    </Box>
  );
}
