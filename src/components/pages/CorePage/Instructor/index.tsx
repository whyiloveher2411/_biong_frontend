import { Box } from '@mui/material'
import Divider from 'components/atoms/Divider'
import Loading from 'components/atoms/Loading'
import Page from 'components/templates/Page'
import { toCamelCase } from 'helpers/string'
import React from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { UserState, useUser } from 'store/user/user.reducers'
import MenuList from './components/MenuList'

function index() {

    const user = useUser();

    const [title, setTitle] = React.useState('...');

    const { tab, subtab1 } = useParams<{
        tab: string,
        subtab1: string,
    }>()

    React.useEffect(() => {
        const footer = document.getElementById('footer-main');
        const shareBox = document.getElementById('share-box');

        if (footer) {
            footer.style.display = 'none';
        }

        if (shareBox) {
            shareBox.style.display = 'none';
        }

        return () => {
            const footer = document.getElementById('footer-main');
            const shareBox = document.getElementById('share-box');

            if (footer) {
                footer.style.display = 'block';
            }

            if (shareBox) {
                shareBox.style.display = 'flex';
            }

        };
    }, []);

    if (user._state === UserState.unknown) {
        return <Box
            sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: 'calc( 100vh - 64px)',
            }}
        > <Loading open={true} isWarpper /></Box>
    }

    if (user._state !== UserState.identify || !user.is_teacher) {
        return <Navigate to='/' />
    }

    return (
        <Page
            title={title !== '...' ? title + ' - Instructor' : '...'}
            description='Bạn có thắc mắc hay cần báo cáo vấn đề xảy ra với sản phẩm hoặc dịch vụ của Spacedev.vn? Chúng tôi luôn sẵn sàng hỗ trợ bạn.'
            image='https://spacedev.vn/images/share-fb-540x282-2.jpg'
            maxWidth='100%'
        >
            <Box
                sx={{
                    marginBottom: -9,
                    marginLeft: -2,
                    marginRight: -2,
                }}
            >
                <Divider color='dark' />
                <Box
                    sx={{
                        display: 'flex',
                    }}
                >
                    <MenuList />
                    <Box
                        sx={(theme) => ({
                            width: '100%',
                            p: 3,
                            backgroundColor: theme.palette.mode === 'light' ? '#f0f2f5' : 'body.background',
                        })}
                    >
                        <Box sx={{
                            maxWidth: 1440,
                            margin: '0 auto',
                        }}>
                            {
                                (() => {
                                    let compoment = toCamelCase(tab ? tab + (subtab1 ? '/' + subtab1 : '') : '');
                                    if (compoment) {
                                        try {
                                            //eslint-disable-next-line
                                            let resolved = require(`./pages/${compoment}`).default;
                                            return React.createElement(resolved, { subtab: subtab1, setTitle: setTitle });
                                        } catch (error) {
                                            //
                                        }
                                    }

                                    return <Navigate to='/instructor/courses' />
                                })()
                            }
                        </Box>
                    </Box>
                </Box>
                <Divider color='dark' />
            </Box>
        </Page>
    )
}

export default index