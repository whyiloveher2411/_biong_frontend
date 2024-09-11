import { Box, Skeleton } from '@mui/material';

function AuthorizeSkeleton() {
    return (<Box sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        width: '100%',
        padding: 3,
    }}>
        <Box sx={(theme) => ({
            maxWidth: '100%',
            width: 500,
            textAlign: 'center',
            backgroundColor: (theme) => theme.palette.background.default,
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
        })}>
            <Skeleton variant="text" width="80%" height={40} sx={{ mb: 4, mx: 'auto' }} />

            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 4 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Skeleton variant="text" width={80} height={24} sx={{ mb: 1 }} />
                    <Skeleton variant="circular" width={52} height={52} />
                </Box>
                <Box sx={{ mx: 2, display: 'flex', alignItems: 'center', mt: 4 }}>
                    <Skeleton variant="circular" width={24} height={24} />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Skeleton variant="text" width={80} height={24} sx={{ mb: 1 }} />
                    <Skeleton variant="circular" width={52} height={52} />
                </Box>
            </Box>

            <Skeleton variant="text" width="90%" height={20} sx={{ mb: 1, mt: 4, mx: 'auto' }} />

            <Box sx={(theme) => ({
                backgroundColor: theme.palette.background.paper,
                borderRadius: theme.shape.borderRadius,
                padding: theme.spacing(2)
            })}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <Skeleton variant="circular" width={24} height={24} sx={{ mr: 2, mt: 1 }} />
                    <Box sx={{ flex: 1 }}>
                        <Skeleton variant="text" width="60%" height={24} sx={{ mb: 1 }} />
                        <Skeleton variant="text" width="80%" height={20} />
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <Skeleton variant="circular" width={24} height={24} sx={{ mr: 2, mt: 1 }} />
                    <Box sx={{ flex: 1 }}>
                        <Skeleton variant="text" width="60%" height={24} sx={{ mb: 1 }} />
                        <Skeleton variant="text" width="80%" height={20} />
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <Skeleton variant="circular" width={24} height={24} sx={{ mr: 2, mt: 1 }} />
                    <Box sx={{ flex: 1 }}>
                        <Skeleton variant="text" width="60%" height={24} sx={{ mb: 1 }} />
                        <Skeleton variant="text" width="80%" height={20} />
                    </Box>
                </Box>
            </Box>
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
                <Skeleton variant="rectangular" width={'50%'} height={36} sx={{ borderRadius: 1 }} />
                <Skeleton variant="rectangular" width={'50%'} height={36} sx={{ borderRadius: 1 }} />
            </Box>
        </Box>
    </Box>)
}

export default AuthorizeSkeleton
