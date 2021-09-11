package tech.marconymous.webpathfinder.classes

class Solution(private val grid: Array<Array<Int>>, private val path: ArrayList<Point>) {
    private val hasPath = path.size <= 0

    fun createView(): Array<Array<String>> {
        val height = this.grid.size
        val width = this.grid[0].size

        val show = Array(height) {
            Array(width) { "" }
        }

        for ((y, row) in this.grid.withIndex()) {
            for ((x, cell) in row.withIndex()) {
                val s = when (cell) {
                    -1 -> "X"
                    else -> "."
                }
                show[y][x] = s
            }
        }

        for ((index, point) in this.path.withIndex()) {
            val s: String = when (index) {
                this.path.size - 1 -> "S"
                0 -> "E"
                else -> "*"
            }
            show[point.y][point.x] = s
        }

        return show
    }
}