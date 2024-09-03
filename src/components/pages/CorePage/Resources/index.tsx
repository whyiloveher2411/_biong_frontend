import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Docs from './Docs';
import Cheatsheets from './Cheatsheets';
import NotFound from 'components/pages/NotFound';

function Resources() {

    let { tab } = useParams<{
        tab: string,
    }>();

    const navigate = useNavigate();

    React.useEffect(() => {
        if (!tab) {
            navigate('/resources/docs');
        }
    }, [tab]);
    alert(tab);
    if (tab === 'docs') {
        return <Docs />
    }

    if (tab === 'cheatsheets') {
        return <Cheatsheets />
    }

    return <NotFound />

}

export default Resources
