import { Box, Typography } from '@mui/material';
import AuthGuard from 'components/templates/AuthGuard';
import { __ } from 'helpers/i18n';

function Setting() {

    return <AuthGuard
        title={__('Setting')}
        header={
            <>
                <Typography
                    component="h2"
                    gutterBottom
                    variant="overline"
                >
                    {__('Setting')}
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                    }}
                >
                    <Typography
                        component="h1"
                        gutterBottom
                        variant="h3"
                    >
                        Setting
                    </Typography>
                </Box>
            </>
        }
    >

        Settings
    </AuthGuard>
}

export default Setting