"use client";

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  IconButton,
  Button,
  Grid,
  Divider,
  Chip,
  Stack,
  Avatar,
} from '@mui/material';
import { useFieldArray, Control, UseFormSetValue } from 'react-hook-form';
import { Iconify } from '@storely/shared/components/iconify';

// ----------------------------------------------------------------------

interface ProductVariant {
  id?: string;
  name: string;
  value: string;
  sku?: string;
  price?: number;
  comparePrice?: number;
  weight?: number;
  image?: string;
  position: number;
}

interface ProductVariantFormProps {
  control: Control<any>;
  name: string;
  setValue: (name: string, value: any) => void;
}

export default function ProductVariantForm({ control, name, setValue }: ProductVariantFormProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  const handleAddVariant = () => {
    append({
      name: '',
      value: '',
      sku: '',
      price: 0,
      comparePrice: 0,
      weight: 0,
      image: '',
      position: fields.length,
    });
  };

  const variantTypes = [
    { label: 'Color', icon: 'mdi:palette' },
    { label: 'Size', icon: 'mdi:resize' },
    { label: 'Material', icon: 'mdi:texture-box' },
    { label: 'Style', icon: 'mdi:style' },
    { label: 'Weight', icon: 'mdi:weight' },
  ];

  return (
    <Card>
      <CardContent>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
          <Typography variant="h6">Product Variants</Typography>
          <Button
            variant="outlined"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={handleAddVariant}
          >
            Add Variant
          </Button>
        </Stack>

        {fields.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 4,
              color: 'text.secondary',
            }}
          >
            <Iconify icon="eva:cube-outline" sx={{ width: 64, height: 64, mb: 2 }} />
            <Typography variant="body1">No variants added yet</Typography>
            <Typography variant="body2">
              Add variants to offer different options like color, size, or material
            </Typography>
          </Box>
        ) : (
          <Stack spacing={3}>
            {fields.map((field, index) => (
              <Card key={field.id} variant="outlined">
                <CardContent>
                  <Stack direction="row" alignItems="center" justifyContent="between" sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
                      Variant #{index + 1}
                    </Typography>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => remove(index)}
                    >
                      <Iconify icon="eva:trash-2-outline" />
                    </IconButton>
                  </Stack>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Variant Type"
                        placeholder="e.g., Color, Size, Material"
                        {...control.register(`${name}.${index}.name`)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Variant Value"
                        placeholder="e.g., Red, Large, Wood"
                        {...control.register(`${name}.${index}.value`)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="SKU (Optional)"
                        placeholder="Unique identifier"
                        {...control.register(`${name}.${index}.sku`)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Price Adjustment"
                        placeholder="0.00"
                        InputProps={{
                          startAdornment: '$',
                        }}
                        {...control.register(`${name}.${index}.price`, { valueAsNumber: true })}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Compare Price"
                        placeholder="0.00"
                        InputProps={{
                          startAdornment: '$',
                        }}
                        {...control.register(`${name}.${index}.comparePrice`, { valueAsNumber: true })}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Weight (kg)"
                        placeholder="0.0"
                        {...control.register(`${name}.${index}.weight`, { valueAsNumber: true })}
                      />
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 2 }} />

                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Quick Variant Types
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {variantTypes.map((type) => (
                        <Chip
                          key={type.label}
                          label={type.label}
                          size="small"
                          variant="outlined"
                          avatar={<Avatar><Iconify icon={type.icon} /></Avatar>}
                          onClick={() => {
                            // Auto-fill variant name
                            setValue(`${name}.${index}.name`, type.label);
                          }}
                          sx={{ cursor: 'pointer' }}
                        />
                      ))}
                    </Stack>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
