import { Box, Button, Grid, Theme, Typography, useTheme } from '@mui/material'
import Avatar from 'components/atoms/Avatar';
import Icon from 'components/atoms/Icon';
import Page from 'components/templates/Page'
import { __ } from 'helpers/i18n'
import React from 'react'

function About() {

    const theme = useTheme();

    return (
        <Page
            title={__('About')}
            width="xl"
            disableTitle
            sx={{
                m: -4,
                mb: -9,
                pt: 4,
                pl: 4,
                pr: 4,
                pb: 0,
            }}
        >
            <Box
                sx={{
                    position: 'relative',
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: theme.spacing(-4),
                        left: theme.spacing(-4),
                        right: theme.spacing(-4),
                        bottom: theme.spacing(-4),
                        opacity: 0.1,
                        zIndex: -1,
                        backgroundSize: 'contain',
                        backgroundImage: 'url(https://gambolthemes.net/html-items/cursus_main_demo/images/about/title_bg.jpg)'
                    }}
                />
                <Typography
                    component="h2"
                    gutterBottom
                    variant="overline"
                >
                    {__('About')}
                </Typography>
                <Typography
                    component="h1"
                    gutterBottom
                    variant="h3"
                >
                    {__("Do something you love to day!")}
                </Typography>
                <Typography variant="subtitle1">
                    {
                        [
                            '“Act as if what you do makes a difference. It does.” — William James',
                            '“It is when we are most lost that we sometimes find our truest friends.” — Brothers Grimm',
                            '“Life isn’t finding shelter in the storm. It’s about learning to dance in the rain.” ― Sherrilyn Kenyon',
                            '“When you have a dream, you’ve got to grab it and never let go.” — Carol Burnett',
                            '“Everything that’s broken was beautiful at one time. And our mistakes make us better people.” — Jamie Hoang',
                            '“We all can dance when we find music that we love.” — Giles Andreae',
                            '“I can’t change the direction of the wind, but I can adjust my sails to always reach my destination.” — Jimmy Dean'
                        ][Math.floor(Math.random() * 7)]
                    }
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        pt: 10,
                        pb: 7.75,
                        mb: 4
                    }}
                >
                    <Typography variant='h3' align="center" component='h2'>
                        Cải thiện cuộc sống thông qua học tập
                    </Typography>
                </Box>
            </Box>

            <Section4Item
                title='Những điều đặc biệt'
                description='Trên lives.dev, bạn có thể'
                items={[
                    {
                        title: 'Học tập trên thiết bị di động',
                        description: 'Quisque nec volutpat sem. Interdum et malesuada fames ac ante ipsum primis in faucibus.',
                        icon: 'MobileFriendlyOutlined'
                    },
                    {
                        title: 'Hỗ trợ',
                        description: 'Quisque nec volutpat sem. Interdum et malesuada fames ac ante ipsum primis in faucibus.',
                        icon: 'PeopleAltOutlined'
                    },
                    {
                        title: 'Chứng chỉ, chứng nhận',
                        description: 'Quisque nec volutpat sem. Interdum et malesuada fames ac ante ipsum primis in faucibus.',
                        icon: 'EmojiEventsOutlined'
                    },
                    {
                        title: 'Trải nghiệm toàn diện',
                        description: 'Quisque nec volutpat sem. Interdum et malesuada fames ac ante ipsum primis in faucibus.',
                        icon: 'LanguageOutlined'
                    },
                ]}
                theme={theme}
            />

            <Section2Column
                theme={theme}
                columnLeft={
                    <>
                        <Typography component='h2' variant='h3'>Câu chuyện của chúng tôi</Typography>
                        <Box
                            sx={{
                                width: 50,
                                height: 2,
                                background: theme.palette.secondary.main,
                            }}
                        />
                        <Typography sx={{ lineHeight: '28px', color: theme.palette.text.secondary }}>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed consectetur vel dolor id ultrices. Proin a magna at mi pretium pulvinar in eu enim. Nulla vel lacus lectus. Donec at venenatis augue. Nam vitae purus placerat, hendrerit nisl id, finibus magna. Etiam pharetra gravida ornare. Donec sagittis, ipsum in egestas egestas, dui lorem sollicitudin justo, ut ullamcorper velit neque eu velit. Ut et fringilla elit. Mauris augue augue, auctor a blandit ac, convallis eget neque. Curabitur in ante ante. Nullam laoreet tempus erat at ornare. In nisl nisi, dapibus eget facilisis sit amet, commodo quis nibh.
                        </Typography>
                    </>
                }
                columnRight={<Avatar
                    src="https://gambolthemes.net/html-items/cursus_main_demo/images/about/stroy_img.png"
                    name="Our Story"
                    variant='square'
                    sx={{
                        width: '100%',
                        height: 'auto',
                    }}
                />}
            />

            <Section6Item
                theme={theme}
                title="Our Global Reach"
                description='Cursus is the leading global marketplace for teaching and learning, connecting millions of students to the skills they need to succeed'
                items={[
                    {
                        title: '25k',
                        description: 'Instructors',
                    },
                    {
                        title: '95k',
                        description: 'Courses',
                    },
                    {
                        title: '40M',
                        description: 'Course enrollments',
                    },
                    {
                        title: '50+',
                        description: 'Languages',
                    },
                    {
                        title: '595+',
                        description: 'Membership Partners',
                    },
                    {
                        title: '295',
                        description: 'Countries',
                    },
                ]}
            />

            <Section2Column
                theme={theme}
                title="Meet Our Team"
                description="A perfect blend of creativity and technical wizardry. The best people formula for great websites!"
                columnLeft={<>
                    <Typography sx={{ lineHeight: '28px', color: theme.palette.text.secondary }}>
                        Morbi eget elit eget turpis varius mollis eget vel massa. Donec porttitor, sapien eget commodo vulputate, erat felis aliquam dolor, non condimentum libero dolor vel ipsum. Sed porttitor nisi eget nulla ullamcorper eleifend. Fusce tristique sapien nisi, vel feugiat neque luctus sit amet. Quisque consequat quis turpis in mattis. Maecenas eget mollis nisl. Cras porta dapibus est, quis malesuada ex iaculis at. Vestibulum egestas tortor in urna tempor, in fermentum lectus bibendum. In leo leo, bibendum at pharetra at, tincidunt in nulla. In vel malesuada nulla, sed tincidunt neque. Phasellus at massa vel sem aliquet sodales non in magna. Ut tempus ipsum sagittis neque cursus euismod. Vivamus luctus elementum tortor, ac aliquet dolor vehicula et.
                    </Typography>
                    <Box>
                        <Button variant='contained' color='secondary' >
                            Join Our Team
                        </Button>
                    </Box>
                </>}
                columnRight={<Avatar
                    src="https://gambolthemes.net/html-items/cursus_main_demo/images/about/team.jpg"
                    name="Meet Our Team"
                    variant='square'
                    sx={{
                        width: '100%',
                        height: 'auto',
                    }}
                />}
            />
        </Page>
    )
}

function Section2Column({ title, description, columnLeft, columnRight, theme }: {
    title?: string,
    description?: string,
    columnLeft: React.ReactNode,
    columnRight: React.ReactNode,
    theme: Theme,
}) {

    return (
        <Box
            sx={{
                background: theme.palette.background.paper,
                ml: -4,
                mr: -4,
                pt: 7.75,
                pb: 7.75,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Box
                sx={{
                    maxWidth: 1280,
                    pl: 4,
                    pr: 4,
                }}
            >
                {Boolean(title || description) &&
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            mb: 6,
                            gap: 2,
                        }}
                    >
                        {
                            Boolean(title) &&
                            <Typography align="center" variant='h4' component='h2'>
                                {title}
                            </Typography>
                        }
                        {
                            Boolean(description) &&
                            <Typography align="center" sx={{ maxWidth: 550, lineHeight: '28px' }} variant='body1' component='h4'>
                                {description}
                            </Typography>
                        }
                        <Box
                            sx={{
                                width: 50,
                                height: 2,
                                background: theme.palette.secondary.main,
                            }}
                        />
                    </Box>
                }

                <Grid
                    container
                    spacing={3}
                    sx={{
                        position: 'relative',
                        alignItems: 'center',
                    }}
                >
                    <Grid
                        item
                        xs={12}
                        md={6}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 3,
                        }}
                    >
                        {columnLeft}
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        md={6}
                    >
                        {columnRight}
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}

function Section4Item({ title, description, items, theme }: {
    theme: Theme,
    title: string,
    description: string,
    items: Array<{
        icon?: string,
        title: string,
        description: string
    }>
}) {

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                pt: 7.75,
                pb: 7.75,
                position: 'relative',
                gap: 2,
                maxWidth: 1280,
                pl: 4,
                pr: 4,
                m: '0 auto',
                alignItems: 'center',
            }}
        >
            {
                Boolean(title) &&
                <Typography align="center" variant='h4' component='h2'>
                    {title}
                </Typography>
            }
            {
                Boolean(description) &&
                <Typography sx={{ maxWidth: 550, lineHeight: '28px' }} align="center" variant='body1' component='h4'>
                    {description}
                </Typography>
            }
            {
                Boolean(title && description) &&
                <Box
                    sx={{
                        width: 50,
                        height: 2,
                        background: theme.palette.secondary.main,
                    }}
                />
            }

            <Grid
                container
                spacing={3}
                sx={{
                    mt: 4,
                }}
            >
                {
                    items.map((item, index) => (
                        <Grid
                            key={index}
                            item
                            xs={12}
                            md={3}
                            sx={{
                                display: 'flex',
                                gap: 2,
                                flexDirection: 'column',
                                textAlign: 'center',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            {
                                Boolean(item.icon) &&
                                <Icon icon={item.icon} sx={{ width: '40px', height: '40px', color: theme.palette.text.secondary }} />
                            }
                            <Typography variant='h4' component='h3'>{item.title}</Typography>
                            <Typography>{item.description}</Typography>
                        </Grid>
                    ))
                }

            </Grid>

        </Box>
    );
}


function Section6Item({ title, description, items, theme }: {
    theme: Theme,
    title: string,
    description: string,
    items: Array<{
        icon?: string,
        title: string,
        description: string
    }>
}) {

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                pt: 7.75,
                pb: 7.75,
                position: 'relative',
                gap: 2,
                maxWidth: 1280,
                pl: 4,
                pr: 4,
                m: '0 auto',
                alignItems: 'center',
            }}
        >

            <Typography align="center" variant='h4' component='h2'>
                {title}
            </Typography>
            <Typography sx={{ maxWidth: 550, lineHeight: '28px' }} align="center" variant='body1' component='h4'>
                {description}
            </Typography>
            <Box
                sx={{
                    width: 50,
                    height: 2,
                    background: theme.palette.secondary.main,
                }}
            />
            <Grid
                container
                spacing={3}
                sx={{
                    mt: 4,
                }}
            >
                {
                    items.map((item, index) => (
                        <Grid
                            key={index}
                            item
                            xs={12}
                            md={2}
                            sx={{
                                display: 'flex',
                                gap: 2,
                                flexDirection: 'column',
                                textAlign: 'center',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            {
                                Boolean(item.icon) &&
                                <Icon icon={item.icon} sx={{ width: '40px', height: '40px', color: theme.palette.text.secondary }} />
                            }
                            <Typography variant='h2' component='h3'>{item.title}</Typography>
                            <Typography>{item.description}</Typography>
                        </Grid>
                    ))
                }

            </Grid>

        </Box>
    );
}

export default About