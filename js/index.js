var places = 5;
var Fork = /** @class */ (function () {
    function Fork(id) {
        this.id = id;
        this.isFree = true;
    }
    Fork.prototype.getId = function () {
        return this.id;
    };
    Fork.prototype.getIsFree = function () {
        return this.isFree;
    };
    Fork.prototype.setIsFree = function (isFree) {
        this.isFree = isFree;
    };
    return Fork;
}());
var Philosopher = /** @class */ (function () {
    function Philosopher(id) {
        this.id = id;
        this.state = Philosopher.THINKING;
    }
    Philosopher.prototype.addObserver = function (observer) {
        if (!this.observers) {
            this.observers = [];
        }
        this.observers.push(observer);
    };
    Philosopher.prototype.notifyObservers = function () {
        console.log('Philosopher ' + this.getId() + ' has changed');
        this.observers.forEach(function (observer) {
            observer();
        });
    };
    Philosopher.prototype.getState = function () {
        return this.state;
    };
    Philosopher.prototype.setState = function (state) {
        this.state = state;
    };
    Philosopher.prototype.getId = function () {
        return this.id;
    };
    Philosopher.prototype.eat = function () {
        var _this = this;
        if (this.leftFork.getIsFree() && this.rightFork.getIsFree()) {
            this.setState(Philosopher.EATING);
            this.leftFork.setIsFree(false);
            this.rightFork.setIsFree(false);
            console.log('Philosopher ' + this.getId() + ' is eating');
            this.notifyObservers();
            setTimeout(function () {
                _this.leftFork.setIsFree(true);
                _this.rightFork.setIsFree(true);
                _this.setState(Philosopher.THINKING);
                console.log('Philosopher ' + _this.getId() + ' is thinking');
                _this.notifyObservers();
            }, 5000);
        }
        else {
            this.setState(Philosopher.HUNGRY);
            console.log('Philosopher ' + this.getId() + ' is waiting to eat');
            this.notifyObservers();
            setTimeout(function () {
                _this.eat();
            }, 4000);
        }
    };
    Philosopher.THINKING = 0;
    Philosopher.HUNGRY = 1;
    Philosopher.EATING = 2;
    return Philosopher;
}());
var Table = /** @class */ (function () {
    function Table() {
        var _this = this;
        this.observers = [];
        this.forks = [];
        for (var i = 1; i <= places; i++) {
            this.forks.push(new Fork(i));
        }
        this.philosophers = [];
        for (var i = 1; i <= places; i++) {
            var p = new Philosopher(i);
            p.addObserver(function () {
                _this.notifyObservers();
            });
            p.leftFork = this.forks[i];
            if (i == 0) {
                p.rightFork = this.forks[places];
            }
            else {
                p.rightFork = this.forks[i - 1];
            }
            this.philosophers.push(p);
        }
    }
    Table.prototype.addObserver = function (observer) {
        this.observers.push(observer);
    };
    Table.prototype.notifyObservers = function () {
        console.log('Table has changed');
        this.observers.forEach(function (observer) {
            observer();
        });
    };
    return Table;
}());
var UI = /** @class */ (function () {
    function UI() {
        var _this = this;
        this.canvas = document.getElementById('canvas');
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
        this.table.addObserver(function () {
            _this.updateCanvas();
        });
        var startbutton = document.getElementById('Startbutton');
        startbutton.addEventListener('click', function () {
            _this.table.philosophers[3].eat();
            _this.table.philosophers[2].eat();
            console.log(_this.table);
        });
        var button2 = document.getElementById('Clearbutton');
        button2.addEventListener('click', function () {
            _this.clearCanvas();
        });
        var button3 = document.getElementById('UpdateButton');
        button3.addEventListener('click', function () {
            _this.updateCanvas();
        });
    }
    UI.prototype.updateCanvas = function () {
        var _this = this;
        try {
            this.clearCanvas();
            this.ctx.save();
            this.philosopherTLoaded = false;
            this.philosopherELoaded = false;
            this.philosopherHLoaded = false;
            // Darw table
            var tableWith_1 = 2000;
            var tableHeight_1 = 2000;
            var tableImage_1 = new Image();
            tableImage_1.onload = function () {
                _this.ctx.drawImage(tableImage_1, -tableWith_1 / 2, -tableHeight_1 / 2, tableWith_1, tableHeight_1);
            };
            tableImage_1.src = 'res/table.png';
            // Draw Plates
            var plateImage_1 = new Image();
            plateImage_1.onload = function () {
                for (var i = 1; i <= places; i++) {
                    _this.drawOnTablePosition(i, 800, plateImage_1, 500, 500);
                }
            };
            plateImage_1.src = 'res/plate.png';
            // Draw philosophers
            var philosopherImageT_1 = new Image();
            var philosopherImageE_1 = new Image();
            var philosopherImageH_1 = new Image();
            philosopherImageT_1.onload = function () {
                _this.philosopherTLoaded = true;
                _this.drawPhilosophers(philosopherImageT_1, philosopherImageE_1, philosopherImageH_1);
            };
            philosopherImageE_1.onload = function () {
                _this.philosopherELoaded = true;
                _this.drawPhilosophers(philosopherImageT_1, philosopherImageE_1, philosopherImageH_1);
            };
            philosopherImageH_1.onload = function () {
                _this.philosopherHLoaded = true;
                _this.drawPhilosophers(philosopherImageT_1, philosopherImageE_1, philosopherImageH_1);
            };
            philosopherImageT_1.src = 'res/philosopherT.png';
            philosopherImageE_1.src = 'res/philosopherE.png';
            philosopherImageH_1.src = 'res/philosopherH.png';
            // Draw forks
            var forkImage_1 = new Image();
            forkImage_1.onload = function () {
                _this.table.forks.forEach(function (fork) {
                    if (fork.getIsFree()) {
                        if (fork.getIsFree()) {
                            _this.drawOnForkPosition(fork.getId(), 800, forkImage_1, 500, 500);
                        }
                    }
                });
            };
            forkImage_1.src = 'res/fork.png';
            this.ctx.restore();
        }
        catch (e) {
            console.log(e);
        }
    };
    UI.prototype.clearCanvas = function () {
        this.ctx.clearRect(-this.canvasWidth / 2, -this.canvasHeight / 2, this.canvasWidth, this.canvasHeight);
    };
    UI.prototype.drawOnTablePosition = function (position, radius, image, imgWith, imgHeight) {
        this.drawOnCyclePosition(position, radius, image, imgWith, imgHeight, 0, places);
    };
    UI.prototype.drawOnForkPosition = function (position, radius, image, imgWith, imgHeight) {
        this.drawOnCyclePosition(position, radius, image, imgWith, imgHeight, -(Math.PI / 5), places);
    };
    UI.prototype.drawOnCyclePosition = function (position, radius, image, imgWith, imgHeight, offset, steps) {
        var arc = 2 * Math.PI / steps * position + offset;
        this.ctx.rotate(arc);
        this.ctx.drawImage(image, 0 - imgWith / 2, radius - imgHeight / 2, imgWith, imgHeight);
        this.ctx.rotate(-1 * arc);
    };
    UI.prototype.drawPhilosophers = function (philosopherImageT, philosopherImageE, philosopherImageH) {
        var _this = this;
        if (!this.philosopherELoaded || !this.philosopherTLoaded || !this.philosopherHLoaded) {
            return;
        }
        else {
            this.table.philosophers.forEach(function (philosopher) {
                var pImg = philosopherImageT;
                if (philosopher.getState() == Philosopher.EATING) {
                    pImg = philosopherImageE;
                }
                else if (philosopher.getState() == Philosopher.HUNGRY) {
                    pImg = philosopherImageH;
                }
                _this.drawOnTablePosition(philosopher.getId(), 1000, pImg, 500, 500);
            });
        }
    };
    return UI;
}());
var ui = new UI();
ui.updateCanvas();
//# sourceMappingURL=index.js.map