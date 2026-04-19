import { Box } from '@mui/material'
import React from 'react'

/** Khối ảnh bên phải banner khóa học: nền màu + logo căn giữa (dùng chung HomePage / SectionCourseSumary). */
export function BannerCourseImageThumbnail({ logo, color, logoAlt = '' }: {
    logo: string,
    color: string,
    logoAlt?: string,
}) {

    const cssRef = React.useRef([
        Math.floor(Math.random() * 360),
        Math.floor(Math.random() * 360),
        Math.floor(Math.random() * 7) + 5,
        Math.floor(Math.random() * 10) + 10,
        Math.floor(Math.random() * 8) + 25,
        Math.floor(Math.random() * 7) + 0,
        Math.floor(Math.random() * 15) + 20,
        Math.floor(Math.random() * 8) + 2,
        Math.floor(Math.random() * 14) + 50,
        Math.floor(Math.random() * 5) + 3,
        Math.floor(Math.random() * 7) + 5,
        Math.floor(Math.random() * 10) + 10,
        Math.floor(Math.random() * 15) + 20,
        Math.floor(Math.random() * 8) + 2,
        Math.floor(Math.random() * 14) + 50,
        Math.floor(Math.random() * 15) + 20,
        Math.floor(Math.random() * 14) + 1,
        Math.floor(Math.random() * 15) + 30
    ]);

    return <Box
        sx={{
            position: 'absolute',
            height: '100%',
            width: '100%',
        }}
    >
        <Box
            sx={{
                clipPath: 'polygon(-10% 0,100% 0,100% 100%,26% 100%)',
                position: 'relative',
                height: '100%',
                width: '100%',
                backgroundColor: color,
                overflow: 'hidden',
            }}
        >
            <img
                style={{
                    position: 'absolute',
                    opacity: '0.15',
                    width: '67.3%',
                    transform: 'translate(-50%, -50%) rotate(' + cssRef.current[0] + 'deg)',
                    top: '50%',
                    left: '55%',
                }}
                src="/images/gif/wave-ball.gif"
                alt=""
            />
            <img
                style={{
                    position: 'absolute',
                    opacity: '0.15',
                    width: '60.3%',
                    transform: 'translate(-50%, -50%) rotate(' + cssRef.current[1] + 'deg)',
                    top: '50%',
                    left: '55%',
                }}
                src="/images/gif/wave-ball.gif"
                alt=""
            />
            <img
                style={{
                    position: 'absolute',
                    width: '5%',
                    top: cssRef.current[2] + '%',
                    right: cssRef.current[3] + '%',
                }}
                src="/images/gif/star-1.gif"
                alt=""
            />
            <img
                style={{
                    position: 'absolute',
                    width: '5%',
                    top: cssRef.current[4] + '%',
                    right: cssRef.current[5] + '%',
                }}
                src="/images/gif/star-2.gif"
                alt=""
            />

            <img
                style={{
                    position: 'absolute',
                    width: '5%',
                    right: cssRef.current[6] + '%',
                    bottom: cssRef.current[7] + '%',
                }}
                src="/images/gif/star-1.gif"
                alt=""
            />

            <img
                style={{
                    position: 'absolute',
                    width: '7%',
                    top: cssRef.current[8] + '%',
                    right: cssRef.current[9] + '%',
                }}
                src="/images/gif/star-1.gif"
                alt=""
            />

            <img
                style={{
                    position: 'absolute',
                    width: '5%',
                    top: cssRef.current[10] + '%',
                    left: cssRef.current[11] + '%',
                }}
                src="/images/gif/star-1.gif"
                alt=""
            />

            <img
                style={{
                    position: 'absolute',
                    width: '5%',
                    left: cssRef.current[12] + '%',
                    bottom: cssRef.current[13] + '%',
                }}
                src="/images/gif/star-1.gif"
                alt=""
            />

            <img
                style={{
                    position: 'absolute',
                    width: '7%',
                    top: cssRef.current[14] + '%',
                    left: cssRef.current[15] + '%',
                }}
                src="/images/gif/star-1.gif"
                alt=""
            />

            <img
                style={{
                    position: 'absolute',
                    width: '7%',
                    top: cssRef.current[16] + '%',
                    left: cssRef.current[16] + '%',
                }}
                src="/images/gif/star-2.gif"
                alt=""
            />

            <img
                style={{
                    maxHeight: '45%',
                    maxWidth: '45%',
                    position: 'absolute',
                    top: '50%',
                    left: '55%',
                    transform: 'translate(-50%, -50%)',
                }}
                src={logo}
                alt={logoAlt}
            />
        </Box>
    </Box>
}
