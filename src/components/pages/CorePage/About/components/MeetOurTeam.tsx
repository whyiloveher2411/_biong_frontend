import { Box, Grid, SxProps, Theme, Typography } from '@mui/material'
import ImageLazyLoading from 'components/atoms/ImageLazyLoading'
import { getImageUrl } from 'helpers/image'
import { Link } from 'react-router-dom'
import { TeamMember } from 'services/elearningService'
import SocialLink from '../../User/components/SocialLink'

function MeetOurTeam({ sx, member }: {
    sx?: SxProps<Theme>,
    member?: Array<TeamMember> | null
}) {
    return (
        <Box sx={sx} >
            <Grid
                container
                spacing={6}
            >
                <Grid
                    item
                    lg={5}
                    md={12}
                    sm={12}
                    xs={12}
                >
                    <Typography variant='h2' sx={{
                        mb: 3, fontSize: 36,
                        lineHeight: 1.4,
                    }}>
                        “Phải có hai hòn đá mới có thể đánh lửa.” <Typography component='span' sx={{ color: 'text.secondary', fontSize: 22, whiteSpace: 'nowrap', }}> - Louisa May Alcott </Typography>
                    </Typography>
                    <Typography sx={{ fontSize: 20, lineHeight: '36px', }}>
                        Tinh thần đội ngũ là khả năng làm việc cùng nhau hướng tới một tầm nhìn chung. Khả năng định hướng thành tựu cá nhân hướng về mục tiêu của tổ chức. Đó là chất đốt cho phép những người bình thường đạt được những kết quả phi thường.
                    </Typography>
                </Grid>
                <Grid
                    item
                    lg={7}
                    md={12}
                    sm={12}
                    xs={12}
                >
                    <Grid
                        container
                        spacing={3}
                    >
                        {
                            member ?
                                member.map(item => (
                                    <Grid
                                        key={item.id}
                                        item
                                        xs={12}
                                        sm={6}
                                        md={6}
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: 1,
                                            textAlign: 'center',
                                            p: 3,
                                        }}
                                    >
                                        <Link to={'/user/' + item.slug}>
                                            <ImageLazyLoading
                                                src={getImageUrl(item.avatar, '/images/user-default.svg')}
                                                placeholderSrc='/images/user-default.svg'
                                                sx={{
                                                    width: 200,
                                                    height: 200,
                                                    borderRadius: '50%',
                                                    margin: '0 auto',
                                                }} />
                                        </Link>
                                        <Typography variant='h3' sx={{ mt: 1 }}><Link to={'/user/' + item.slug}>{item.full_name}</Link></Typography>
                                        <Typography>{item.role}</Typography>

                                        <Box
                                            sx={{
                                                display: 'flex',
                                            }}
                                        >
                                            {
                                                Boolean(item.social_facebook) &&
                                                <SocialLink icon="Facebook" color='#4267B2' href={item.social_facebook ?? '#'} />
                                            }


                                            {
                                                Boolean(item.social_twitter) &&
                                                <SocialLink icon="Twitter" color='#1DA1F2' href={item.social_twitter ?? '#'} />
                                            }

                                            {
                                                Boolean(item.social_youtube) &&
                                                <SocialLink icon="YouTube" color='#FF0000' href={item.social_youtube ?? '#'} />
                                            }
                                            {
                                                Boolean(item.social_linkedin) &&
                                                <SocialLink icon="LinkedIn" color='#2867B2' href={item.social_linkedin ?? '#'} />
                                            }
                                            {
                                                Boolean(item.social_github) &&
                                                <SocialLink icon="GitHub" color='#6cc644' href={item.social_github ?? '#'} />
                                            }
                                        </Box>
                                    </Grid>
                                ))
                                :
                                <></>
                        }
                    </Grid>
                </Grid>
            </Grid>

        </Box>
    )
}

export default MeetOurTeam