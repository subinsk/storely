import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography,
  Alert,
  Paper,
} from '@mui/material';
import { EmailTemplate, EmailTemplateType } from '@/types/email';
import { useEmailTemplates, createEmailTemplate, updateEmailTemplate } from '@/hooks/useEmailTemplates';

interface EmailEditorProps {
  template?: EmailTemplate;
  onSave: (template: EmailTemplate) => void;
  onCancel: () => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`email-tabpanel-${index}`}
      aria-labelledby={`email-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const EMAIL_TEMPLATE_TYPES = [
  { value: EmailTemplateType.WELCOME, label: 'Welcome' },
  { value: EmailTemplateType.ORDER_CONFIRMATION, label: 'Order Confirmation' },
  { value: EmailTemplateType.ORDER_SHIPPED, label: 'Order Shipped' },
  { value: EmailTemplateType.ORDER_DELIVERED, label: 'Order Delivered' },
  { value: EmailTemplateType.PASSWORD_RESET, label: 'Password Reset' },
  { value: EmailTemplateType.ACCOUNT_VERIFICATION, label: 'Account Verification' },
  { value: EmailTemplateType.NEWSLETTER, label: 'Newsletter' },
  { value: EmailTemplateType.ABANDONED_CART, label: 'Abandoned Cart' },
  { value: EmailTemplateType.PRODUCT_BACK_IN_STOCK, label: 'Back in Stock' },
  { value: EmailTemplateType.RECEIPT, label: 'Receipt' },
  { value: EmailTemplateType.INVOICE, label: 'Invoice' },
  { value: EmailTemplateType.CUSTOM, label: 'Custom' },
];

export default function EmailEditor({ template, onSave, onCancel }: EmailEditorProps) {
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    type: EmailTemplateType.CUSTOM,
    content: '',
    htmlContent: '',
    variables: {},
    isActive: true,
  });

  const [variables, setVariables] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (template) {
      setFormData({
        name: template.name,
        subject: template.subject,
        type: template.type,
        content: template.content,
        htmlContent: template.htmlContent || '',
        variables: template.variables || {},
        isActive: template.isActive,
      });
      setVariables(JSON.stringify(template.variables || {}, null, 2));
    }
  }, [template]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      let parsedVariables = {};
      if (variables.trim()) {
        try {
          parsedVariables = JSON.parse(variables);
        } catch (err) {
          throw new Error('Invalid JSON format for variables');
        }
      }

      const templateData = {
        ...formData,
        variables: parsedVariables,
      };

      let result;
      if (template) {
        result = await updateEmailTemplate(template.id, templateData);
      } else {
        result = await createEmailTemplate(templateData);
      }

      onSave(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVariableInsertion = (variable: string) => {
    const textarea = document.getElementById('content-textarea') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      const before = text.substring(0, start);
      const after = text.substring(end);
      const newText = before + `{{${variable}}}` + after;
      
      setFormData(prev => ({ ...prev, content: newText }));
      
      // Restore cursor position
      setTimeout(() => {
        textarea.focus();
        textarea.selectionStart = start + variable.length + 4;
        textarea.selectionEnd = start + variable.length + 4;
      }, 0);
    }
  };

  const commonVariables = [
    'organizationName',
    'userName',
    'userEmail',
    'orderNumber',
    'orderTotal',
    'itemCount',
    'resetLink',
    'productName',
    'productPrice',
  ];

  return (
    <Card sx={{ maxWidth: '4xl', mx: 'auto' }}>
      <CardHeader>
        <Typography variant="h6" component="h2">
          {template ? 'Edit Email Template' : 'Create Email Template'}
        </Typography>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {error && (
              <Alert severity="error">{error}</Alert>
            )}

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <TextField
                fullWidth
                label="Template Name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
                disabled={template?.isSystem}
              />

              <FormControl fullWidth disabled={template?.isSystem}>
                <InputLabel>Template Type</InputLabel>
                <Select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as EmailTemplateType }))}
                  label="Template Type"
                >
                  {EMAIL_TEMPLATE_TYPES.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            <TextField
              fullWidth
              label="Subject Line"
              value={formData.subject}
              onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
              required
              placeholder="e.g., Welcome to {{organizationName}}!"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                />
              }
              label="Active"
            />

            <Box sx={{ width: '100%' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
                  <Tab label="Text Content" />
                  <Tab label="HTML Content" />
                  <Tab label="Variables" />
                </Tabs>
              </Box>

              <TabPanel value={activeTab} index={0}>
                <Stack spacing={2}>
                  <TextField
                    fullWidth
                    multiline
                    rows={12}
                    label="Email Content (Text)"
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    required
                    placeholder="Enter your email content here. Use {{variable}} for dynamic content."
                    inputProps={{ id: 'content-textarea' }}
                  />

                  <Box>
                    <Typography variant="body2" gutterBottom>
                      Common Variables
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {commonVariables.map((variable) => (
                        <Chip
                          key={variable}
                          label={variable}
                          size="small"
                          clickable
                          onClick={() => handleVariableInsertion(variable)}
                          sx={{ mb: 1 }}
                        />
                      ))}
                    </Stack>
                  </Box>
                </Stack>
              </TabPanel>

              <TabPanel value={activeTab} index={1}>
                <TextField
                  fullWidth
                  multiline
                  rows={12}
                  label="HTML Content (Optional)"
                  value={formData.htmlContent}
                  onChange={(e) => setFormData(prev => ({ ...prev, htmlContent: e.target.value }))}
                  placeholder="Enter your HTML email content here. Use {{variable}} for dynamic content."
                />
              </TabPanel>

              <TabPanel value={activeTab} index={2}>
                <Stack spacing={2}>
                  <TextField
                    fullWidth
                    multiline
                    rows={8}
                    label="Variables (JSON)"
                    value={variables}
                    onChange={(e) => setVariables(e.target.value)}
                    placeholder={`{
  "organizationName": "string",
  "userName": "string",
  "orderNumber": "string"
}`}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Define variables that can be used in this template. Format: JSON object with variable names as keys and types as values.
                  </Typography>
                </Stack>
              </TabPanel>
            </Box>

            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button variant="outlined" onClick={onCancel}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : template ? 'Update Template' : 'Create Template'}
              </Button>
            </Stack>
          </Stack>
        </form>
      </CardContent>
    </Card>
  );
}
