package tech.marconymous.webpathfinder.classes

import java.lang.IllegalArgumentException

enum class Cell(val value: Int, val s: String) {
    WALL(-1, "X"),
    PATH(0, "O"),
    STRT(Int.MAX_VALUE, "S"),
    GOAL(Int.MIN_VALUE, "E");


    companion object {
        fun createCellArray(array: Array<Array<String>>): Array<Array<Cell>> {
            val height = array.size
            val width = array[0].size
            val cells = Array(height) {
                Array(width) { PATH }
            }

            for ((y, row) in array.withIndex()) {
                for ((x, cell) in row.withIndex()) {
                    cells[y][x] = getFromString(cell)
                }
            }

            return cells
        }

        private fun getFromString(s: String): Cell {
            for (e in values()) {
                if (e.s == s) {
                    return e
                }
            }

            throw IllegalArgumentException("The String: $s does not have a respective Cell")
        }
    }
}