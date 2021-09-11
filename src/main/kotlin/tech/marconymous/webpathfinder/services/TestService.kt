package tech.marconymous.webpathfinder.services

import javax.ws.rs.GET
import javax.ws.rs.Path
import javax.ws.rs.Produces
import javax.ws.rs.core.MediaType
import javax.ws.rs.core.Response

@Path("test")
class TestService {

    @GET
    @Produces(MediaType.TEXT_PLAIN)
    fun test(): Response {
        return Response.status(200).entity("Yes!").build()
    }
}