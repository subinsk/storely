const fs = require('fs');
const path = require('path');

const failingPages = [
  'dashboard/customer/segmentation/page.tsx',
  'dashboard/organizations/page.tsx',
  'dashboard/invoices/page.tsx',
  'dashboard/currency/configuration/page.tsx',
  'dashboard/order/create/page.tsx',
  'dashboard/payment/configuration/page.tsx',
  'dashboard/reports/scheduled/page.tsx',
  'dashboard/project-status/page.tsx',
  'dashboard/security/two-factor/page.tsx',
  'dashboard/settings/admin/page.tsx',
  'dashboard/reports/sales/page.tsx',
  'dashboard/security/gdpr/page.tsx',
  'dashboard/system/backup/page.tsx',
  'dashboard/reports/products/page.tsx',
  'dashboard/store/settings/page.tsx',
  'dashboard/shipping/configuration/page.tsx',
  'dashboard/tax/configuration/page.tsx',
  'dashboard/security/audit-logs/page.tsx',
  'dashboard/website/page.tsx',
  'dashboard/reports/customers/page.tsx',
  'dashboard/website/footer/page.tsx',
  'dashboard/website/pages/page.tsx'
];

const basePath = './src/app';

failingPages.forEach(page => {
  const filePath = path.join(basePath, page);
  
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    if (!content.includes('export const dynamic')) {
      // Find the position after imports or use client directive
      const lines = content.split('\n');
      let insertPos = -1;
      
      // Find the best insertion point
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // If it's a client directive, insert after it
        if (line === "'use client';" || line === '"use client";') {
          insertPos = i + 1;
          break;
        }
        
        // If it's an import line, keep track of last import
        if (line.startsWith('import ') && insertPos === -1) {
          insertPos = i + 1;
        }
      }
      
      if (insertPos === -1) insertPos = 0; // Insert at the beginning if no imports
      
      lines.splice(insertPos, 0, '', "export const dynamic = 'force-dynamic';", '');
      
      fs.writeFileSync(filePath, lines.join('\n'));
      console.log(`Added dynamic export to ${page}`);
    } else {
      console.log(`${page} already has dynamic export`);
    }
  } else {
    console.log(`File not found: ${filePath}`);
  }
});
