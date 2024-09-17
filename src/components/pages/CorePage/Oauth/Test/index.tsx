import { Box, Button, Typography } from '@mui/material';
import ImageLazyLoading from 'components/atoms/ImageLazyLoading';
import React from 'react'
import { useSearchParams } from 'react-router-dom';
import accountService from 'services/accountService';

function Test() {

    const [searchParams] = useSearchParams();

    const [user, setUser] = React.useState<{
        id: number;
        full_name: string;
        email: string;
        avatar: string;
    } | null>(null);

    const handleTest = async () => {
        // Mở cửa sổ mới để xác thực OAuth
        const clientId = '195456576238734';
        const redirectUri = encodeURIComponent('http://localhost:3033/oauth/test');
        const scope = 'profile';
        const responseType = 'code';
        
        const oauthUrl = `http://localhost:3033/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`;
        
        window.open(oauthUrl, 'OAuth', 'width=600,height=600');
    }

    React.useEffect(() => {
        const code = searchParams.get('code');
        const testCode = async () => {
            if (code) {
                const result = await accountService.testCode(code);

                if (result.error_message) {
                    window.showMessage(result.error_message, 'error');
                }

                if (result.access_token) {

                    const info = await accountService.getInfoByAccessToken('195456576238734', '8my)SU6yV+9hmbUxDc^cf_c2bSj#7j', result.access_token);

                    if (info.error_message) {
                        window.showMessage(info.error_message, 'error');
                    }

                    if (info.data) {
                        setUser(info.data);
                    }
                }



            }
        }
        testCode();
    }, [searchParams]);

    React.useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data.code) {
                console.log(event.data.code);
            }
        };

        window.addEventListener('message', handleMessage);

        return () => {
            window.removeEventListener('message', handleMessage);
        }
    }, []);

    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
        }}>
            <Button 
                onClick={handleTest}
            >
                Test
            </Button>
            {user && (
                <Box sx={(theme) => ({
                    backgroundColor: (theme) => theme.palette.background.paper,
                    borderRadius: '16px',
                    padding: '24px',
                    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                    textAlign: 'center',
                    maxWidth: '400px',
                    width: '100%'
                })}>
                    <ImageLazyLoading 
                        src={user.avatar} 
                        alt="avatar" 
                        sx={{
                            width: '120px',
                            height: '120px',
                            borderRadius: '50%',
                            margin: '0 auto 16px'
                        }}
                    />
                    <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>{user.full_name}</Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary' }}>{user.email}</Typography>
                </Box>
            )}
        </Box>
    )
}

export default Test
