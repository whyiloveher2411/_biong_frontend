// import { delayUntil } from 'helpers/script';
// import { delayUntil } from 'helpers/script';
import { Box } from '@mui/material';
import { toCamelCase } from 'helpers/string';
import React from 'react';
import { useParams } from 'react-router-dom';
import LinearProgress from 'components/atoms/LinearProgress';

// const templateMap = {
//     Homepage: React.lazy(() => import("./HomePage/index")),
//     About: React.lazy(() => import("./About/index")),
//     Auth: React.lazy(() => import("./Auth/index")),
//     CareerPath: React.lazy(() => import("./CareerPath/index")),
//     Cart: React.lazy(() => import("./Cart/index")),
//     ContactUs: React.lazy(() => import("./ContactUs/index")),
//     Instructor: React.lazy(() => import("./Instructor/index")),
//     Roadmap: React.lazy(() => import("./Roadmap/index")),
//     Terms: React.lazy(() => import("./Terms/index")),
//     User: React.lazy(() => import("./User/index")),
//     Explore: React.lazy(() => import("./Explore/index")),
//     Course: React.lazy(() => import("./Course/index")),
//     Error404: React.lazy(() => import("./Error404")),
// };


function CorePage() {

    const done = React.useRef<{
        [key: string]: React.ReactNode
    }>({

    });

    const [, setComponentNew] = React.useState<ANY>(null);

    const { page, tab, subtab1, subtab2 } = useParams();

    const getNameComponent = (page?: string, tab?: string, subtab1?: string, subtab2?: string) => {

        const names = [];

        if (page) {
            names.push(page);
        }

        if (tab) {
            names.push(tab);
        }

        if (subtab1) {
            names.push(subtab1);
        }

        if (subtab2) {
            names.push(subtab2);
        }

        return names.join('/');
    }

    React.useEffect(() => {

        let slug = '', category = '';

        if (!done.current[page + '1']) {
            setComponentNew(<Box />);

            let name = '';
            const imported = async () => {
                if (page) {

                    try {
                        let pageCompoment = toCamelCase(page);

                        if (tab && subtab1 && subtab2) {

                            slug = subtab2;
                            category = subtab1;

                            try {
                                const check = await import('./' + pageCompoment + '/' + toCamelCase(tab as string) + '/' + toCamelCase(subtab1 as string) + '/' + toCamelCase(subtab2 as string));

                                if (check && typeof check === 'object') {
                                    name = getNameComponent(page, tab, subtab1, subtab2);
                                    return check;
                                }

                            } catch (error) {
                                //
                            }


                            try {
                                const check = await import('./' + pageCompoment + '/' + toCamelCase(tab as string) + '/' + toCamelCase(subtab1 as string) + '/[slug]');

                                if (check && typeof check === 'object') {
                                    name = getNameComponent(page, tab, subtab1, subtab2);
                                    return check;
                                }

                            } catch (error) {
                                //
                            }

                            try {
                                const check = await import('./' + pageCompoment + '/' + toCamelCase(tab as string) + '/[slug]/[slug]');

                                if (check && typeof check === 'object') {
                                    name = getNameComponent(page, tab, subtab1, subtab2);
                                    return check;
                                }

                            } catch (error) {
                                //
                            }

                            try {
                                const check = await import('./' + pageCompoment + '/[slug]/[slug]/[slug]');

                                if (check && typeof check === 'object') {
                                    name = getNameComponent(page, tab, subtab1, subtab2);
                                    return check;
                                }

                            } catch (error) {
                                //
                            }

                        }

                        if (tab && subtab1) {

                            slug = subtab1;
                            category = tab;

                            try {
                                const check = await import('./' + pageCompoment + '/' + toCamelCase(tab as string) + '/' + toCamelCase(subtab1 as string));

                                if (check && typeof check === 'object') {
                                    name = getNameComponent(page, tab, subtab1);
                                    return check;
                                }

                            } catch (error) {
                                //
                            }

                            try {
                                const check = await import('./' + pageCompoment + '/' + toCamelCase(tab as string) + '/[slug]');

                                if (check && typeof check === 'object') {
                                    name = getNameComponent(page, tab, subtab1);
                                    return check;
                                }

                            } catch (error) {
                                //
                            }

                            try {
                                const check = await import('./' + pageCompoment + '/[slug]/[slug]');

                                if (check && typeof check === 'object') {
                                    name = getNameComponent(page, tab, subtab1);
                                    return check;
                                }

                            } catch (error) {
                                //
                            }

                        }


                        if (tab) {
                            slug = tab;
                            try {
                                const check = await import('./' + pageCompoment + '/' + toCamelCase(tab as string));
                                if (check && typeof check === 'object') {
                                    name = getNameComponent(page, tab);
                                    return check;
                                }
                            } catch (error) {
                                //
                            }

                            try {
                                const check = await import('./' + pageCompoment + '/[slug]');
                                if (check && typeof check === 'object') {
                                    name = getNameComponent(page, tab);
                                    return check;
                                }
                            } catch (error) {
                                //
                            }
                        }


                        try {
                            const check = await import('./' + pageCompoment);

                            if (check && typeof check === 'object') {
                                name = getNameComponent(page);
                                return check;
                            }

                        } catch (error) {
                            //
                        }


                    } catch (error) {
                        //
                    }

                    name = getNameComponent(page);
                    return import("./Error404");

                }
                name = getNameComponent('Homepage');
                return import("./HomePage/index");
            };
            const Component = imported();

            if (Component.then) {
                Component.then(C => {
                    if (C.default) {
                        setComponentNew(Component);
                        done.current[name + '1'] = React.createElement(C.default, {
                            slug, category, page, tab, subtab1, subtab2
                        });
                    }
                });
            }
        }

    }, [page, tab, subtab1, subtab2]);

    if (done.current[getNameComponent(page, tab, subtab1, subtab2) + '1']) {
        return <> {done.current[getNameComponent(page, tab, subtab1, subtab2) + '1']} </>
    }

    if (done.current[getNameComponent(page, tab, subtab1) + '1']) {
        return <> {done.current[getNameComponent(page, tab, subtab1) + '1']} </>
    }

    if (done.current[getNameComponent(page, tab) + '1']) {
        return <> {done.current[getNameComponent(page, tab) + '1']} </>
    }

    if (done.current[getNameComponent(page) + '1']) {
        return <> {done.current[getNameComponent(page) + '1']} </>
    }

    if (!page) {
        return <> {done.current[getNameComponent('Homepage') + '1']} </>
    }

    return <LinearProgress />

}

export default CorePage


// async function getComponent(page?: string, tab?: string, subtab1?: string, subtab2?: string) {
//     if (page) {

//         try {
//             let pageCompoment = toCamelCase(page);

//             if (tab && subtab1 && subtab2) {
//                 try {
//                     const check = await import('./' + pageCompoment + '/' + toCamelCase(tab as string) + '/' + toCamelCase(subtab1 as string) + '/' + toCamelCase(subtab2 as string));

//                     if (check && typeof check === 'object') {
//                         const Component = React.lazy(() => import('./' + pageCompoment + '/' + toCamelCase(tab as string) + '/' + toCamelCase(subtab1 as string) + '/' + toCamelCase(subtab2 as string)));
//                         return <Component />
//                     }

//                 } catch (error) {
//                     //
//                 }
//             }


//             if (tab && subtab1) {

//                 try {
//                     const check = await import('./' + pageCompoment + '/' + toCamelCase(tab as string) + '/' + toCamelCase(subtab1 as string));

//                     if (check && typeof check === 'object') {
//                         const Component = React.lazy(() => import('./' + pageCompoment + '/' + toCamelCase(tab as string) + '/' + toCamelCase(subtab1 as string)));
//                         return <Component />
//                     }

//                 } catch (error) {
//                     //
//                 }

//             }


//             if (tab) {
//                 try {
//                     const check = await import('./' + pageCompoment + '/' + toCamelCase(tab as string));

//                     if (check && typeof check === 'object') {
//                         const Component = React.lazy(() => import('./' + pageCompoment + '/' + toCamelCase(tab as string)));
//                         return <Component />
//                     }
//                 } catch (error) {
//                     //
//                 }
//             }


//             try {
//                 const check = await import('./' + pageCompoment);

//                 if (check && typeof check === 'object') {
//                     const Component = React.lazy(() => import('./' + pageCompoment));
//                     return <Component />
//                 }

//             } catch (error) {
//                 //
//             }


//         } catch (error) {
//             //
//         }

//         return <Error404 />

//     }

//     return <Homepage />

// }