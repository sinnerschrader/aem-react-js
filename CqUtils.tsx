interface CqElement {
    dom: any;
}

interface Editable {
    element: CqElement;
    show(skipNested?: boolean): void;
    hide(skipNested?: boolean): void;
    createParagraph(cfg: any): void;
    refresh(): void;
}
interface Wcm {
    getEditable(path: string): Editable;
    unregisterEditable(path: string): void;
    getTopWindow(): {CQ: Cq};
    on(event: string, callback: any, ctx: any): void;
    getNestedEditables(path: String): string[];
    getEditables(): any;
    removeListener(event: String, cb: any): void;
}

export declare type WcmModeListener = (wcmmode: string) => void;

interface Cq {
    WCM: Wcm;
}

declare var CQ: Cq;

interface Window {
    CQ: any;
}

declare var window: Window;


export default class CqUtils {
    /**
     * hide or show the editable at the path.
     */
    public static setVisible(path: string, visible: boolean, recursive: boolean = true): void {
        // TODO TouchUI : $("[data-path='/content/react-demo/demo/jcr:content/par/*']").hide()
        if (typeof CQ !== "undefined") {
            let editable = CQ.WCM.getEditable(path);
            if (editable) {

                if (visible) {
                    editable.show(true);
                } else {
                    editable.hide(true);
                }
            } else {
                if (Object.keys(CQ.WCM.getEditables()).length === 0) {
                    let cb = function (): void {
                        CqUtils.setVisible(path, visible, recursive);
                        CQ.WCM.removeListener("editablesready", cb);
                    }.bind(this);
                        CQ.WCM.on("editablesready", cb, this);
                } else {

                    // This is the add accordion situation: editables already exist but the new editable will be created soon.
                    // TODO handle the timing eithout setTimeout
                    let cb = function (): void {
                        CqUtils.setVisible(path, visible, recursive);
                    };
                    setTimeout(cb, 0);
                }
            }
        }
    }

    /**
     * add a child to a Dnd-Zone. Usually the Dnd-Zone is hidden.
     */
    public static addChild(ctx: any, relPath: string, resourceType: string): void {
        // TODO TouchUi: Granite.author.persistence.createParagraph()
        let e: Editable = CQ.WCM.getEditable(ctx.path + relPath + "/*");
        e.createParagraph({
            resourceType: resourceType
        });
    }


    public static refresh(path: string): void {
        let e: Editable = CQ.WCM.getEditable(path);
        console.log("refresh " + path);
        e.refresh();
    }

    public static removeEditable(path: string): void {
        CQ.WCM.unregisterEditable(path);
    }

    public static on(event: string, cb: WcmModeListener, ctx: any): void {
        if (typeof window !== "undefined" && window.CQ) {
            window.CQ.WCM.on(event, cb, this);
        }
    }

    public static refreshNested(path: string): void {
        let rootEditable: any = CQ.WCM.getEditable(path);
        if (rootEditable) {
            let element: any = rootEditable.element;
            let editables: any = CQ.WCM.getEditables();
            Object.keys(editables).forEach((editablePath: string) => {
                let editable: any = editables[editablePath];
                if (editable && CqUtils.isAncestor(element, editable) && !CqUtils.isVisible(editable)) {
                    editable.show();
                }
            });
        }
    }

    private static isVisible(editable: any): boolean {
        return editable.element.dom.getBoundingClientRect().width > 0;
    }

    private static isAncestor(ancestor: any, element: any): boolean {
        return true;
    }

    public static getEditables(): any {
        return window.CQ.getEditables();
    }
}



