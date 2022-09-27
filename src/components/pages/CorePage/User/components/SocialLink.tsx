import { IconButton, Link } from '@mui/material';
import Icon, { IconFormat } from 'components/atoms/Icon';
import makeCSS from 'components/atoms/makeCSS';


const useStyle = makeCSS({
    btnLink: {
        '&:hover .MuiSvgIcon-root': {
            color: 'var(--color)',
        }
    }
});


function SocialLink({
    icon,
    href,
    color,
}: {
    href: string,
    icon: IconFormat,
    color: string,
}) {

    const classes = useStyle();

    return (
        <IconButton className={classes.btnLink} component={Link} href={href} target={'_blank'} rel="nofollow">
            <Icon icon={icon} style={{ color: color, ['--color']: color }} />
        </IconButton>
    )
}

export default SocialLink