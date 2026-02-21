const express = require("express")
const redis = require("redis")
const axios = require("axios")

const app = express()
const client = redis.createClient({
    host:'localhost',
    port: 6379
})

app.get("/rickR", async (req, res)=>{
    const checkRedis = await client.get("rickApi")
    if(checkRedis) return res.json(JSON.parse(checkRedis))
    const {data} = await axios.get("https://rickandmortyapi.com/api/character")
    await client.set("rickApi", JSON.stringify(data))
})

app.get("/rick", async (req, res)=>{
    const {data} = await axios.get("https://rickandmortyapi.com/api/character")
    return res.json(data)
})

async function main(){
    await client.connect()
    app.listen(3000, ()=>{
        console.log("Express and Redis redies")
    })
}

main()