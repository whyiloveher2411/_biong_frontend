import { Box } from '@mui/material';
import { LoginForm } from 'components/organisms/components/Auth/Login';
import Page from 'components/templates/Page';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import accountService from 'services/accountService';
import { setFooterVisible, setHeaderVisible, setIsIframeOauth } from 'store/layout/layout.reducers';
import { UserState, useUser } from 'store/user/user.reducers';
import AuthorizeSkeleton from './components/AuthorizeSkeleton';
import Identify from './components/Identify';
import PageError from './components/PageError';
import { ImageProps } from 'components/atoms/Avatar';

function Authorize() {

    const user = useUser();

    const dispatch = useDispatch();

    const [showLoading, setShowLoading] = React.useState(true);

    const [application, setApplication] = React.useState<{
        logo: ImageProps,
        title: string,
    } | null>(null);

    const [showPageError, setShowPageError] = React.useState<'application_not_found' | 'redirect_uri_not_match' | false>(false);

    const [searchParams] = useSearchParams();

    const checkApplication = async () => {
        const client_id = searchParams.get('client_id');
        const redirect_uri = searchParams.get('redirect_uri');

        if (client_id && redirect_uri) {
            const result = await accountService.checkApplication(client_id, redirect_uri);
            if (result.error_code) {
                setShowPageError(result.error_code);
            }

            if (result.logo && result.title) {
                setApplication({
                    logo: result.logo,
                    title: result.title,
                })
            }

        }

        setShowLoading(false);

    }

    React.useEffect(() => {

        checkApplication();

        dispatch(setHeaderVisible(false));
        dispatch(setFooterVisible(false));
        dispatch(setIsIframeOauth(true));
        return () => {
            dispatch(setHeaderVisible(true));
            dispatch(setFooterVisible(true));
            dispatch(setIsIframeOauth(false));
        };
    }, []);

    if (showLoading) {
        return <AuthorizeSkeleton />
    }

    if (showPageError) {
        return <Page
            title={showPageError === 'application_not_found' ? 'Ứng dụng không tồn tại' : 'Địa chỉ URL không khớp'}
            description={showPageError === 'application_not_found' ? 'Ứng dụng không tồn tại' : 'Địa chỉ URL không khớp'}
            image='/images/share-fb-540x282-2.jpg'
            sxRoot={{
                padding: '0 !important',
            }}
        >
            <PageError errorCode={showPageError} />
        </Page>
    }

    return <Page
        title={'Đăng nhập'}
        description='Từ việc học kiến thức mới đến tìm kiếm công việc, khởi nghiệp hoặc phát triển kinh doanh, hãy chọn lộ trình học tập phù hợp với ước mơ của bạn và bắt đầu chuyến hành trình thành công của bạn.'
        image='/images/share-fb-540x282-2.jpg'
        sxRoot={{
            padding: '0 !important',
        }}
    >
        {
            user._state === UserState.identify &&
            <Identify application={application} />
        }
        {
            user._state === UserState.nobody &&
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                }}
            >
                <LoginForm />
            </Box>
        }
        {
            user._state === UserState.unknown &&
            <AuthorizeSkeleton />
        }
    </Page>
}

export default Authorize
