package tech.marconymous.webpathfinder.classes

import java.io.File

class Algorithm(private val board: Array<Array<Cell>>) {
    private val intBoard = generateIntArray(board)

    private fun generateIntArray(board: Array<Array<Cell>>): Array<Array<Int>> {
        val hg = board.size
        val wd = board[0].size

        val array = Array(hg) {
            Array(wd) {
                0
            }
        }

        for ((y, row) in board.withIndex()) {
            for ((x, cell) in row.withIndex()) {
                array[y][x] = cell.value
            }
        }

        return array
    }


    fun solve(): Solution {
        val startEnd = getStartEnd()
        val start = startEnd.first
        val end = startEnd.second

        var done = false
        var count = 0
        var hasSolution = true
        var lastPoints = arrayListOf(
            start
        )

        whileLoop@ while (!done) {
            count++
            done = true
            var cellChange = true

            val newLastPoints = arrayListOf<Point>()

            for (lp in lastPoints) {
                val positions = getNeighbors(lp)

                for (p in positions) {
                    if (!inArray(p)) continue
                    else if (board[p.y][p.x] == Cell.WALL) {
                        cellChange = false
                        continue
                    } else if (intBoard[p.y][p.x] == Cell.PATH.value) {
                        cellChange = true
                        newLastPoints.add(p)
                        done = false
                        intBoard[p.y][p.x] = count
                    }
                }
            }
            hasSolution = cellChange
            lastPoints = newLastPoints
        }

        val backtracked = if (hasSolution) backtrack(end) else arrayListOf()
        return Solution(intBoard, backtracked)
    }

    private fun getNeighbors(point: Point): Array<Point> {
        return arrayOf(
            Point(point.y - 1, point.x),
            Point(point.y + 1, point.x),
            Point(point.y, point.x + 1),
            Point(point.y, point.x - 1),
        )
    }

    private fun inArray(point: Point): Boolean {
        return !(point.y >= intBoard.size || point.y < 0 || point.x >= intBoard[0].size || point.x < 0)
    }

    private fun backtrack(end: Point): ArrayList<Point> {
        var current = end
        val path = arrayListOf(
            end
        )
        whileLoop@ while (true) {
            val neighbors = getNeighbors(current)

            var lowest = Int.MAX_VALUE
            var lowestPoint = Point(0, 0)
            for (p in neighbors) {
                if (!inArray(p)) continue
                if (intBoard[p.y][p.x] == Cell.GOAL.value) continue

                if (intBoard[p.y][p.x] == Cell.STRT.value) {
                    path.add(p)
                    break@whileLoop
                }

                if (intBoard[p.y][p.x] < lowest && intBoard[p.y][p.x] != -1) {
                    lowest = intBoard[p.y][p.x]
                    lowestPoint = p
                }
            }


            current = lowestPoint
            path.add(lowestPoint)
        }

        return path
    }

    private fun getStartEnd(): Pair<Point, Point> {
        var end = Point(-1, -1)
        var start = Point(-1, -1)
        for ((y, row) in board.withIndex()) {
            for ((x, cell) in row.withIndex()) {
                if (cell == Cell.GOAL) end = Point(y, x)
                else if (cell == Cell.STRT) start = Point(y, x)
            }
        }

        return Pair(start, end)
    }

    companion object {
        fun <T> createFile(array: Array<Array<T>>, name: String) {
            val file = initFile(name)
            var string = ""
            for (row in array) {
                for (cell in row) {
                    string += " $cell "
                }
                string += System.lineSeparator()
            }
            file.writeText(string)
        }

        private fun initFile(name: String): File {
            val file = File(name)
            file.createNewFile()
            return file
        }
    }
}