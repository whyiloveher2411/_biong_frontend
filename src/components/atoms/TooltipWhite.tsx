import { Theme } from '@mui/material';
import { withStyles } from '@mui/styles';
import Tooltip from 'components/atoms/Tooltip';

const TooltipWhite = withStyles((theme: Theme) => ({
    tooltip: {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.background.paper,
        margin: 5,
        minWidth: 250,
        maxWidth: 450,
        fontSize: 13,
        boxShadow: '0 4px 5px 0 rgb(0 0 0 / 14%), 0 1px 10px 0 rgb(0 0 0 / 12%), 0 2px 4px -1px rgb(0 0 0 / 20%)',
        fontWeight: 400,
        lineHeight: '22px',
        padding: 16,
        '& a': {
            color: theme.palette.text.primary,
            display: 'block',
            font: '500 14px / 20px main,RobotoDraft,Helvetica,Arial,sans-serif',
            letterSpacing: '.5px',
            lineHeight: '16px',
            paddingTop: '8px',
            textTransform: 'uppercase',
            opacity: .7,
            '&:hover': {
                opacity: 1,
            }
        },
        '& .MuiTooltip-arrow': {
            color: theme.palette.background.paper,
        }
    }
}))(Tooltip);


export default TooltipWhite;

