export default {
    styleOverrides: {
        root: {
            whiteSpace: 'nowrap',
            borderColor: 'rgba(255, 255, 255, 0.23)',
            borderRadius: '4px',
        },
        containedInherit: {
            color: 'initial',
        },
        contained: {
            boxShadow:
                '0 1px 1px 0 rgba(0,0,0,0.14), 0 2px 1px -1px rgba(0,0,0,0.12), 0 1px 3px 0 rgba(0,0,0,0.20)',
        },
    },
    defaultProps: {
        disableRipple: true,
    }
}
