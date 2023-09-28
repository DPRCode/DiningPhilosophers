var Fork = /** @class */ (function () {
    function Fork(id) {
        this.id = id;
        this.isFree = true;
    }
    Fork.prototype.addObserver = function (observer) {
        if (!this.observers) {
            this.observers = [];
        }
        this.observers.push(observer);
    };
    Fork.prototype.notifyObservers = function () {
        console.log('Fork ' + this.getId() + ' has changed');
        this.observers.forEach(function (observer) {
            observer();
        });
    };
    Fork.prototype.getId = function () {
        return this.id;
    };
    Fork.prototype.getIsFree = function () {
        return this.isFree;
    };
    Fork.prototype.setIsFree = function (isFree) {
        this.isFree = isFree;
        this.notifyObservers();
    };
    return Fork;
}());
var SemaphoreHandler = /** @class */ (function () {
    function SemaphoreHandler(resources, resourceLink) {
        this.semaphore = resources;
        this.buffer = [];
        this.resourceLink = resourceLink;
    }
    SemaphoreHandler.prototype.addObserver = function (observer) {
        if (!this.observers) {
            this.observers = [];
        }
        this.observers.push(observer);
    };
    SemaphoreHandler.prototype.notifyObservers = function () {
        console.log('Semaphore has changed');
        this.observers.forEach(function (observer) {
            observer();
        });
    };
    SemaphoreHandler.prototype.pOperation = function (observer) {
        if (this.semaphore > 0) {
            this.semaphore--;
            observer(this.resourceLink);
        }
        else {
            this.buffer.push(observer);
        }
        this.notifyObservers();
    };
    SemaphoreHandler.prototype.vOperation = function () {
        var fun = this.buffer.pop();
        this.semaphore++;
        if (fun) {
            this.pOperation(fun);
        }
        this.notifyObservers();
    };
    return SemaphoreHandler;
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
        if (this.state == Philosopher.THINKING) {
            console.log('Philosopher ' + this.getId() + ' is thinking');
        }
        else if (this.state == Philosopher.HUNGRY) {
            console.log('Philosopher ' + this.getId() + ' is hungry');
        }
        else if (this.state == Philosopher.EATING) {
            console.log('Philosopher ' + this.getId() + ' is eating');
        }
        this.notifyObservers();
    };
    Philosopher.prototype.getId = function () {
        return this.id;
    };
    Philosopher.prototype.eatSemaphoreRequest = function () {
        var _this = this;
        if (this.getState() == Philosopher.THINKING) {
            this.setState(Philosopher.HUNGRY);
        }
        this.semaphoreLeftFork.pOperation(function (resourceLink) {
            _this.holdLeftFork = true;
            _this.leftFork = resourceLink;
            _this.leftFork.setIsFree(false);
            _this.notifyObservers();
            _this.eatSemaphoreRelease();
        });
        setTimeout(function () {
            _this.semaphoreRightFork.pOperation(function (resourceLink) {
                _this.holdRightFork = true;
                _this.rightFork = resourceLink;
                _this.rightFork.setIsFree(false);
                _this.eatSemaphoreRelease();
            });
        }, 1000);
    };
    Philosopher.prototype.eatSemaphoreRelease = function () {
        var _this = this;
        if (this.holdLeftFork && this.holdRightFork) {
            this.setState(Philosopher.EATING);
            setTimeout(function () {
                _this.setState(Philosopher.THINKING);
                _this.holdLeftFork = false;
                _this.holdRightFork = false;
                _this.leftFork.setIsFree(true);
                _this.rightFork.setIsFree(true);
                _this.semaphoreLeftFork.vOperation();
                _this.semaphoreRightFork.vOperation();
            }, 5000);
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
        this.semaphoresForks = [];
        for (var i = 1; i <= places; i++) {
            var f = new Fork(i);
            f.addObserver(function () {
                _this.notifyObservers();
            });
            this.forks.push(f);
            var s = new SemaphoreHandler(1, this.forks[i - 1]);
            s.addObserver(function () {
                _this.notifyObservers();
            });
            this.semaphoresForks.push(s);
        }
        this.philosophers = [];
        for (var i = 1; i <= places; i++) {
            var p = new Philosopher(i);
            p.addObserver(function () {
                _this.notifyObservers();
            });
            p.leftFork = this.forks[i - 1];
            p.semaphoreLeftFork = this.semaphoresForks[i - 1];
            if (i == 1) {
                p.rightFork = this.forks[places - 1];
                p.semaphoreRightFork = this.semaphoresForks[places - 1];
            }
            else {
                p.rightFork = this.forks[i - 2];
                p.semaphoreRightFork = this.semaphoresForks[i - 2];
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
                        _this.drawOnForkPosition(fork.getId(), 800, _this.forkImage, 500, 500);
                    }
                });
            }
            this.drawPhilosophers();
            this.ctx.restore();
            this.visualiseSemaphore();
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
                if (philosopher.getState() == Philosopher.HUNGRY) {
                    pImg = _this.philosopherImageH;
                    if (philosopher.getIsLeftForkTaken()) {
                        pImg = _this.philosopherLeftForkImage;
                    }
                    else if (philosopher.getIsRightForkTaken()) {
                        pImg = _this.philosopherRightForkImage;
                    }
                }
                else if (philosopher.getState() == Philosopher.EATING) {
                    pImg = _this.philosopherImageE;
                }
                _this.drawOnTablePosition(philosopher.getId(), 1100, pImg, 500, 500);
            });
        }
    };
    UI.prototype.visualisePhilosopher = function () {
        var div = document.getElementById("PhilosopherVisualisation");
        div.innerHTML = "";
        this.table.philosophers.forEach(function (p) {
            var philosopherVisualisation = document.createElement("div");
            philosopherVisualisation.classList.add("philosopherVisualisationDivs");
            var philosopherVisualisationText = document.createElement("p");
            switch (p.getState()) {
                case Philosopher.THINKING:
                    philosopherVisualisationText.innerText = "Philosopher " + p.getId() + " is thinking";
                    break;
                case Philosopher.HUNGRY:
                    philosopherVisualisationText.innerText = "Philosopher " + p.getId() + " is hungry";
                    break;
                case Philosopher.EATING:
                    philosopherVisualisationText.innerText = "Philosopher " + p.getId() + " is eating";
                    break;
            }
            philosopherVisualisation.appendChild(philosopherVisualisationText);
            var philosopherVisualisationTextL = document.createElement("p");
            if (p.semaphoreLeftFork.semaphore == 0) {
                philosopherVisualisationTextL.classList.add("semaphoreRed");
                philosopherVisualisationTextL.innerText = "Left Fork used. Counter: ";
            }
            else {
                philosopherVisualisationTextL.classList.add("semaphoreGreen");
                philosopherVisualisationTextL.innerText = "Left Fork free. Counter: ";
            }
            philosopherVisualisation.appendChild(philosopherVisualisationTextL);
            var philosopherVisualisationTextR = document.createElement("p");
            if (p.semaphoreRightFork.semaphore == 0) {
                philosopherVisualisationTextR.classList.add("semaphoreRed");
                philosopherVisualisationTextR.innerText = "Right Fork used. Counter: ";
            }
            else {
                philosopherVisualisationTextR.classList.add("semaphoreGreen");
                philosopherVisualisationTextR.innerText = "Right Fork free. Counter: ";
            }
            philosopherVisualisation.appendChild(philosopherVisualisationTextR);
            div.appendChild(philosopherVisualisation);
        });
    };
    UI.prototype.visualiseSemaphore = function () {
        var div = document.getElementById("SemaphoreVisualisation");
        div.innerHTML = "";
        this.table.semaphoresForks.forEach(function (s) {
            var fork = s.resourceLink;
            var semaphoreVisualisation = document.createElement("div");
            semaphoreVisualisation.classList.add("semaphoreVisualisationDivs");
            var semaphoreVisualisationText = document.createElement("p");
            semaphoreVisualisationText.innerText = "Semaphore of fork " + fork.getId();
            semaphoreVisualisation.appendChild(semaphoreVisualisationText);
            var availableText = document.createElement("p");
            availableText.innerText = "Available resources: " + s.semaphore;
            semaphoreVisualisation.appendChild(availableText);
            var bufferText = document.createElement("p");
            bufferText.innerText = "In Buffer waiting: " + s.buffer.length;
            semaphoreVisualisation.appendChild(bufferText);
            div.appendChild(semaphoreVisualisation);
        });
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
            philosopher.eatSemaphoreRequest();
        });
    });
    buttonAllEatReckless.innerText = "All eat Reckless";
    buttonDiv.appendChild(buttonAllEatReckless);
    var _loop_1 = function (i) {
        var div = document.createElement("div");
        div.innerText = "Philosopher " + i;
        var buttonEatSemaphor = document.createElement("button");
        buttonEatSemaphor.addEventListener('click', function () {
            table.philosophers[i - 1].eatSemaphoreRequest();
        });
        buttonEatSemaphor.innerText = "Philosopher " + i + " eat with Semaphore";
        div.appendChild(buttonEatSemaphor);
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