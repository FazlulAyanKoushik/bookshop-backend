const validUrl = require('valid-url')
const shortid = require('shortid')
const UrlShortener = require('../models/url-shortener');


exports.generateShortUrl = async (req, res, next) => {

    const baseUrl = 'http://localhost:3000'

    const {
        longUrl
    } = req.body // destructure the longUrl from req.body.longUrl

    // check base url if valid using the validUrl.isUri method
    if (!validUrl.isUri(baseUrl)) {
        return res.status(401).json('Invalid base URL')
    }

    // if valid, we create the url code
    const urlCode = shortid.generate()

    // check long url if valid using the validUrl.isUri method
    if (validUrl.isUri(longUrl)) {
        try {
            let url = await UrlShortener.findOne({
                longUrl
            })

            if (url) {
                res.status(200).json({
                    success: true,
                    url,
                    message: 'Old Url Generated'
                });
            } else {
                const shortUrl = baseUrl + '/' + urlCode

                url = new UrlShortener({
                    longUrl,
                    shortUrl,
                    urlCode,
                    date: new Date()
                })
                await url.save()
                res.status(200).json({
                    success: true,
                    url,
                    message: 'New Url Generated'
                });
            }
        }
            // exception handler
        catch (err) {
            console.log(err)
            res.status(500).json('Server Error')
        }
    } else {
        res.status(401).json({
            success: false,
            message: 'Invalid base url!'
        })
    }
}

exports.redirectToUrl = async (req, res, next) => {
    try {
        // find a document match to the code in req.params.code
        const url = await UrlShortener.findOne({
            urlCode: req.params.code
        })
        if (url) {
            return res.redirect(url.longUrl)
        } else {
            return res.status(404).json('No URL Found')
        }

    }
        // exception handler
    catch (err) {
        console.error(err)
        res.status(500).json('Server Error')
    }
}
