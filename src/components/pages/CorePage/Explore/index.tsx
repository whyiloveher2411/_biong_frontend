import { useParams } from 'react-router-dom';
import ExploreDetail from './ExploreDetail';
import ExplorePage from './ExplorePage';

const Explore = () => {

    let { tab } = useParams<{
        tab: string,
    }>();

    if (tab) {
        return (
            <ExploreDetail />
        )
    }

    return (
        <ExplorePage />
    )
};

export default Explore;
