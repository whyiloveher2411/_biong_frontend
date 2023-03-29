import { toCamelCase } from 'helpers/string';
import React, { Suspense } from 'react';
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

    return <Suspense fallback={<></>}>
        {(() => {
            if (page) {

                try {
                    let pageCompoment = toCamelCase(page);

                    try {
                        if (tab && subtab1 && subtab2) {
                            const Component = React.lazy(() => import('./' + pageCompoment + '/' + toCamelCase(tab as string) + '/' + toCamelCase(subtab1 as string) + '/' + toCamelCase(subtab2 as string)));
                            return <Component />
                            //eslint-disable-next-line
                            // let resolved = require('./' + pageCompoment + '/' + toCamelCase(tab) + '/' + toCamelCase(subtab1) + '/' + toCamelCase(subtab2)).default;
                            // return React.createElement(resolved, { page: page });
                        }
                    } catch (error) {
                        //
                    }

                    try {
                        if (tab && subtab1) {
                            //eslint-disable-next-line

                            const Component = React.lazy(() => import('./' + pageCompoment + '/' + toCamelCase(tab as string) + '/' + toCamelCase(subtab1 as string)));
                            return <Component />
                            // let resolved = require('./' + pageCompoment + '/' + toCamelCase(tab) + '/' + toCamelCase(subtab1)).default;
                            // return React.createElement(resolved, { page: page });
                        }
                    } catch (error) {
                        //
                    }

                    try {
                        if (tab) {
                            //eslint-disable-next-line
                            const Component = React.lazy(() => import('./' + pageCompoment + '/' + toCamelCase(tab as string)));
                            return <Component />
                            // let resolved = require('./' + pageCompoment + '/' + toCamelCase(tab)).default;
                            // return React.createElement(resolved, { page: page });
                        }
                    } catch (error) {
                        //
                    }

                    const Component = React.lazy(() => import('./' + pageCompoment));
                    return <Component />

                    //eslint-disable-next-line
                    // let resolved = require('./' + pageCompoment).default;

                    // return React.createElement(resolved, { page: page });

                } catch (error) {
                    //
                }

                return <Error404 />

            }

            return <Error404 />
        })()}
    </Suspense>

}

export default CorePage
