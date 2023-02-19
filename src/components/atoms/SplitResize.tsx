import { Box, SxProps } from '@mui/material';
import React from 'react';

function SplitResize({ minHeight, minSize, maxSize, pane1, pane2, variant = 'vertical', primary = 'first', storeId, onChange, height, width, sxPane1, sxPane2 }: {
    minSize?: number | string,
    maxSize?: number | string,
    variant?: "vertical" | "horizontal",
    minHeight?: string,
    primary?: 'first' | 'second',
    storeId: string,
    onChange?: (value: number) => void,
    pane1: React.ReactNode,
    pane2: React.ReactNode,
    height?: string,
    width?: string,
    sxPane1?: SxProps,
    sxPane2?: SxProps,
}) {

    const isDrapAble = React.useRef(false);
    const refMain = React.useRef<HTMLDivElement>(null);
    const refLeft = React.useRef<HTMLDivElement>(null);
    const refRight = React.useRef<HTMLDivElement>(null);
    const positionRefDefault = React.useRef<number>(Number(localStorage.getItem(storeId)) ? Number(localStorage.getItem(storeId)) : 0);

    React.useEffect(() => {

        if (positionRefDefault.current) {
            if (variant === 'vertical') {
                (refRight.current as HTMLDivElement).style.width = ((refMain.current as HTMLDivElement).offsetWidth - positionRefDefault.current) + 'px';

            } else {
                (refRight.current as HTMLDivElement).style.height = ((refMain.current as HTMLDivElement).offsetHeight - positionRefDefault.current) + 'px';
            }
        }

        if (onChange) {
            if (positionRefDefault.current) {
                onChange(positionRefDefault.current);
            } else {
                if (variant === 'vertical') {
                    onChange((refMain.current as HTMLDivElement).offsetWidth / 2);
                } else {
                    onChange((refMain.current as HTMLDivElement).offsetHeight / 2);
                }
            }
        }

    }, []);

    const handleSaveLocal = (value: number) => {
        localStorage.setItem(storeId, value + '');
    }

    if (variant === 'vertical') {
        return (<Box
            ref={refMain}
            sx={{
                height: height ? height : '100%',
                width: width ? width : '100%',
                display: 'flex',
            }}
            onMouseLeave={() => {
                // isDrapAble.current = false;
            }}
            onMouseUp={() => {
                isDrapAble.current = false;
            }}
            onMouseMove={(e) => {
                if (isDrapAble.current) {
                    let x = e.pageX - e.currentTarget.offsetLeft - e.currentTarget.getBoundingClientRect().left;

                    if (x < 200) {
                        x = 200;
                    } else if ((e.currentTarget.offsetWidth - x) < 200) {
                        x = e.currentTarget.offsetWidth - 200;
                    }

                    (refLeft.current as HTMLDivElement).style.width = x + 'px';
                    (refRight.current as HTMLDivElement).style.width = (e.currentTarget.offsetWidth - x) + 'px';
                    handleSaveLocal(x);
                    if (onChange) {
                        onChange(x);
                    }
                }
            }}
        >
            <Box
                ref={refLeft}
                className="Pane"
                sx={{
                    width: positionRefDefault.current ? positionRefDefault.current : '50px',
                    flexGrow: positionRefDefault.current ? positionRefDefault.current : '50',
                    ...sxPane1,
                }}
            >
                {pane1}
            </Box>
            <Box className="reiszeBar"
                sx={{
                    height: '100%',
                    width: '10px',
                    flexShrink: 0,
                    cursor: 'col-resize',
                    backgroundColor: 'divider',
                    transition: 'filter 0.3s',
                    '&:hover': {
                        filter: 'invert(1)',
                        transition: 'filter 0.3s',
                    }
                }}
                onMouseDown={() => {
                    isDrapAble.current = true;
                }}
                onMouseUp={() => {
                    isDrapAble.current = false;
                }}
            />

            <Box
                ref={refRight}
                className="Pane"
                sx={{
                    width: '50%',
                    flexGrow: 50,
                    ...sxPane2,
                }}
            >
                {pane2}
            </Box>
        </Box >
        )
    }

    return (<Box
        ref={refMain}
        sx={{
            height: height ? height : '100%',
            width: width ? width : '100%',
            display: 'flex',
            flexDirection: 'column',
        }}
        onMouseLeave={() => {
            // isDrapAble.current = false;
        }}
        onMouseUp={() => {
            isDrapAble.current = false;
        }}
        onMouseMove={(e) => {
            if (isDrapAble.current) {
                let y = e.pageY - e.currentTarget.offsetTop - e.currentTarget.getBoundingClientRect().top;

                if (y < 50) {
                    y = 50;
                } else if ((e.currentTarget.offsetHeight - y) < 50) {
                    y = e.currentTarget.offsetHeight - 50;
                }

                (refLeft.current as HTMLDivElement).style.height = y + 'px';
                (refRight.current as HTMLDivElement).style.height = (e.currentTarget.offsetHeight - y) + 'px';
                handleSaveLocal(y);
                if (onChange) {
                    onChange(y);
                }
            }
        }}
    >

        <Box
            ref={refLeft}
            className="Pane"
            sx={{
                height: positionRefDefault.current ? positionRefDefault.current : '50%',
                flexGrow: positionRefDefault.current ? positionRefDefault.current : '50',
                ...sxPane1,
            }}
        >
            {pane1}
        </Box>
        <Box className="reiszeBar"
            sx={{
                height: '10px',
                width: '100%',
                flexShrink: 0,
                backgroundColor: 'divider',
                cursor: 'row-resize',
                transition: 'filter 0.3s',
                '&:hover': {
                    filter: 'invert(1)',
                    transition: 'filter 0.3s',
                }
            }}
            onMouseDown={() => {
                isDrapAble.current = true;
            }}
            onMouseUp={() => {
                isDrapAble.current = false;
            }}
        />

        <Box
            ref={refRight}
            className="Pane"
            sx={{
                height: '50%',
                flexGrow: 50,
                ...sxPane2,
            }}
        >
            {pane2}
        </Box>
    </Box>
    );
}

export default SplitResize