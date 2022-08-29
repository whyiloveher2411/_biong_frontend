import { getParamsFromUrl, getUrlParams, replaceUrlParam } from 'helpers/url';
import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

function useQuery<K extends { [key: string]: string | number }>(querys: K): {
    query: { [P in keyof K]: string | null | number },
    changeQuery: (query: { [key: string]: string | null | number }) => void,
} {

    let [searchParams] = useSearchParams();

    const [queryResult, setQueryResult] = React.useState<{ [key: string]: string | null | number }>({
        ...getUrlParams(window.location.search, querys)
    });

    const navigate = useNavigate();

    React.useEffect(() => {
        setQueryResult(prev => ({
            ...prev,
            ...getUrlParams(window.location.search, querys)
        }));

    }, [searchParams]);

    return {
        query: queryResult as { [P in keyof K]: string | null | number },
        changeQuery: (query: { [key: string]: string | null | number }) => {
            navigate('?' + getParamsFromUrl(replaceUrlParam(window.location.href, query)));
        }
    };
}

export default useQuery