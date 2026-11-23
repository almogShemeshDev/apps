import * as THREE from 'three'

const TAU = Math.PI * 2
const INK = 0x2b2b52
const CREAM = 0xfffdf5
const RIM = 0xff8c42
const HOUR_COLOR = 0x7a5cff
const MINUTE_COLOR = 0xff6f91
const SECOND_COLOR = 0xff8c42
const GOLD = 0xffd76a

function numberTexture(text, { size = 128, color = '#2b2b52', weight = 900 } = {}) {
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    ctx.font = `${weight} ${size * 0.62}px Rubik, system-ui, sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = color
    ctx.fillText(text, size / 2, size / 2 + size * 0.03)
    const tex = new THREE.CanvasTexture(canvas)
    tex.anisotropy = 4
    return tex
}

function angleForHour(hourValue) {
    return (hourValue / 12) * TAU
}
function angleForMinute(minuteValue) {
    return (minuteValue / 60) * TAU
}

function makeHand({ length, width, depth, color, pivotOffset = 0 }) {
    const geo = new THREE.BoxGeometry(width, length, depth)
    geo.translate(0, length / 2 - pivotOffset, 0)
    const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.4, metalness: 0.1 })
    const mesh = new THREE.Mesh(geo, mat)
    mesh.castShadow = true
    const tip = new THREE.Mesh(
        new THREE.CircleGeometry(width * 0.55, 16),
        mat
    )
    tip.position.set(0, length - pivotOffset, depth / 2 + 0.001)
    mesh.add(tip)
    return mesh
}

export function createClock3D(container) {
    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50)
    camera.position.set(0, 0.35, 9)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    container.appendChild(renderer.domElement)
    renderer.domElement.style.display = 'block'
    renderer.domElement.style.touchAction = 'none'

    // --- lighting ---
    scene.add(new THREE.AmbientLight(0xffffff, 0.75))
    const key = new THREE.DirectionalLight(0xffffff, 1.1)
    key.position.set(2, 3, 5)
    key.castShadow = true
    key.shadow.mapSize.set(512, 512)
    scene.add(key)
    const fill = new THREE.DirectionalLight(0xbfe9ff, 0.4)
    fill.position.set(-3, -1, 2)
    scene.add(fill)

    // --- background whimsy (sun + clouds), own small scene drawn behind ---
    const bgGroup = new THREE.Group()
    bgGroup.position.z = -6
    scene.add(bgGroup)

    const sunMat = new THREE.MeshBasicMaterial({ color: GOLD })
    const sun = new THREE.Mesh(new THREE.CircleGeometry(1.4, 32), sunMat)
    sun.position.set(3.2, 2.4, 0)
    bgGroup.add(sun)

    const cloudMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 })
    function makeCloud(x, y, scale) {
        const g = new THREE.Group()
        ;[
            [0, 0, 0.6],
            [0.55, 0.1, 0.45],
            [-0.55, 0.1, 0.45],
            [0.2, 0.3, 0.4],
        ].forEach(([dx, dy, r]) => {
            const m = new THREE.Mesh(new THREE.CircleGeometry(r, 20), cloudMat)
            m.position.set(dx, dy, 0)
            g.add(m)
        })
        g.position.set(x, y, 0.1)
        g.scale.setScalar(scale)
        return g
    }
    const cloudA = makeCloud(-3.6, 2.6, 1)
    const cloudB = makeCloud(-2.6, -2.8, 0.7)
    bgGroup.add(cloudA, cloudB)

    // --- shadow catcher ---
    const shadowPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(20, 20),
        new THREE.ShadowMaterial({ opacity: 0.18 })
    )
    shadowPlane.position.z = -0.6
    shadowPlane.receiveShadow = true
    scene.add(shadowPlane)

    // --- clock group ---
    const clockGroup = new THREE.Group()
    clockGroup.rotation.x = -0.18
    scene.add(clockGroup)

    const RADIUS = 2.2

    const face = new THREE.Mesh(
        new THREE.CylinderGeometry(RADIUS, RADIUS, 0.22, 64),
        new THREE.MeshStandardMaterial({ color: CREAM, roughness: 0.6 })
    )
    face.rotation.x = Math.PI / 2
    face.castShadow = true
    face.receiveShadow = true
    clockGroup.add(face)

    const rim = new THREE.Mesh(
        new THREE.TorusGeometry(RADIUS, 0.14, 16, 64),
        new THREE.MeshStandardMaterial({ color: RIM, roughness: 0.4, metalness: 0.2 })
    )
    rim.position.z = 0.0
    clockGroup.add(rim)

    // tick marks
    const tickMat = new THREE.MeshStandardMaterial({ color: INK })
    const tickPositions = []
    for (let i = 0; i < 60; i++) {
        const isHour = i % 5 === 0
        const isBig = i % 15 === 0
        const h = isHour ? (isBig ? 0.26 : 0.18) : 0.08
        const w = isHour ? 0.045 : 0.025
        const tick = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.05), tickMat)
        const angle = (i / 60) * TAU
        const r = RADIUS - 0.26
        const pos = [r * Math.sin(angle), r * Math.cos(angle), 0.14]
        tick.position.set(...pos)
        tick.rotation.z = -angle
        clockGroup.add(tick)
        tickPositions.push(pos)
    }

    const tickHighlight = new THREE.Mesh(
        new THREE.CircleGeometry(0.17, 24),
        new THREE.MeshBasicMaterial({ color: GOLD, transparent: true, opacity: 0 })
    )
    tickHighlight.position.z = 0.17
    clockGroup.add(tickHighlight)
    function setTickHighlight(i) {
        if (i === null || i === undefined) {
            tickHighlight.material.opacity = 0
            return
        }
        const [x, y] = tickPositions[i]
        tickHighlight.position.set(x, y, 0.17)
        tickHighlight.material.opacity = 0.55
    }

    // number sprites
    const numberSprites = []
    for (let n = 1; n <= 12; n++) {
        const big = n % 3 === 0
        const tex = numberTexture(String(n), { color: '#2b2b52' })
        const mat = new THREE.SpriteMaterial({ map: tex, transparent: true })
        const sprite = new THREE.Sprite(mat)
        const scale = big ? 0.62 : 0.5
        sprite.scale.set(scale, scale, 1)
        const angle = (n / 12) * TAU
        const r = RADIUS - 0.56
        sprite.position.set(r * Math.sin(angle), r * Math.cos(angle), 0.16)
        sprite.userData.pickType = 'number'
        sprite.userData.pickValue = n
        clockGroup.add(sprite)
        numberSprites.push(sprite)
    }

    // hands
    const hourHand = makeHand({ length: 1.05, width: 0.16, depth: 0.08, color: HOUR_COLOR })
    hourHand.position.z = 0.2
    hourHand.userData.pickType = 'hour'
    clockGroup.add(hourHand)

    const minuteHand = makeHand({ length: 1.6, width: 0.1, depth: 0.08, color: MINUTE_COLOR })
    minuteHand.position.z = 0.26
    minuteHand.userData.pickType = 'minute'
    clockGroup.add(minuteHand)

    const secondGeo = new THREE.BoxGeometry(0.03, 1.75, 0.04)
    secondGeo.translate(0, 1.75 / 2 - 0.3, 0)
    const secondHand = new THREE.Mesh(
        secondGeo,
        new THREE.MeshStandardMaterial({ color: SECOND_COLOR, roughness: 0.3 })
    )
    secondHand.position.z = 0.32
    clockGroup.add(secondHand)

    // center cap
    const cap = new THREE.Mesh(
        new THREE.CylinderGeometry(0.16, 0.16, 0.4, 24),
        new THREE.MeshStandardMaterial({ color: GOLD, metalness: 0.3, roughness: 0.3 })
    )
    cap.rotation.x = Math.PI / 2
    cap.position.z = 0.3
    clockGroup.add(cap)
    const gem = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.1),
        new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.5, roughness: 0.1 })
    )
    gem.position.z = 0.46
    clockGroup.add(gem)

    // highlight rings (shown behind hour/minute meshes for emphasis)
    function makeHighlightRing(color) {
        const ring = new THREE.Mesh(
            new THREE.RingGeometry(0.3, 0.4, 32),
            new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0 })
        )
        ring.position.z = 0.12
        clockGroup.add(ring)
        return ring
    }
    const hourGlow = makeHighlightRing(HOUR_COLOR)
    hourGlow.scale.setScalar(2.6)
    hourGlow.position.y = 0
    const minuteGlow = makeHighlightRing(MINUTE_COLOR)
    minuteGlow.scale.setScalar(2.6)

    const numberGlows = new Map()
    for (const sprite of numberSprites) {
        numberGlows.set(sprite.userData.pickValue, sprite)
    }

    // particles for celebration
    const PARTICLE_COUNT = 90
    const particleGeo = new THREE.BufferGeometry()
    const positions = new Float32Array(PARTICLE_COUNT * 3)
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const particleMat = new THREE.PointsMaterial({
        size: 0.18,
        vertexColors: false,
        color: GOLD,
        transparent: true,
        opacity: 0,
    })
    const particles = new THREE.Points(particleGeo, particleMat)
    particles.position.z = 1
    scene.add(particles)
    let particleVelocities = []
    let particleLife = 0
    const confettiColors = [GOLD, RIM, HOUR_COLOR, MINUTE_COLOR, 0x3ddc97]

    function resize() {
        const w = container.clientWidth
        const h = container.clientHeight
        if (!w || !h) return
        renderer.setSize(w, h)
        camera.aspect = w / h
        camera.updateProjectionMatrix()
    }
    resize()
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(container)

    let currentHourAngle = 0
    let currentMinuteAngle = 0
    let targetHourAngle = 0
    let targetMinuteAngle = 0

    function setTime(hour24, minute, { animate = true } = {}) {
        const hourValue = (hour24 % 12) + minute / 60
        targetHourAngle = angleForHour(hourValue)
        targetMinuteAngle = angleForMinute(minute)
        if (!animate) {
            currentHourAngle = targetHourAngle
            currentMinuteAngle = targetMinuteAngle
            hourHand.rotation.z = -currentHourAngle
            minuteHand.rotation.z = -currentMinuteAngle
        }
    }

    function shortestDelta(from, to) {
        let d = (to - from) % TAU
        if (d > Math.PI) d -= TAU
        if (d < -Math.PI) d += TAU
        return d
    }

    let shakeTime = 0
    let bounceTime = 0

    function celebrate() {
        bounceTime = 1
        particleLife = 1
        particleVelocities = []
        const posAttr = particleGeo.getAttribute('position')
        const colors = new Float32Array(PARTICLE_COUNT * 3)
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            posAttr.setXYZ(i, 0, 0.3, 1)
            const speed = 0.02 + Math.random() * 0.05
            const angle = Math.random() * TAU
            const upward = 0.05 + Math.random() * 0.06
            particleVelocities.push({
                x: Math.cos(angle) * speed,
                y: Math.sin(angle) * speed * 0.6 + upward,
                z: 0,
            })
            const c = new THREE.Color(confettiColors[i % confettiColors.length])
            colors[i * 3] = c.r
            colors[i * 3 + 1] = c.g
            colors[i * 3 + 2] = c.b
        }
        particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
        particleMat.vertexColors = true
        particleMat.needsUpdate = true
        posAttr.needsUpdate = true
    }

    function shake() {
        shakeTime = 1
    }

    let pickCallback = null
    function onPick(cb) {
        pickCallback = cb
    }

    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()
    function handlePointer(ev) {
        if (!pickCallback) return
        const rect = renderer.domElement.getBoundingClientRect()
        pointer.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1
        pointer.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1
        raycaster.setFromCamera(pointer, camera)
        const targets = [hourHand, minuteHand, ...numberSprites]
        const hits = raycaster.intersectObjects(targets, true)
        if (hits.length) {
            let obj = hits[0].object
            while (obj && !obj.userData.pickType) obj = obj.parent
            if (obj) pickCallback(obj.userData.pickType, obj.userData.pickValue)
        }
    }
    renderer.domElement.addEventListener('pointerdown', handlePointer)

    // clock-scrub: drag either hand to sweep through hours (0-11) or every single minute tick
    let scrubCallback = null
    let scrubActive = false
    let scrubTarget = null
    function getCenterScreenPos(rect) {
        const v = new THREE.Vector3(0, 0, 0)
        clockGroup.updateMatrixWorld()
        v.applyMatrix4(clockGroup.matrixWorld)
        v.project(camera)
        return {
            x: (v.x * 0.5 + 0.5) * rect.width + rect.left,
            y: (1 - (v.y * 0.5 + 0.5)) * rect.height + rect.top,
        }
    }
    function getScreenScale(rect) {
        const center = getCenterScreenPos(rect)
        const v = new THREE.Vector3(RADIUS, 0, 0)
        clockGroup.updateMatrixWorld()
        v.applyMatrix4(clockGroup.matrixWorld)
        v.project(camera)
        const edge = {
            x: (v.x * 0.5 + 0.5) * rect.width + rect.left,
            y: (1 - (v.y * 0.5 + 0.5)) * rect.height + rect.top,
        }
        return Math.hypot(edge.x - center.x, edge.y - center.y) / RADIUS
    }
    function updateScrub(ev) {
        const rect = renderer.domElement.getBoundingClientRect()
        const center = getCenterScreenPos(rect)
        const dx = ev.clientX - center.x
        const dy = ev.clientY - center.y
        if (Math.abs(dx) < 2 && Math.abs(dy) < 2) return
        let angle = Math.atan2(dx, -dy)
        if (angle < 0) angle += TAU
        if (scrubTarget === 'hour') {
            setTickHighlight(null)
            const hourIndex = Math.round((angle / TAU) * 12) % 12
            scrubCallback?.('hour', hourIndex === 0 ? 12 : hourIndex)
        } else {
            const minuteIndex = Math.round((angle / TAU) * 60) % 60
            setTickHighlight(minuteIndex)
            scrubCallback?.('minute', minuteIndex)
        }
    }
    function handleScrubDown(ev) {
        if (!scrubCallback) return
        const rect = renderer.domElement.getBoundingClientRect()
        const center = getCenterScreenPos(rect)
        const scale = getScreenScale(rect)
        const dist = Math.hypot(ev.clientX - center.x, ev.clientY - center.y)
        scrubTarget = dist < 1.3 * scale ? 'hour' : 'minute'
        scrubActive = true
        updateScrub(ev)
    }
    function handleScrubMove(ev) {
        if (!scrubActive) return
        updateScrub(ev)
    }
    function handleScrubUp() {
        scrubActive = false
    }
    renderer.domElement.addEventListener('pointerdown', handleScrubDown)
    window.addEventListener('pointermove', handleScrubMove)
    window.addEventListener('pointerup', handleScrubUp)

    function enableClockScrub(cb) {
        scrubCallback = cb
    }
    function disableClockScrub() {
        scrubCallback = null
        scrubActive = false
        setTickHighlight(null)
    }

    function setGlow(type, on) {
        if (type === 'hour') hourGlow.material.opacity = on ? 0.35 : 0
        if (type === 'minute') minuteGlow.material.opacity = on ? 0.3 : 0
    }

    function setNumberGlow(n, on) {
        const sprite = numberGlows.get(n)
        if (!sprite) return
        sprite.scale.setScalar(on ? 0.78 : n % 3 === 0 ? 0.62 : 0.5)
    }

    let rafId = null
    const clock = new THREE.Clock()
    function animate() {
        rafId = requestAnimationFrame(animate)
        const dt = Math.min(clock.getDelta(), 0.05)
        const t = clock.elapsedTime

        currentHourAngle += shortestDelta(currentHourAngle, targetHourAngle) * Math.min(dt * 6, 1)
        currentMinuteAngle += shortestDelta(currentMinuteAngle, targetMinuteAngle) * Math.min(dt * 6, 1)
        hourHand.rotation.z = -currentHourAngle
        minuteHand.rotation.z = -currentMinuteAngle
        secondHand.rotation.z = -(t * 0.6) % TAU

        clockGroup.position.y = Math.sin(t * 1.2) * 0.03
        sun.scale.setScalar(1 + Math.sin(t * 1.5) * 0.04)
        cloudA.position.x = -3.6 + Math.sin(t * 0.15) * 0.3
        cloudB.position.x = -2.6 + Math.sin(t * 0.12 + 2) * 0.3

        if (shakeTime > 0) {
            shakeTime -= dt * 2.6
            clockGroup.rotation.z = Math.sin(shakeTime * 40) * 0.05 * Math.max(shakeTime, 0)
        } else {
            clockGroup.rotation.z = 0
        }

        if (bounceTime > 0) {
            bounceTime -= dt * 1.4
            const s = 1 + Math.max(bounceTime, 0) * 0.12 * Math.sin(bounceTime * 18)
            clockGroup.scale.setScalar(s)
        } else {
            clockGroup.scale.setScalar(1)
        }

        if (particleLife > 0) {
            particleLife -= dt * 0.6
            const posAttr = particleGeo.getAttribute('position')
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                const v = particleVelocities[i]
                if (!v) continue
                v.y -= dt * 0.05
                const x = posAttr.getX(i) + v.x
                const y = posAttr.getY(i) + v.y
                posAttr.setXYZ(i, x, y, 1)
            }
            posAttr.needsUpdate = true
            particleMat.opacity = Math.max(particleLife, 0)
        } else {
            particleMat.opacity = 0
        }

        renderer.render(scene, camera)
    }
    animate()

    function dispose() {
        cancelAnimationFrame(rafId)
        resizeObserver.disconnect()
        renderer.domElement.removeEventListener('pointerdown', handlePointer)
        renderer.domElement.removeEventListener('pointerdown', handleScrubDown)
        window.removeEventListener('pointermove', handleScrubMove)
        window.removeEventListener('pointerup', handleScrubUp)
        renderer.dispose()
        if (renderer.domElement.parentElement === container) {
            container.removeChild(renderer.domElement)
        }
    }

    return {
        setTime,
        celebrate,
        shake,
        onPick,
        enableClockScrub,
        disableClockScrub,
        setGlow,
        setNumberGlow,
        setTickHighlight,
        resize,
        dispose,
    }
}
