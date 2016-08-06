let app = require('koa')()
require('koa-qs')(app, 'extended')
let router = require('koa-router')()
var path = require('path')
var fs = require('fs')
var url = require('url')
var exec = require('child_process').exec
const querystring = require('querystring')
const PORT = 4000

router.get('*',
    async function(next) {
        const URL = url.parse(this.request.url)
        const HREF = URL.href
        const DIST_PATH = path.join(__dirname, 'dist')
		const INDEX_PATH = path.join(DIST_PATH, 'index.html')
		const LIB_PATH = path.join(DIST_PATH, HREF)
        const QUERIES = querystring.parse(URL.query)

        if (HREF.startsWith('/components')) {
			const COMPONENT_PATH = path.join(__dirname, HREF, 'build', 'app.js')
            this.type = 'application/javascript'
            this.body = fs.readFileSync(COMPONENT_PATH, 'utf8')
        }

		else if (HREF === '/') this.body = fs.readFileSync(INDEX_PATH, 'utf8')

        else this.body = fs.readFileSync(LIB_PATH, 'utf8')
    }
)

router.post('*',
    async function(next) {
        exec('git pull')
        this.status = 200
        this.type = 'json'
        this.body = 'success'
    }
)

app.use(router.routes())
app.listen(PORT)

console.log('Started application at', PORT)
