import { Box, Typography } from '@mui/material'
import ImageLazyLoading from 'components/atoms/ImageLazyLoading';
import React from 'react'

function PageError({ errorCode }: { errorCode: 'application_not_found' | 'redirect_uri_not_match' }) {
    return (
        <Box sx={{
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
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
                    <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main', letterSpacing: 1 }}>
                        SpaceDev
                    </Typography>
                    <ImageLazyLoading
                        src="/images/LOGO-image-full.svg"
                        alt="SpaceDev Logo"
                        sx={{ 
                            width: 80, 
                            height: 80,
                            filter: 'drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.15))',
                            transition: 'transform 0.3s ease-in-out',
                            '&:hover': {
                                transform: 'scale(1.05)'
                            }
                        }}
                    />
                </Box>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'error.main', mb: 4 }}>
                    {errorCode === 'application_not_found' 
                        ? 'Rất tiếc, ứng dụng không tồn tại' 
                        : 'Ôi không, địa chỉ URL không khớp'}
                </Typography>

                <Box sx={(theme) => ({
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: theme.shape.borderRadius,
                    padding: theme.spacing(2),
                    mb: 2
                })}>
                    <Typography variant="body1" color="text.secondary">
                        {errorCode === 'application_not_found'
                            ? 'Ứng dụng không tồn tại trong hệ thống. Vui lòng kiểm tra lại thông tin và liên kết bạn đang sử dụng.'
                            : 'Địa chỉ URL chuyển hướng không khớp với thông tin đã đăng ký. Có thể do cấu hình hoặc thiết lập ứng dụng đã thay đổi.'}
                    </Typography>
                </Box>

                <Typography variant="body2" color="text.secondary">
                    Vui lòng kiểm tra lại thông tin và thử lại. Nếu vấn đề vẫn tiếp tục, hãy liên hệ với quản trị viên ứng dụng để được hỗ trợ.
                </Typography>
            </Box>
        </Box>
    )
}

export default PageError;
