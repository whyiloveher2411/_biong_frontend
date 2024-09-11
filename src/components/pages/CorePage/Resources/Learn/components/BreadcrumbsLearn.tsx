import { Breadcrumbs, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import { Cheatsheet } from 'services/cheatsheetsService'

function BreadcrumbsLearn({ content }: { content?: Cheatsheet | null }) {
    return (
        <Breadcrumbs aria-label="breadcrumb">
            <Link to="/resources/cheatsheets">Cheatsheets</Link>
            <Typography>
                {content?.title}
            </Typography>
        </Breadcrumbs>
    )
}

export default BreadcrumbsLearn
