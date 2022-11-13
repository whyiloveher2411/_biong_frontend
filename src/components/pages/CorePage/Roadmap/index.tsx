import { useParams } from 'react-router-dom'
import RoadmapDetail from './components/RoadmapDetail'
import RoadmapList from './components/RoadmapList'

function index() {

    const { tab } = useParams();

    if (tab) {
        return (
            <RoadmapDetail slug={tab} />
        )
    }

    return (
        <RoadmapList />
    )

}

export default index