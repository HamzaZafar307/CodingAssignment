
let db = {}

let loginRateLimiter = (ip, cookieId, username) => {
    let getCount = (key) => db[key]
    let incrCount = (key, expiry) => {
        if (!db[key]) {
            db[key] = 1
            setTimeout(() => {
                console.log('clearing key', { key })
                delete db[key]
            }, 1000 * expiry)
            return 1
        }

        return db[key]++
    }

    if (
        getCount(`login:user:hr:${username}`) >= 10 ||
        getCount(`login:ip:mn:${ip}`) >= 5 ||
        getCount(`login:ip:hr:${ip}`) >= 15 ||
        getCount(`login:cookie:10s:${cookieId}`) >= 2
    ) {
        console.log('rate limited, sorry')
        return false
    }

    incrCount(`login:user:hr:${username}`, 60 * 60)
    incrCount(`login:ip:mn:${ip}`, 60)
    incrCount(`login:ip:hr:${ip}`, 60 * 60)
    incrCount(`login:cookie:10s:${cookieId}`, 10)

    return true

}

const main = () => {
    loginRateLimiter('1.1.1.1', 'sample-cookie', 'acid')
    loginRateLimiter('1.1.1.1', 'sample-cookie', 'acid')
    loginRateLimiter('1.1.1.1', 'sample-cookie', 'acid')
    // should be rate limited now
}

module.exports = main