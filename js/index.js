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
    Philosopher.prototype.eatReckless = function () {
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
                _this.eatReckless();
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
        // Load images table
        this.tableImage = new Image();
        this.tableImage.onload = function () {
            _this.updateCanvas();
        };
        this.tableImage.src = 'res/table.png';
        // Load images plate
        this.plateImage = new Image();
        this.plateImage.onload = function () {
            _this.updateCanvas();
        };
        this.plateImage.src = 'res/plate.png';
        // Load images fork
        this.forkImage = new Image();
        this.forkImage.onload = function () {
            _this.updateCanvas();
        };
        this.forkImage.src = 'res/fork.png';
        // Load images philosopher
        this.philosopherImageT = new Image();
        this.philosopherImageE = new Image();
        this.philosopherImageH = new Image();
        this.philosopherLeftForkImage = new Image();
        this.philosopherRightForkImage = new Image();
        this.philosopherImageT.onload = function () {
            _this.updateCanvas();
        };
        this.philosopherImageE.onload = function () {
            _this.updateCanvas();
        };
        this.philosopherImageH.onload = function () {
            _this.updateCanvas();
        };
        this.philosopherLeftForkImage.onload = function () {
            _this.updateCanvas();
        };
        this.philosopherRightForkImage.onload = function () {
            _this.updateCanvas();
        };
        this.philosopherImageT.src = 'res/philosopherT.png';
        this.philosopherImageE.src = 'res/philosopherE.png';
        this.philosopherImageH.src = 'res/philosopherH.png';
        this.philosopherLeftForkImage.src = "res/philosopherLeftF.png";
        this.philosopherRightForkImage.src = "res/philosopherRightF.png";
        // Set table
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
            // Draw table
            if (this.tableImage.complete) {
                var tableWith = 2000;
                var tableHeight = 2000;
                this.ctx.drawImage(this.tableImage, -tableWith / 2, -tableHeight / 2, tableWith, tableHeight);
            }
            // Draw Plates
            if (this.plateImage.complete) {
                for (var i = 1; i <= this.table.places; i++) {
                    this.drawOnTablePosition(i, 800, this.plateImage, 500, 500);
                }
            }
            // Draw forks
            if (this.forkImage.complete) {
                this.table.forks.forEach(function (fork) {
                    if (fork.getIsFree()) {
                        if (fork.getIsFree()) {
                            _this.drawOnForkPosition(fork.getId(), 800, _this.forkImage, 500, 500);
                        }
                    }
                });
            }
            this.drawPhilosophers();
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
    UI.prototype.drawPhilosophers = function () {
        var _this = this;
        if (!this.philosopherImageE.complete || !this.philosopherImageH.complete || !this.philosopherImageT.complete || !this.philosopherLeftForkImage.complete || !this.philosopherRightForkImage.complete) {
            return;
        }
        else {
            this.table.philosophers.forEach(function (philosopher) {
                var pImg = _this.philosopherImageT;
                if (philosopher.getIsLeftForkTaken()) {
                    pImg = _this.philosopherLeftForkImage;
                }
                else if (philosopher.getIsRightForkTaken()) {
                    pImg = _this.philosopherRightForkImage;
                }
                if (philosopher.getState() == Philosopher.EATING) {
                    pImg = _this.philosopherImageE;
                }
                else if (philosopher.getState() == Philosopher.HUNGRY) {
                    pImg = _this.philosopherImageH;
                }
                _this.drawOnTablePosition(philosopher.getId(), 1100, pImg, 500, 500);
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
    var buttonAllEatReckless = document.createElement("button");
    buttonAllEatReckless.addEventListener('click', function () {
        table.philosophers.forEach(function (philosopher) {
            philosopher.eatReckless();
        });
    });
    buttonAllEatReckless.innerText = "All eat Reckless";
    buttonDiv.appendChild(buttonAllEatReckless);
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
        buttonEatR.innerText = "Philosopher " + i + " eat Reckless";
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