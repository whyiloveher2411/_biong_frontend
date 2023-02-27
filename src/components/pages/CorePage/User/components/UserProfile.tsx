import { Box, Link as MuiLink } from "@mui/material";
import Typography from "components/atoms/Typography";
import Page from "components/templates/Page";
import { __ } from "helpers/i18n";
import { toCamelCase } from "helpers/string";
import { useIndexedDB } from "hook/useApi";
import React from "react";
// import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
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

    const { data: user, setData: setUser } = useIndexedDB<UserProps | null>({ key: 'UserProfile/' + slug, defaultValue: null });

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
        title={user ? user.full_name : '...'}
        description='Bạn có thắc mắc hay cần báo cáo vấn đề xảy ra với sản phẩm hoặc dịch vụ của Spacedev.vn? Chúng tôi luôn sẵn sàng hỗ trợ bạn.'
        image='https://spacedev.vn/images/share-fb-540x282-2.jpg'
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

                        if (user.account_status === 'blocked') {

                            return <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    maxWidth: 800,
                                    margin: '24px auto 0',
                                }}
                            >
                                <Typography variant="h2">{__('Tài khoản đã bị khóa')}</Typography>
                                <Typography>{__('Tài khoản này đã bị khóa, nêu đây là nhầm lẫn, hãy liên hệ ngay với đội ngũ hỗ trợ của chúng tôi ')} <MuiLink component={Link} to="/contact-us">ở Đây</MuiLink></Typography>
                            </Box>

                        } else {

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

                        }
                    }
                    return null;
                })()
            }
        </Box>

    </Page >)
}

export default UserProfile

const SkeletonProfile = () => <Page
    title='...'
    description='Bạn có thắc mắc hay cần báo cáo vấn đề xảy ra với sản phẩm hoặc dịch vụ của Spacedev.vn? Chúng tôi luôn sẵn sàng hỗ trợ bạn.'
    image='https://spacedev.vn/images/share-fb-540x282-2.jpg'
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