// import { delayUntil } from 'helpers/script';
// import { delayUntil } from 'helpers/script';
import { toCamelCase } from 'helpers/string';
import React, { Suspense } from 'react';
import { useParams } from 'react-router-dom';

const Error404 = React.lazy(() => import("./Error404"));

function CorePage({ pageCustom }: {
    pageCustom?: string
}) {

    const [component, setComponent] = React.useState<JSX.Element | null>(null);

    let { page, tab, subtab1, subtab2 } = useParams<{
        page: string,
        tab: string,
        subtab1: string,
        subtab2: string,
    }>();

    if (pageCustom) {
        page = pageCustom;
    }

    React.useEffect(() => {
        (async () => {
            setComponent(await getComponent(page, tab, subtab1, subtab2));
        })();
    }, [page, tab, subtab1, subtab2]);

    return <Suspense fallback={<></>}>
        {component}
    </Suspense>

}

export default CorePage


async function getComponent(page?: string, tab?: string, subtab1?: string, subtab2?: string) {
    if (page) {

        try {
            let pageCompoment = toCamelCase(page);

            if (tab && subtab1 && subtab2) {
                try {
                    const check = await import('./' + pageCompoment + '/' + toCamelCase(tab as string) + '/' + toCamelCase(subtab1 as string) + '/' + toCamelCase(subtab2 as string));

                    if (check && typeof check === 'object') {
                        const Component = React.lazy(() => import('./' + pageCompoment + '/' + toCamelCase(tab as string) + '/' + toCamelCase(subtab1 as string) + '/' + toCamelCase(subtab2 as string)));
                        return <Component />
                    }

                } catch (error) {
                    //
                }
            }


            if (tab && subtab1) {

                try {
                    const check = await import('./' + pageCompoment + '/' + toCamelCase(tab as string) + '/' + toCamelCase(subtab1 as string));

                    if (check && typeof check === 'object') {
                        const Component = React.lazy(() => import('./' + pageCompoment + '/' + toCamelCase(tab as string) + '/' + toCamelCase(subtab1 as string)));
                        return <Component />
                    }

                } catch (error) {
                    //
                }

            }


            if (tab) {
                try {
                    const check = await import('./' + pageCompoment + '/' + toCamelCase(tab as string));

                    if (check && typeof check === 'object') {
                        const Component = React.lazy(() => import('./' + pageCompoment + '/' + toCamelCase(tab as string)));
                        return <Component />
                    }
                } catch (error) {
                    //
                }
            }


            try {
                const check = await import('./' + pageCompoment);

                if (check && typeof check === 'object') {
                    const Component = React.lazy(() => import('./' + pageCompoment));
                    return <Component />
                }

            } catch (error) {
                //
            }


        } catch (error) {
            //
        }

        return <Error404 />

    }

    return <Error404 />

}