import { useParams } from 'react-router-dom';
import ExploreDetail from './ExploreDetail';
import ExplorePage from './ExplorePage';

const Explore = () => {

    let { tab, subtab1 } = useParams<{
        tab: string,
        subtab1: string,
    }>();

    if (tab && !subtab1) {
        return (
            <ExploreDetail slug={tab} />
        )
    }
    return (
        <ExplorePage cate={subtab1} />
    )
};

export default Explore;
