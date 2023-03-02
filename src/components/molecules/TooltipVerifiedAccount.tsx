import Box from 'components/atoms/Box'
import Icon from 'components/atoms/Icon'
import TooltipWhite from 'components/atoms/TooltipWhite'
import Typography from 'components/atoms/Typography'
import { __ } from 'helpers/i18n'

function TooltipVerifiedAccount({ iconSize = 24 }: { iconSize?: number }) {
    return (
        <TooltipWhite
            title={
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        pb: 1,
                        pt: 1,
                        maxWidth: 280
                    }}
                >
                    <Icon size="large" icon={{ custom: '<g><path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z"></path></g>' }} sx={{ color: "rgb(29, 155, 240)" }} />
                    <Typography sx={{ letterSpacing: '0.5px', mt: '4px', mb: '4px', }} variant='h3' align='center'>{__('Tài khoản xác mình')}</Typography>
                    <Typography sx={{ fontSize: 14, letterSpacing: '0.5px', lineHeight: '22px', }} align='center'>{__('Tài khoản này đã được xác minh các thông tin cá nhân và quá trình làm việc.')}</Typography>
                </Box>
            }
        >
            <Icon icon={{ custom: '<g><path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z"></path></g>' }} sx={{ color: "rgb(29, 155, 240)", cursor: 'pointer', fontSize: iconSize }} />
        </TooltipWhite>
    )
}

export default TooltipVerifiedAccount