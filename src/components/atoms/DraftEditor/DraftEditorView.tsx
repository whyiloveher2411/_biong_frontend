import { Theme, Typography } from '@mui/material';
import { ContentBlock, convertFromRaw, Editor, EditorState } from 'draft-js';
//draft editor
import 'draft-js/dist/Draft.css';
import { addClasses } from 'helpers/dom';
import makeCSS from '../makeCSS';


const useStyle = makeCSS((theme: Theme) => ({
    editor: {
        fontSize: theme.spacing(2),
        '& .public-DraftEditor-content': {
            lightHeight: '22px',
        },
        '& .RichEditor-hidePlaceholder .public-DraftEditorPlaceholder-root': {
            display: 'none',
        },
        '& .RichEditor-blockquote': {
            borderLeft: '5px solid ' + theme.palette.dividerDark,
            color: '#666',
            fontStyle: 'italic',
            margin: '16px 0',
            padding: '10px 20px',
        },
        '& .public-DraftStyleDefault-pre': {
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
            fontSize: '16px',
            padding: '20px',
        },
    },
}));

function DraftEditorView({ value }: { value: string }) {

    const classes = useStyle();

    let content: EditorState | string;

    try {
        if (value) {
            content = EditorState.createWithContent(convertFromRaw(JSON.parse(value)));
        } else {
            content = EditorState.createEmpty();
        }
    } catch (error) {
        content = value;
    }


    return (
        <div>
            <div className={addClasses({
                'richEditor-draft-view': true,
                [classes.editor]: true,
            })}>
                {
                    typeof content === 'string' ?
                        <Typography component={'div'} sx={{ '&>p': { margin: 0, fontSize: 16 } }} dangerouslySetInnerHTML={{ __html: content }} />
                        :
                        <Editor
                            blockStyleFn={getBlockStyle}
                            readOnly
                            customStyleMap={styleMap}
                            onChange={() => {
                                //
                            }}
                            editorState={content}
                        />
                }

            </div>
        </div>
    )
}

const styleMap = {
    CODE: {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        fontSize: 16,
        padding: 2,
    },
};

function getBlockStyle(block: ContentBlock): string {
    switch (block.getType()) {
        case 'blockquote':
            return 'RichEditor-blockquote';
        default:
            return '';
    }
}

export default DraftEditorView