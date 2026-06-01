export class levelLoader{

    //@ts-ignore
    private static root!:FileSystemDirectoryHandle;


    public static async initLLS(){
        this.root = await navigator.storage.getDirectory(); 

    }
    //@ts-ignore
    public static loadLevel(levelLocation:string){

    }
    //@ts-ignore
    public static saveLevel(levelLocation:string, levelData:JSON){

    }
    //@ts-ignore
    public static createLevel(levelLocation:string, levelData:JSON){

    }
}


