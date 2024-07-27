import { Box, Card, CardContent, Typography } from '@mui/material'

function SectionEarnBit() {
  return (<Box
    sx={{
      mt: 12,
      position: 'relative',
    }}
  >
    <Box
      sx={{
        backgroundColor: 'primary.main',
        position: 'absolute',
        zIndex: 0,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.1,
      }}
    />
    <Card
      sx={{
        zIndex: 1,
        position: 'relative',
        backgroundColor: 'transparent',
      }}
    >
      <CardContent
      >
        <Typography variant='h3' sx={{ fontWeight: 'bold' }}>Cơ hội kiếm được số lượng bit x2 mỗi ngày</Typography>
      </CardContent>
    </Card>
  </Box>
  )
}

export default SectionEarnBit