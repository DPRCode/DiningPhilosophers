const places:number = 5;

class Fork{
    private isFree:boolean;
    private id:number;

    constructor(id:number) {
        this.id = id;
        this.isFree = true;
    }
    public getId():number{
        return this.id;
    }

    public getIsFree():boolean{
        return this.isFree;
    }

    public setIsFree(isFree:boolean){
        this.isFree = isFree;
    }
}
class Philosopher {
    private observers:Function[];
    static readonly THINKING:number = 0;
    static readonly HUNGRY:number = 1;
    static readonly EATING:number = 2;
    private state:number;
    private id:number;
    public leftFork:Fork;
    public rightFork:Fork;

    constructor(id:number){
        this.id = id;
        this.state = Philosopher.THINKING;
    }

    public addObserver(observer:Function){
        if (!this.observers){
            this.observers = [];
        }
        this.observers.push(observer);
    }

    private notifyObservers(){
        console.log('Philosopher '+this.getId()+' has changed');
        this.observers.forEach((observer)=>{
            observer();
        });
    }

    public getState():number{
        return this.state;
    }

    public setState(state:number){
        this.state = state;
    }

    public getId():number{
        return this.id;
    }

    public eat(){
        if (this.leftFork.getIsFree() && this.rightFork.getIsFree()) {
            this.setState(Philosopher.EATING);
            this.leftFork.setIsFree(false);
            this.rightFork.setIsFree(false);
            console.log('Philosopher '+this.getId()+' is eating');
            this.notifyObservers();
            setTimeout(()=>{
                this.leftFork.setIsFree(true);
                this.rightFork.setIsFree(true);
                this.setState(Philosopher.THINKING);
                console.log('Philosopher '+this.getId()+' is thinking');
                this.notifyObservers();
            } , 5000);
        }else{
            this.setState(Philosopher.HUNGRY);
            console.log('Philosopher '+this.getId()+' is waiting to eat');
            this.notifyObservers();
            setTimeout(()=>{
                this.eat();
            }, 4000);
        }
    }
}
class Table{
    public observers:Function[];
    public philosophers:Philosopher[];
    public forks:Fork[];
    constructor() {
        this.observers = [];
        this.forks = [];
        for (let i = 1; i <= places; i++) {
            this.forks.push(new Fork(i));
        }

        this.philosophers = [];
        for (let i = 1; i <= places; i++) {
            let p = new Philosopher(i);
            p.addObserver(()=>{
                this.notifyObservers();
            });
            p.leftFork = this.forks[i];
            if (i == 0){
                p.rightFork = this.forks[places];
            }else{
                p.rightFork = this.forks[i-1];
            }
            this.philosophers.push(p);
        }
    }

    public addObserver(observer:Function){
        this.observers.push(observer);
    }

    private notifyObservers(){
        console.log('Table has changed');
        this.observers.forEach((observer)=>{
            observer();
        });
    }



}
class UI{
    private ctx:CanvasRenderingContext2D;
    private canvas:HTMLCanvasElement;
    private canvasWidth:number;
    private canvasHeight:number;
    private table:Table;
    private philosopherELoaded:boolean;
    private philosopherTLoaded:boolean;
    private philosopherHLoaded:boolean;


    constructor(){
        this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
        this.canvasWidth = 5000;
        this.canvasHeight = 5000;
        this.canvas.width = this.canvasWidth;
        this.canvas.height = this.canvasHeight;
        this.ctx = this.canvas.getContext('2d');
        this.ctx.translate(this.canvasWidth / 2, this.canvasHeight / 2);
        this.philosopherELoaded = false;
        this.philosopherTLoaded = false;
        this.philosopherHLoaded = false;
        this.table = new Table();
        this.table.addObserver(()=>{
            this.updateCanvas();
        });
        let startbutton = document.getElementById('Startbutton') as HTMLButtonElement;
        startbutton.addEventListener('click', ()=>{
            this.table.philosophers[3].eat();
            this.table.philosophers[2].eat();
            console.log(this.table);
        });
        let button2 = document.getElementById('Clearbutton') as HTMLButtonElement;
        button2.addEventListener('click', ()=>{
            this.clearCanvas();
        });
        let button3 = document.getElementById('UpdateButton') as HTMLButtonElement;
        button3.addEventListener('click', ()=>{
            this.updateCanvas();
        });
    }

    public updateCanvas(){
        try {
            this.clearCanvas();
            this.ctx.save();
            this.philosopherTLoaded = false;
            this.philosopherELoaded = false;
            this.philosopherHLoaded = false;
            // Darw table
            let tableWith= 2000;
            let tableHeight = 2000;
            let tableImage = new Image();
            tableImage.onload = ()=>{
                this.ctx.drawImage(tableImage, -tableWith/2, -tableHeight/2, tableWith, tableHeight);
            }
            tableImage.src = 'res/table.png';
            // Draw Plates
            let plateImage = new Image();
            plateImage.onload = ()=>{
                for (let i = 1; i <= places; i++) {
                    this.drawOnTablePosition(i, 800, plateImage,500,500);
                }
            }
            plateImage.src = 'res/plate.png';
            // Draw philosophers
            let philosopherImageT = new Image();
            let philosopherImageE = new Image();
            let philosopherImageH = new Image();
            philosopherImageT.onload = ()=>{
                this.philosopherTLoaded = true;
                this.drawPhilosophers(philosopherImageT, philosopherImageE, philosopherImageH);
            }
            philosopherImageE.onload = ()=>{
                this.philosopherELoaded = true;
                this.drawPhilosophers(philosopherImageT, philosopherImageE, philosopherImageH);
            }
            philosopherImageH.onload = ()=>{
                this.philosopherHLoaded = true;
                this.drawPhilosophers(philosopherImageT, philosopherImageE, philosopherImageH);
            }
            philosopherImageT.src = 'res/philosopherT.png';
            philosopherImageE.src = 'res/philosopherE.png';
            philosopherImageH.src = 'res/philosopherH.png';
            // Draw forks
            let forkImage = new Image();
            forkImage.onload = ()=>{
                this.table.forks.forEach((fork)=>{
                    if (fork.getIsFree()) {
                        if (fork.getIsFree()){
                            this.drawOnForkPosition(fork.getId(), 800, forkImage, 500, 500);
                        }
                    }
                });
            }
            forkImage.src = 'res/fork.png';
            this.ctx.restore();
        }
        catch (e) {
            console.log(e);
        }
    }

    public clearCanvas(){
        this.ctx.clearRect(-this.canvasWidth/2, -this.canvasHeight/2, this.canvasWidth, this.canvasHeight);
    }

    private drawOnTablePosition(position:number, radius:number, image:HTMLImageElement, imgWith:number, imgHeight:number){
        this.drawOnCyclePosition(position, radius, image, imgWith, imgHeight, 0, places)
    }

    private drawOnForkPosition(position:number, radius:number, image:HTMLImageElement, imgWith:number, imgHeight:number){
        this.drawOnCyclePosition(position, radius, image, imgWith, imgHeight, -(Math.PI/5), places)
    }

    private drawOnCyclePosition(position:number, radius:number, image:HTMLImageElement, imgWith:number, imgHeight:number, offset:number,steps:number){
        let arc = 2 * Math.PI/steps*position+offset;
        this.ctx.rotate(arc);
        this.ctx.drawImage(image, 0-imgWith/2, radius-imgHeight/2, imgWith, imgHeight);
        this.ctx.rotate(-1*arc);
    }

    private drawPhilosophers(philosopherImageT, philosopherImageE, philosopherImageH){
        if (!this.philosopherELoaded || !this.philosopherTLoaded || !this.philosopherHLoaded){
            return;
        }else{
            this.table.philosophers.forEach((philosopher)=>{
                let pImg = philosopherImageT;
                if (philosopher.getState() == Philosopher.EATING){
                    pImg = philosopherImageE;
                }else if (philosopher.getState() == Philosopher.HUNGRY){
                    pImg = philosopherImageH;
                }
                this.drawOnTablePosition(philosopher.getId(), 1000, pImg, 500, 500);
            });
        }
    }
}

let ui = new UI();
ui.updateCanvas();
