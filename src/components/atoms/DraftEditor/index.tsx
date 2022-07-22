import { Theme } from '@mui/material';
import { ContentBlock, convertToRaw, DraftHandleValue, Editor, EditorState, RichUtils } from 'draft-js';
//draft editor
import 'draft-js/dist/Draft.css';
import { addClasses } from 'helpers/dom';
import React from 'react';
import makeCSS from '../makeCSS';


const useStyle = makeCSS((theme: Theme) => ({
    root: {
        background: theme.palette.background.paper,
        border: '1px solid ' + theme.palette.dividerDark,
        padding: theme.spacing(2),
        borderRadius: theme.spacing(0.5),
        width: '100%',
        '& .RichEditor-controls': {
            marginBottom: '5px',
            userSelect: 'none',
        },
        '& .RichEditor-styleButton': {
            color: theme.palette.text.disabled,
            cursor: 'pointer',
            marginRight: '16px',
            padding: '2px 0',
            display: 'inline-block',
            '&:hover': {
                color: theme.palette.text.primary,
            }
        },
        '& .RichEditor-activeButton': {
            color: theme.palette.primary.main,
        },
    },
    editor: {
        borderTop: '1px solid ' + theme.palette.dividerDark,
        cursor: 'text',
        fontSize: theme.spacing(2),
        marginTop: '10px',
        '& .public-DraftEditorPlaceholder-root, & .public-DraftEditor-content': {
            margin: '0 -16px -16px',
            padding: '16px',
        },
        '& .public-DraftEditor-content': {
            minHeight: '100px',
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

function DraftEditor({ editorState, setEditorState }: {
    editorState: EditorState,
    setEditorState: React.Dispatch<React.SetStateAction<EditorState>> | ((content: EditorState) => void),
}) {

    const classes = useStyle();

    const toggleBlockType = (blockType: string) => {
        handleOnChange(RichUtils.toggleBlockType(editorState, blockType));
    };

    const toggleInlineStyle = (inlineStyle: string) => {
        handleOnChange(RichUtils.toggleInlineStyle(editorState, inlineStyle))
    }

    const handleKeyCommand = (command: string): DraftHandleValue => {

        const newState = RichUtils.handleKeyCommand(editorState, command);

        if (newState) {
            handleOnChange(newState);
            return 'handled';
        }

        return 'not-handled';
    };


    // const [valueTemp, setValueTemp] = React.useState<RawDraftContentState | null>(null);

    const handleOnChange = (editorState: EditorState) => {
        setEditorState(editorState);
    }

    let contentState = editorState.getCurrentContent();

    return (
        <>
            <div className={classes.root}>
                <BlockStyleControls
                    editorState={editorState}
                    onToggle={toggleBlockType}
                />

                <InlineStyleControls
                    editorState={editorState}
                    onToggle={toggleInlineStyle}
                />

                <div className={addClasses({
                    [classes.editor]: true,
                    ['RichEditor-hidePlaceholder']: !contentState.hasText() && contentState.getBlockMap().first().getType() !== 'unstyled'
                })}>
                    <Editor
                        blockStyleFn={getBlockStyle}
                        customStyleMap={styleMap}
                        editorState={editorState}
                        handleKeyCommand={handleKeyCommand}
                        onChange={handleOnChange}
                        placeholder="Enter something..."
                        spellCheck={true}
                    />
                </div>
            </div>
        </>
    )
}

const BlockStyleControls = (props: {
    editorState: EditorState,
    onToggle: (blockType: string) => void
}) => {
    const { editorState } = props;
    const selection = editorState.getSelection();
    const blockType = editorState
        .getCurrentContent()
        .getBlockForKey(selection.getStartKey())
        .getType();
    return (
        <div className="RichEditor-controls">
            {BLOCK_TYPES.map(type =>
                <StyleButton
                    key={type.label}
                    active={type.style === blockType}
                    label={type.label}
                    onToggle={props.onToggle}
                    style={type.style}
                />
            )}
        </div>
    );
};

const StyleButton = (props: {
    active?: boolean,
    label: string,
    onToggle: (blockType: string) => void,
    style: string
}) => {


    const onToggle = (e: React.MouseEvent<HTMLSpanElement>) => {
        e.preventDefault();
        props.onToggle(props.style);
    };

    let className = 'RichEditor-styleButton';

    if (props.active) {
        className += ' RichEditor-activeButton';
    }

    return (
        <span className={className} onMouseDown={onToggle}>
            {props.label}
        </span>
    );
}

const BLOCK_TYPES = [
    { label: 'H1', style: 'header-one' },
    { label: 'H2', style: 'header-two' },
    { label: 'H3', style: 'header-three' },
    { label: 'H4', style: 'header-four' },
    { label: 'H5', style: 'header-five' },
    { label: 'H6', style: 'header-six' },
    { label: 'Blockquote', style: 'blockquote' },
    { label: 'UL', style: 'unordered-list-item' },
    { label: 'OL', style: 'ordered-list-item' },
    { label: 'Code Block', style: 'code-block' },
];


const INLINE_STYLES = [
    { label: 'Bold', style: 'BOLD' },
    { label: 'Italic', style: 'ITALIC' },
    { label: 'Underline', style: 'UNDERLINE' },
    { label: 'Monospace', style: 'CODE' },
];

const styleMap = {
    CODE: {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        fontSize: 16,
        padding: 2,
    },
};

const InlineStyleControls = (props: {
    editorState: EditorState,
    onToggle: (inlineStyle: string) => void
}) => {

    let currentStyle = props.editorState.getCurrentInlineStyle();

    return (
        <div className="RichEditor-controls">
            {INLINE_STYLES.map(type =>
                <StyleButton
                    key={type.label}
                    active={currentStyle.has(type.style)}
                    label={type.label}
                    onToggle={props.onToggle}
                    style={type.style}
                />
            )}
        </div>
    );
};

function getBlockStyle(block: ContentBlock): string {
    switch (block.getType()) {
        case 'blockquote':
            return 'RichEditor-blockquote';
        default:
            return '';
    }
}

export function getDarftContent(editorState: EditorState): string | null {

    let valueNote = convertToRaw(editorState.getCurrentContent());
    if (valueNote) {
        let text = valueNote.blocks.map(block => (!block.text.trim() && '\n') || block.text).join('\n').trim();

        if (text) {
            return JSON.stringify(valueNote)
        }
    }

    return null;
}
export default DraftEditor