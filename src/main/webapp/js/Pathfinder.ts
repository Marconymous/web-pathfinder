interface Wall {
    x: number,
    y: number
}

const xSize = 50
const ySize = 38
const grid = document.querySelector('#grid') as HTMLTableElement
let walls: Wall[] = []

gridSize()

async function fetchResult() {
    function generateWallParam() {
        let wall = ''
        for (let i = 0; i < walls.length; i++) {
            const w = walls[i]

            wall += `${w.y}:${w.x}`
            if (i < walls.length - 1) wall += '|'
        }

        return wall
    }

    const fetchUrl = `services/find/path?xSize=${xSize}&ySize=${ySize}&walls=${generateWallParam()}&start=0:0&goal=${ySize - 1 + ':' + (xSize - 1)}`
    console.log(fetchUrl)
    const response = await fetch(fetchUrl)
    const json = await response.json()

    console.log(json)

    let maxNr = 0
    for (const row of json.grid) {
        for (const cell of row) {
            if (cell === 2147483647) continue

            if (cell > maxNr) maxNr = cell
        }
    }

    for (let y = 0; y < json.grid.length; y++) {
        for (let x = 0; x < json.grid[y].length; x++) {
            const i = json.grid[y][x]
            const cell = document.getElementById(`${y}-${x}`)

            if (i === 2147483647) {
                cell.style.background = '#7dc2bf'
            } else if (i === -2147483648) {
                cell.style.background = '#535a9e'
            } else if (i === -1) {

            } else {
                cell.style.background = getColor(i / maxNr)
            }
        }
    }

    for (const w of json.path) {
        const cell = document.getElementById(`${w.y}-${w.x}`)
        cell.style.background = '#75467d'
    }
}

function gridSize() {
    grid.innerHTML = ''
    for (let y = 0; y < ySize; y++) {
        const row = document.createElement('tr') as HTMLTableRowElement
        for (let x = 0; x < xSize; x++) {
            const handle = (isWall: boolean) => {
                if (!isWall) {
                    cell.classList.remove('grid-cell-wall')

                    for (let i = 0; i < walls.length; i++) {
                        const wall = walls[i]
                        if (wall.x === x && wall.y === y) {
                            console.log(`slice at ${y}:${x}`)
                            walls = walls.filter(((value, index) => index !== i))
                        }
                    }
                } else {
                    let alreadyWall = false
                    for (const w of walls) {
                        if (w.x === x && w.y === y) {
                            alreadyWall = true
                            break
                        }
                    }

                    if (!alreadyWall) {
                        cell.classList.add('grid-cell-wall')
                        console.log(`wall at ${y}:${x}`)
                        walls.push({x: x, y: y})
                    }
                }
            }
            const cell = document.createElement('td') as HTMLTableCellElement
            cell.classList.add('grid-cell')
            cell.id = `${y}-${x}`

            cell.onmouseover = (e) => {
                e.preventDefault()
                if (e.buttons === 1) {
                    handle(true)
                } else if (e.buttons === 2) {
                    handle(false)
                }
            }

            cell.oncontextmenu = (e) => {
                e.preventDefault()
                handle(false)
            }

            cell.onclick = () => {
                handle(true)
            }

            row.append(cell)
        }
        grid.appendChild(row)
    }
}

function getColor(value) {
    const hue = ((1 - value) * 120).toString(10);
    return ["hsl(", hue, ",100%,50%)"].join("");
}