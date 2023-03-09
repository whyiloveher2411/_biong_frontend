import { Box } from '@mui/material';
import Icon from 'components/atoms/Icon';
import { useTransferLinkDisableScroll } from 'components/atoms/ScrollToTop';
import Tabs, { TabProps } from 'components/atoms/Tabs';
import { __ } from 'helpers/i18n';
import { useSelector } from 'react-redux';
import { Navigate, useParams } from 'react-router-dom';
import { RootState } from 'store/configureStore';
import { UserProps } from 'store/user/user.reducers';
import MyLearning from './MyLearning';
import EditProfile from './Profile/EditProfile';
import Settings from './Profile/Settings';

function MyProfile({ user, onLoadProfile }: {
    user: UserProps,
    onLoadProfile: () => void,
}) {

    const { subtab2 } = useParams();

    const myAccount = useSelector((state: RootState) => state.user);

    const disableScroll = useTransferLinkDisableScroll();

    if (myAccount && user && (myAccount.id + '') === (user.id + '')) {

        const tabs: Array<TabProps> = [
            {
                title: <><Icon icon="ManageAccountsOutlined" /> {__('Hồ sơ')}</>,
                key: 'overview',
                content: () => <EditProfile onLoadProfile={onLoadProfile} />
            },
            // {
            //     title: <><Icon icon="LockOutlined" /> {__('Bảo mật')}</>,
            //     key: 'security',
            //     content: () => <Security />
            // },
            {
                title: <><Icon icon="SecurityOutlined" /> {__('Cài đặt')}</>,
                key: 'settings',
                content: () => <Settings />
            },
            // {
            //     title: <><Icon icon="PeopleAltOutlined" /> {__('Mạng xã hội')}</>,
            //     key: 'social-network',
            //     content: () => <SocialNetwork />
            // },
            // {
            //     title: <><Icon icon="NotificationsOutlined" /> {__('Notifications')}</>,
            //     key: 'notifications',
            //     content: () => <Notifications />
            // },
            // {
            //     title: <><Icon icon="ShoppingCartOutlined" /> {__('Đơn hàng')}</>,
            //     key: 'orders',
            //     content: () => <Orders />
            // },
            // {
            //     title: <><Icon icon="AttachMoneyRounded" /> {__('Purchase history')}</>,
            //     key: 'purchase-history',
            //     content: () => <PurchaseHistory />
            // },
            // {
            //     title: <><Icon icon="ImageOutlined" /> My learning</>,
            //     key: 'my-learning',
            //     content: () => <></>,
            //     hidden: true,
            // },
        ];

        const handleTabsChange = (index: number) => {
            disableScroll('/user/' + myAccount.slug + '/edit-profile/' + tabs[index].key);
        }

        let tabContentIndex = tabs.findIndex(item => item.key === subtab2);

        if (tabContentIndex < 0) {
            return <Navigate to={'/user/' + myAccount.slug + '/edit-profile/' + tabs[0].key} />;
        }

        if (subtab2 === 'my-learning') {
            return <MyLearning />;
        }

        return (
            <Box
                sx={{
                    '& .tabItems': {
                        borderRight: 0,
                        marginRight: 10,
                    },
                    '&>.tabsBox>.tabContent': {
                        paddingLeft: '0 !important'
                    }
                }}
            >
                <Tabs
                    name='profile'
                    orientation='vertical'
                    tabs={tabs}
                    onChangeTab={handleTabsChange}
                    tabIndex={tabContentIndex}
                />
            </Box>
        )
    }

    return <Navigate to={'/user/' + user.slug} />;


}

export default MyProfile