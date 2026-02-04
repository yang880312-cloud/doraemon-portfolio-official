<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { level1Keywords, level2Keywords, level3Keywords, level4Keywords } from '@/data/lobbyKeywords'

const canvasRef = ref(null)
let ctx = null
let animationFrame = null
let particles = []

const mouse = { x: -5000, y: -5000 }
const width = ref(0)
const height = ref(0)

const MOUSE_RADIUS = 300
const MOUSE_FORCE = 2.5
const SPRING_STRENGTH = 0.05
const DAMPING = 0.9

class Particle {
  constructor({ text, x, y, tier }) {
    this.text = text
    this.originX = x
    this.originY = y
    this.x = x
    this.y = y
    this.vx = 0
    this.vy = 0
    this.tier = tier // 1, 2, 3, 4

    this.tier = tier // 1, 2, 3, 4

    // Rotation Logic: "Cyber Chaos"
    // Level 1: Always Horizontal (Readability)
    // Level 2/3: 50% Horizontal, 50% Vertical (90 or -90)
    // Level 4: 40% Horizontal, 60% Vertical/Random
    if (tier === 1) {
        this.angle = 0
    } else if (tier === 4) {
        // Background Debris - Random chaos
        const r = Math.random()
        if (r > 0.6) this.angle = 0
        else if (r > 0.3) this.angle = Math.PI / 2
        else this.angle = -Math.PI / 2
    } else {
        // Mid Tiers
        this.angle = Math.random() > 0.5 ? 0 : (Math.random() > 0.5 ? Math.PI/2 : -Math.PI/2)
    }

    // Config based on Tier
    if (tier === 1) {
       // Super Hero (Shocking Size)
       this.fontSize = Math.random() * 20 + 70 // 70-90px
       this.font = `900 ${this.fontSize}px "Inter", "Arial Black", sans-serif`
       this.color = '#ffffff'
       this.alpha = 1.0
       this.mass = 5
    } else if (tier === 2) {
       // Major
       this.fontSize = Math.random() * 15 + 40 // 40-55px
       this.font = `700 ${this.fontSize}px "Inter", sans-serif`
       this.color = '#e0e7ff' // Indigo-100
       this.alpha = 0.85
       this.mass = 3
    } else if (tier === 3) {
       // Specialist
       this.fontSize = Math.random() * 10 + 20 // 20-30px
       this.font = `500 ${this.fontSize}px "JetBrains Mono", monospace`
       this.color = '#818cf8' // Indigo-400
       this.alpha = 0.7
       this.mass = 2
    } else {
       // Background (Level 4) - Increased Visibility
       this.fontSize = Math.random() * 4 + 11 // 11-15px
       this.font = `400 ${this.fontSize}px "JetBrains Mono", monospace`
       this.color = '#6b7280' // Gray-500 (lighter than 600)
       this.alpha = 0.5 // Visible
       this.mass = 1
    }
  }

  update() {
    const dx = mouse.x - this.x
    const dy = mouse.y - this.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance < MOUSE_RADIUS) {
      const forceDirectionX = dx / distance
      const forceDirectionY = dy / distance
      const force = (MOUSE_RADIUS - distance) / MOUSE_RADIUS

      const repulsionX = forceDirectionX * force * MOUSE_FORCE * 20
      const repulsionY = forceDirectionY * force * MOUSE_FORCE * 20

      this.vx -= repulsionX / this.mass
      this.vy -= repulsionY / this.mass
    }

    const springX = (this.originX - this.x) * SPRING_STRENGTH
    const springY = (this.originY - this.y) * SPRING_STRENGTH

    this.vx += springX
    this.vy += springY

    this.vx *= DAMPING
    this.vy *= DAMPING

    this.x += this.vx
    this.y += this.vy
  }

  draw() {
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate(this.angle)

    ctx.globalAlpha = this.alpha
    ctx.fillStyle = this.color
    ctx.font = this.font
    ctx.fillText(this.text, 0, 0) // Draw at origin after transform

    ctx.restore()
  }
}

function init() {
  if (!canvasRef.value) return
  const canvas = canvasRef.value

  const dpr = window.devicePixelRatio || 1
  width.value = window.innerWidth
  height.value = window.innerHeight

  canvas.width = width.value * dpr
  canvas.height = height.value * dpr
  canvas.style.width = `${width.value}px`
  canvas.style.height = `${height.value}px`

  ctx = canvas.getContext('2d')
  ctx.scale(dpr, dpr)
  ctx.textBaseline = 'middle'
  ctx.textAlign = 'center'

  createParticles()
}

function createParticles() {
  particles = []
  const isMobile = width.value < 768

  // 1. Level 4 (Background Texture)
  const density = isMobile ? 80 : 60
  const cols = Math.floor(width.value / density)
  const hDensity = isMobile ? 40 : 30
  const rows = Math.floor(height.value / hDensity)

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (Math.random() > 0.6) continue

      const text = level4Keywords[Math.floor(Math.random() * level4Keywords.length)]
      particles.push(new Particle({
        text,
        x: c * density + Math.random() * 20,
        y: r * hDensity + Math.random() * 10,
        tier: 4
      }))
    }
  }

  // 2. Level 3 (Specialist - Scattered)
  const count3 = isMobile ? 8 : 18
  for (let i = 0; i < count3; i++) {
     const text = level3Keywords[Math.floor(Math.random() * level3Keywords.length)]
     particles.push(new Particle({
        text,
        x: Math.random() * width.value,
        y: Math.random() * height.value,
        tier: 3
     }))
  }

  // 3. Level 2 (Core - Prominent)
  const count2 = isMobile ? 4 : 10
  for (let i = 0; i < count2; i++) {
     const text = level2Keywords[Math.floor(Math.random() * level2Keywords.length)]
     particles.push(new Particle({
        text,
        x: Math.random() * (width.value * 0.8) + (width.value * 0.1),
        y: Math.random() * (height.value * 0.8) + (height.value * 0.1),
        tier: 2
     }))
  }

  // 4. Level 1 (Hero - Center Stage)
  // Ensure we show ALL hero keywords if possible, nicely distributed
  level1Keywords.forEach((text, i) => {
      // Divide screen into quadrants for Level 1 to avoid overlap?
      // Or just randomness is fine.
      particles.push(new Particle({
        text,
        x: Math.random() * (width.value * 0.6) + (width.value * 0.2),
        y: Math.random() * (height.value * 0.6) + (height.value * 0.2),
        tier: 1
      }))
  })
}

function animate() {
  ctx.clearRect(0, 0, width.value, height.value)
  particles.forEach(p => {
    p.update()
    p.draw()
  })
  animationFrame = requestAnimationFrame(animate)
}

onMounted(() => {
  init()
  window.addEventListener('resize', init)
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX
    mouse.y = e.clientY
  })
  animate()
})

onUnmounted(() => {
  window.removeEventListener('resize', init)
  cancelAnimationFrame(animationFrame)
})
</script>

<template>
  <canvas ref="canvasRef" class="absolute inset-0 z-0 pointer-events-auto"></canvas>
</template>
