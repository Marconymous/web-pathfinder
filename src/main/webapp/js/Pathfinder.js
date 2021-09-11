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
var xSize = 50;
var ySize = 38;
var grid = document.querySelector('#grid');
var walls = [];
gridSize();
function fetchResult() {
    return __awaiter(this, void 0, void 0, function () {
        function generateWallParam() {
            var wall = '';
            for (var i = 0; i < walls.length; i++) {
                var w = walls[i];
                wall += w.y + ":" + w.x;
                if (i < walls.length - 1)
                    wall += '|';
            }
            return wall;
        }
        var fetchUrl, response, json, maxNr, _i, _a, row, _b, row_1, cell, y, x, i, cell, _c, _d, w, cell;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    fetchUrl = "services/find/path?xSize=" + xSize + "&ySize=" + ySize + "&walls=" + generateWallParam() + "&start=0:0&goal=" + (ySize - 1 + ':' + (xSize - 1));
                    console.log(fetchUrl);
                    return [4 /*yield*/, fetch(fetchUrl)];
                case 1:
                    response = _e.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    json = _e.sent();
                    console.log(json);
                    maxNr = 0;
                    for (_i = 0, _a = json.grid; _i < _a.length; _i++) {
                        row = _a[_i];
                        for (_b = 0, row_1 = row; _b < row_1.length; _b++) {
                            cell = row_1[_b];
                            if (cell === 2147483647)
                                continue;
                            if (cell > maxNr)
                                maxNr = cell;
                        }
                    }
                    for (y = 0; y < json.grid.length; y++) {
                        for (x = 0; x < json.grid[y].length; x++) {
                            i = json.grid[y][x];
                            cell = document.getElementById(y + "-" + x);
                            if (i === 2147483647) {
                                cell.style.background = '#7dc2bf';
                            }
                            else if (i === -2147483648) {
                                cell.style.background = '#535a9e';
                            }
                            else if (i === -1) {
                            }
                            else {
                                cell.style.background = getColor(i / maxNr);
                            }
                        }
                    }
                    for (_c = 0, _d = json.path; _c < _d.length; _c++) {
                        w = _d[_c];
                        cell = document.getElementById(w.y + "-" + w.x);
                        cell.style.background = '#75467d';
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function gridSize() {
    grid.innerHTML = '';
    var _loop_1 = function (y) {
        var row = document.createElement('tr');
        var _loop_2 = function (x) {
            var handle = function (isWall) {
                if (!isWall) {
                    cell.classList.remove('grid-cell-wall');
                    var _loop_3 = function (i) {
                        var wall = walls[i];
                        if (wall.x === x && wall.y === y) {
                            console.log("slice at " + y + ":" + x);
                            walls = walls.filter((function (value, index) { return index !== i; }));
                        }
                    };
                    for (var i = 0; i < walls.length; i++) {
                        _loop_3(i);
                    }
                }
                else {
                    var alreadyWall = false;
                    for (var _i = 0, walls_1 = walls; _i < walls_1.length; _i++) {
                        var w = walls_1[_i];
                        if (w.x === x && w.y === y) {
                            alreadyWall = true;
                            break;
                        }
                    }
                    if (!alreadyWall) {
                        cell.classList.add('grid-cell-wall');
                        console.log("wall at " + y + ":" + x);
                        walls.push({ x: x, y: y });
                    }
                }
            };
            var cell = document.createElement('td');
            cell.classList.add('grid-cell');
            cell.id = y + "-" + x;
            cell.onmouseover = function (e) {
                e.preventDefault();
                if (e.buttons === 1) {
                    handle(true);
                }
                else if (e.buttons === 2) {
                    handle(false);
                }
            };
            cell.oncontextmenu = function (e) {
                e.preventDefault();
                handle(false);
            };
            cell.onclick = function () {
                handle(true);
            };
            row.append(cell);
        };
        for (var x = 0; x < xSize; x++) {
            _loop_2(x);
        }
        grid.appendChild(row);
    };
    for (var y = 0; y < ySize; y++) {
        _loop_1(y);
    }
}
function getColor(value) {
    var hue = ((1 - value) * 120).toString(10);
    return ["hsl(", hue, ",100%,50%)"].join("");
}
