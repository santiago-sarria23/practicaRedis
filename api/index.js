const express = require("express")  //Lo usamos para montar un servidor
const redis = require("redis")      //Redis
const axios = require("axios")      //Nos permite hacer peticiones a páginas webs, similar a fetch()

// Declaramos nuestra app
const app = express()

// Declaramos nuestro cliente de Redis
const client = redis.createClient({
    host:'localhost',   // La dirección en donde se encuentra el servidor de Redis
    port: 6379          // El puerto en el que corre el servidor de Redis
})

// Diclaramos una ruta. En esta ruta es la que usará Redis
app.get("/rickR", async (req, res)=>{
    const checkRedis = await client.get("rickApi")                                  // Intentamos obtener desde el servidor de Redis
    if(checkRedis) return res.json(JSON.parse(checkRedis))                          // Si encuentra algo guardado con la clave "rickApi", si lo encuentra, nos retorna el valor
    const {data} = await axios.get("https://rickandmortyapi.com/api/character")     // Si no se encuentra la clave, se ejecutará esta linea y se hará una solicitud la PokeApi
    await client.set("rickApi", JSON.stringify(data))                               // Guardamos los datos obtenidos en la anterior consulta con la clave "rickApi"
    return res.json(data)                                                           // Devolvemos la respuesta
})

// Diclaramos una ruta. En esta ruta no usará Redis
app.get("/rick", async (req, res)=>{
    const {data} = await axios.get("https://rickandmortyapi.com/api/character")     // Hacemos la petición a la PokeApi y obtenemos el objecto "data" de la respuesta
    return res.json(data)                                                           // Devolvemos la respuesta
})

async function main(){
    await client.connect()                                                          // Conectamos con Redis
    app.listen(3000, ()=>{console.log("Express and Redis ready")})
}

main()