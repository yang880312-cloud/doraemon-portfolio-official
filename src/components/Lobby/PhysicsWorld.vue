<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import Matter from 'matter-js'

const sceneRef = ref(null)
let engine = null
let render = null
let runner = null

onMounted(() => {
  const width = window.innerWidth
  const height = window.innerHeight

  // 1. Setup Matter.js
  engine = Matter.Engine.create()
  const world = engine.world

  // 2. Setup Render
  render = Matter.Render.create({
    element: sceneRef.value,
    engine: engine,
    options: {
      width,
      height,
      wireframes: false, // Show full materials
      background: 'transparent',
      pixelRatio: window.devicePixelRatio 
    }
  })

  // 3. Create Walls
  const walls = [
    Matter.Bodies.rectangle(width / 2, height + 50, width, 100, { isStatic: true, render: { fillStyle: 'transparent' } }), // Floor
    Matter.Bodies.rectangle(width / 2, -50, width, 100, { isStatic: true }), // Ceiling
    Matter.Bodies.rectangle(-50, height / 2, 100, height, { isStatic: true }), // Left
    Matter.Bodies.rectangle(width + 50, height / 2, 100, height, { isStatic: true }) // Right
  ]
  Matter.World.add(world, walls)

  // 4. Create Props with visual identifiers (using internal type for rendering)
  const props = []
  
  // Flashlight 🔦 (REMOVED as per user request)
  // const flashlight = Matter.Bodies.rectangle(width * 0.3, 0, 40, 80, {
  //   chamfer: { radius: 10 },
  //   render: { fillStyle: 'transparent' },
  //   label: '🔦'
  // })
  
  // Camera 📷
  const camera = Matter.Bodies.rectangle(width * 0.7, -200, 60, 60, {
    chamfer: { radius: 10 },
    render: { fillStyle: 'transparent' },
    label: '📷'
  })

  // Hourglass ⏳
  const hourglass = Matter.Bodies.rectangle(width * 0.5, -400, 40, 60, {
    chamfer: { radius: 5 },
    render: { fillStyle: 'transparent' },
    label: '⏳'
  })

  props.push(camera, hourglass)
  Matter.World.add(world, props)

  // 5. Mouse Interaction
  const mouse = Matter.Mouse.create(render.canvas)
  const mouseConstraint = Matter.MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: { visible: false }
    }
  })
  Matter.World.add(world, mouseConstraint)
  render.mouse = mouse

  // Custom Rendering for Emojis
  Matter.Events.on(render, 'afterRender', () => {
    const ctx = render.context
    ctx.font = '24px serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    props.forEach(body => {
      const { x, y } = body.position
      const angle = body.angle
      
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(angle)
      ctx.fillStyle = '#000' // Text color
      if (body.label === '🔦') ctx.fillStyle = '#000'
      if (body.label === '📷') ctx.fillStyle = '#fff'
      
      ctx.fillText(body.label, 0, 0)
      ctx.restore()
    })
  })

  // 6. Run
  Matter.Runner.run(engine)
  Matter.Render.run(render)
})

onUnmounted(() => {
  if (render) {
    Matter.Render.stop(render)
    render.canvas.remove()
  }
  if (engine) {
    Matter.Engine.clear(engine)
  }
})
</script>

<template>
  <div ref="sceneRef" class="absolute inset-0 w-full h-full"></div>
</template>
