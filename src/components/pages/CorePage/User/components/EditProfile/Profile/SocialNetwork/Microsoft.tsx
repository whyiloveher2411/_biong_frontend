import { LoadingButton } from '@mui/lab'
import { Box, Typography } from '@mui/material'
import Icon from 'components/atoms/Icon'
import { __ } from 'helpers/i18n'
import { getParamsFromUrl } from 'helpers/url'
import useAjax from 'hook/useApi'
import React from 'react'
import { useSelector } from 'react-redux'
// import { useNavigate } from 'react-router-dom'
import { ConnectionProps } from 'services/accountService'
import { RootState } from 'store/configureStore'

function Microsoft({ connections, onLoadData }: {
    connections: {
        [key: string]: ConnectionProps
    } | null,
    onLoadData: () => void,
}) {
    const user = useSelector((state: RootState) => state.user);
    // const navigate = useNavigate();
    const useAjaxLogin = useAjax();

    const handleOnclickConnect = () => {
        window.location.href = 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=c3bf4a3b-74f9-4193-9076-da84cc314ff9&response_type=code&redirect_uri=' + window.location.origin + '/connect&response_mode=query&scope=https%3A%2F%2Fgraph.microsoft.com%2Fmail.read&state=' + user.id + '_microsoftConnect&code_challenge=' + user.id + '_' + user.slug + '_https://login.microsoftonline.com';
    }

    const handleCancelConnection = () => {
        if (connections !== null && connections.Microsoft) {
            useAjaxLogin.ajax({
                url: '/vn4-account/me/cancel-connect-social',
                data: {
                    id: connections.Microsoft.id_social,

                },
                success: (result: { success: boolean }) => {
                    if (result.success) {
                        onLoadData();
                    }
                },
            })
        }
    }

    React.useEffect(() => {
        const state = getParamsFromUrl(window.location.href, 'state');
        const code = getParamsFromUrl(window.location.href, 'code');
        // const redirect = getParamsFromUrl(window.location.href, 'redirect');

        if (state === user.id + '_microsoftConnect' && code) {
            useAjaxLogin.ajax({
                url: '/vn4-account/me/connect-microsoft',
                data: {
                    access_token: code,
                    redirect: window.location.origin + '/connect?redirect=' + window.location.pathname,
                    scope: 'https://graph.microsoft.com/mail.read',
                    code_challenge: 'sadfasdfsdfasdfhajsdflksdjahflkdsajhflsdhjf',
                },
                success: (result: { success: boolean }) => {
                    if (result.success) {
                        onLoadData();
                    }
                },
                finally: () => {
                    // navigate(redirect);
                }
            })
        }

    }, []);

    return (
        <Box
            sx={{
                display: 'flex',
                gap: 3,
                justifyContent: 'space-between',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    gap: 1,
                    alignItems: 'center',
                }}
            >
                <Icon icon={{ custom: '<image href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAhFBMVEXz8/PzUyWBvAYFpvD/ugjz9fb19Pbz+fr39fr69vPy9foAofD/tgDzRQB9ugAAo/Df6dCv0Xjz2dPzTBfzl4PznImz04CAx/H60oHS5vJ5xPH60Hn16dIAnvDz7u3z4t7n7dzzNADzkXurz3BwtQDzvrLM36zf6/Os2PL336z07d/7z3RN8WfWAAABg0lEQVR4nO3cyVLCYBCFURwCkXlygDBFUBTf//3cSGIVf5WrDi7O9wJdp3p/Wy1JkvSrLLzqVDu8FHAzjW57JrZ34+hSH5yWg9jK187PrXx/GMZ2GF9+MZsObmKbzSvhZHgb25CQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCwUWE5i21QC/fB86Xp/dLt/DG4t/MGbf7+FNxkl9jZzTrR1TvCeXjJIWFJkv7uIbzqVDe8LAE8Lp+D+zgTu5/FS2zFKUFcrEex9ZaV8Ksf3Sol7N3FNqqFRf8+NkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQsJmhetebOtr75dmi+iO1anTKrrNJbDRsvCuDJQk6Z/1DSzvYqEfRCNJAAAAAElFTkSuQmCC"  height="24" width="24" />' }} />
                <Typography variant='subtitle1'>Microsoft</Typography>
                {
                    Boolean(connections !== null && connections.Microsoft) &&
                    <> - <Typography variant='body2'>{connections?.Microsoft.title}</Typography></>
                }
            </Box>

            {
                connections !== null && connections.Microsoft ?
                    <LoadingButton
                        variant='outlined'
                        loading={useAjaxLogin.open}
                        onClick={handleCancelConnection}
                    >
                        {__('Cancel connection')}
                    </LoadingButton>
                    :
                    <LoadingButton
                        variant='outlined'
                        onClick={handleOnclickConnect}
                        loading={useAjaxLogin.open}
                    >
                        {__('Connect')}
                    </LoadingButton>
            }
        </Box>
    )
}

export default Microsoft