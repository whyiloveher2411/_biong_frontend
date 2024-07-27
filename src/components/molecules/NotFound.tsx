import React from 'react';
import { __ } from 'helpers/i18n';

function NotFound({ children, title = __('Nothing To Display.'), subTitle = __('Seems like no data have been created yet.'), img }: {
    children?: React.ReactNode,
    title?: React.ReactNode,
    subTitle?: React.ReactNode,
    img?: string
}) {

    return (
        <h2 style={{ textAlign: 'center' }}>
            <img style={{ maxWidth: '100%', margin: '0 auto 16px', display: 'block', maxHeight: 350 }} src={img ? img : "/images/notfound.svg"} />
            <strong>
                {
                    children ?
                        children :
                        <>
                            {title} <br />
                            <span style={{ color: '#ababab', fontSize: '16px' }}>{subTitle}</span>
                            {children}
                        </>
                }
            </strong>
        </h2>
    )
}

export default NotFound
