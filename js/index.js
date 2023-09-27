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
        this.holdLeftFork = false;
        this.holdRightFork = false;
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
    Philosopher.prototype.eatReakless = function () {
        var _this = this;
        if (this.leftFork.getIsFree()) {
            this.leftFork.setIsFree(false);
            this.holdLeftFork = true;
            this.notifyObservers();
        }
        else if (this.rightFork.getIsFree()) {
            this.rightFork.setIsFree(false);
            this.holdRightFork = true;
            this.notifyObservers();
        }
        if (this.holdLeftFork && this.holdRightFork) {
            this.setState(Philosopher.EATING);
            console.log('Philosopher ' + this.getId() + ' is eating');
            this.notifyObservers();
            setTimeout(function () {
                _this.leftFork.setIsFree(true);
                _this.rightFork.setIsFree(true);
                _this.holdLeftFork = false;
                _this.holdRightFork = false;
                _this.setState(Philosopher.THINKING);
                console.log('Philosopher ' + _this.getId() + ' is thinking');
                _this.notifyObservers();
            }, 5000);
        }
        else {
            setTimeout(function () {
                _this.eatReakless();
            }, 1000);
        }
    };
    Philosopher.prototype.getIsLeftForkTaken = function () {
        return this.holdLeftFork;
    };
    Philosopher.prototype.getIsRightForkTaken = function () {
        return this.holdRightFork;
    };
    Philosopher.THINKING = 0;
    Philosopher.HUNGRY = 1;
    Philosopher.EATING = 2;
    return Philosopher;
}());
var Table = /** @class */ (function () {
    function Table(places) {
        var _this = this;
        this.observers = [];
        this.places = places;
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
            p.leftFork = this.forks[i - 1];
            if (i == 1) {
                p.rightFork = this.forks[places - 1];
            }
            else {
                p.rightFork = this.forks[i - 2];
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
    function UI(table) {
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
        this.table = table;
        this.table.addObserver(function () {
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
                for (var i = 1; i <= _this.table.places; i++) {
                    _this.drawOnTablePosition(i, 800, plateImage_1, 500, 500);
                }
            };
            plateImage_1.src = 'res/plate.png';
            // Draw philosophers
            var philosopherImageT_1 = new Image();
            var philosopherImageE_1 = new Image();
            var philosopherImageH_1 = new Image();
            var philosopherLeftForkImage_1 = new Image();
            var philosopherRightForkImage_1 = new Image();
            philosopherImageT_1.onload = function () {
                _this.philosopherTLoaded = true;
                _this.drawPhilosophers(philosopherImageT_1, philosopherImageE_1, philosopherImageH_1, philosopherLeftForkImage_1, philosopherRightForkImage_1);
            };
            philosopherImageE_1.onload = function () {
                _this.philosopherELoaded = true;
                _this.drawPhilosophers(philosopherImageT_1, philosopherImageE_1, philosopherImageH_1, philosopherLeftForkImage_1, philosopherRightForkImage_1);
            };
            philosopherImageH_1.onload = function () {
                _this.philosopherHLoaded = true;
                _this.drawPhilosophers(philosopherImageT_1, philosopherImageE_1, philosopherImageH_1, philosopherLeftForkImage_1, philosopherRightForkImage_1);
            };
            philosopherLeftForkImage_1.onload = function () {
                _this.philosopherLeftForkLoaded = true;
                _this.drawPhilosophers(philosopherImageT_1, philosopherImageE_1, philosopherImageH_1, philosopherLeftForkImage_1, philosopherRightForkImage_1);
            };
            philosopherRightForkImage_1.onload = function () {
                _this.philosopherRightForkLoaded = true;
                _this.drawPhilosophers(philosopherImageT_1, philosopherImageE_1, philosopherImageH_1, philosopherLeftForkImage_1, philosopherRightForkImage_1);
            };
            philosopherImageT_1.src = 'res/philosopherT.png';
            philosopherImageE_1.src = 'res/philosopherE.png';
            philosopherImageH_1.src = 'res/philosopherH.png';
            philosopherLeftForkImage_1.src = "res/philosopherLeftF.png";
            philosopherRightForkImage_1.src = "res/philosopherRightF.png";
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
        this.drawOnCyclePosition(position, radius, image, imgWith, imgHeight, 0, this.table.places);
    };
    UI.prototype.drawOnForkPosition = function (position, radius, image, imgWith, imgHeight) {
        this.drawOnCyclePosition(position, radius, image, imgWith, imgHeight, (Math.PI / this.table.places), this.table.places);
    };
    UI.prototype.drawOnCyclePosition = function (position, radius, image, imgWith, imgHeight, offset, steps) {
        var arc = 2 * Math.PI / steps * position + offset;
        this.ctx.rotate(arc);
        this.ctx.drawImage(image, 0 - imgWith / 2, radius - imgHeight / 2, imgWith, imgHeight);
        this.ctx.rotate(-1 * arc);
    };
    UI.prototype.drawPhilosophers = function (philosopherImageT, philosopherImageE, philosopherImageH, philosopherLeftForkImage, philosopherRightForkImage) {
        var _this = this;
        if (!this.philosopherELoaded || !this.philosopherTLoaded || !this.philosopherHLoaded || !this.philosopherLeftForkLoaded || !this.philosopherRightForkLoaded) {
            return;
        }
        else {
            this.table.philosophers.forEach(function (philosopher) {
                var pImg = philosopherImageT;
                if (philosopher.getIsLeftForkTaken()) {
                    pImg = philosopherLeftForkImage;
                }
                else if (philosopher.getIsRightForkTaken()) {
                    pImg = philosopherRightForkImage;
                }
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
var table;
var ui;
var startbutton = document.getElementById('Startbutton');
startbutton.addEventListener('click', function () {
    var input = document.getElementById("NumberPh");
    var number = parseInt(input.value);
    table = new Table(number);
    ui = new UI(table);
    ui.updateCanvas();
    var buttonDiv = document.getElementById('phButtons');
    buttonDiv.innerHTML = "";
    var buttonAllEatReakless = document.createElement("button");
    buttonAllEatReakless.addEventListener('click', function () {
        table.philosophers.forEach(function (philosopher) {
            philosopher.eatReckless();
        });
    });
    buttonAllEatReakless.innerText = "All eat Reakless";
    buttonDiv.appendChild(buttonAllEatReakless);
    var _loop_1 = function (i) {
        var div = document.createElement("div");
        div.innerText = "Philosopher " + i;
        var buttonEat = document.createElement("button");
        var buttonEatR = document.createElement("button");
        buttonEat.addEventListener('click', function () {
            console.log(table);
            table.philosophers[i - 1].eat();
        });
        buttonEatR.addEventListener('click', function () {
            table.philosophers[i - 1].eatReckless();
        });
        buttonEat.innerText = "Philosopher " + i + " eat";
        buttonEatR.innerText = "Philosopher " + i + " eat Reakless";
        div.appendChild(buttonEat);
        div.appendChild(buttonEatR);
        buttonDiv.appendChild(div);
    };
    for (var i = 1; i <= number; i++) {
        _loop_1(i);
    }
});
var button2 = document.getElementById('Clearbutton');
button2.addEventListener('click', function () {
    ui.clearCanvas();
});
var button3 = document.getElementById('UpdateButton');
button3.addEventListener('click', function () {
    ui.updateCanvas();
});
//# sourceMappingURL=index.js.map