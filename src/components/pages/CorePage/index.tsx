import { toCamelCase } from 'helpers/string';
import React from 'react';
import { useParams } from 'react-router-dom';
const Error404 = React.lazy(() => import("./Error404"));

function CorePage({ pageCustom }: {
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

export default CorePage
