import express, { Response } from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { createCanvas } from 'canvas';
import fs from 'fs';
import crypto from 'crypto';
import mongoose from 'mongoose';
import Hits from './schemes/hits';
import { HitsInterface } from './types/types';
import isURL from 'is-url';

const app = express()

app.use(express.static(path.join(`${__dirname}/APIs`)))
app.listen(process.env.PORT || 9794, async () => {
    console.log(`Ready - Systems Online - Listen ${process.env.PORT || 9794}`)
})
mongoose.connect(process.env.MongoURI || '', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})

app.use(bodyParser.json())

app.get(`/`, async (req, res) => {
    res.redirect('https://github.com/Gabry-76/Hitsx')
})

app.use('/api/fetch', async (req, res) => {
    let q = await req.query.site?.toString().toLowerCase()
    if (!q) return res.json({ success: false, message: `Invalid URL. Try again with a valid query.` })
    if (!isURL(q)) return res.json({ success: false, message: 'Invalid URL. Try again with a valid url. If you think this is a mistake pls report a bug on our github' }) 
    await Hits.findOne({
        ID: q
    }, async (err: Error, data: HitsInterface) => {
        if (err) console.log(err)
        if (!data) {
            return res.json({ success: false, message: 'URL is not verified. Pls read our docs'})
        } else if (data && !data.Verified) {
            return res.json({ success: false, message: 'URL is not verified. Pls read our docs'})
        } else {
            await checkHits(res, data.BadgeHits)
        }
    })
})

app.use('/api/refresh', async (req, res) => {
    if (req.body.Password != process.env.Password) return res.json({ success: false, message: `Invalid Params.`})
    if (!req.body.ID) return res.json({ success: false, message: `Invalid Params.`})

    if (!isURL(req.body.ID)) return res.json({ success: false, message: `Invalid Params.`})
    
    await Hits.findOne({
        ID: req.body.ID
    }, async (err: Error, data: HitsInterface) => {
        if (!data) {
            await Hits.create({
                ID: req.body.ID,
                BadgeHits: 1,
                Verified: true
            })
        } else {
            if (!data.Verified) data.Verified = true
            await data.BadgeHits++
            await data.save()
        }
    })
})

app.use(async (req, res, next) => {
    res.redirect('https://github.com/Gabry-76/Hitsx')
})

const checkHits = async (res: Response, hits_: number) => {
    let canvas = createCanvas(140, 60)
    const ctx = canvas.getContext('2d')
    
    ctx.fillStyle = '#282a36'
    ctx.fillRect(0, 0, 140, 60)

    ctx.fillStyle = '#f8f8f2'
    ctx.font = await '20px Arial'
    ctx.textAlign = 'center'
    let space: string = String.fromCharCode(8202)
    let txt: string = `H${space}i${space}t${space}s`
    ctx.fillText(txt, hits_.toString().length < 5 ? 35 : 28, 35)

    ctx.fillStyle = '#b95877'
    ctx.fillRect(hits_.toString().length < 5 ? 70 : 55, 0, hits_.toString().length < 5 ? 70 : 85, 60)

    ctx.fillStyle = '#f8f8f2'
    ctx.font = await '20px Arial'
    ctx.textAlign = 'center'
    let arr: String[] = await stringToArray(hits_.toString())
    let r: string = await crypto.randomBytes(10).toString('hex')

    await ctx.fillText(arr.join(`${space}`), hits_.toString().length < 5 ? 105 : 98, 35)

    let buffer = await canvas.toBuffer('image/png')
    await fs.writeFileSync(`./Assets/${r}.png`, buffer)
    await res.contentType(`image/png`)
    await res.sendFile(path.join(`${__dirname}/Assets/${r}.png`))
}
const stringToArray = async (element: string) => {
    let arr: String[] = []
    for (let I = 0; I < element.length; I++) {
        await arr.push(element[I])
    }
    return arr
}
const delay = async (ms: number) => new Promise(res => setTimeout(res, ms))
