import { Box } from '@mui/material';
import { useTransferLinkDisableScroll } from 'components/atoms/ScrollToTop';
import Tabs, { TabProps } from 'components/atoms/Tabs';
import { useSelector } from 'react-redux';
import { Navigate, useParams } from 'react-router-dom';
import { RootState } from 'store/configureStore';
import { UserProps } from 'store/user/user.reducers';
import MyLearning from './MyLearning';
import EditProfile from './Profile/EditProfile';
import Settings from './Profile/Settings';
// import SocialNetwork from './Profile/SocialNetwork';
import ManageAccountsOutlined from '@mui/icons-material/ManageAccountsOutlined';
import SecurityOutlined from '@mui/icons-material/SecurityOutlined';

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
                title: <><ManageAccountsOutlined />Hồ sơ</>,
                key: 'overview',
                content: () => <EditProfile onLoadProfile={onLoadProfile} />
            },
            // {
            //     title: <><Icon icon="LockOutlined" /> {__('Bảo mật')}</>,
            //     key: 'security',
            //     content: () => <Security />
            // },
            {
                title: <><SecurityOutlined />Cài đặt</>,
                key: 'settings',
                content: () => <Settings />
            },
            // {
            //     title: <><Icon icon={IconBit} />Nhật ký bit</>,
            //     key: 'bit-transaction-log',
            //     content: () => <BitTransactionLog />
            // },
            // {
            //     title: <><AppsIcon />Ứng dụng</>,
            //     key: 'application',
            //     content: () => <AppSettings />
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