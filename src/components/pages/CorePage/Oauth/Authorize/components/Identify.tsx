import { ArrowForward, EmailOutlined, Person2Outlined } from '@mui/icons-material';
import { Box, Button, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { ImageProps } from 'components/atoms/Avatar';
import ImageLazyLoading from 'components/atoms/ImageLazyLoading';
import { getImageUrl } from 'helpers/image';
import { useSearchParams } from 'react-router-dom';
import accountService from 'services/accountService';
import { useUser } from 'store/user/user.reducers';

function Identify({ application }: {
    application: {
        logo?: ImageProps,
        title?: string,
    } | null
}) {

    const user = useUser();

    // get query params (client_id, redirect_uri, response_type, scope) from url
    const [searchParams] = useSearchParams();

    const handleCancel = () => {
        const redirectUri = searchParams.get('redirect_uri');
        if (redirectUri) {
            const cancelCode = 'user_canceled';
            const redirectUrl = new URL(redirectUri);
            redirectUrl.searchParams.append('error', cancelCode);
            window.location.href = redirectUrl.toString();
        } else {
            window.location.href = '/';
        }
    }

    const handleAuthorize = async () => {

        const client_id = searchParams.get('client_id');
        const redirect_uri = searchParams.get('redirect_uri');
        const response_type = searchParams.get('response_type');
        const scope = searchParams.get('scope');


        if (client_id && redirect_uri && response_type && scope) {
            const result = await accountService.authorize(client_id, redirect_uri, response_type, scope);
            if (result.error_code === 'application_not_found') {
                window.showMessage('Ứng dụng không tồn tại', 'error');
            } else if (result.error_code === 'redirect_uri_not_match') {
                window.showMessage('Địa chỉ URL không khớp', 'error');
            } else if (result.error) {
                window.showMessage('Đã có lỗi xảy ra', 'error');
            } else if (result.redirect_uri) {
                window.location.href = result.redirect_uri;
            }
        }
    }

    return (
        <Box sx={(theme) => ({
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            width: '100%',
            padding: 3,
        })}>
            <Box sx={(theme) => ({
                maxWidth: '100%',
                width: 500,
                textAlign: 'center',
                backgroundColor: theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(18, 18, 18, 0.9)',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: theme.shadows[4],
            })}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 4 }}>
                    Đăng nhập bằng SpaceDev.vn
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 4 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>SpaceDev</Typography>
                        <ImageLazyLoading
                            src="/images/LOGO-image-full.svg"
                            alt="SpaceDev Logo"
                            sx={{ width: 52, height: 52 }}
                        />
                    </Box>
                    <Box sx={{ mx: 2, display: 'flex', alignItems: 'center', mt: 4 }}>
                        <ArrowForward color="primary" />
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>{application?.title}</Typography>
                        <ImageLazyLoading
                            src={getImageUrl(application?.logo, '/images/LOGO-image-full.svg')}
                            placeholderSrc='/images/user-default.svg'
                            alt="Space English Logo"
                            sx={{ width: 52, height: 52 }}
                        />
                    </Box>
                </Box>
                <Typography variant="body1" paragraph sx={{ fontSize: '14px', color: 'text.secondary', mb: 1, mt: 4 }}>
                    Ứng dụng yêu cầu quyền truy cập vào các thông tin sau:
                </Typography>
                <List sx={(theme) => ({
                    backgroundColor: theme.palette.mode === 'light' ? 'rgba(245, 245, 245, 0.8)' : 'rgba(66, 66, 66, 0.8)',
                    borderRadius: '8px',
                    padding: '16px'
                })}>
                    <ListItem sx={{ alignItems: 'flex-start' }}>
                        <ListItemIcon sx={{ mt: 1, mr: 1 }}>
                            <ImageLazyLoading
                                src={getImageUrl(user.avatar, '/images/user-default.svg')}
                                placeholderSrc='/images/user-default.svg'
                                name={user.full_name}
                                sx={{
                                    '& .blur': {
                                        filter: 'unset !important',
                                    },
                                    width: "24px",
                                    height: "24px",
                                    borderRadius: '50%',
                                }}
                            />
                        </ListItemIcon>
                        <ListItemText
                            primary="Ảnh đại diện của bạn"
                            primaryTypographyProps={{ fontWeight: 'bold' }}
                            secondary={
                                <>
                                    Hình ảnh đại diện được sử dụng trong hồ sơ của bạn
                                </>
                            }
                        />
                    </ListItem>
                    <ListItem sx={{ mb: 1, alignItems: 'flex-start' }}>
                        <ListItemIcon sx={{ mt: 1, mr: 1 }}>
                            <Person2Outlined color="primary" />
                        </ListItemIcon>
                        <ListItemText
                            primary={
                                <Typography variant="body1" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    Tên của bạn - <Box component="span" sx={{ color: 'primary.main', fontWeight: 600, fontSize: 14 }}>{user.full_name}</Box>
                                </Typography>
                            }
                            secondary='Tên hiển thị của bạn trên hệ thống'
                        />
                    </ListItem>
                    <ListItem sx={{ mb: 1, alignItems: 'flex-start' }}>
                        <ListItemIcon sx={{ mt: 1, mr: 1 }}>
                            <EmailOutlined color="primary" />
                        </ListItemIcon>
                        <ListItemText
                            primary={
                                <Typography variant="body1" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    Email của bạn - <Box component="span" sx={{ color: 'primary.main', fontWeight: 600, fontSize: 14 }}>{user.email}</Box>
                                </Typography>
                            }
                            secondary='Địa chỉ email được sử dụng để liên hệ và xác thực tài khoản'
                        />
                    </ListItem>
                </List>
                <Typography variant="body2" sx={{ mt: 2, mb: 2, color: 'text.secondary' }}>
                    Trước khi sử dụng SpaceEnglish, bạn có thể xem chính sách quyền riêng tư và điều khoản dịch vụ của ứng dụng này.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    <Button variant="contained" onClick={handleCancel} color='inherit' fullWidth sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                        Từ chối
                    </Button>
                    <Button variant="contained" onClick={handleAuthorize} color="primary" fullWidth sx={{ fontWeight: 'bold', }}>
                        Đồng ý
                    </Button>
                </Box>
            </Box>
        </Box>
    )
}

export default Identify
