import { Box, Card, CardContent, Typography } from '@mui/material'
import { __ } from 'helpers/i18n'
import React from 'react'
import accountService, { ConnectionProps } from 'services/accountService'
import Apple from './SocialNetwork/Apple'
import Facebook from './SocialNetwork/Facebook'
import Github from './SocialNetwork/Github'
import Google from './SocialNetwork/Google'
import LinkedIn from './SocialNetwork/LinkedIn'
import Microsoft from './SocialNetwork/Microsoft'
import Twitter from './SocialNetwork/Twitter'

function SocialNetwork() {

    const [connections, setConnections] = React.useState<{
        [key: string]: ConnectionProps
    } | null>(null);

    const onLoadData = async (callback?: () => void) => {
        let connectionsData = await accountService.getConnectSocial();
        setConnections(connectionsData);

        if (callback) callback();
    }

    React.useEffect(() => {
        onLoadData();
    }, []);

    return (
        <Card>
            <CardContent
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                }}
            >
                <Box>
                    <Typography variant="h5" component="div">
                        {__('Social Network')}
                    </Typography>
                    <Typography>
                        {__('Khi liên kết với mạng xã hội, bạn có thể sử dụng chức năng đăng nhập bằng tài khoản mạng xã hội một cách thuận tiện hơn.')}
                    </Typography>
                </Box>
                <Google connections={connections} onLoadData={onLoadData} />
                <Apple connections={connections} onLoadData={onLoadData} />
                <Facebook connections={connections} onLoadData={onLoadData} />
                <Twitter connections={connections} onLoadData={onLoadData} />
                <LinkedIn connections={connections} onLoadData={onLoadData} />
                <Github connections={connections} onLoadData={onLoadData} />
                <Microsoft connections={connections} onLoadData={onLoadData} />
            </CardContent>
        </Card>
    )
}

export default SocialNetwork