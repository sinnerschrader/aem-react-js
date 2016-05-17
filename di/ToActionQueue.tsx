

import ActionQueue from "./ActionQueue";
export default class ToActionQueue extends ActionQueue {

    public push(cb: () => void): void {
        window.setTimeout(cb, 0);
    }

}


