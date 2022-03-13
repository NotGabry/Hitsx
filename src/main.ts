import express, { Application, Response } from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { createCanvas } from 'canvas';
import fs from 'fs';
import crypto from 'crypto';
import mongoose from 'mongoose';
import Hits from './schemes/hits';
import { HitsInterface } from './Types/interfaces';
import isURL from 'is-url';
import isHex from 'is-hexcolor';
import db from 'quick.db';

const app: Application = express()

app.listen(process.env.PORT || 9794, async () => {
    console.log(`Ready - Systems Online - Listen ${process.env.PORT || 9794}`)
})
mongoose.connect(process.env.MongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})

app.use(bodyParser.json())

app.get(`/`, async (req, res) => {
    res.redirect('https://github.com/Gabry-76/Hitsx')
})

app.use('/api/badge', async (req, res) => {
    let options: Number[] = [0, 1]
    let q = await req.query.site?.toString()
    if (!q) return res.json({ success: false, message: `Invalid URL. Try again with a valid query.` })
    if (!isURL(q)) return res.json({ success: false, message: 'Invalid URL. Try again with a valid URL. If you think this is a mistake pls report a bug on our github' }) 
    
    let bgColor: string = await req.query.bgColor?.toString() 
    let textColor: string = await req.query.textColor?.toString() 
    let rectColor: string = await req.query.rectColor?.toString() 

    let textType: number = await parseInt(req.query.textType?.toString()) || 0
    if (textType && !options.includes(textType)) return res.json({ success: false, message: `Invalid Text Type. Try again with a valid query. (${options.join(' | ')})` })

    await Hits.findOne({
        ID: q
    }, async (err: Error, data: HitsInterface) => {
        if (err) console.log(err)
        if (!data) {
            await Hits.create({
                ID: req.query.site?.toString(),
                BadgeHits: 0
            })
            await checkHits(res, 0, bgColor, rectColor, textColor, textType)
        } else {
            await checkHits(res, data.BadgeHits, bgColor, rectColor, textColor, textType)
            if (req.query.devOptions?.toString() && req.query.devOptions?.toString() == 'nofetch' || await rateLimits(q)) return
            data.BadgeHits++
            await data.save()
        }
    })
})

app.post('/api/fetch', async (req, res) => {
    if (!req.body.ID) return res.json({ success: false, message: `Invalid URL. Try again with a valid query.` })
    
    await Hits.findOne({
        ID: req.body.ID
    }, async (err: Error, data: HitsInterface) => {
        if (err) console.log(err)
        if (!data) {
            await Hits.create({
                ID: req.body.ID.toString(),
                BadgeHits: 0
            })
        } else {
            data.BadgeHits++
            await data.save()
        }
    })
})

app.use('/api/admin/delete', async (req, res) => {
    let pw: string = await req.query.pwd?.toString()
    if (pw && pw != process.env.Password || !pw) return res.json({ success: false, message: `Hey you're not Gabry, close this page Now.` })
    await deleteAllAssets(res)
})

app.use(async (req, res, next) => {
    res.redirect('https://github.com/Gabry-76/Hitsx')
})

const checkHits = async (res: Response, hits_: number, colorBg?: string, colorRect?: string, colorText?: string, text: number = 0): Promise<void> => {
    let canvas = createCanvas(140, 50)
    const ctx = canvas.getContext('2d')
    
    ctx.fillStyle = await isHex(`#${colorBg}`) ? `#${colorBg}` : '#282a36'
    ctx.fillRect(0, 0, 140, 50)

    ctx.fillStyle = await isHex(`#${colorText}`) ? `#${colorText}` : '#f8f8f2'
    ctx.font = `${hits_.toString().length > 5 ? 17 : 20}px Arial`
    ctx.textAlign = 'center'
    let space: string = String.fromCharCode(8202)
    let txt: string = ''
    if (text == 0) {
        txt = `H${space}i${space}t${space}s`
    } else if (text == 1) {
        txt = `Views`
    }
    ctx.fillText(txt, hits_.toString().length < 5 ? 35 : 28, 33)

    ctx.fillStyle = await isHex(`#${colorRect}`) ? `#${colorRect}` : '#b95877'
    ctx.fillRect(hits_.toString().length < 5 ? 70 : 55, 0, hits_.toString().length < 5 ? 70 : 85, 50)

    ctx.fillStyle = await isHex(`#${colorText}`) ? `#${colorText}` : '#f8f8f2'
    ctx.font = await `${hits_.toString().length > 5 ? 17 : 20}px Arial`
    ctx.textAlign = 'center'
    let arr: String[] = await stringToArray(hits_.toString())
    let r: string = await crypto.randomBytes(3).toString('hex')

    await ctx.fillText(arr.join(`${space}`), hits_.toString().length < 5 ? 105 : 98, 33)

    let buffer = await canvas.toBuffer('image/png')
    await fs.writeFileSync(path.join(__dirname, `Assets`, `${r}.png`), buffer)
    await res.contentType(`image/png`)
    await res.sendFile(path.join(__dirname, `Assets`, `${r}.png`))
}
const stringToArray = async (element: string): Promise<String[]> => {
    let arr: String[] = []
    for (let I = 0; I < element.length; I++) {
        await arr.push(element[I])
    }
    return arr
}
const rateLimits = async (ID: string): Promise<Boolean> => {
    let a: number = await db.fetch(`ratelimits.${ID}`)
    if (!a) await db.set(`ratelimits.${ID}`, 0)
    else await db.add(`ratelimis.${ID}`, 1)

    let refetch: number = await db.fetch(`ratelimits.${ID}`)
    
    if (refetch && refetch >= 4) return true
}
const deleteRateLimits = async (): Promise<void> => {
    await db.delete(`ratelimits`)
}
const deleteAllAssets = async (res: Response): Promise<Response> => {
    let assets = await fs
    .readdirSync(path.join(__dirname, 'Assets'))
    .filter(async f => f.endsWith('.png'))
    
    if (!assets.length) return res.json({ success: false, message: `No files to delete.`})

    for (let file of assets) {
        console.log(file)
        console.log(path.join(__dirname, 'Assets', `${file}`))
        await fs.unlinkSync(path.join(__dirname, 'Assets', `${file}`))
    }
    return res.json({ success: true, message: `All Assets were deleted.`})
}

setInterval(deleteRateLimits, 2500)