import { Box } from '@mui/material'
import NoticeContent from 'components/molecules/NoticeContent'
import { __ } from 'helpers/i18n'
import React from 'react'
import { UserProps } from 'store/user/user.reducers'

function NewFeed({ user }: {
    user: UserProps
}) {
    return (
        <Box>
            <NoticeContent
                title={__('Something awesome is coming!')}
                description={__('We are working very hard on the new version of our site. It will bring a lot of new features. Stay tuned!')}
                image="/images/undraw_work_chat_erdt.svg"
            />
        </Box>
    )
}

export default NewFeed