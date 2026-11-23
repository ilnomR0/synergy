export class Section {
//@ts-ignore
    private elements: HTMLElement[] = [];

    constructor() {

    }
    appendElement(...elements:HTMLElement[]){
        this.elements.push(...elements);
    }
}
