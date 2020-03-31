import express, { Router, Response, Request } from 'express'

import { getDieselStationsAlongRouteAsync, getFuelStationsAlongTwoPointsRouteAsync } from '../services/fuelService'
import { Coords } from '../types/basic'

const router = Router()

const id: string = process.env.HERE_APP_ID;
const code: string = process.env.HERE_APP_CODE;
if(id == undefined || id == "" || code == undefined || code == "") {
    console.log("Please, provide \"HERE_APP_ID\" and \"HERE_APP_CODE\" environment variables.")
    process.exit(1)
}
const creds = {id, code}

const detourRegexpLiteral = '(\\d{3,4})';
const coordsRegexp = new RegExp('(-?\\d{1,2}\\.\\d{7}),(-?\\d{1,3}\\.\\d{7})'); // can be better
const getCoords = (coords: string): Coords => {
  const coordsMatch = coordsRegexp.exec(coords)
  if (coordsMatch == null) {
    return null
  }

  const [lat, lng] = coordsMatch.slice(1).map(Number)
  return {lat, lng}
}
const getAsyncServer = (all: boolean) => (req: Request, res: Response) => {
  req.setTimeout(30 * 1000, () => {
    res.status(408).end('Request Timeout')
  })
  res.setTimeout(30 * 60 * 1000, () => {
    res.status(503).end('Timeout: calculation took more than 30 min')
  })

  const {detour, from, to} = req.params;
  const keys = Object.keys(req.params)
    .filter(k => k.startsWith('via'))
    .map(k => Number(k.slice(3, k.length)))
  keys.sort((a, b) => a - b)
  const coords = [from, ...keys.map(k => req.params['via' + k]), to].map(getCoords)
  const detourNum = Number(detour)

  if (detourNum > 5000) {
    return res.status(400).end('detour must be less than 5000 meters')
  }

  if (coords.some(c => c == null)) {
    return res.status(400).end('wrong waypoint coordinates')
  }

  console.log(`got ds request with detour (${detourNum}) and coords (${coords.map(({ lat, lng }) => `${lat},${lng}`).join(';')})`)
  return getDieselStationsAlongRouteAsync(creds, Number(detour), ...coords)
    .then(pois => {
      console.log(`got ${pois[0].length} pois`)
        const resp = all
          ? pois
          : pois[0]

      try {
        const respJson = JSON.stringify(resp)
        console.log('response chunk: ' + respJson.slice(0, 100))
        res.end(respJson, 'utf-8')
        console.log('--> ok')
      } catch (e) {
        console.log('--> error')
        console.log(e)
      }
    })
    .catch(e => {
      console.log('Error: ' + JSON.stringify(e))
      res.status(400).end(JSON.stringify(e))
    })
}

router.use(express.json());
router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})

router.get(`/ds/:detour(${detourRegexpLiteral})/:from/:to`, getAsyncServer(false))
router.get(`/ds/:detour(${detourRegexpLiteral})/:from/:via1/:to`, getAsyncServer(false))
router.get(`/ds/:detour(${detourRegexpLiteral})/:from/:via1/:via2/:to`, getAsyncServer(false))
router.get(`/ds/:detour(${detourRegexpLiteral})/:from/:via1/:via2/:via3/:to`, getAsyncServer(false))
router.get(`/ds/:detour(${detourRegexpLiteral})/:from/:via1/:via2/:via3/:via4/:to`, getAsyncServer(false))
router.get(`/ds/:detour(${detourRegexpLiteral})/:from/:via1/:via2/:via3/:via4/:via5/:to`, getAsyncServer(false))
router.get(`/ds/:detour(${detourRegexpLiteral})/:from/:via1/:via2/:via3/:via4/:via5/:via6/:to`, getAsyncServer(false))
router.get(`/ds/:detour(${detourRegexpLiteral})/:from/:via1/:via2/:via3/:via4/:via5/:via6/:via7/:to`, getAsyncServer(false))
router.get(`/ds/:detour(${detourRegexpLiteral})/:from/:via1/:via2/:via3/:via4/:via5/:via6/:via7/:via8/:to`, getAsyncServer(false))
router.get(`/ds/:detour(${detourRegexpLiteral})/:from/:via1/:via2/:via3/:via4/:via5/:via6/:via7/:via8/:via9/:to`, getAsyncServer(false))
router.get(`/ds/:detour(${detourRegexpLiteral})/:from/:via1/:via2/:via3/:via4/:via5/:via6/:via7/:via8/:via9/:via10/:to`, getAsyncServer(false))
router.get(`/ds/:detour(${detourRegexpLiteral})/:from/:via1/:via2/:via3/:via4/:via5/:via6/:via7/:via8/:via9/:via10/:via11/:to`, getAsyncServer(false))
router.get(`/ds/:detour(${detourRegexpLiteral})/:from/:via1/:via2/:via3/:via4/:via5/:via6/:via7/:via8/:via9/:via10/:via11/:via12/:to`, getAsyncServer(false))
router.get(`/ds/:detour(${detourRegexpLiteral})/:from/:via1/:via2/:via3/:via4/:via5/:via6/:via7/:via8/:via9/:via10/:via11/:via12/:via13/:to`, getAsyncServer(false))
router.get(`/ds/:detour(${detourRegexpLiteral})/:from/:via1/:via2/:via3/:via4/:via5/:via6/:via7/:via8/:via9/:via10/:via11/:via12/:via13/:via14/:to`, getAsyncServer(false))

router.get(`/test/ds/:detour(${detourRegexpLiteral})/:from/:to`, getAsyncServer(true))
router.get(`/test/fs/:detour(${detourRegexpLiteral})/:from/:to`, (req, res) => {
  const {detour, from, to} = req.params;
  getFuelStationsAlongTwoPointsRouteAsync(creds, getCoords(from), getCoords(to), Number(detour))
    .then(stationsInfo => {
      res.end(JSON.stringify(stationsInfo), 'utf-8')
    })
    .catch(e => {
      console.log('Error: ' + JSON.stringify(e))
      res.status(400).end(JSON.stringify(e))
    })
})

export default router
