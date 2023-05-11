import { Alert, AlertProps } from '@mui/material'
import CodeBlock from 'components/atoms/CodeBlock'
import React from 'react'

function AlertMui({ content, variant, color, severity, icon }: { content: string, color: AlertProps['color'], severity: AlertProps['severity'], variant: AlertProps['variant'], icon: 0 | 1 }) {
    return (
        <Alert
            variant={variant}
            color={color}
            severity={severity}
            icon={icon ? undefined : false}
            sx={{
                '& .MuiAlert-icon': {
                    pt: 2,
                    color: variant === 'filled' ? 'white' : 'unset',
                }
            }}
        >
            <CodeBlock
                html={content}
                sx={{
                    color: variant === 'filled' ? 'white' : 'unset',
                    '& p:first-child': {
                        marginTop: 0,
                    },
                    '& p': {
                        lineHeight: '18px',
                    }
                }}
            />
        </Alert>
    )
}

export default AlertMui