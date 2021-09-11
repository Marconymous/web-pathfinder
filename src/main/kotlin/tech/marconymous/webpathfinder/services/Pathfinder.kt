package tech.marconymous.webpathfinder.services

import tech.marconymous.webpathfinder.classes.Cell
import tech.marconymous.webpathfinder.classes.Point
import com.google.gson.Gson
import tech.marconymous.webpathfinder.classes.Algorithm
import javax.ws.rs.GET
import javax.ws.rs.Path
import javax.ws.rs.QueryParam
import javax.ws.rs.core.Response

@Path("find")
class Pathfinder {
    private fun parsePoint(asString: String): Point {
        val vals = asString.split(":")

        return Point(vals[0].toInt(), vals[1].toInt())
    }

    private fun parseWalls(walls: String): ArrayList<Point> {
        val pts = walls.split("|")

        val points = arrayListOf<Point>()
        for (p in pts) {
            points.add(parsePoint(p))
        }

        return points
    }

    private fun changeCell(array: Array<Array<Cell>>, point: Point, cell: Cell) {
        array[point.y][point.x] = cell
    }

    @Path("path")
    @GET
    fun findPath(
        @QueryParam("xSize") xSize: Int,
        @QueryParam("ySize") ySize: Int,
        @QueryParam("walls") paramWalls: String,
        @QueryParam("start") paramStart: String,
        @QueryParam("goal") paramGoal: String,
    ): Response? {

        println("xSize = $xSize")
        println("ySize = $ySize")
        println("walls = $paramWalls")
        println("goal = $paramGoal")
        println("start = $paramStart")

        // Create Array of Size
        val cellArray = Array(ySize) {
            Array(xSize) {
                Cell.PATH
            }
        }

        // Parse walls and set them in Array
        val walls = parseWalls(paramWalls)
        for (point in walls) {
            changeCell(cellArray, point, Cell.WALL)
        }


        // Parse Start & Goal
        val start = parsePoint(paramStart)
        val goal = parsePoint(paramGoal)
        changeCell(cellArray, start, Cell.STRT)
        changeCell(cellArray, goal, Cell.GOAL)

        val algo = Algorithm(cellArray)
        val sol = algo.solve()

        val gson = Gson()

        val response = gson.toJson(sol)

        return Response.status(200).entity(response).build()
    }
}