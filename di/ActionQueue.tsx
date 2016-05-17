export default class ActionQueue {

    private cbs: (() => void)[];

    constructor() {
        this.cbs = [];
    }

    public push(cb: () => void): void {
        console.log("issue load")
        this.cbs.push(cb);
    }

    public hasNext(): boolean {
        return this.cbs.length > 0;
    }

    public next(): void {
        let cb: () => void = this.cbs.pop()
        cb();
    }

}


