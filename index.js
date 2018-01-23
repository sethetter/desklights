#!/usr/bin/env node

require('dotenv').load()

const huejay = require('huejay')

async function main() {
  try {
    const client = await getHueClient()
    const light = await getLight(client, 'desk')

    await setLightToColorLoop(client, light)
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

async function getHueClient() {
  const bridgeIp = await huejay.discover().then(([bridge]) => bridge.ip)
  return new huejay.Client({ host: bridgeIp, username: process.env.HUE_USER })
}

async function getLight(client, lightName) {
  return await client.lights.getAll().then(lights => {
    let deskLight = null
    for (let light of lights) {
      const n = light.attributes.attributes.name.toLowerCase()
      if (n.match(lightName.toLowerCase())) deskLight = light
    }
    return deskLight
  })
}

function setLightToColorLoop(client, light) {
  light.effect = 'colorloop'
  return client.lights.save(light)
}

main()
