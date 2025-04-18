import { Grid, Typography } from '@mui/material';
import { PaginationProps } from 'components/atoms/TablePagination';
import ExploreSingle from 'components/molecules/ExploreSingle';
import { __ } from 'helpers/i18n';
import usePaginate from 'hook/usePaginate';
import React from 'react'
import { Navigate } from 'react-router-dom';
import exploreService, { ExploreProps } from 'services/exploreService';
import { UserProps, UserState, useUser } from 'store/user/user.reducers'

function SavedPost({ user }: {
    user: UserProps
}) {

    const myAccount = useUser();

    const [explores, setExplores] = React.useState<PaginationProps<ExploreProps> | null>(null)

    const titleCourseRef = React.useRef<HTMLDivElement>(null);

    const paginate = usePaginate<ExploreProps>({
        template: 'page',
        name: 'ex',
        enableLoadFirst: true,
        onChange: async (data) => {
            setExplores(await exploreService.getSavedPost(data));
        },
        scrollToELementAfterChange: titleCourseRef,
        pagination: explores,
        rowsPerPageOptions: [6, 12, 18, 24],
        data: {
            current_page: 1,
            per_page: 6
        }
    });


    if (myAccount._state === UserState.identify && ((myAccount.id + '') === (user.id + ''))) {
        return (<>
            <Grid
                container
                spacing={6}
                sx={{
                    mt: -4
                }}
            >
                {
                    (() => {
                        if (explores) {
                            if (paginate.isLoading) {
                                return [1, 2, 3, 4, 5, 6].map((item) => (
                                    <Grid
                                        key={item}
                                        item
                                        xs={12}
                                        md={6}
                                        lg={4}
                                    >
                                        <ExploreSingle />
                                    </Grid>
                                ));
                            }

                            if (explores.total) {
                                return explores.data?.map((item, index) => (
                                    <Grid
                                        key={index}
                                        item
                                        xs={12}
                                        md={6}
                                        lg={4}
                                    >
                                        <ExploreSingle
                                            explore={item}
                                        />
                                    </Grid>
                                ));
                            }

                            return <Grid
                                item
                                xs={12}
                                md={12}
                            >
                                <Typography align='center' variant='h3'>
                                    {__('Bạn chưa lưu bài viết nào')}
                                </Typography>
                            </Grid>

                        }

                        return [1, 2, 3, 4, 5, 6].map((item) => (
                            <Grid
                                key={item}
                                item
                                xs={12}
                                md={6}
                                lg={4}
                            >
                                <ExploreSingle />
                            </Grid>
                        ));

                    })()
                }
            </Grid>
            {paginate.component}
        </>)
    }

    return <Navigate to={'/user/' + user.slug} />

}

export default SavedPost