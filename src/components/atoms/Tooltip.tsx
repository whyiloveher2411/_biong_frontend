import React from 'react';
import { default as MuiTooltip } from "@mui/material/Tooltip";
import { TooltipProps as MuiTooltipProps } from "@mui/material/Tooltip"

function Tooltip({ disableInteractive = true, arrow = true, ...rest }: MuiTooltipProps) {
    return <MuiTooltip
        disableInteractive={disableInteractive}
        arrow={arrow}
        PopperProps={{
            ...rest.PopperProps,
            disablePortal: true,
        }}
        {...rest}
    />;
}

export default Tooltip;
