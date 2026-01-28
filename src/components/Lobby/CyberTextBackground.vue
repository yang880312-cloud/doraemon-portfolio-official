<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { skills, fillers } from '@/data/lobbyKeywords'

const canvasRef = ref(null)
let ctx = null
let animationFrame = null
let particles = []

const mouse = { x: -5000, y: -5000 } // Start off-screen
const width = ref(0)
const height = ref(0)

// Physics Config
const MOUSE_RADIUS = 300
const MOUSE_FORCE = 2.5 // Repulsion strength
const SPRING_STRENGTH = 0.05 // Return speed
const DAMPING = 0.9 // Friction (0.9 = slippery, 0.5 = muddy)

class Particle {
  constructor({ text, x, y, fontSize, isHero }) {
    this.text = text
    this.originX = x
    this.originY = y
    this.x = x
    this.y = y
    this.vx = 0
    this.vy = 0

    this.fontSize = fontSize
    this.isHero = isHero

    // Mass: Heroes are heavy (move less), Fillers are light
    this.mass = isHero ? 3 : 1
    this.font = isHero
      ? `900 ${fontSize}px "Inter", sans-serif`
      : `400 ${fontSize}px "JetBrains Mono", monospace` // Monospace for matrix feel

    this.color = isHero ? '#dddddd' : '#333333'
    this.alpha = isHero ? 0.9 : 0.4
  }

  update() {
    // 1. Calculate repulsion from mouse
    const dx = mouse.x - this.x
    const dy = mouse.y - this.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance < MOUSE_RADIUS) {
      const forceDirectionX = dx / distance
      const forceDirectionY = dy / distance
      const force = (MOUSE_RADIUS - distance) / MOUSE_RADIUS

      const repulsionX = forceDirectionX * force * MOUSE_FORCE * 20
      const repulsionY = forceDirectionY * force * MOUSE_FORCE * 20

      // Apply force based on mass (F=ma -> a=F/m)
      this.vx -= repulsionX / this.mass
      this.vy -= repulsionY / this.mass
    }

    // 2. Spring force (Return to home)
    const springX = (this.originX - this.x) * SPRING_STRENGTH
    const springY = (this.originY - this.y) * SPRING_STRENGTH

    this.vx += springX
    this.vy += springY

    // 3. Apply friction
    this.vx *= DAMPING
    this.vy *= DAMPING

    // 4. Update position
    this.x += this.vx
    this.y += this.vy
  }

  draw() {
    ctx.globalAlpha = this.alpha
    ctx.fillStyle = this.color
    ctx.font = this.font
    ctx.fillText(this.text, this.x, this.y)
  }
}

function init() {
  if (!canvasRef.value) return
  const canvas = canvasRef.value

  // High DPI Setup
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

  // 1. Texture Layer (Dense Grid)
  // Reduce density on mobile (larger spacing)
  const density = isMobile ? 120 : 60
  const cols = Math.floor(width.value / density)

  const hDensity = isMobile ? 60 : 30
  const rows = Math.floor(height.value / hDensity)

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (Math.random() > 0.65) continue // Sparsity

      const text = fillers[Math.floor(Math.random() * fillers.length)]
      particles.push(new Particle({
        text,
        x: c * density + Math.random() * 20,
        y: r * hDensity + Math.random() * 10,
        fontSize: 10,
        isHero: false
      }))
    }
  }

  // 2. Hero Layer (Scattered Big Words)
  const skillPool = [...skills, ...skills] // Weight
  const heroCount = Math.floor((width.value * height.value) / 60000)

  for (let i = 0; i < heroCount; i++) {
    const text = skillPool[Math.floor(Math.random() * skillPool.length)]
    particles.push(new Particle({
      text,
      x: Math.random() * width.value,
      y: Math.random() * height.value,
      fontSize: Math.random() * 40 + 40, // 40px - 80px
      isHero: true
    }))
  }
}

function animate() {
  ctx.clearRect(0, 0, width.value, height.value)

  updateAutoDrift()

  // Update and draw all particles
  particles.forEach(p => {
    p.update()
    p.draw()
  })

  animationFrame = requestAnimationFrame(animate)
}

// --- Auto Drift Logic ---
let isMouseActive = false
let mouseTimer = null

function handleMouseMove(e) {
  isMouseActive = true
  const rect = canvasRef.value.getBoundingClientRect()
  mouse.x = e.clientX - rect.left
  mouse.y = e.clientY - rect.top

  // Reset timer
  clearTimeout(mouseTimer)
  mouseTimer = setTimeout(() => {
    isMouseActive = false
  }, 2000) // Resume drift after 2s of inactivity
}

function handleTouchStart() {
  // On mobile touch, we treat it as interaction, but resume drift quickly
  isMouseActive = true
  clearTimeout(mouseTimer)
  mouseTimer = setTimeout(() => {
    isMouseActive = false
  }, 1000)
}

function updateAutoDrift() {
  if (isMouseActive) return

  const time = Date.now() * 0.0005
  // Figure-8 pattern
  mouse.x = (width.value / 2) + (Math.sin(time) * width.value * 0.3)
  mouse.y = (height.value / 2) + (Math.cos(time * 1.3) * height.value * 0.2)
}

function handleResize() {
  init() // Re-create grid on resize to fill screen
}

onMounted(() => {
  init()
  handleResize()
  animate()
  window.addEventListener('resize', handleResize)
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('touchstart', handleTouchStart)
})

onUnmounted(() => {
  cancelAnimationFrame(animationFrame)
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('touchstart', handleTouchStart)
})
</script>

<template>
  <canvas
    ref="canvasRef"
    class="absolute inset-0 bg-[#020202] -z-10 pointer-events-auto"
  ></canvas>
</template>

<style scoped>
.grid-layer {
    /* Optimization */
}
</style>
