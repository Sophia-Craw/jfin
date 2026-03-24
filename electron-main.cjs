const { app, BrowserWindow } = require("electron")
const { fork } = require("child_process")
const path = require("path")
const http = require("http")
const net = require("net")

let svelteProcess

function getFreePort() {
	return new Promise((resolve, reject) => {
		const server = net.createServer()
		server.unref()
		server.on("error", reject)
		server.listen(0, "127.0.0.1", () => {
			const addr = server.address()
			const port = typeof addr === "object" && addr ? addr.port : null
			server.close(() => {
				if (port != null) resolve(port)
				else reject(new Error("Could not allocate a port"))
			})
		})
	})
}

function waitForServer(url, maxAttempts = 40, intervalMs = 250) {
	return new Promise((resolve, reject) => {
		let attempts = 0
		const tryOnce = () => {
			const req = http.get(url, (res) => {
				res.resume()
				resolve()
			})
			req.on("error", () => {
				attempts++
				if (attempts >= maxAttempts) {
					reject(new Error(`Server did not become ready at ${url}`))
				} else {
					setTimeout(tryOnce, intervalMs)
				}
			})
		}
		tryOnce()
	})
}

function createWindow(port, origin) {
	const win = new BrowserWindow({
		width: 1200,
		height: 800,
		backgroundColor: "black",
		titleBarOverlay: false,
		titleBarStyle: "hidden",
		webPreferences: {
			nodeIntegration: false,
			contextIsolation: true
		}
	})
	
	svelteProcess = fork(path.join(__dirname, "build", "index.js"), [], {
		cwd: __dirname,
		env: {
			...process.env,
			ELECTRON_RUN_AS_NODE: "1",
			PORT: String(port),
			ORIGIN: origin,
			NODE_ENV: process.env.NODE_ENV || "production"
		}
	})

	svelteProcess.on("error", (err) => {
		console.error("SvelteKit child process failed to start:", err)
	})

	svelteProcess.on("exit", (code, signal) => {
		if (code !== null && code !== 0) {
			console.error("SvelteKit server exited with code", code, signal)
		}
	})

	const load = async () => {
		try {
			await waitForServer(`${origin}/`)
			await win.loadURL(origin)
		} catch (err) {
			console.error(err)
		}
	}
	void load()

	win.on("closed", () => {
		if (svelteProcess) svelteProcess.kill()
	})
}

app.whenReady().then(async () => {
	let port
	let origin
	if (process.env.PORT) {
		port = Number(process.env.PORT)
		origin = process.env.ORIGIN || `http://127.0.0.1:${port}`
	} else {
		port = await getFreePort()
		origin = `http://127.0.0.1:${port}`
	}
	createWindow(port, origin)
})

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		if (svelteProcess) svelteProcess.kill()
		app.quit()
	}
})
