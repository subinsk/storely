"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  TextField,
  Stack,
  Tabs,
  Tab,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Alert,
  Chip,
  Divider,
  Avatar,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  ListItemAvatar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { fNumber } from '@/utils/format-number';
import Iconify from '@/components/iconify';
import Image from '@/components/image';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

interface HeroSection {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  ctaText?: string;
  ctaLink?: string;
}

interface ContentSection {
  id: string;
  type: 'hero' | 'features' | 'products' | 'testimonials' | 'newsletter' | 'custom';
  title?: string;
  content: any;
  order: number;
  isVisible: boolean;
}

interface NavigationItem {
  id: string;
  label: string;
  url: string;
  type: 'internal' | 'external' | 'category' | 'page';
  target: '_self' | '_blank';
  icon?: string;
  order: number;
  isVisible: boolean;
  children?: NavigationItem[];
}

interface NavigationMenu {
  id: string;
  name: string;
  type: 'header' | 'footer' | 'mobile' | 'sidebar';
  items: NavigationItem[];
  settings?: {
    maxDepth: number;
    showIcons: boolean;
    style?: string;
  };
}

interface HomepageData {
  hero: HeroSection;
  sections: ContentSection[];
  seo: {
    title?: string;
    description?: string;
    keywords?: string[];
    image?: string;
  };
}

interface NavigationData {
  menus: NavigationMenu[];
}

export default function WebsiteContentManager() {
  const [tabValue, setTabValue] = useState(0);
  const [homepageData, setHomepageData] = useState<HomepageData | null>(null);
  const [navigationData, setNavigationData] = useState<NavigationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [sectionDialogOpen, setSectionDialogOpen] = useState(false);
  const [menuItemDialogOpen, setMenuItemDialogOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<ContentSection | null>(null);
  const [selectedMenu, setSelectedMenu] = useState<NavigationMenu | null>(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState<NavigationItem | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  // Form for homepage editing
  const homepageForm = useForm<HomepageData>({
    defaultValues: {
      hero: {
        title: '',
        subtitle: '',
        backgroundImage: '',
        ctaText: '',
        ctaLink: ''
      },
      sections: [],
      seo: {
        title: '',
        description: '',
        keywords: [],
        image: ''
      }
    }
  });

  const { fields: sectionFields, append: appendSection, remove: removeSection, move: moveSection } = useFieldArray({
    control: homepageForm.control,
    name: 'sections'
  });

  // Form for navigation editing
  const navigationForm = useForm<NavigationData>({
    defaultValues: {
      menus: []
    }
  });

  useEffect(() => {
    fetchWebsiteContent();
  }, []);

  const fetchWebsiteContent = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/website-content?type=all');
      const data = await response.json();
      
      if (data.homepage) {
        setHomepageData(data.homepage);
        homepageForm.reset(data.homepage);
      }
      
      if (data.navigation) {
        setNavigationData(data.navigation);
        navigationForm.reset(data.navigation);
      }
    } catch (error) {
      console.error('Failed to fetch website content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveHomepage = async (data: HomepageData) => {
    try {
      setSaveLoading(true);
      const response = await fetch('/api/website-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'homepage', data })
      });
      
      if (response.ok) {
        setHomepageData(data);
        // Show success message
      }
    } catch (error) {
      console.error('Failed to save homepage:', error);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleSaveNavigation = async (data: NavigationData) => {
    try {
      setSaveLoading(true);
      const response = await fetch('/api/website-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'navigation', data })
      });
      
      if (response.ok) {
        setNavigationData(data);
        // Show success message
      }
    } catch (error) {
      console.error('Failed to save navigation:', error);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAddSection = (type: ContentSection['type']) => {
    const newSection: ContentSection = {
      id: `section-${Date.now()}`,
      type,
      title: `New ${type} Section`,
      content: getDefaultSectionContent(type),
      order: sectionFields.length,
      isVisible: true
    };
    
    appendSection(newSection);
    setSectionDialogOpen(false);
  };

  const getDefaultSectionContent = (type: ContentSection['type']) => {
    switch (type) {
      case 'features':
        return {
          features: [
            { icon: 'eva:star-outline', title: 'Feature 1', description: 'Feature description' },
            { icon: 'eva:heart-outline', title: 'Feature 2', description: 'Feature description' },
            { icon: 'eva:shield-check', title: 'Feature 3', description: 'Feature description' }
          ]
        };
      case 'products':
        return { productIds: [], displayType: 'grid', limit: 8 };
      case 'testimonials':
        return {
          testimonials: [
            { name: 'John Doe', text: 'Great service!', rating: 5, image: '' },
            { name: 'Jane Smith', text: 'Excellent products!', rating: 5, image: '' }
          ]
        };
      case 'newsletter':
        return { title: 'Subscribe to our newsletter', description: 'Get the latest updates and offers' };
      default:
        return {};
    }
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    moveSection(result.source.index, result.destination.index);
  };

  const SectionEditor = ({ section, index }: { section: ContentSection; index: number }) => (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <IconButton size="small">
              <Iconify icon="eva:menu-outline" />
            </IconButton>
            <Typography variant="h6">{section.title || `${section.type} Section`}</Typography>
            <Chip label={section.type} size="small" variant="outlined" />
          </Stack>
          
          <Stack direction="row" spacing={1}>
            <FormControlLabel
              control={
                <Switch
                  checked={section.isVisible}
                  onChange={(e) => {
                    const sections = homepageForm.getValues('sections');
                    sections[index].isVisible = e.target.checked;
                    homepageForm.setValue('sections', sections);
                  }}
                />
              }
              label="Visible"
              labelPlacement="start"
            />
            <IconButton
              size="small"
              onClick={() => {
                setSelectedSection(section);
                setSectionDialogOpen(true);
              }}
            >
              <Iconify icon="eva:edit-outline" />
            </IconButton>
            <IconButton size="small" onClick={() => removeSection(index)} color="error">
              <Iconify icon="eva:trash-2-outline" />
            </IconButton>
          </Stack>
        </Stack>

        {/* Section Content Preview */}
        {section.type === 'features' && (
          <Grid container spacing={2}>
            {section.content.features?.map((feature: any, idx: number) => (
              <Grid item xs={12} md={4} key={idx}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Iconify icon={feature.icon} width={40} height={40} sx={{ mb: 1 }} />
                  <Typography variant="subtitle2" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}

        {section.type === 'products' && (
          <Alert severity="info">
            Products section will display {section.content.limit || 8} products in {section.content.displayType || 'grid'} format
          </Alert>
        )}

        {section.type === 'testimonials' && (
          <Grid container spacing={2}>
            {section.content.testimonials?.map((testimonial: any, idx: number) => (
              <Grid item xs={12} md={6} key={idx}>
                <Paper sx={{ p: 2 }}>
                  <Stack direction="row" spacing={2}>
                    <Avatar src={testimonial.image}>{testimonial.name[0]}</Avatar>
                    <Box>
                      <Typography variant="subtitle2">{testimonial.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        &ldquo;{testimonial.text}&rdquo;
                      </Typography>
                      <Stack direction="row" spacing={0.5} sx={{ mt: 1 }}>
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <Iconify key={i} icon="eva:star-fill" color="warning.main" width={16} />
                        ))}
                      </Stack>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </CardContent>
    </Card>
  );

  const NavigationMenuEditor = ({ menu }: { menu: NavigationMenu }) => (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Typography variant="h6">{menu.name}</Typography>
          <Stack direction="row" spacing={1}>
            <Chip label={menu.type} size="small" />
            <Button
              size="small"
              startIcon={<Iconify icon="eva:plus-outline" />}
              onClick={() => {
                setSelectedMenu(menu);
                setSelectedMenuItem(null);
                setMenuItemDialogOpen(true);
              }}
            >
              Add Item
            </Button>
          </Stack>
        </Stack>

        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Label</TableCell>
                <TableCell>URL</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {menu.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      {item.icon && <Iconify icon={item.icon} width={16} />}
                      <span>{item.label}</span>
                    </Stack>
                  </TableCell>
                  <TableCell>{item.url}</TableCell>
                  <TableCell>
                    <Chip label={item.type} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={item.isVisible ? 'Visible' : 'Hidden'} 
                      color={item.isVisible ? 'success' : 'default'}
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <IconButton 
                        size="small"
                        onClick={() => {
                          setSelectedMenu(menu);
                          setSelectedMenuItem(item);
                          setMenuItemDialogOpen(true);
                        }}
                      >
                        <Iconify icon="eva:edit-outline" />
                      </IconButton>
                      <IconButton size="small" color="error">
                        <Iconify icon="eva:trash-2-outline" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      {/* Header */}
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        alignItems={{ xs: 'start', md: 'center' }}
        justifyContent="space-between"
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h4" gutterBottom>
            Website Content Manager
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage homepage content and navigation menus
          </Typography>
        </Box>

        <Stack direction="row" spacing={2}>
          <Button
            variant={previewMode ? 'contained' : 'outlined'}
            startIcon={<Iconify icon="eva:eye-outline" />}
            onClick={() => setPreviewMode(!previewMode)}
          >
            Preview Mode
          </Button>
          <LoadingButton
            variant="contained"
            startIcon={<Iconify icon="eva:save-outline" />}
            loading={saveLoading}
            onClick={() => {
              if (tabValue === 0) {
                homepageForm.handleSubmit(handleSaveHomepage)();
              } else {
                navigationForm.handleSubmit(handleSaveNavigation)();
              }
            }}
          >
            Save Changes
          </LoadingButton>
        </Stack>
      </Stack>

      {/* Main Content */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab
              label={
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Iconify icon="eva:home-outline" />
                  <span>Homepage</span>
                </Stack>
              }
            />
            <Tab
              label={
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Iconify icon="eva:menu-outline" />
                  <span>Navigation</span>
                </Stack>
              }
            />
            <Tab
              label={
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Iconify icon="eva:settings-outline" />
                  <span>SEO Settings</span>
                </Stack>
              }
            />
          </Tabs>
        </Box>

        {/* Homepage Tab */}
        <TabPanel value={tabValue} index={0}>
          <form onSubmit={homepageForm.handleSubmit(handleSaveHomepage)}>
            <Grid container spacing={3}>
              {/* Hero Section */}
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Hero Section
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Controller
                          name="hero.title"
                          control={homepageForm.control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Hero Title"
                              placeholder="Welcome to Our Store"
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Controller
                          name="hero.subtitle"
                          control={homepageForm.control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Hero Subtitle"
                              placeholder="Discover amazing products"
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Controller
                          name="hero.ctaText"
                          control={homepageForm.control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="CTA Button Text"
                              placeholder="Shop Now"
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Controller
                          name="hero.ctaLink"
                          control={homepageForm.control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="CTA Button Link"
                              placeholder="/products"
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Content Sections */}
              <Grid item xs={12}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                  <Typography variant="h6">Content Sections</Typography>
                  <Button
                    variant="outlined"
                    startIcon={<Iconify icon="eva:plus-outline" />}
                    onClick={() => setSectionDialogOpen(true)}
                  >
                    Add Section
                  </Button>
                </Stack>

                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="sections">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef}>
                        {sectionFields.map((section, index) => (
                          <Draggable key={section.id} draggableId={section.id} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <SectionEditor section={section} index={index} />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </Grid>
            </Grid>
          </form>
        </TabPanel>

        {/* Navigation Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
              <Typography variant="h6">Navigation Menus</Typography>
              <Button
                variant="outlined"
                startIcon={<Iconify icon="eva:plus-outline" />}
              >
                Add Menu
              </Button>
            </Stack>

            {navigationData?.menus.map((menu) => (
              <NavigationMenuEditor key={menu.id} menu={menu} />
            ))}
          </Box>
        </TabPanel>

        {/* SEO Settings Tab */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Controller
                name="seo.title"
                control={homepageForm.control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="SEO Title"
                    placeholder="Home - Your Online Store"
                    helperText="Recommended: 50-60 characters"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="seo.image"
                control={homepageForm.control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Social Media Image"
                    placeholder="https://example.com/image.jpg"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="seo.description"
                control={homepageForm.control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    multiline
                    rows={3}
                    label="SEO Description"
                    placeholder="Shop the best products at amazing prices..."
                    helperText="Recommended: 150-160 characters"
                  />
                )}
              />
            </Grid>
          </Grid>
        </TabPanel>
      </Card>

      {/* Add Section Dialog */}
      <Dialog open={sectionDialogOpen} onClose={() => setSectionDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Content Section</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {[
              { type: 'features' as const, icon: 'eva:star-outline', title: 'Features', description: 'Highlight key features or benefits' },
              { type: 'products' as const, icon: 'eva:cube-outline', title: 'Products', description: 'Display featured or latest products' },
              { type: 'testimonials' as const, icon: 'eva:message-circle-outline', title: 'Testimonials', description: 'Customer reviews and feedback' },
              { type: 'newsletter' as const, icon: 'eva:email-outline', title: 'Newsletter', description: 'Email subscription form' }
            ].map((option) => (
              <Grid item xs={12} md={6} key={option.type}>
                <Card 
                  sx={{ 
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'action.hover' }
                  }}
                  onClick={() => handleAddSection(option.type)}
                >
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Iconify icon={option.icon} width={40} height={40} sx={{ mb: 1 }} />
                    <Typography variant="subtitle1" gutterBottom>
                      {option.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {option.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSectionDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Menu Item Dialog */}
      <Dialog open={menuItemDialogOpen} onClose={() => setMenuItemDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedMenuItem ? 'Edit Menu Item' : 'Add Menu Item'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Label"
                placeholder="Home"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="URL"
                placeholder="/"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select label="Type" defaultValue="internal">
                  <MenuItem value="internal">Internal Link</MenuItem>
                  <MenuItem value="external">External Link</MenuItem>
                  <MenuItem value="category">Category Page</MenuItem>
                  <MenuItem value="page">Custom Page</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Target</InputLabel>
                <Select label="Target" defaultValue="_self">
                  <MenuItem value="_self">Same Window</MenuItem>
                  <MenuItem value="_blank">New Window</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Visible in menu"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMenuItemDialogOpen(false)}>Cancel</Button>
          <Button variant="contained">
            {selectedMenuItem ? 'Update' : 'Add'} Item
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
