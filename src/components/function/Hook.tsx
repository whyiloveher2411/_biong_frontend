import React, { ReactNode } from 'react'
import { useSelector } from 'react-redux';
import { RootState } from 'store/configureStore';
import { toCamelCase } from 'helpers/string';

interface Props {
    [key: string]: ANY,
    hook: string
}

function Hook({ hook, ...propsChild }: Props) {

    const plugins = useSelector((state: RootState) => state.plugins);

    return <React.Fragment>
        {
            (() => {

                let viewsTemp: Array<ReactNode> = [];

                Object.keys(plugins).forEach((plugin) => (
                    (() => {
                        if (plugins[plugin].status === 'publish') {
                            try {
                                let compoment = toCamelCase(plugin) + '/' + hook;

                                //eslint-disable-next-line
                                let resolved = require(`./../../plugins/${compoment}`).default;

                                if (Number.isInteger(resolved.priority)) {
                                    viewsTemp.splice(resolved.priority, 0, React.createElement(resolved.content, { key: plugin, plugin: plugins[plugin], ...propsChild }));
                                } else {
                                    viewsTemp.push(React.createElement(resolved, { key: plugin, plugin: plugins[plugin], ...propsChild }));
                                }

                            } catch (error) {
                                //
                            }
                        }
                    })()
                ));

                return viewsTemp.map(item => item);
            })()

        }
    </React.Fragment>
}

export default Hook
