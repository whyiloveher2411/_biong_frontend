export class CodeNode {
    constructor(node) {
        this.type = node.type;
        if (node.value)
            this.value = node.value;
        if (node.match)
            this.match = node.match;
        this.newline = node.newline || "";
    }
    get protected() {
        return Boolean(this.match) && this.match[1] === "!";
    }
}
export class Block extends CodeNode {
    constructor(node) {
        super(node);
        this.nodes = node.nodes || [];
    }
    push(node) {
        this.nodes.push(node);
    }
    get protected() {
        return this.nodes.length > 0 && this.nodes[0].protected === true;
    }
}
//# sourceMappingURL=node.js.map