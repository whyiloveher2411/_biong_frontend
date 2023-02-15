interface CodeNodeProps {
    type: string;
    value: string;
    match: string;
    newline: string;
    nodes: CodeNode[];
}
export type CodeNodeType = Partial<CodeNodeProps> | null;
export declare class CodeNode {
    type: string;
    value: any;
    match: string;
    newline: string;
    constructor(node: CodeNodeType);
    get protected(): boolean;
}
export declare class Block extends CodeNode {
    nodes: CodeNode[];
    constructor(node: CodeNodeType);
    push(node: CodeNode): void;
    get protected(): boolean;
}
export {};
