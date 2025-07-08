import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Alert,
  Tooltip,
  DialogActions,
  DialogContentText,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import { EmailTemplate, EmailTemplateType } from '@/types/email';
import { useEmailTemplates, deleteEmailTemplate } from '@/hooks/useEmailTemplates';
import EmailEditor from '@/components/email/EmailEditor';

export default function EmailTemplateManager() {
  const { templates, templatesLoading, mutateTemplates } = useEmailTemplates();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  const filteredTemplates = templates.filter((template: EmailTemplate) =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setShowEditor(true);
  };

  const handleCreate = () => {
    setSelectedTemplate(null);
    setShowEditor(true);
  };

  const handleSave = (template: EmailTemplate) => {
    setShowEditor(false);
    setSelectedTemplate(null);
    mutateTemplates();
  };

  const handleDeleteClick = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setShowDeleteDialog(true);
  };

  const handleDelete = async () => {
    if (!selectedTemplate) return;
    
    setDeleteLoading(selectedTemplate.id);
    try {
      await deleteEmailTemplate(selectedTemplate.id);
      mutateTemplates();
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Failed to delete template:', error);
    } finally {
      setDeleteLoading(null);
    }
  };

  const handlePreview = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setShowPreview(true);
  };

  const getTypeLabel = (type: EmailTemplateType) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getTypeColor = (type: EmailTemplateType) => {
    const colors = {
      [EmailTemplateType.WELCOME]: 'info',
      [EmailTemplateType.ORDER_CONFIRMATION]: 'success',
      [EmailTemplateType.ORDER_SHIPPED]: 'secondary',
      [EmailTemplateType.ORDER_DELIVERED]: 'success',
      [EmailTemplateType.PASSWORD_RESET]: 'error',
      [EmailTemplateType.ACCOUNT_VERIFICATION]: 'warning',
      [EmailTemplateType.NEWSLETTER]: 'info',
      [EmailTemplateType.ABANDONED_CART]: 'warning',
      [EmailTemplateType.PRODUCT_BACK_IN_STOCK]: 'info',
      [EmailTemplateType.RECEIPT]: 'default',
      [EmailTemplateType.INVOICE]: 'default',
      [EmailTemplateType.CUSTOM]: 'secondary',
    };
    return colors[type] || 'default';
  };

  if (templatesLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Email Templates
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreate}
        >
          Create Template
        </Button>
      </Box>

      <Card>
        <CardHeader>
          <Typography variant="h6">Templates</Typography>
          <Box display="flex" alignItems="center" gap={1} mt={2}>
            <SearchIcon color="action" />
            <TextField
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              sx={{ maxWidth: 400 }}
            />
          </Box>
        </CardHeader>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Subject</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>System</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTemplates.map((template: EmailTemplate) => (
                  <TableRow key={template.id}>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {template.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getTypeLabel(template.type)}
                        color={getTypeColor(template.type) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" noWrap sx={{ maxWidth: 300 }}>
                        {template.subject}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={template.isActive ? 'Active' : 'Inactive'}
                        color={template.isActive ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {template.isSystem && (
                        <Chip label="System" variant="outlined" size="small" />
                      )}
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Tooltip title="Preview">
                          <IconButton
                            size="small"
                            onClick={() => handlePreview(template)}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(template)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        {!template.isSystem && (
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteClick(template)}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Email Editor Dialog */}
      <Dialog 
        open={showEditor} 
        onClose={() => setShowEditor(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          {selectedTemplate ? 'Edit Email Template' : 'Create Email Template'}
        </DialogTitle>
        <DialogContent>
          <EmailEditor
            template={selectedTemplate || undefined}
            onSave={handleSave}
            onCancel={() => setShowEditor(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={showDeleteDialog} 
        onClose={() => setShowDeleteDialog(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the email template "{selectedTemplate?.name}"? 
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleDelete}
            color="error"
            disabled={deleteLoading === selectedTemplate?.id}
          >
            {deleteLoading === selectedTemplate?.id ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Email Preview Dialog */}
      <Dialog 
        open={showPreview} 
        onClose={() => setShowPreview(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Email Preview - {selectedTemplate?.name}</DialogTitle>
        <DialogContent>
          {selectedTemplate && (
            <Stack spacing={3}>
              <Box>
                <Typography variant="h6" gutterBottom>Subject:</Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedTemplate.subject}
                </Typography>
              </Box>
              <Box>
                <Typography variant="h6" gutterBottom>Content:</Typography>
                <Paper 
                  variant="outlined" 
                  sx={{ p: 2, maxHeight: 400, overflow: 'auto' }}
                >
                  {selectedTemplate.htmlContent ? (
                    <div dangerouslySetInnerHTML={{ __html: selectedTemplate.htmlContent }} />
                  ) : (
                    <Typography 
                      variant="body2" 
                      component="pre" 
                      sx={{ whiteSpace: 'pre-wrap', fontSize: '0.875rem' }}
                    >
                      {selectedTemplate.content}
                    </Typography>
                  )}
                </Paper>
              </Box>
              {selectedTemplate.variables && Object.keys(selectedTemplate.variables).length > 0 && (
                <Box>
                  <Typography variant="h6" gutterBottom>Variables:</Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {Object.keys(selectedTemplate.variables).map((variable) => (
                      <Chip key={variable} label={variable} size="small" />
                    ))}
                  </Stack>
                </Box>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPreview(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
