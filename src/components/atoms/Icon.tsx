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
    return null;
}), (props1, props2) => {
    return props1.renderVersion === props2.renderVersion && props1.icon === props2.icon;
});
