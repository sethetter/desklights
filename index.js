#!/usr/bin/env node

require('dotenv').load()

const huejay = require('huejay')

async function main() {
  try {
    const client = await getHueClient()
    const deskLights = await getLights(client, 'desk')

    await setLightsToColorLoops(client, deskLights)
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

async function getHueClient() {
  const bridgeIp = await huejay.discover().then(([bridge]) => bridge.ip)
  return new huejay.Client({ host: bridgeIp, username: process.env.HUE_USER })
}

async function getLights(client, lightName) {
  return client.lights.getAll().then(lights => lights.filter(light => {
    const n = light.attributes.attributes.name.toLowerCase()
    return !!n.match(lightName.toLowerCase())
  }))
}

function setLightsToColorLoops(client, lights) {
  return Promise.all(lights.map(light => {
    light.effect = 'colorloop'
    return client.lights.save(light)
  }))
}

main()
