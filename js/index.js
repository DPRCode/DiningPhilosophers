var places = 5;
var Fork = /** @class */ (function () {
    function Fork(id) {
        this.id = id;
        this.isFree = true;
        this.image = new Image();
        this.image.src = './res/fork.png';
    }
    Fork.prototype.getId = function () {
        return this.id;
    };
    Fork.prototype.getIsFree = function () {
        return this.isFree;
    };
    Fork.prototype.setIsFree = function (isFree) {
        this.isFree = isFree;
        if (this.isFree) {
            this.image.style.visibility = 'visible';
        }
        else {
            this.image.style.visibility = 'hidden';
        }
    };
    return Fork;
}());
var Philosopher = /** @class */ (function () {
    function Philosopher(id) {
        this.id = id;
        this.state = Philosopher.THINKING;
        this.image = new Image();
        this.image.src = './res/philosopherT.png';
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
            this.image.src = './res/philosopherT.png';
        }
        else if (this.state == Philosopher.HUNGRY) {
            this.image.src = './res/philosopherH.png';
        }
        else if (this.state == Philosopher.EATING) {
            this.image.src = './res/philosopherE.png';
        }
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
                _this.setState(Philosopher.THINKING);
                _this.leftFork.setIsFree(true);
                _this.rightFork.setIsFree(true);
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
            }, 5000);
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
        this.image = new Image();
        this.image.src = './res/table.png';
        this.forks = [];
        for (var i = 0; i <= places; i++) {
            this.forks.push(new Fork(i));
        }
        this.philosophers = [];
        for (var i = 0; i <= places; i++) {
            var p = new Philosopher(i);
            p.addObserver(function () {
                _this.notifyObservers();
            });
            p.leftFork = this.forks[i];
            p.rightFork = this.forks[(i + 1) % places];
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
        this.button = document.getElementById('button');
        this.button.addEventListener('click', function () {
            _this.table.philosophers[0].eat();
            _this.table.philosophers[1].eat();
        });
        this.plate = new Image();
        this.plate.src = './res/plate.png';
        this.table = new Table();
        this.table.addObserver(function () {
            _this.updateCanvas();
        });
    }
    UI.prototype.createDefaultCanvas = function () {
        this.updateCanvas();
    };
    UI.prototype.updateCanvas = function () {
        var _this = this;
        this.ctx.clearRect(-this.canvasWidth / 2, -this.canvasHeight / 2, this.canvasWidth, this.canvasHeight);
        var tableWith = 2000;
        var tableHeight = 2000;
        this.ctx.drawImage(this.table.image, -tableWith / 2, -tableHeight / 2, tableWith, tableHeight);
        for (var i = 0; i <= places; i++) {
            this.drawOnTablePosition(i, 800, this.plate, 500, 500);
        }
        this.table.philosophers.forEach(function (philosopher) {
            _this.drawOnTablePosition(philosopher.getId(), 1000, philosopher.image, 500, 500);
        });
        this.table.forks.forEach(function (fork) {
            _this.drawOnForkPosition(fork.getId(), 800, fork.image, 500, 500);
        });
    };
    UI.prototype.drawOnTablePosition = function (position, radius, image, imgWith, imgHeight) {
        this.drawOnCyclePosition(position, radius, image, imgWith, imgHeight, 0, places);
    };
    UI.prototype.drawOnForkPosition = function (position, radius, image, imgWith, imgHeight) {
        this.drawOnCyclePosition(position, radius, image, imgWith, imgHeight, Math.PI, places);
    };
    UI.prototype.drawOnCyclePosition = function (position, radius, image, imgWith, imgHeight, offset, steps) {
        var arc = 2 * Math.PI / steps * position + offset;
        this.ctx.rotate(arc);
        this.ctx.drawImage(image, 0 - imgWith / 2, radius - imgHeight / 2, imgWith, imgHeight);
        this.ctx.rotate(-1 * arc);
    };
    return UI;
}());
var ui = new UI();
ui.createDefaultCanvas();
ui.updateCanvas();
//# sourceMappingURL=index.js.map