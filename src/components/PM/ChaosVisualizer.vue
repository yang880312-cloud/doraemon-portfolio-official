<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'

const canvasRef = ref(null)
let ctx = null
let animationFrameId = null
let particles = []
const mouse = { x: -1000, y: -1000 }
const isOrdered = ref(false)

const COLOR_CHAOS = '#ef4444' // Red
const COLOR_ORDER = '#1e3a8a' // Blue

class Particle {
    constructor(w, h) {
        this.w = w
        this.h = h
        // Chaos State (Random)
        this.x = Math.random() * w
        this.y = Math.random() * h
        this.vx = (Math.random() - 0.5) * 2
        this.vy = (Math.random() - 0.5) * 2

        // Order State (Grid Target)
        this.targetX = 0
        this.targetY = 0

        this.radius = Math.random() * 2 + 1
        this.color = COLOR_CHAOS
        this.alpha = Math.random() * 0.5 + 0.1
    }

    setTarget(x, y) {
        this.targetX = x
        this.targetY = y
    }

    update(ordered) {
        if (ordered) {
            // Lerp to target
            this.x += (this.targetX - this.x) * 0.05
            this.y += (this.targetY - this.y) * 0.05
            this.color = COLOR_ORDER

            // Mouse Interaction (Disturb Order)
            const dx = mouse.x - this.x
            const dy = mouse.y - this.y
            const dist = Math.sqrt(dx * dx + dy * dy)
            if (dist < 100) {
                const force = (100 - dist) / 100
                const angle = Math.atan2(dy, dx)
                this.x -= Math.cos(angle) * force * 5
                this.y -= Math.sin(angle) * force * 5
            }
        } else {
            // Brownian Motion
            this.x += this.vx
            this.y += this.vy
            this.color = COLOR_CHAOS

            // Bounce bounds
            if (this.x < 0 || this.x > this.w) this.vx *= -1
            if (this.y < 0 || this.y > this.h) this.vy *= -1

            // Connect to mouse
            const dx = mouse.x - this.x
            const dy = mouse.y - this.y
            const dist = Math.sqrt(dx * dx + dy * dy)
            if (dist < 150) {
               this.vx += dx * 0.0001
               this.vy += dy * 0.0001
            }
        }
    }

    draw(ctx) {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.globalAlpha = this.alpha
        ctx.fill()
        ctx.globalAlpha = 1
    }
}

function initParticles(w, h) {
    const count = 150 // Particle count
    particles = []

    // Grid Setup
    const cols = 15
    const rows = 10
    const cellW = w / cols
    const cellH = h / rows

    let index = 0
    for (let i = 0; i < count; i++) {
        const p = new Particle(w, h)

        // Calculate grid target
        const col = index % cols
        const row = Math.floor(index / cols)
        const tx = col * cellW + cellW / 2
        const ty = row * cellH + cellH / 2
        p.setTarget(tx, ty)

        particles.push(p)
        index++
    }
}

function animate() {
    if (!canvasRef.value) return
    ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)

    // Draw Connections (Line Mesh)
    if (isOrdered.value) {
         ctx.strokeStyle = COLOR_ORDER
         ctx.lineWidth = 0.5
         ctx.beginPath()
         for (let i = 0; i < particles.length; i++) {
             const p = particles[i]
             // Connect neighbors in grid logic roughly
             if (i < particles.length - 1 && Math.random() > 0.9) {
                 ctx.moveTo(p.x, p.y)
                 ctx.lineTo(particles[i+1].x, particles[i+1].y)
             }
         }
         ctx.globalAlpha = 0.1
         ctx.stroke()
         ctx.globalAlpha = 1
    } else {
        // Chaos Lines (Proximity)
        ctx.strokeStyle = COLOR_CHAOS
        ctx.lineWidth = 0.2
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i]
            const dx = mouse.x - p.x
            const dy = mouse.y - p.y
            const dist = Math.sqrt(dx * dx + dy * dy)
            if (dist < 150) {
                ctx.beginPath()
                ctx.moveTo(p.x, p.y)
                ctx.lineTo(mouse.x, mouse.y)
                ctx.globalAlpha = (150 - dist) / 150
                ctx.stroke()
            }
        }
        ctx.globalAlpha = 1
    }

    particles.forEach(p => {
        p.update(isOrdered.value)
        p.draw(ctx)
    })

    animationFrameId = requestAnimationFrame(animate)
}

function handleResize() {
    if (canvasRef.value) {
        canvasRef.value.width = window.innerWidth
        canvasRef.value.height = 300 // Hero Height
        initParticles(window.innerWidth, 300)
    }
}

function toggleOrder() {
    isOrdered.value = !isOrdered.value
    // Trigger animations if needed
}

onMounted(() => {
    ctx = canvasRef.value.getContext('2d')
    handleResize()
    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', (e) => {
        const rect = canvasRef.value.getBoundingClientRect()
        mouse.x = e.clientX - rect.left
        mouse.y = e.clientY - rect.top
    })

    // Start animation loop
    animate()

    // Auto-trigger Order after delay to demo
    setTimeout(() => {
        isOrdered.value = true
    }, 2000)
})

onUnmounted(() => {
    cancelAnimationFrame(animationFrameId)
    window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <div class="chaos-visualizer relative w-full h-[300px] overflow-hidden bg-[#f0f8ff] cursor-pointer" @click="toggleOrder">
      <canvas ref="canvasRef" class="absolute inset-0 block"></canvas>

      <!-- Overlay Text -->
      <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
          <transition name="fade" mode="out-in">
              <div v-if="!isOrdered" class="text-center">
                  <h2 class="text-4xl font-black text-[#ef4444] tracking-widest opacity-20">CHAOS</h2>
                  <div class="text-xs text-[#ef4444] tracking-[1em] opacity-40">UNCERTAINTY</div>
              </div>
              <div v-else class="text-center">
                   <h2 class="text-4xl font-black text-[#1e3a8a] tracking-widest opacity-20">ORDER</h2>
                   <div class="text-xs text-[#1e3a8a] tracking-[1em] opacity-40">STRUCTURE</div>
              </div>
          </transition>
      </div>

      <!-- Instruction -->
      <div class="absolute bottom-4 right-4 text-[10px] text-gray-400 font-mono">
          CLICK_TO_{{ isOrdered ? 'DISRUPT' : 'ORGANIZE' }}
      </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
