import { useParams } from 'react-router-dom';
import FreeTutorialsCategory from './FreeTutorialsCategory';
import FreeTutorialsIndex from './FreeTutorialsIndex';

function index() {

    let { tab } = useParams<{
        tab: string,
    }>();

    if (tab) {
        return <FreeTutorialsCategory slug={tab} />
    }

    return <FreeTutorialsIndex />
}

export default index