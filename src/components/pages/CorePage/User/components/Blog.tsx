import { Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { PaginationProps } from 'components/atoms/TablePagination'
import ExploreSingle from 'components/molecules/ExploreSingle'
import { __ } from 'helpers/i18n'
import usePaginate from 'hook/usePaginate'
import React from 'react'
import exploreService, { ExploreProps } from 'services/exploreService'
import { UserProps } from 'store/user/user.reducers'

function Explore({ user }: {
    user: UserProps
}) {

    const [blogs, setBlogs] = React.useState<PaginationProps<ExploreProps> | null>(null)

    const titleCourseRef = React.useRef<HTMLDivElement>(null);

    const paginate = usePaginate<ExploreProps>({
        name: 'ex',
        enableLoadFirst: true,
        onChange: async (data) => {
            setBlogs(await exploreService.getBlogOfMe({
                ...data,
                user: user.id,
            }));
        },
        scrollToELementAfterChange: titleCourseRef,
        pagination: blogs,
        rowsPerPageOptions: [6, 12, 18, 24],
        data: {
            current_page: 1,
            per_page: 6
        }
    });


    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                mt: 2
            }}
            ref={titleCourseRef}
        >
            <Grid
                container
                spacing={4}
            >
                <Grid
                    item
                    xs={12}
                >
                    <Typography
                        component="h4"
                        variant="h4"
                        align='center'
                    >
                        {__('Blogs that {{username}} is the author', {
                            username: user.full_name
                        })}
                    </Typography>
                </Grid>
                {
                    (() => {
                        if (blogs) {
                            if (paginate.isLoading) {
                                return [1, 2, 3, 4, 5, 6].map((item) => (
                                    <Grid
                                        key={item}
                                        item
                                        xs={12}
                                        // md={6}
                                        // lg={4}
                                    >
                                        <ExploreSingle />
                                    </Grid>
                                ));
                            }

                            if (blogs.total) {
                                return blogs.data?.map((item, index) => (
                                    <Grid
                                        key={index}
                                        item
                                        xs={12}
                                        // md={6}
                                        // lg={4}
                                    >
                                        <ExploreSingle explore={item} />
                                    </Grid>
                                ));
                            }

                            return <Grid
                                item
                                xs={12}
                                md={12}
                                sx={{ paddingTop: '8px !important' }}
                            >
                                <Typography align='center'>
                                    {__('Có vẻ như {{username}} hiện không là tác giả của bất kỳ bài blog nào', {
                                        username: user.full_name
                                    })}
                                </Typography>
                            </Grid>

                        }

                        return [1, 2, 3, 4, 5, 6].map((item) => (
                            <Grid
                                key={item}
                                item
                                xs={12}
                                // md={6}
                                // lg={4}
                            >
                                <ExploreSingle />
                            </Grid>
                        ));

                    })()
                }
            </Grid>
            {
                blogs !== null &&
                paginate.component
            }
        </Box>
    )
}

export default Explore