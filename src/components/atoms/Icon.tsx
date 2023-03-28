import SvgIcon from 'components/atoms/SvgIcon';
import React from 'react'

export type IconFormat = string | {
    custom: string
}

export interface IconProps {
    [key: string]: ANY,
    icon: IconFormat,
    iconBackup?: IconFormat,
    type?: 'material',
    renderVersion?: string,
}

export default React.memo(React.forwardRef(function Icon({ icon, iconBackup, type = 'material', renderVersion, ...rest }: IconProps, ref: React.ForwardedRef<ANY>) {

    if (icon && typeof icon === 'object' && icon.custom) {
        return <SvgIcon ref={ref} {...rest}> <svg dangerouslySetInnerHTML={{ __html: icon.custom }
        } /></SvgIcon>
    }

    try {
        if (icon && type === 'material' && typeof icon === 'string') {
            //eslint-disable-next-line
            return React.createElement(require(`@mui/icons-material/esm/${icon}`).default, { ...rest, ref: ref });
        }

        if (iconBackup && type === 'material' && typeof iconBackup === 'string') {
            //eslint-disable-next-line
            return React.createElement(require(`@mui/icons-material/esm/${iconBackup}`).default, { ...rest, ref: ref });
        }

    } catch (error) {

        if (iconBackup) {
            try {
                //eslint-disable-next-line
                return React.createElement(require(`@mui/icons-material/esm/${iconBackup}`).default, { ...rest, ref: ref });
            } catch (error) {
                //
            }
        }
        //
    }

    return null;
}), (props1, props2) => {
    return props1.renderVersion === props2.renderVersion && props1.icon === props2.icon;
});
