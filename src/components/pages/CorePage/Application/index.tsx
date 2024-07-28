import { Box } from '@mui/material';
import Loading from 'components/atoms/Loading';
import React from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import applicationService, { IApplicationProps } from 'services/applicationService';
import { UserState, useUser } from 'store/user/user.reducers';
import { hidenSectionMainLayout, showSectionMainLayout } from '../Course/CourseLearning';
import { getImageUrl } from 'helpers/image';
import useQuery from 'hook/useQuery';
import { getThemeMode } from 'helpers/theme';
import AuthGuard from 'components/templates/AuthGuard';
import { useHandleUpdateViewMode } from 'components/molecules/Header/Account';

function Application() {

    let { tab } = useParams<{
        tab: string,
    }>();

    let urlQuery = useQuery({
        test: '',
    })

    const [application, setApplication] = React.useState<IApplicationProps | null>(null);

    const [iframeUrl, setIframeUrl] = React.useState<string | null>(null);

    const iframeRef = React.useRef<HTMLIFrameElement>(null);

    const handleUpdateViewMode = useHandleUpdateViewMode();

    const navigate = useNavigate();

    const user = useUser();

    React.useEffect(() => {
        const eventListenerMessage = function (event: MessageEvent) {
            try {
                const post: ANY = JSON.parse(event.data);

                if (post.is_spacedev_app) {
                    switch (post.event) {
                        case 'init':
                            if (!post.data?.app_id || post.data.app_id.toString() !== application?.app_id_random.toString()) {
                                navigate('/')
                            }
                            break;
                        case 'get_user_info':
                            iframeRef.current?.contentWindow?.postMessage(JSON.stringify({
                                from_spacedev: true,
                                event: 'get_user_info',
                                data: user._state === UserState.identify ? {
                                    user_id: user.id,
                                    name: user.full_name,
                                    avatar: getImageUrl(user.avatar, '/images/user-default.svg'),
                                    dark_mode: getThemeMode(user.theme + '') === 'dark',
                                    email: user.email,
                                    status: 1,
                                } : {
                                    dark_mode: getThemeMode(user.theme + '') === 'dark',
                                    status: 0,
                                }
                            }), '*');
                            break;
                        case 'show_alert':
                            window.showMessage(post.data.message);
                            break;
                        case 'changeThemeMode':
                            handleUpdateViewMode(post.data.theme);
                            break;
                        default:
                            break;
                    }
                }
            } catch (error) {
                //
            }
        };

        window.addEventListener("message", eventListenerMessage);
        if (user._state === UserState.identify) {
            hidenSectionMainLayout();
            document.body.style.overflow = 'hidden';
        }
        return () => {
            window.removeEventListener("message", eventListenerMessage);
            document.body.style.overflow = 'inherit';
            showSectionMainLayout();
        };

    }, [user, application]);

    React.useEffect(() => {
        if (user._state !== UserState.unknown) {
            iframeRef.current?.contentWindow?.postMessage(JSON.stringify({
                from_spacedev: true,
                event: 'get_user_info',
                data: user._state === UserState.identify ? {
                    user_id: user.id,
                    name: user.full_name,
                    avatar: getImageUrl(user.avatar, '/images/user-default.svg'),
                    dark_mode: getThemeMode(user.theme + '') === 'dark',
                    email: user.email,
                    status: 1,
                } : {
                    dark_mode: getThemeMode(user.theme + '') === 'dark',
                    status: 0,
                }
            }), '*');
        }
    }, [user]);

    React.useEffect(() => {
        if (tab && user._state !== UserState.unknown) {
            (async () => {
                const app = await applicationService.detail(tab);
                if (app) {
                    setApplication(app);
                    if (user._state !== UserState.unknown) {
                        if (urlQuery.query.test === app.app_id_random && user._state === UserState.identify && user.id.toString() === app.account_owner.toString()) {
                            setIframeUrl(app.test_domain);
                        } else {
                            setIframeUrl(app.domain);
                        }
                    }
                    return;
                }
                navigate('/');

            })();
        }
    }, [tab, user]);

    if (!tab) {
        return <Navigate to={'/'} />
    }

    return (
        <AuthGuard
            title={application?.title ?? 'Ứng dụng'}
            description={application?.description ?? 'Trãi nghiệm các ứng dụng học tập chỉ có tại spacedev.vn'}
            image='https://spacedev.vn/images/share-fb-540x282-2.jpg'
            width="xl"
            sxRoot={{
                padding: '0 !important',
                height: 'calc( 100vh - 64px )',
                marginBottom: '-40px !important',
                '&>div': {
                    height: '100%'
                }
            }}
        >

            {
                application && iframeUrl ?
                    <Box
                        sx={{
                            height: '100%',
                            '& iframe': {
                                width: '100%',
                                border: 'none',
                                height: '100%',
                            }
                        }}
                    >
                        <iframe
                            ref={iframeRef}
                            className='custom_scroll'
                            src={iframeUrl}
                        />
                    </Box>
                    :
                    <Loading
                        open
                        isCover
                        isWarpper
                    />
            }
        </AuthGuard>
    )
}

export default Application
