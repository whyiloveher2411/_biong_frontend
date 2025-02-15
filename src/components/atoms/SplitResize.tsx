import { Box, SxProps } from '@mui/material';
import React from 'react';
import RemoveRounded from '@mui/icons-material/RemoveRounded';

function SplitResize({ minSize = 200, pane1, pane2, variant = 'vertical', storeId, onChange, height, width, sxPane1, sxPane2, sx }: {
    minSize?: number,
    // maxSize?: number | string,
    variant?: "vertical" | "horizontal",
    // minHeight?: string,
    // primary?: 'first' | 'second',
    storeId: string,
    onChange?: (value: number) => void,
    pane1: React.ReactNode,
    pane2: React.ReactNode,
    height?: string,
    width?: string,
    sxPane1?: SxProps,
    sxPane2?: SxProps,
    sx?: SxProps,
}) {

    const isDrapAble = React.useRef(false);
    const refMain = React.useRef<HTMLDivElement>(null);
    const refLeft = React.useRef<HTMLDivElement>(null);
    const refRight = React.useRef<HTMLDivElement>(null);
    const positionRefDefault = React.useRef<number>(Number(localStorage.getItem(storeId)) ? Number(localStorage.getItem(storeId)) : 0);

    const handleUpdateSize = () => {
        if (positionRefDefault.current !== null && positionRefDefault.current !== undefined) {
            if (variant === 'vertical') {

                if (positionRefDefault.current === 0) {
                    if (refMain.current) {
                        const mainWidth = refMain.current.offsetWidth;
                        minSize = Math.max(mainWidth * 0.5, minSize);
                    }
                }

                let widthLeft = Math.max(positionRefDefault.current, minSize);
                let widthRight = (refMain.current as HTMLDivElement).offsetWidth - widthLeft;

                if (widthRight < minSize) {
                    widthRight = minSize;
                    widthLeft = (refMain.current as HTMLDivElement).offsetWidth - widthRight;
                }

                (refLeft.current as HTMLDivElement).style.width = widthLeft + 'px';
                (refRight.current as HTMLDivElement).style.width = widthRight + 'px';
            } else {

                if (positionRefDefault.current === 0) {
                    if (refMain.current) {
                        const mainHeight = refMain.current.offsetHeight;
                        minSize = Math.max(mainHeight * 0.5, minSize);
                    }
                }

                let heightTop = Math.max(positionRefDefault.current, minSize);
                let heightBottom = (refMain.current as HTMLDivElement).offsetHeight - heightTop;

                if (heightBottom < minSize) {
                    heightBottom = minSize;
                    heightTop = (refMain.current as HTMLDivElement).offsetHeight - heightBottom;
                }
                (refLeft.current as HTMLDivElement).style.height = heightTop + 'px';
                (refRight.current as HTMLDivElement).style.height = heightBottom + 'px';
            }
        }
    }
    React.useEffect(() => {

        handleUpdateSize();

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

        window.addEventListener('resize', handleUpdateSize);

        return () => {
            window.removeEventListener('resize', handleUpdateSize);
        };

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
                ...sx,
            }}
            onMouseLeave={() => {
                // isDrapAble.current = false;
            }}
            onMouseUp={() => {
                isDrapAble.current = false;
            }}
            onMouseMove={(e) => {
                if (isDrapAble.current && refMain.current) {
                    // let x = e.pageX - refMain.current.getBoundingClientRect().left - e.currentTarget.offsetLeft - e.currentTarget.getBoundingClientRect().left;
                    let x = e.pageX - refMain.current.getBoundingClientRect().left;

                    let minWidth = minSize ?? 200;

                    if (x < minWidth) {
                        x = minWidth;
                    } else if ((e.currentTarget.offsetWidth - x) < minWidth) {
                        x = e.currentTarget.offsetWidth - minWidth;
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
                className="Pane pane-left"
                sx={{
                    width: positionRefDefault.current ? positionRefDefault.current : '50px',
                    flexShrink: 0,
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
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background-color 0.3s',
                    '&:hover': {
                        backgroundColor: 'primary.main',
                        transition: 'background-color 0.3s',
                    }
                }}
                onMouseDown={() => {
                    isDrapAble.current = true;
                }}
                onMouseUp={() => {
                    isDrapAble.current = false;
                }}
            ><RemoveRounded sx={{ opacity: 0.2, transform: 'rotate(90deg)' }} /></Box>

            <Box
                ref={refRight}
                className="Pane pane-right"
                sx={{
                    width: '50%',
                    flexGrow: 1,
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
            maxHeight: '100%',
            width: width ? width : '100%',
            display: 'flex',
            flexDirection: 'column',
            ...sx,
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

                let minWHeight = minSize ?? 200;

                if (y < minWHeight) {
                    y = minWHeight;
                } else if ((e.currentTarget.offsetHeight - y) < minWHeight) {
                    y = e.currentTarget.offsetHeight - minWHeight;
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
            className="Pane pane-left"
            sx={{
                height: positionRefDefault.current ? positionRefDefault.current : '50%',
                flexShrink: 0,
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
                transition: 'background-color 0.3s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                '&:hover': {
                    backgroundColor: 'primary.main',
                    transition: 'background-color 0.3s',
                }
            }}
            onMouseDown={() => {
                isDrapAble.current = true;
            }}
            onMouseUp={() => {
                isDrapAble.current = false;
            }}
        ><RemoveRounded sx={{ opacity: 0.2 }} /></Box>

        <Box
            ref={refRight}
            className="Pane pane-right"
            sx={{
                height: '50%',
                flexGrow: 1,
                ...sxPane2,
            }}
        >
            {pane2}
        </Box>
    </Box>
    );
}

export default SplitResize