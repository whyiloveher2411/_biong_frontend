import { useParams } from 'react-router-dom';
import ExploreDetail from './ExploreDetail';
import ExplorePage from './ExplorePage';

const Explore = () => {

    let { tab, subtab1 } = useParams<{
        tab: string,
        subtab1: string,
    }>();

    if (tab) {

        if (tab === 'tag' && subtab1) {
            return <ExplorePage cate={subtab1} />
        }

        return (
            <ExploreDetail />
        )
    }

    return (
        <ExplorePage />
    )
};

export default Explore;
