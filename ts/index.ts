const places:number = 5;

class Fork{
    private isFree:boolean;
    image:HTMLImageElement;
    private id:number;

    constructor(id:number) {
        this.id = id;
        this.isFree = true;
        this.image = new Image();
        this.image.src = './res/fork.png';
    }
    public getId():number{
        return this.id;
    }

    public getIsFree():boolean{
        return this.isFree;
    }

    public setIsFree(isFree:boolean){
        this.isFree = isFree;
        if (this.isFree){
            this.image.style.visibility = 'visible';
        }else{
            this.image.style.visibility = 'hidden';
        }
    }
}
class Philosopher {
    private observers:Function[];
    static readonly THINKING:number = 0;
    static readonly HUNGRY:number = 1;
    static readonly EATING:number = 2;
    private state:number;
    public image:HTMLImageElement;
    private id:number;
    public leftFork:Fork;
    public rightFork:Fork;

    constructor(id:number){
        this.id = id;
        this.state = Philosopher.THINKING;
        this.image = new Image();
        this.image.src = './res/philosopherT.png';
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
        if (this.state == Philosopher.THINKING){
            this.image.src = './res/philosopherT.png';
        }else if (this.state == Philosopher.HUNGRY){
            this.image.src = './res/philosopherH.png';
        }else if (this.state == Philosopher.EATING){
            this.image.src = './res/philosopherE.png';
        }
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
            setTimeout(() => {
                this.setState(Philosopher.THINKING);
                this.leftFork.setIsFree(true);
                this.rightFork.setIsFree(true);
                console.log('Philosopher '+this.getId()+' is thinking');
                this.notifyObservers();
            }, 5000);
        }else{
            this.setState(Philosopher.HUNGRY);
            console.log('Philosopher '+this.getId()+' is waiting to eat');
            this.notifyObservers();
            setTimeout(()=>{
                this.eat();
            }, 5000);
        }
    }
}
class Table{
    public observers:Function[];
    public philosophers:Philosopher[];
    public forks:Fork[];
    public image:HTMLImageElement;
    constructor() {
        this.observers = [];
        this.image = new Image();
        this.image.src = './res/table.png';

        this.forks = [];
        for (let i = 0; i <= places; i++) {
            this.forks.push(new Fork(i));
        }

        this.philosophers = [];
        for (let i = 0; i <= places; i++) {
            let p = new Philosopher(i);
            p.addObserver(()=>{
                this.notifyObservers();
            });
            p.leftFork = this.forks[i];
            p.rightFork = this.forks[(i+1)%places];
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
    private plate:HTMLImageElement;

    public button:HTMLButtonElement;

    private table:Table;


    constructor(){
        this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
        this.canvasWidth = 5000;
        this.canvasHeight = 5000;
        this.canvas.width = this.canvasWidth;
        this.canvas.height = this.canvasHeight;
        this.ctx = this.canvas.getContext('2d');
        this.ctx.translate(this.canvasWidth / 2, this.canvasHeight / 2);
        this.button = document.getElementById('button') as HTMLButtonElement;
        this.button.addEventListener('click', ()=>{
            this.table.philosophers[0].eat();
            this.table.philosophers[1].eat();
        });
        this.plate = new Image();
        this.plate.src = './res/plate.png';
        this.table = new Table();
        this.table.addObserver(()=>{
            this.updateCanvas();
        });
    }

    public createDefaultCanvas(){
        this.updateCanvas();
    }

    public updateCanvas(){
        this.ctx.clearRect(-this.canvasWidth/2, -this.canvasHeight/2, this.canvasWidth, this.canvasHeight);
        let tableWith= 2000;
        let tableHeight = 2000;
        this.ctx.drawImage(this.table.image, -tableWith/2, -tableHeight/2, tableWith, tableHeight);
        for (let i = 0; i <= places; i++) {
            this.drawOnTablePosition(i, 800, this.plate,500,500);
        }
        this.table.philosophers.forEach((philosopher)=>{
            this.drawOnTablePosition(philosopher.getId(), 1000, philosopher.image, 500, 500);
        });
        this.table.forks.forEach((fork)=>{
            this.drawOnForkPosition(fork.getId(), 800, fork.image, 500, 500);
        });
    }

    private drawOnTablePosition(position:number, radius:number, image:HTMLImageElement, imgWith:number, imgHeight:number){
        this.drawOnCyclePosition(position, radius, image, imgWith, imgHeight, 0, places)
    }

    private drawOnForkPosition(position:number, radius:number, image:HTMLImageElement, imgWith:number, imgHeight:number){
        this.drawOnCyclePosition(position, radius, image, imgWith, imgHeight, Math.PI, places)
    }

    private drawOnCyclePosition(position:number, radius:number, image:HTMLImageElement, imgWith:number, imgHeight:number, offset:number,steps:number){
        let arc = 2 * Math.PI/steps*position+offset;
        this.ctx.rotate(arc);
        this.ctx.drawImage(image, 0-imgWith/2, radius-imgHeight/2, imgWith, imgHeight);
        this.ctx.rotate(-1*arc);
    }
}

let ui = new UI();
ui.createDefaultCanvas();
ui.updateCanvas();
