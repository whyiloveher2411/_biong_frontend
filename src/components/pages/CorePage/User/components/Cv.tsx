import { Alert, Box, Typography } from "@mui/material";
import { useTransferLinkDisableScroll } from "components/atoms/ScrollToTop";
import { __ } from "helpers/i18n";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import elearningService from "services/elearningService";
import { UserCV } from "services/elearningService/@type";
import { RootState } from "store/configureStore";
import { UserProps } from "store/user/user.reducers";
import About from "./CV/About";
import Education from "./CV/Education";
import PersonalInfo from "./CV/PersonalInfo";
import Projects from "./CV/Projects";
import References from "./CV/References";
import Skills from "./CV/Skills";
import WorkExperience from "./CV/WorkExperience";

function Cv({ user }: {
    user: UserProps
}) {

    const [cvContent, setCVContent] = React.useState<UserCV | null>(null);

    const myAccount = useSelector((state: RootState) => state.user);

    const disableScroll = useTransferLinkDisableScroll();

    React.useEffect(() => {
        handleLoadDataCV();
    }, []);

    const editAble = (myAccount && user && (myAccount.id + '') === (user.id + ''));

    const handleLoadDataCV = async () => {
        if (editAble || !user.is_private_account) {
            const cv = await elearningService.user.cv.get(user.id);
            setCVContent(cv);
        }
    }

    if (!editAble && user.is_private_account) {
        return (<Box
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
            <Typography variant="h6">{__('This Account is Private')}</Typography>
            <Typography>{__('The account is currently private, so only followers can see their posts')}</Typography>
        </Box>
        )
    }

    return <>
        {
            Boolean(user.is_private_account) &&
            <Alert severity="warning">
                {__('Tài khoản đang được cài đặt là private, sẽ chỉ có bạn thấy các thông tin này. cài đặt ')}
                <Link style={{ textDecoration: 'underline' }} to={'/user/' + myAccount.slug + '/edit-profile/security'} onClick={() => disableScroll('/user/' + myAccount.slug + '/edit-profile/security')}>{__('tại đây')}</Link>
            </Alert>
        }
        <Alert severity="warning">
            {__('Các thông tin dưới đây do người dùng tự cung cấp, tính xác thực của chúng sẽ không được đảm bảo.')}
        </Alert>
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: '3.5fr 8fr',
                gap: 3,
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                }}
            >
                <PersonalInfo user={user} cv={cvContent} onReloadCV={handleLoadDataCV} editAble={editAble} />
                <Skills cv={cvContent} onReloadCV={handleLoadDataCV} editAble={editAble} />
                <References cv={cvContent} onReloadCV={handleLoadDataCV} editAble={editAble} />
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                    p: 1,
                    m: -1,
                    overflow: 'hidden',
                }}
            >
                <About cv={cvContent} onReloadCV={handleLoadDataCV} editAble={editAble} />
                <WorkExperience cv={cvContent} onReloadCV={handleLoadDataCV} editAble={editAble} />
                <Education cv={cvContent} onReloadCV={handleLoadDataCV} editAble={editAble} />
                <Projects cv={cvContent} onReloadCV={handleLoadDataCV} editAble={editAble} />
            </Box>
        </Box>
    </>

}

export default Cv