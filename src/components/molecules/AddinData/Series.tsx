import { Box, Typography } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'

function Series({ series, exploreId }: {
    series: {
        title: string,
        blogs: Array<{
            id: ID,
            title: string,
            slug: string,
        }>
    },
    exploreId: ID,
}) {
    return (<Box sx={{
        maxWidth: 550,
        margin: '0 auto',
        pt: 4,
        pb: 4,
    }}>
        <Typography variant='h2' sx={{ fontSize: 22 }}>{series.title} ({series.blogs.length} phần)</Typography>
        <Box sx={{ mt: 2, pl: 1, display: 'flex', flexDirection: 'column', gap: 2, }}>
            {
                series.blogs.map((blog, index) => (
                    <Box
                        key={blog.id}
                        component={Link}
                        to={'/explore/' + blog.slug}
                        sx={{
                            display: 'flex',
                            gap: 2,
                            '&:hover': {
                                color: 'text.link',
                            }
                        }}
                    >
                        <Box sx={{
                            width: 32,
                            height: 32,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: '50%',
                            backgroundColor: exploreId === blog.id ? 'primary.main' : 'dividerDark',
                            color: exploreId === blog.id ? 'white' : 'unset',
                        }}>{index + 1}</Box>
                        <Typography variant='h2'
                            sx={{
                                fontSize: 18,
                                fontWeight: exploreId === blog.id ? 500 : 400,
                                color: exploreId === blog.id ? 'primary.main' : 'unset'
                            }}>{blog.title}</Typography>
                    </Box>
                ))
            }
        </Box>
    </Box>)
}

export default Series