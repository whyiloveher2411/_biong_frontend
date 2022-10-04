import { Box } from "@mui/material";
import Page from "components/templates/Page";
import { __ } from "helpers/i18n";
import { toCamelCase } from "helpers/string";
import React from "react";
// import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import accountService from "services/accountService";
// import { RootState } from "store/configureStore";
import { UserProps } from "store/user/user.reducers";
import CourseEnrolled from "./CourseEnrolled";
// import CourseOfMe from "./CourseOfMe";
// import CV from "./CV";
// import MyLearning from "./MyLearning";
// import MyProfile from "./MyProfile";
import ProfileTop from "./ProfileTop";
// import SectionQuestion from "./SectionQuestion";
// import SectionReviews from "./SectionReviews";
// import UserExplore from "./UserExplore";

function UserProfile({ slug }: {
    slug: string,
}) {

    const [user, setUser] = React.useState<UserProps | null>(null);

    let { subtab1 } = useParams<{
        subtab1: string,
    }>();

    // const myAccount = useSelector((state: RootState) => state.user);

    const navigate = useNavigate();

    const handleLoadProfile = async () => {
        if (slug) {
            let profile = await accountService.getProfileOfAccount(slug);

            if (profile) {
                setUser(profile);
            } else {
                navigate('/');
            }
        }
    }

    React.useEffect(() => {
        handleLoadProfile();
    }, [slug]);

    if (user === null) {
        return <SkeletonProfile />
    }

    if (slug !== user.slug) {
        return <SkeletonProfile />
    }

    // if (user === false) {
    //     return <Navigate to="/" />
    // }

    return (<Page
        title={__('Hồ sơ cá nhân')}
    >
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                pt: 3,
            }}
        >
            <ProfileTop handleLoadProfile={handleLoadProfile} user={user} isTemplateProfile={false} nameButtonActive={subtab1 ?? 'course-enrolled'} />
            {
                (() => {
                    if (user !== null) {

                        let compoment = toCamelCase(subtab1 ?? '');

                        if (compoment) {
                            try {
                                //eslint-disable-next-line
                                let resolved = require(`../components/${compoment}`).default;
                                return React.createElement(resolved, { user: user, onLoadProfile: handleLoadProfile });
                            } catch (error) {
                                //
                            }
                        }

                        return <CourseEnrolled user={user} />


                        // switch (subtab1) {
                        //
                        //
                        //     case 'cv':
                        //         return <CV user={user} />
                        //     case 'edit-profile':
                        //         if (myAccount._state === UserState.identify && ((myAccount.id + '') === (user.id + ''))) {
                        //             return <MyProfile />
                        //         }
                        //         return <Navigate to={'/user/' + user.slug} />
                        //     case 'review':
                        //         return <SectionReviews user={user} />
                        //     case 'explore':
                        //         return <UserExplore user={user} />
                        //     case 'question':
                        //         return <SectionQuestion user={user} />
                        //     default:
                        //         return <NewFeed user={user} />
                        // }
                    }
                    return null;
                })()
            }
        </Box>

    </Page >)
}

export default UserProfile

const SkeletonProfile = () => <Page
    title={__('Profile')}
>
    <Box
        sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            pt: 3,
        }}
    >
        <ProfileTop user={null} isTemplateProfile={false} nameButtonActive={'cv'} />
    </Box>
</Page>