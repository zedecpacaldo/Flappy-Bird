// TYPES
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
// VIEW
var FlappyBirdBrowserView = /** @class */ (function () {
    // Constructor is private to force use of `create` for instantiation
    function FlappyBirdBrowserView(canvas, ctx, groundHeight, groundVx, pipeImg, backgroundImg, groundImg, birdImg, debug) {
        var _this = this;
        this.canvas = canvas;
        this.ctx = ctx;
        this.groundHeight = groundHeight;
        this.groundVx = groundVx;
        this.pipeImg = pipeImg;
        this.backgroundImg = backgroundImg;
        this.groundImg = groundImg;
        this.birdImg = birdImg;
        this.debug = debug;
        this.tickHandlers = [];
        this.jumpHandlers = [];
        this.isTickingPaused = false;
        this.BIRD_SPRITE_STEPS = 3;
        this.BIRD_SPRITE_TICK_DIVISOR = 3;
        this.SINGLE_BIRD_SPRITE_WIDTH = 92;
        this.CANVAS_TEXT_STYLING = "56pt flappyfont";
        this.redraw = function (tickCount, pipePairs, bird, score) {
            _this.drawWorld(tickCount);
            _this.drawPipePairs(pipePairs);
            _this.drawBird(tickCount, bird);
            _this.drawScore(score);
        };
        this.pauseTicking = function () {
            _this.isTickingPaused = true;
        };
        this.unpauseTicking = function () {
            if (_this.isTickingPaused) {
                _this.isTickingPaused = false;
                window.requestAnimationFrame(_this.tickHandler);
            }
        };
        this.tickHandler = function () {
            _this.tickHandlers.forEach(function (f) { return f(_this); });
            if (!_this.isTickingPaused) {
                window.requestAnimationFrame(_this.tickHandler);
            }
        };
        this.jumpHandler = function () {
            _this.jumpHandlers.forEach(function (f) { return f(_this); });
        };
        this.drawWorld = function (tickCount) {
            _this.ctx.drawImage(_this.backgroundImg, 0, 0, _this.canvas.width, _this.canvas.height - _this.groundHeight);
            // Width must still be even for ground images with odd widths
            var groundWidth = Math.floor((_this.groundImg.width + 1) / 2) * 2;
            // Illusion of movement needs one extra ground image at right end
            var groundTileCount = Math.ceil(_this.canvas.width / groundWidth) + 1;
            var stepsPerFullGroundMovement = Math.ceil(Math.abs(_this.groundImg.width / _this.groundVx));
            var groundMovementStep = tickCount % stepsPerFullGroundMovement;
            Array(groundTileCount)
                .fill(0)
                .map(function (_, idx) { return idx * groundWidth; })
                .forEach(function (x) {
                return _this.ctx.drawImage(_this.groundImg, x + groundMovementStep * _this.groundVx, _this.canvas.height - _this.groundHeight, groundWidth, _this.groundImg.height);
            });
        };
        this.drawPipePairs = function (pairs) {
            pairs.forEach(_this.drawPipePair);
        };
        this.drawPipePair = function (pair) {
            _this.drawTopPipe(pair);
            _this.drawBottomPipe(pair);
        };
        this.drawTopPipe = function (pair) {
            // Assumes pipe image is inverted
            _this.ctx.save();
            _this.ctx.translate(pair.width, pair.topHeight);
            _this.ctx.scale(-1, 1);
            _this.ctx.rotate((Math.PI / 180) * 180);
            _this.ctx.drawImage(_this.pipeImg, 0, 0, pair.width, pair.topHeight, -pair.width + pair.x, 0, pair.width, pair.topHeight);
            _this.ctx.restore();
        };
        this.drawBottomPipe = function (pair) {
            var bottomPipeY = _this.canvas.height - _this.groundHeight - pair.bottomHeight;
            _this.ctx.drawImage(_this.pipeImg, 0, 0, pair.width, pair.bottomHeight, pair.x, bottomPipeY, pair.width, pair.bottomHeight);
        };
        this.drawBird = function (tickCount, bird) {
            var currentBirdStage = Math.floor(tickCount / _this.BIRD_SPRITE_TICK_DIVISOR) %
                _this.BIRD_SPRITE_STEPS;
            var birdTopLeftX = bird.x - _this.SINGLE_BIRD_SPRITE_WIDTH / 2;
            var birdTopLeftY = bird.y - _this.birdImg.height / 2;
            if (_this.debug) {
                _this.ctx.beginPath();
                _this.ctx.arc(bird.x, bird.y, 35, 0, 2 * Math.PI);
                _this.ctx.fill();
            }
            _this.ctx.drawImage(_this.birdImg, currentBirdStage * _this.SINGLE_BIRD_SPRITE_WIDTH, 0, _this.SINGLE_BIRD_SPRITE_WIDTH, _this.birdImg.height, birdTopLeftX, birdTopLeftY, _this.SINGLE_BIRD_SPRITE_WIDTH, _this.birdImg.height);
        };
        this.drawScore = function (score) {
            var x = _this.canvas.width / 2;
            var y = _this.canvas.height / 6;
            var text = score.toString();
            _this.ctx.textBaseline = "middle";
            _this.ctx.textAlign = "center";
            _this.ctx.fillStyle = "white";
            _this.ctx.strokeStyle = "black";
            _this.ctx.lineWidth = 5;
            _this.ctx.fillText(text, x, y);
            _this.ctx.strokeText(text, x, y);
        };
    }
    // Constructors cannot be async, so a static factory method must be used
    FlappyBirdBrowserView.create = function (opts) {
        return __awaiter(this, void 0, void 0, function () {
            var canvasId, groundHeight, groundVx, _a, pipeSrc, _b, backgroundSrc, _c, groundSrc, _d, birdSrc, _e, fontSrc, _f, debug, canvas, ctx, backgroundImg, pipeImg, groundImg, birdImg, view, font;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        canvasId = opts.canvasId, groundHeight = opts.groundHeight, groundVx = opts.groundVx, _a = opts.pipeSrc, pipeSrc = _a === void 0 ? "pipe.png" : _a, _b = opts.backgroundSrc, backgroundSrc = _b === void 0 ? "background.png" : _b, _c = opts.groundSrc, groundSrc = _c === void 0 ? "ground.png" : _c, _d = opts.birdSrc, birdSrc = _d === void 0 ? "bird.png" : _d, _e = opts.fontSrc, fontSrc = _e === void 0 ? "font.woff" : _e, _f = opts.debug, debug = _f === void 0 ? false : _f;
                        canvas = document.getElementById(canvasId);
                        ctx = canvas === null || canvas === void 0 ? void 0 : canvas.getContext("2d");
                        if (canvas == null || ctx == null) {
                            throw new Error("Cannot get context of canvas element ".concat(canvasId));
                        }
                        return [4 /*yield*/, this.loadImage(backgroundSrc)];
                    case 1:
                        backgroundImg = _g.sent();
                        return [4 /*yield*/, this.loadImage(pipeSrc)];
                    case 2:
                        pipeImg = _g.sent();
                        return [4 /*yield*/, this.loadImage(groundSrc)];
                    case 3:
                        groundImg = _g.sent();
                        return [4 /*yield*/, this.loadImage(birdSrc)];
                    case 4:
                        birdImg = _g.sent();
                        view = new FlappyBirdBrowserView(canvas, ctx, groundHeight, groundVx, pipeImg, backgroundImg, groundImg, birdImg, debug);
                        return [4 /*yield*/, new FontFace("flappyfont", "url(".concat(fontSrc, ")")).load()];
                    case 5:
                        font = _g.sent();
                        document.fonts.add(font);
                        ctx.font = view.CANVAS_TEXT_STYLING;
                        canvas.addEventListener("click", view.jumpHandler);
                        window.addEventListener("keypress", function (ev) {
                            if (ev.key === " ")
                                view.jumpHandler();
                        });
                        window.requestAnimationFrame(view.tickHandler);
                        return [2 /*return*/, view];
                }
            });
        });
    };
    // Callback is wrapped in a Promise to avoid callback hell
    FlappyBirdBrowserView.loadImage = function (url) {
        var img = new Image();
        img.src = url;
        return new Promise(function (resolve) {
            img.addEventListener("load", function () {
                return resolve(img);
            });
        });
    };
    FlappyBirdBrowserView.prototype.addTickHandler = function (callback) {
        this.tickHandlers.push(callback);
    };
    FlappyBirdBrowserView.prototype.addJumpHandler = function (callback) {
        this.jumpHandlers.push(callback);
    };
    return FlappyBirdBrowserView;
}());
var PipeDeleter = /** @class */ (function () {
    function PipeDeleter() {
    }
    PipeDeleter.prototype.deleteOutOfBoundPipes = function (pairs) {
        return pairs.filter(function (pair) { return pair.x + pair.width >= 0; });
    };
    return PipeDeleter;
}());
var MovementHandler = /** @class */ (function () {
    function MovementHandler() {
    }
    MovementHandler.prototype.moveGameObjects = function (gameState) {
        var bird = gameState.bird;
        var pairs = gameState.pipePairs;
        return __assign(__assign({}, gameState), { bird: __assign(__assign({}, bird), { y: bird.y + bird.vy + bird.ay, vy: bird.vy + bird.ay }), pipePairs: pairs.map(function (pair) { return (__assign(__assign({}, pair), { x: pair.x + pair.vx })); }) });
    };
    return MovementHandler;
}());
var CollisionDetector = /** @class */ (function () {
    function CollisionDetector() {
    }
    CollisionDetector.prototype.isGameOver = function (gameState) {
        return this.hasCollidedWithAny(gameState.bird, gameState.pipePairs, gameState.screenHeight, gameState.groundHeight);
    };
    CollisionDetector.prototype.hasCollidedWithAny = function (bird, pairs, screenHeight, groundHeight) {
        for (var _i = 0, pairs_1 = pairs; _i < pairs_1.length; _i++) {
            var pipe = pairs_1[_i];
            if (bird.y < 0 && bird.x + 35 >= pipe.x) {
                return true;
            }
            if (this.hasCollidedWith(bird, pipe.x + pipe.width / 2, pipe.topHeight / 2, pipe.width, pipe.topHeight) || this.hasCollidedWith(bird, pipe.x + pipe.width / 2, screenHeight - (groundHeight + pipe.bottomHeight / 2), pipe.width, pipe.bottomHeight)) {
                return true;
            }
        }
        return false;
    };
    CollisionDetector.prototype.hasCollidedWith = function (bird, pipeX, pipeY, pipeWidth, pipeHeight) {
        var circleDistanceX = Math.abs(bird.x - pipeX);
        var circleDistanceY = Math.abs(bird.y - pipeY);
        if (circleDistanceX > (pipeWidth / 2 + 35)) {
            return false;
        }
        if (circleDistanceY > (pipeHeight / 2 + 35)) {
            return false;
        }
        if (circleDistanceX <= (pipeWidth / 2)) {
            return true;
        }
        if (circleDistanceY <= (pipeHeight / 2)) {
            return true;
        }
        var cornerDistance_sq = Math.pow((circleDistanceX - pipeWidth / 2), 2) +
            Math.pow((circleDistanceY - pipeHeight / 2), 2);
        return (cornerDistance_sq <= (Math.pow(35, 2)));
        ;
    };
    return CollisionDetector;
}());
var OutOfBoundsDetector = /** @class */ (function () {
    function OutOfBoundsDetector() {
    }
    OutOfBoundsDetector.prototype.isGameOver = function (gameState) {
        return this.isOutOfBounds(gameState.bird, gameState.screenHeight, gameState.groundHeight);
    };
    OutOfBoundsDetector.prototype.isOutOfBounds = function (bird, screenHeight, groundHeight) {
        var birdBottom = bird.y + bird.height / 2;
        var maxBirdBottom = screenHeight - groundHeight;
        return birdBottom > maxBirdBottom;
    };
    return OutOfBoundsDetector;
}());
var GameOverDecider = /** @class */ (function () {
    function GameOverDecider(detectors) {
        this.detectors = __spreadArray([], detectors, true);
    }
    GameOverDecider.createDefault = function () {
        return new GameOverDecider([
            new CollisionDetector(),
            new OutOfBoundsDetector(),
        ]);
    };
    GameOverDecider.prototype.isGameOver = function (gameState) {
        return this.detectors.some(function (detector) { return detector.isGameOver(gameState); });
    };
    return GameOverDecider;
}());
var ScoreManager = /** @class */ (function () {
    function ScoreManager() {
        this._score = 0;
    }
    Object.defineProperty(ScoreManager.prototype, "score", {
        get: function () {
            return this._score;
        },
        enumerable: false,
        configurable: true
    });
    ScoreManager.prototype.updateScoreIfNeeded = function (previousGameState, currentGameState) {
        if (this.shouldUpdateScore(previousGameState, currentGameState)) {
            this._score++;
            return;
        }
    };
    ScoreManager.prototype.shouldUpdateScore = function (previousGameState, currentGameState) {
        if ((currentGameState.pipePairs).length != (previousGameState.pipePairs).length) {
            return true;
        }
        return false;
    };
    ScoreManager.prototype.reset = function () {
        this._score = 0;
    };
    return ScoreManager;
}());
var PipeGenerator = /** @class */ (function () {
    function PipeGenerator(ticksPerGeneration, holeHeight, minPipeHeight) {
        this.ticksPerGeneration = ticksPerGeneration;
        this.holeHeight = holeHeight;
        this.minPipeHeight = minPipeHeight;
    }
    PipeGenerator.prototype.gameTick = function (tickCount, gameState) {
        return tickCount % this.ticksPerGeneration === 0
            ? this.generatePipePair(gameState)
            : null;
    };
    PipeGenerator.prototype.generatePipePair = function (gameState) {
        var heightFromTopToGround = gameState.screenHeight - gameState.groundHeight;
        var totalPipeHeight = heightFromTopToGround - this.holeHeight;
        var maxSinglePipeHeight = totalPipeHeight - this.minPipeHeight;
        var topPipeHeight = this.randomInt(this.minPipeHeight, maxSinglePipeHeight);
        var bottomPipeHeight = totalPipeHeight - topPipeHeight;
        return {
            x: gameState.screenWidth,
            width: gameState.pipeWidth,
            topHeight: topPipeHeight,
            bottomHeight: bottomPipeHeight,
            vx: gameState.pipeVx
        };
    };
    PipeGenerator.prototype.randomInt = function (min, max) {
        var range = max - min + 1;
        return Math.floor(Math.random() * range) + min;
    };
    return PipeGenerator;
}());
var FlappyBirdModel = /** @class */ (function () {
    function FlappyBirdModel(opts) {
        this.opts = __assign({}, opts);
        this._gameState = this.makeGameState(opts);
        this._previousGameState = this._gameState;
    }
    FlappyBirdModel.prototype.makeGameState = function (opts) {
        return {
            tickCount: 0,
            screenWidth: opts.screenWidth,
            screenHeight: opts.screenHeight,
            groundHeight: opts.groundHeight,
            pipeWidth: opts.pipeWidth,
            pipeVx: opts.pipeVx,
            pipePairs: [],
            score: 0,
            bird: {
                x: opts.screenWidth / 2,
                y: opts.screenHeight / 2,
                width: opts.birdWidth,
                height: opts.birdHeight,
                vy: 0,
                ay: opts.birdAy
            }
        };
    };
    FlappyBirdModel.createDefault = function () {
        var FPS = 60;
        var secondsPerGeneration = 2;
        var ticksPerGeneration = FPS * secondsPerGeneration;
        var holeHeight = 230;
        var minPipeHeight = 100;
        var opts = {
            screenWidth: 600,
            screenHeight: 800,
            groundHeight: 128,
            birdWidth: 92,
            birdHeight: 64,
            pipeWidth: 138,
            pipeVx: -3,
            birdAy: 0.5,
            gameOverDecider: GameOverDecider.createDefault(),
            movementHandler: new MovementHandler(),
            scoreManager: new ScoreManager(),
            pipeGenerator: new PipeGenerator(ticksPerGeneration, holeHeight, minPipeHeight),
            pipeDeleter: new PipeDeleter()
        };
        return new FlappyBirdModel(opts);
    };
    FlappyBirdModel.prototype.gameTick = function () {
        if (!this.isGameOver()) {
            var newPipePair = this.opts.pipeGenerator.gameTick(this.gameState.tickCount, this._gameState);
            if (newPipePair !== null) {
                this._gameState.pipePairs.push(newPipePair);
            }
            var newGameState = this.opts.movementHandler.moveGameObjects(this.gameState);
            this.opts.scoreManager.updateScoreIfNeeded(this._previousGameState, newGameState);
            this._gameState = __assign(__assign({}, newGameState), { pipePairs: this.opts.pipeDeleter.deleteOutOfBoundPipes(newGameState.pipePairs), score: this.opts.scoreManager.score });
        }
        this._previousGameState = this._gameState;
        this._gameState = __assign(__assign({}, this.gameState), { tickCount: this._gameState.tickCount + 1 });
    };
    FlappyBirdModel.prototype.triggerJump = function () {
        this._gameState.bird.vy = -12;
    };
    FlappyBirdModel.prototype.reset = function () {
        this._gameState = this.makeGameState(this.opts);
        this._previousGameState = this._gameState;
        this.opts.scoreManager.reset();
    };
    FlappyBirdModel.prototype.isGameOver = function () {
        return this.opts.gameOverDecider.isGameOver(this.gameState);
    };
    Object.defineProperty(FlappyBirdModel.prototype, "gameState", {
        get: function () {
            // Defensive copy; expensive
            return JSON.parse(JSON.stringify(this._gameState));
        },
        enumerable: false,
        configurable: true
    });
    return FlappyBirdModel;
}());
var FlappyBirdPresenter = /** @class */ (function () {
    function FlappyBirdPresenter(model, view) {
        var _this = this;
        this.model = model;
        this.view = view;
        this.handleTick = function () {
            if (_this.model.isGameOver()) {
                _this.view.pauseTicking();
            }
            else {
                _this.model.gameTick();
                var gameState = _this.model.gameState;
                _this.view.redraw(gameState.tickCount, gameState.pipePairs, gameState.bird, gameState.score);
            }
        };
        this.handleJump = function () {
            if (_this.model.isGameOver()) {
                _this.model.reset();
                _this.view.unpauseTicking();
            }
            else {
                _this.model.triggerJump();
            }
        };
        this.view.addTickHandler(this.handleTick);
        this.view.addJumpHandler(this.handleJump);
    }
    return FlappyBirdPresenter;
}());
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var model, view;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    model = FlappyBirdModel.createDefault();
                    return [4 /*yield*/, FlappyBirdBrowserView.create({
                            canvasId: "flappy-canvas",
                            groundHeight: 128,
                            groundVx: -3,
                            debug: false
                        })];
                case 1:
                    view = _a.sent();
                    new FlappyBirdPresenter(model, view);
                    return [2 /*return*/];
            }
        });
    });
}
main();
