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

class SemaphoreHandler {
    // Usage of a boolean translates this to a mutex
    semaphore:number;
    buffer:Function[];
    resourceLink:any;
    constructor(resources:number, resourceLink:any){
        this.semaphore = resources;
        this.buffer = [];
        this.resourceLink = resourceLink;
    }

    public pOperation(observer:Function){
        if (this.semaphore > 0){
            this.semaphore--;
            observer(this.resourceLink);
        }else{
            this.buffer.push(observer);
        }
    }

    public vOperation(){
        let fun = this.buffer.pop();
        this.semaphore++;
        if (fun){
            this.pOperation(fun);
        }
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
    public holdLeftFork:boolean;
    public holdRightFork:boolean;
    // using semaphore
    public semaphoreLeftFork:SemaphoreHandler;
    public semaphoreRightFork:SemaphoreHandler;

    constructor(id:number){
        this.id = id;
        this.state = Philosopher.THINKING;
        this.holdLeftFork = false;
        this.holdRightFork = false;
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

    public eatSemaphoreRequest(){
        this.setState(Philosopher.HUNGRY);
        console.log('Philosopher '+this.getId()+' is waiting to eat');
        this.notifyObservers();
        this.semaphoreLeftFork.pOperation((resourceLink:Fork)=>{
            this.holdLeftFork = true;
            this.leftFork = resourceLink;
            this.leftFork.setIsFree(false);
            this.notifyObservers();
            this.eatSemaphoreRelease();
        });
        setTimeout(()=>{
            this.semaphoreRightFork.pOperation((resourceLink:Fork)=>{
                this.holdRightFork = true;
                this.rightFork = resourceLink;
                this.rightFork.setIsFree(false);
                this.notifyObservers();
                this.eatSemaphoreRelease();
            });
        }, 1000);
    }

    public eatSemaphoreRelease(){
        if (this.holdLeftFork&&this.holdRightFork){
            this.setState(Philosopher.EATING);
            console.log('Philosopher '+this.getId()+' is eating');
            this.notifyObservers();
            setTimeout(()=>{
                this.holdLeftFork = false;
                this.holdRightFork = false;
                this.leftFork.setIsFree(true);
                this.rightFork.setIsFree(true);
                this.semaphoreLeftFork.vOperation();
                this.semaphoreRightFork.vOperation();
                this.setState(Philosopher.THINKING);
                console.log('Philosopher '+this.getId()+' is thinking');
                this.notifyObservers();
            }, 5000);
        }
    }

    getIsLeftForkTaken() {
        return this.holdLeftFork;
    }

    getIsRightForkTaken() {
       return this.holdRightFork;
    }
}
class Table{
    public observers:Function[];
    public philosophers:Philosopher[];
    public forks:Fork[];
    public semaphoresForks:SemaphoreHandler[];
    places:number;
    constructor(places:number) {
        this.observers = [];
        this.places = places;
        this.forks = [];
        this.semaphoresForks = [];
        for (let i = 1; i <= places; i++) {
            this.forks.push(new Fork(i));
            this.semaphoresForks.push(new SemaphoreHandler(1, this.forks[i-1]));
        }

        this.philosophers = [];
        for (let i = 1; i <= places; i++) {
            let p = new Philosopher(i);
            p.addObserver(()=>{
                this.notifyObservers();
            });
            p.leftFork = this.forks[i-1];
            p.semaphoreLeftFork = this.semaphoresForks[i-1];
            if (i == 1){
                p.rightFork = this.forks[places-1];
                p.semaphoreRightFork = this.semaphoresForks[places-1];
            }else{
                p.rightFork = this.forks[i-2];
                p.semaphoreRightFork = this.semaphoresForks[i-2];
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
    private philosopherImageT:HTMLImageElement;
    private philosopherImageE:HTMLImageElement;
    private philosopherImageH:HTMLImageElement;
    private philosopherLeftForkImage:HTMLImageElement;
    private philosopherRightForkImage:HTMLImageElement;
    private tableImage:HTMLImageElement;
    private plateImage:HTMLImageElement;
    private forkImage:HTMLImageElement;



    constructor(table:Table){
        this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
        this.canvasWidth = 5000;
        this.canvasHeight = 5000;
        this.canvas.width = this.canvasWidth;
        this.canvas.height = this.canvasHeight;
        this.ctx = this.canvas.getContext('2d');
        this.ctx.translate(this.canvasWidth / 2, this.canvasHeight / 2);
        // Load images table
        this.tableImage = new Image();
        this.tableImage.onload = ()=>{
            this.updateCanvas();
        }
        this.tableImage.src = 'res/table.png';
        // Load images plate
        this.plateImage = new Image();
        this.plateImage.onload = ()=>{
            this.updateCanvas();
        }
        this.plateImage.src = 'res/plate.png';
        // Load images fork
        this.forkImage = new Image();
        this.forkImage.onload = ()=>{
            this.updateCanvas();
        }
        this.forkImage.src = 'res/fork.png';
        // Load images philosopher
        this.philosopherImageT = new Image();
        this.philosopherImageE = new Image();
        this.philosopherImageH = new Image();
        this.philosopherLeftForkImage = new Image();
        this.philosopherRightForkImage = new Image();
        this.philosopherImageT.onload = ()=>{
            this.updateCanvas();
        }
        this.philosopherImageE.onload = ()=>{
            this.updateCanvas();
        }
        this.philosopherImageH.onload = ()=>{
            this.updateCanvas();
        }
        this.philosopherLeftForkImage.onload = ()=>{
            this.updateCanvas();
        }
        this.philosopherRightForkImage.onload = ()=>{
            this.updateCanvas();
        }
        this.philosopherImageT.src = 'res/philosopherT.png';
        this.philosopherImageE.src = 'res/philosopherE.png';
        this.philosopherImageH.src = 'res/philosopherH.png';
        this.philosopherLeftForkImage.src ="res/philosopherLeftF.png";
        this.philosopherRightForkImage.src ="res/philosopherRightF.png";
        // Set table
        this.table = table;
        this.table.addObserver(()=>{
            this.updateCanvas();
        });
    }

    public updateCanvas(){
        try {
            this.clearCanvas();
            this.ctx.save();
            // Draw table
            if (this.tableImage.complete){
                let tableWith= 2000;
                let tableHeight = 2000;
                this.ctx.drawImage(this.tableImage, -tableWith/2, -tableHeight/2, tableWith, tableHeight);
            }
            // Draw Plates
            if (this.plateImage.complete){
                for (let i = 1; i <= this.table.places; i++) {
                    this.drawOnTablePosition(i, 800, this.plateImage,500,500);
                }
            }
            // Draw forks
            if (this.forkImage.complete){
                this.table.forks.forEach((fork)=>{
                    if (fork.getIsFree()){
                        this.drawOnForkPosition(fork.getId(), 800, this.forkImage, 500, 500);
                    }
                });
            }
            this.drawPhilosophers();
            this.ctx.restore();
            this.visualiseSemaphores();
        }
        catch (e) {
            console.log(e);
        }
    }

    public clearCanvas(){
        this.ctx.clearRect(-this.canvasWidth/2, -this.canvasHeight/2, this.canvasWidth, this.canvasHeight);
    }

    private drawOnTablePosition(position:number, radius:number, image:HTMLImageElement, imgWith:number, imgHeight:number){
        this.drawOnCyclePosition(position, radius, image, imgWith, imgHeight, 0, this.table.places)
    }

    private drawOnForkPosition(position:number, radius:number, image:HTMLImageElement, imgWith:number, imgHeight:number){
        this.drawOnCyclePosition(position, radius, image, imgWith, imgHeight, (Math.PI/this.table.places), this.table.places)
    }

    private drawOnCyclePosition(position:number, radius:number, image:HTMLImageElement, imgWith:number, imgHeight:number, offset:number,steps:number){
        let arc = 2 * Math.PI/steps*position+offset;
        this.ctx.rotate(arc);
        this.ctx.drawImage(image, 0-imgWith/2, radius-imgHeight/2, imgWith, imgHeight);
        this.ctx.rotate(-1*arc);
    }

    private drawPhilosophers(){
        if (!this.philosopherImageE.complete || !this.philosopherImageH.complete || !this.philosopherImageT.complete || !this.philosopherLeftForkImage.complete || !this.philosopherRightForkImage.complete){
            return;
        }else{
            this.table.philosophers.forEach((philosopher)=>{
                let pImg = this.philosopherImageT;
                if (philosopher.getState() == Philosopher.HUNGRY){
                    pImg = this.philosopherImageH;
                }
                if (philosopher.getIsLeftForkTaken()){
                    pImg = this.philosopherLeftForkImage;
                }else if (philosopher.getIsRightForkTaken()){
                    pImg = this.philosopherRightForkImage;
                }
                if (philosopher.getState() == Philosopher.EATING){
                    pImg = this.philosopherImageE;
                }
                this.drawOnTablePosition(philosopher.getId(), 1100, pImg, 500, 500);
            });
        }
    }

    visualiseSemaphores(){
        let div = document.getElementById("semaphorVisualisation") as HTMLDivElement;
        div.innerHTML = "";
        this.table.philosophers.forEach((p)=>{
            let semaphorVisualisation = document.createElement("div");
            let semaphorVisualisationText = document.createElement("p");
            semaphorVisualisationText.innerText = "Philosopher "+p.getId()+" State: "+p.getState();
            semaphorVisualisation.appendChild(semaphorVisualisationText);
            let semaphorVisualisationTextL = document.createElement("p");
            semaphorVisualisationTextL.innerText = "Semaphore Left Fork Counter: "+p.semaphoreLeftFork.semaphore;
            semaphorVisualisation.appendChild(semaphorVisualisationTextL);
            let semaphorVisualisationTextR = document.createElement("p");
            semaphorVisualisationTextR.innerText = "Semaphore Right Fork Counter: "+p.semaphoreRightFork.semaphore;
            semaphorVisualisation.appendChild(semaphorVisualisationTextR);
            div.appendChild(semaphorVisualisation);
        });
    }
}

let table:Table;
let ui:UI;

let startbutton = document.getElementById('Startbutton') as HTMLButtonElement;
startbutton.addEventListener('click', ()=>{
    let input = document.getElementById("NumberPh") as HTMLInputElement;
    let number = parseInt(input.value);
    table = new Table(number);
    ui = new UI(table);
    ui.updateCanvas();
    let buttonDiv = document.getElementById('phButtons') as HTMLDivElement;
    buttonDiv.innerHTML = "";
    let buttonAllEatReckless = document.createElement("button");
    buttonAllEatReckless.addEventListener('click', ()=>{
        table.philosophers.forEach((philosopher)=>{
            philosopher.eatSemaphoreRequest();
        });
    });
    buttonAllEatReckless.innerText = "All eat Reckless";
    buttonDiv.appendChild(buttonAllEatReckless);
    for (let i = 1; i <=number; i++) {
        let div = document.createElement("div");
        div.innerText = "Philosopher "+i;
        let buttonEatSemaphor = document.createElement("button");
        buttonEatSemaphor.addEventListener('click', ()=>{
            table.philosophers[i-1].eatSemaphoreRequest();
        });
        buttonEatSemaphor.innerText = "Philosopher "+i+" eat with Semaphore";
        div.appendChild(buttonEatSemaphor);
        buttonDiv.appendChild(div);
    }
});
let button2 = document.getElementById('Clearbutton') as HTMLButtonElement;
button2.addEventListener('click', ()=>{
    ui.clearCanvas();
});
let button3 = document.getElementById('UpdateButton') as HTMLButtonElement;
button3.addEventListener('click', ()=>{
    ui.updateCanvas();
});
