'use client';

import { useState, useCallback } from 'react';
import {
  Box,
  Card,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Switch,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  Stack,
  Tooltip,
  Tabs,
  Tab,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Iconify } from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';

// ----------------------------------------------------------------------

interface CustomPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: 'published' | 'draft' | 'scheduled';
  template: string;
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
  isVisible: boolean;
  showInMenu: boolean;
  menuOrder: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

interface PageTemplate {
  id: string;
  name: string;
  description: string;
  preview: string;
  sections: string[];
}

const mockPages: CustomPage[] = [
  {
    id: '1',
    title: 'About Us',
    slug: 'about-us',
    content: '<h1>About Storely</h1><p>We are passionate about bringing you the finest furniture...</p>',
    status: 'published',
    template: 'default',
    seo: {
      title: 'About Us - Storely',
      description: 'Learn about Storely\'s mission to provide premium furniture',
      keywords: 'about, storely, furniture, company'
    },
    isVisible: true,
    showInMenu: true,
    menuOrder: 1,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    publishedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    title: 'Privacy Policy',
    slug: 'privacy-policy',
    content: '<h1>Privacy Policy</h1><p>This Privacy Policy describes how we collect, use, and protect your information...</p>',
    status: 'published',
    template: 'legal',
    seo: {
      title: 'Privacy Policy - Storely',
      description: 'Read our privacy policy to understand how we handle your data',
      keywords: 'privacy, policy, data, protection'
    },
    isVisible: true,
    showInMenu: false,
    menuOrder: 0,
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    publishedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '3',
    title: 'Sustainability',
    slug: 'sustainability',
    content: '<h1>Our Commitment to Sustainability</h1><p>Draft content about our environmental initiatives...</p>',
    status: 'draft',
    template: 'feature',
    seo: {
      title: 'Sustainability - Storely',
      description: 'Learn about our environmental commitments and sustainable practices',
      keywords: 'sustainability, environment, eco-friendly'
    },
    isVisible: false,
    showInMenu: true,
    menuOrder: 2,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const pageTemplates: PageTemplate[] = [
  {
    id: 'default',
    name: 'Default Page',
    description: 'Standard page layout with header and content area',
    preview: '/templates/default.png',
    sections: ['header', 'content', 'footer']
  },
  {
    id: 'feature',
    name: 'Feature Page',
    description: 'Page with hero section, features grid, and call-to-action',
    preview: '/templates/feature.png',
    sections: ['hero', 'features', 'cta', 'footer']
  },
  {
    id: 'legal',
    name: 'Legal Page',
    description: 'Simple layout for terms, privacy policy, and other legal pages',
    preview: '/templates/legal.png',
    sections: ['header', 'content']
  },
  {
    id: 'landing',
    name: 'Landing Page',
    description: 'Full-featured landing page with multiple sections',
    preview: '/templates/landing.png',
    sections: ['hero', 'features', 'testimonials', 'pricing', 'cta']
  }
];

const statusColors = {
  published: 'success',
  draft: 'warning',
  scheduled: 'info'
} as const;

// ----------------------------------------------------------------------

export default function CustomPagesManagement() {
  const { enqueueSnackbar } = useSnackbar();
  
  const [pages, setPages] = useState<CustomPage[]>(mockPages);
  const [activeTab, setActiveTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPage, setEditingPage] = useState<CustomPage | null>(null);
  const [loading, setLoading] = useState(false);
  
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

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    template: 'default',
    status: 'draft' as const,
    seo: {
      title: '',
      description: '',
      keywords: ''
    },
    showInMenu: false,
    menuOrder: 0
  });

  const handleOpenDialog = useCallback((page?: CustomPage) => {
    if (page) {
      setEditingPage(page);
      setFormData({
        title: page.title,
        slug: page.slug,
        content: page.content,
        template: page.template,
        status: page.status,
        seo: page.seo,
        showInMenu: page.showInMenu,
        menuOrder: page.menuOrder
      });
    } else {
      setEditingPage(null);
      setFormData({
        title: '',
        slug: '',
        content: '',
        template: 'default',
        status: 'draft',
        seo: {
          title: '',
          description: '',
          keywords: ''
        },
        showInMenu: false,
        menuOrder: 0
      });
    }
    setOpenDialog(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
    setEditingPage(null);
  }, []);

  const generateSlug = useCallback((title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }, []);

  const handleTitleChange = useCallback((title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title),
      seo: {
        ...prev.seo,
        title: prev.seo.title || title
      }
    }));
  }, [generateSlug]);

  const handleSave = useCallback(async () => {
    setLoading(true);
    try {
      const now = new Date().toISOString();
      
      if (editingPage) {
        setPages(prev => prev.map(page => 
          page.id === editingPage.id 
            ? { 
                ...page, 
                ...formData,
                updatedAt: now,
                publishedAt: formData.status === 'published' && page.status !== 'published' ? now : page.publishedAt,
                isVisible: formData.status === 'published'
              }
            : page
        ));
        enqueueSnackbar('Page updated successfully', { variant: 'success' });
      } else {
        const newPage: CustomPage = {
          id: Date.now().toString(),
          ...formData,
          isVisible: formData.status === 'published',
          createdAt: now,
          updatedAt: now,
          publishedAt: formData.status === 'published' ? now : undefined
        };
        setPages(prev => [...prev, newPage]);
        enqueueSnackbar('Page created successfully', { variant: 'success' });
      }
      handleCloseDialog();
    } catch (error) {
      enqueueSnackbar('Failed to save page', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [editingPage, formData, enqueueSnackbar, handleCloseDialog]);

  const handleStatusChange = useCallback((id: string, status: 'published' | 'draft') => {
    const now = new Date().toISOString();
    setPages(prev => prev.map(page => 
      page.id === id 
        ? { 
            ...page, 
            status,
            isVisible: status === 'published',
            publishedAt: status === 'published' && page.status !== 'published' ? now : page.publishedAt,
            updatedAt: now
          }
        : page
    ));
    enqueueSnackbar(`Page ${status === 'published' ? 'published' : 'unpublished'} successfully`, { variant: 'success' });
  }, [enqueueSnackbar]);

  const handleDelete = useCallback((id: string) => {
    setConfirmDialog({
      open: true,
      title: 'Delete Page',
      content: 'Are you sure you want to delete this page? This action cannot be undone.',
      action: () => {
        setPages(prev => prev.filter(page => page.id !== id));
        enqueueSnackbar('Page deleted successfully', { variant: 'success' });
        setConfirmDialog({ ...confirmDialog, open: false });
      }
    });
  }, [confirmDialog, enqueueSnackbar]);

  const handleDuplicate = useCallback((page: CustomPage) => {
    const now = new Date().toISOString();
    const duplicatedPage: CustomPage = {
      ...page,
      id: Date.now().toString(),
      title: `${page.title} (Copy)`,
      slug: `${page.slug}-copy`,
      status: 'draft',
      isVisible: false,
      createdAt: now,
      updatedAt: now,
      publishedAt: undefined
    };
    setPages(prev => [...prev, duplicatedPage]);
    enqueueSnackbar('Page duplicated successfully', { variant: 'success' });
  }, [enqueueSnackbar]);

  const renderPagesTab = () => (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography variant="h6">Custom Pages</Typography>
        <Button
          variant="contained"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={() => handleOpenDialog()}
        >
          Create Page
        </Button>
      </Stack>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          Create and manage custom pages for your website. Pages can be set to show in navigation menus and have custom SEO settings.
        </Typography>
      </Alert>

      <Card>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Page</TableCell>
                <TableCell>Template</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Menu</TableCell>
                <TableCell>Last Updated</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pages.map((page) => (
                <TableRow key={page.id}>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2">
                        {page.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        /{page.slug}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                      {pageTemplates.find(t => t.id === page.template)?.name || page.template}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={page.status}
                      size="small"
                      color={statusColors[page.status]}
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={page.showInMenu}
                      onChange={(e) => setPages(prev => prev.map(p => 
                        p.id === page.id ? { ...p, showInMenu: e.target.checked } : p
                      ))}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(page.updatedAt).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={0.5}>
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(page)}
                        >
                          <Iconify icon="eva:edit-fill" />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="Duplicate">
                        <IconButton
                          size="small"
                          onClick={() => handleDuplicate(page)}
                        >
                          <Iconify icon="eva:copy-fill" />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title={page.status === 'published' ? 'Unpublish' : 'Publish'}>
                        <IconButton
                          size="small"
                          color={page.status === 'published' ? 'warning' : 'success'}
                          onClick={() => handleStatusChange(page.id, page.status === 'published' ? 'draft' : 'published')}
                        >
                          <Iconify icon={page.status === 'published' ? 'eva:eye-off-fill' : 'eva:eye-fill'} />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(page.id)}
                        >
                          <Iconify icon="eva:trash-2-fill" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );

  const renderTemplatesTab = () => (
    <Box>
      <Typography variant="h6" mb={3}>Page Templates</Typography>
      
      <Grid container spacing={3}>
        {pageTemplates.map((template) => (
          <Grid item xs={12} md={6} lg={4} key={template.id}>
            <Card sx={{ height: '100%' }}>
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  {template.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  {template.description}
                </Typography>
                
                <Typography variant="subtitle2" gutterBottom>
                  Sections:
                </Typography>
                <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
                  {template.sections.map((section) => (
                    <Chip key={section} label={section} size="small" variant="outlined" />
                  ))}
                </Stack>
                
                <Button
                  fullWidth
                  variant="outlined"
                  sx={{ mt: 2 }}
                  onClick={() => {
                    setFormData(prev => ({ ...prev, template: template.id }));
                    handleOpenDialog();
                  }}
                >
                  Use Template
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography variant="h4">Custom Pages</Typography>
      </Stack>

      <Card>
        <Tabs 
          value={activeTab} 
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Pages" />
          <Tab label="Templates" />
        </Tabs>
        
        <Box sx={{ p: 3 }}>
          {activeTab === 0 && renderPagesTab()}
          {activeTab === 1 && renderTemplatesTab()}
        </Box>
      </Card>

      {/* Create/Edit Page Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
        <DialogTitle>
          {editingPage ? 'Edit Page' : 'Create New Page'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  label="Page Title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={formData.status}
                    label="Status"
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                  >
                    <MenuItem value="draft">Draft</MenuItem>
                    <MenuItem value="published">Published</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  label="URL Slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  helperText={`Page will be available at: /${formData.slug}`}
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Template</InputLabel>
                  <Select
                    value={formData.template}
                    label="Template"
                    onChange={(e) => setFormData(prev => ({ ...prev, template: e.target.value }))}
                  >
                    {pageTemplates.map((template) => (
                      <MenuItem key={template.id} value={template.id}>
                        {template.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            
            <TextField
              fullWidth
              label="Page Content"
              multiline
              rows={8}
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              helperText="You can use HTML markup for formatting"
            />
            
            <Divider />
            
            <Accordion>
              <AccordionSummary expandIcon={<Iconify icon="eva:arrow-down-fill" />}>
                <Typography variant="h6">SEO Settings</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="SEO Title"
                    value={formData.seo.title}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      seo: { ...prev.seo, title: e.target.value }
                    }))}
                  />
                  
                  <TextField
                    fullWidth
                    label="Meta Description"
                    multiline
                    rows={2}
                    value={formData.seo.description}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      seo: { ...prev.seo, description: e.target.value }
                    }))}
                  />
                  
                  <TextField
                    fullWidth
                    label="Keywords"
                    value={formData.seo.keywords}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      seo: { ...prev.seo, keywords: e.target.value }
                    }))}
                    helperText="Separate keywords with commas"
                  />
                </Stack>
              </AccordionDetails>
            </Accordion>
            
            <Accordion>
              <AccordionSummary expandIcon={<Iconify icon="eva:arrow-down-fill" />}>
                <Typography variant="h6">Navigation Settings</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={3}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={8}>
                      <Switch
                        checked={formData.showInMenu}
                        onChange={(e) => setFormData(prev => ({ ...prev, showInMenu: e.target.checked }))}
                      />
                      <Typography variant="body2" component="span" sx={{ ml: 1 }}>
                        Show in navigation menu
                      </Typography>
                    </Grid>
                    
                    {formData.showInMenu && (
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label="Menu Order"
                          type="number"
                          size="small"
                          value={formData.menuOrder}
                          onChange={(e) => setFormData(prev => ({ ...prev, menuOrder: parseInt(e.target.value) || 0 }))}
                        />
                      </Grid>
                    )}
                  </Grid>
                </Stack>
              </AccordionDetails>
            </Accordion>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <LoadingButton
            variant="contained"
            onClick={handleSave}
            loading={loading}
          >
            {editingPage ? 'Update' : 'Create'} Page
          </LoadingButton>
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
