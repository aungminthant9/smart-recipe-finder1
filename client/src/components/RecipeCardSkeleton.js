import React from 'react';
import {
  Card,
  CardContent,
  Skeleton,
  Box
} from '@mui/material';

const RecipeCardSkeleton = () => {
  return (
    <Card sx={{ height: '100%' }}>
      <Skeleton variant="rectangular" height={200} />
      <CardContent>
        <Skeleton variant="text" height={32} sx={{ mb: 1 }} />
        <Skeleton variant="text" height={20} sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 1 }} />
          <Skeleton variant="rectangular" width={100} height={24} sx={{ borderRadius: 1 }} />
        </Box>
        <Skeleton variant="text" height={16} />
        <Skeleton variant="text" height={16} />
        <Box sx={{ mt: 2 }}>
          <Skeleton variant="rectangular" height={36} sx={{ borderRadius: 1 }} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default RecipeCardSkeleton;