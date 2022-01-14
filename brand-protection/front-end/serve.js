const Path = require('path')
const process = require('process')

const log = require('book')
const micro = require('micro')
const dotenv = require('dotenv')
const handler = require('serve-handler')
const localtunnel = require('localtunnel')

const config = dotenv.config({path: './.env'}).parsed

let tunnel
const PORT = config.PORT || 3000
const SUBDOMAIN = config.SUBDOMAIN || undefined
const PUBLIC_DIR = Path.resolve(__dirname, 'dist')

//---------------------------------------------------------------------- main --
async function main() {
    /**
     * Create a tunnel to expose our localhost server via a public url.
     * e.g https://${SUBDOMAIN}.loca.lt
     */
    tunnel = await localtunnel({port: PORT, subdomain: SUBDOMAIN})

    /**
     * Create our local server to serve our UI website and assets.
     * e.g "http://localhost:${PORT}"
     */
    const server = micro(async (req, res) => {
        await handler(req, res, {
            public: PUBLIC_DIR,
            rewrites: [
                // Redirect all requests to index.html since we have a React SPA
                {source: '*', destination: '/index.html'},
            ],
            renderSingle: true,
        })
    })

    tunnel.on('close', () => {
        process.stdout.write('\n')
        log.info('tunnel closed')
        server.close()
    })

    server
        .on('close', () => {
            log.info('server closed')
            process.exit()
        })
        .listen(PORT, () => {
            log.info('LOCAL URL: http://localhost:%s', PORT)
            log.info('PUBLIC URL: %s', tunnel.url)
            log.info('Serving files from: %s', PUBLIC_DIR)
            console.log('-'.repeat(tunnel.url.length + 20))
        })
}

main()

//------------------------------------------------------------------- cleanup --
process
    .on('SIGINT', close)
    .on('SIGTERM', close)
    .on('uncaughtException', (e) => {
        log.error(e)
        process.exit()
    })

function close() {
    if (tunnel && !tunnel.closed) {
        tunnel.close()
    }
}