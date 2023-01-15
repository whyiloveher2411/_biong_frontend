import { toCamelCase } from 'helpers/string';
import React from 'react';
import { useParams } from 'react-router-dom';
import Error404 from './Error404';
import { UserState, useUser } from 'store/user/user.reducers';
import { Box } from '@mui/system';

function CorePageMain({ pageCustom }: {
    pageCustom?: string
}) {

    let { page, tab, subtab1, subtab2 } = useParams<{
        page: string,
        tab: string,
        subtab1: string,
        subtab2: string,
    }>();

    if (pageCustom) {
        page = pageCustom;
    }

    if (page) {

        try {
            let pageCompoment = toCamelCase(page);

            try {
                if (tab && subtab1 && subtab2) {
                    //eslint-disable-next-line
                    let resolved = require('./' + pageCompoment + '/' + toCamelCase(tab) + '/' + toCamelCase(subtab1) + '/' + toCamelCase(subtab2)).default;
                    return React.createElement(resolved, { page: page });
                }
            } catch (error) {
                //
            }

            try {
                if (tab && subtab1) {
                    //eslint-disable-next-line
                    let resolved = require('./' + pageCompoment + '/' + toCamelCase(tab) + '/' + toCamelCase(subtab1)).default;
                    return React.createElement(resolved, { page: page });
                }
            } catch (error) {
                //
            }

            try {
                if (tab) {
                    //eslint-disable-next-line
                    let resolved = require('./' + pageCompoment + '/' + toCamelCase(tab)).default;
                    return React.createElement(resolved, { page: page });
                }
            } catch (error) {
                //
            }

            //eslint-disable-next-line
            let resolved = require('./' + pageCompoment).default;

            return React.createElement(resolved, { page: page });

        } catch (error) {
            //
        }

        return <Error404 />

    }

    return <Error404 />
}


function CorePage({ pageCustom }: {
    pageCustom?: string
}) {

    const times = React.useRef(0);

    const user = useUser();

    React.useEffect(() => {

        if (user._state !== UserState.unknown) {
            ++times.current;
        }

    }, [user]);

    if (times.current % 2 === 0) {
        return <CorePageMain pageCustom={pageCustom} />
    }

    return <Box><CorePageMain pageCustom={pageCustom} /></Box>
}

export default CorePage
