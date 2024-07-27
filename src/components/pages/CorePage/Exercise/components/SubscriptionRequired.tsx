import { Box, Button, Typography } from '@mui/material'
import React from 'react'
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import { Link } from 'react-router-dom';

function SubscriptionRequired({ titleType, position = 'absolute' }: { titleType: string, position?: 'absolute' | 'inherit' }) {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        pt: 4,
        pb: 4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: position,
        top: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      <Box
        sx={{
          pointerEvents: 'all',
          maxWidth: 400,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <LockRoundedIcon sx={{ fontSize: 64 }} color="warning" />
        <Typography variant='h2' sx={{ fontSize: 22, fontWeight: 'bold', mt: 2 }}>Đăng ký để mở khóa.</Typography>
        <Typography sx={{ mt: 1 }} align="center">Cảm ơn bạn đã sử dụng Spacedev.vn! Để xem {titleType} này, bạn phải đăng ký trả phí.</Typography>
        <Button variant='contained' sx={{ mt: 2 }} component={Link} to="/subscribe">Đăng ký</Button>
      </Box>
    </Box>
  )
}

export default SubscriptionRequired