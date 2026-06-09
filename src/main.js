import './style.css'

// ==================== PRIMAVERA P6 12 CURVE DATA ====================
const P6_CURVES = [
  { name: 'Linear 线性/均匀', shortName: '线性', color: '#4F46E5', values: [4.76, 4.76, 4.76, 4.76, 4.76, 4.76, 4.76, 4.76, 4.76, 4.76, 4.76, 4.76, 4.76, 4.76, 4.76, 4.76, 4.76, 4.76, 4.76, 4.76, 4.76] },
  { name: 'Front Loaded 前加载', shortName: '前加载', color: '#8B5CF6', values: [39.60, 24.75, 14.85, 9.90, 4.95, 2.47, 0.99, 0.74, 0.49, 0.40, 0.30, 0.20, 0.15, 0.10, 0.05, 0.03, 0.02, 0.01, 0.00, 0.00, 0.00] },
  { name: 'Back Loaded 后加载', shortName: '后加载', color: '#EC4899', values: [0.00, 0.00, 0.00, 0.01, 0.02, 0.03, 0.05, 0.10, 0.15, 0.20, 0.30, 0.40, 0.49, 0.74, 0.99, 2.47, 4.95, 9.90, 14.85, 24.75, 39.60] },
  { name: 'Early Peak 早期峰值', shortName: '早期峰值', color: '#14B8A6', values: [16.26, 13.01, 10.84, 8.67, 7.59, 6.50, 5.96, 5.42, 4.88, 4.34, 3.79, 3.25, 2.71, 2.17, 1.63, 1.08, 0.87, 0.54, 0.33, 0.16, 0.00] },
  { name: 'Late Peak 晚期峰值', shortName: '晚期峰值', color: '#F59E0B', values: [0.00, 0.16, 0.33, 0.54, 0.87, 1.08, 1.63, 2.17, 2.71, 3.25, 3.79, 4.34, 4.88, 5.42, 5.96, 6.50, 7.59, 8.67, 10.84, 13.01, 16.26] },
  { name: 'Bell Shaped 钟形', shortName: '钟形', color: '#10B981', values: [0.59, 1.18, 2.37, 4.14, 5.92, 8.28, 10.06, 11.24, 11.83, 11.24, 10.06, 8.28, 5.92, 4.14, 2.37, 1.18, 0.59, 0.37, 0.18, 0.06, 0.00] },
  { name: 'Triangular 三角形', shortName: '三角形', color: '#EF4444', values: [0.00, 1.00, 2.00, 3.00, 4.00, 5.00, 6.00, 7.00, 8.00, 9.00, 10.00, 9.00, 8.00, 7.00, 6.00, 5.00, 4.00, 3.00, 2.00, 1.00, 0.00] },
  { name: 'Trapezoidal 梯形', shortName: '梯形', color: '#3B82F6', values: [1.25, 2.50, 3.75, 5.00, 6.25, 6.25, 6.25, 6.25, 6.25, 6.25, 6.25, 6.25, 6.25, 6.25, 6.25, 6.25, 5.00, 3.75, 2.50, 1.25, 0.00] },
  { name: 'At Start 在开始', shortName: '在开始', color: '#F97316', values: [100.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00] },
  { name: 'At Finish 在结束', shortName: '在结束', color: '#06B6D4', values: [0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 100.00] },
  { name: 'Double Peak 双峰值', shortName: '双峰值', color: '#A855F7', values: [10.39, 7.79, 5.20, 2.60, 1.30, 0.65, 1.30, 2.60, 5.19, 7.79, 10.39, 7.79, 5.19, 2.60, 1.30, 0.65, 1.30, 2.60, 5.19, 7.79, 10.39] },
  { name: 'Skewed Left 左偏/上升', shortName: '左偏上升', color: '#14B8A6', values: [0.43, 0.87, 1.30, 1.73, 2.16, 2.60, 3.03, 3.46, 3.90, 4.33, 4.76, 5.19, 5.63, 6.06, 6.49, 6.93, 7.36, 7.79, 8.23, 8.66, 9.09] },
]

// ==================== STATE ====================
const state = {
  // Wizard steps: 'input' | 'select' | 'result'
  step: 'input',
  // Step 1 inputs
  taskName: '',
  durationCount: 12,
  durationUnit: '天', // 天 | 周 | 月 | 季 | 年
  domestic: true, // 国内/境外 (周的最后一天: 周日/周五)
  totalCount: 1000,
  // Step 2
  selectedCurve: 0,
  // Step 3 computed
  periods: [], // { label, date, percentage, allocated }
  chartTitle: '',
  graphTitle: '资源加载柱状图',
  showGrid: true,
  gradientFill: true,
  showDataPoints: false,
  animating: true,
  animProgress: 0,
  barShape: 'rounded',
  gridColor: '#F1F5F9',
  axisColor: '#CBD5E1',
  backgroundColor: '#FFFFFF',
  fontFamily: '-apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif',
  titleFont: '20px',
  labelFont: '12px',
  valueFont: '11px',
  hideResult: false,
}

// ==================== DATE HELPERS ====================
function addDays(date, days) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

function addWeeks(date, weeks) {
  return addDays(date, weeks * 7)
}

function addMonths(date, months) {
  const d = new Date(date)
  d.setMonth(d.getMonth() + months)
  return d
}

function formatDate(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function getWeekEndDate(date, domestic) {
  const d = new Date(date)
  // domestic: Sunday=0, international: Friday=5
  const targetDay = domestic ? 0 : 5
  let daysToAdd = (targetDay - d.getDay() + 7) % 7
  if (daysToAdd === 0 && d.getDay() !== targetDay) daysToAdd = 7
  // If already the target day or before, go to that day
  if (d.getDay() <= targetDay) {
    daysToAdd = targetDay - d.getDay()
  } else {
    daysToAdd = 7 - (d.getDay() - targetDay)
  }
  return addDays(d, daysToAdd)
}

function getWeekLabel(startDate, weekIndex, domestic) {
  const d = addWeeks(startDate, weekIndex)
  const endDate = getWeekEndDate(d, domestic)
  return formatDate(endDate)
}

function generatePeriods(startDateStr) {
  const startDate = new Date(startDateStr)
  const count = state.durationCount
  const unit = state.durationUnit
  const result = []

  if (unit === '天') {
    for (let i = 0; i < count; i++) {
      const d = addDays(startDate, i)
      result.push({ label: formatDate(d), date: formatDate(d), index: i })
    }
  } else if (unit === '周') {
    for (let i = 0; i < count; i++) {
      const label = getWeekLabel(startDate, i, state.domestic)
      result.push({ label, date: label, index: i })
    }
  } else if (unit === '月') {
    for (let i = 0; i < count; i++) {
      const d = addMonths(startDate, i)
      result.push({ label: `${d.getFullYear()}年${d.getMonth() + 1}月`, date: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`, index: i })
    }
  } else if (unit === '季') {
    const quarters = ['第一季度', '第二季度', '第三季度', '第四季度']
    const startQ = Math.floor(startDate.getMonth() / 3)
    for (let i = 0; i < count; i++) {
      const q = (startQ + i) % 4
      const yearShift = Math.floor((startQ + i) / 4)
      const year = startDate.getFullYear() + yearShift
      result.push({ label: `${year}年${quarters[q]}`, date: `${year}-Q${q + 1}`, index: i })
    }
  } else if (unit === '年') {
    for (let i = 0; i < count; i++) {
      const year = startDate.getFullYear() + i
      result.push({ label: `${year}年`, date: `${year}`, index: i })
    }
  }

  return result
}

// Allocate total quantity based on curve percentages
function allocateQuantity(curveValues, totalCount) {
  const n = curveValues.length
  const nonZeroIndices = []
  curveValues.forEach((v, i) => { if (v > 0) nonZeroIndices.push(i) })

  const nonZeroCount = Math.max(nonZeroIndices.length, n)

  // Scale curve to have exactly nonZeroCount meaningful points
  let scaledValues
  if (nonZeroCount >= n) {
    scaledValues = [...curveValues]
  } else {
    // Map the 21-point curve onto n periods using interpolation
    scaledValues = []
    for (let i = 0; i < n; i++) {
      const srcIndex = (i / (n - 1)) * 20
      const lo = Math.floor(srcIndex)
      const hi = Math.min(lo + 1, 20)
      const t = srcIndex - lo
      scaledValues.push(curveValues[lo] * (1 - t) + curveValues[hi] * t)
    }
  }

  // Normalize to percentages summing to 100
  const sum = scaledValues.reduce((a, b) => a + b, 0)
  const percentages = scaledValues.map(v => sum > 0 ? (v / sum) * 100 : 100 / n)

  // Allocate: compute floor for each, then distribute remainder
  const allocations = percentages.map(p => {
    const raw = (p / 100) * totalCount
    return Math.floor(raw)
  })

  // Distribute rounding difference
  let allocatedSum = allocations.reduce((a, b) => a + b, 0)
  let diff = Math.round(totalCount) - allocatedSum

  // Give remainder to largest percentages first
  const sorted = percentages.map((p, i) => ({ p, i })).sort((a, b) => b.p - a.p)
  for (let k = 0; k < Math.abs(diff) && k < sorted.length; k++) {
    const idx = sorted[k].i
    if (diff > 0) allocations[idx]++
    else if (allocations[idx] > 0) allocations[idx]--
  }

  // Build results
  const periods = []
  percentages.forEach((p, i) => {
    periods.push({
      label: '',
      percentage: parseFloat(p.toFixed(2)),
      allocated: allocations[i],
    })
  })

  return periods
}

// ==================== CANVAS ====================
const canvas = document.getElementById('chart')
const ctx = canvas.getContext('2d')
const tooltip = document.getElementById('tooltip')

function getChartSize() {
  const container = document.getElementById('chart-container')
  const cw = container.clientWidth - 40
  const ch = container.clientHeight - 40
  return {
    width: Math.max(600, Math.min(cw, 1100)),
    height: Math.max(420, Math.min(ch, 650)),
  }
}

// ==================== DRAWING ====================
let drawTimer = null
function scheduleDraw() { if (drawTimer) clearTimeout(drawTimer); drawTimer = setTimeout(draw, 30) }

function draw() {
  const periods = state.periods
  if (!periods.length) return

  const { width, height } = getChartSize()
  const dpr = window.devicePixelRatio || 1
  canvas.width = width * dpr
  canvas.height = height * dpr
  canvas.style.width = width + 'px'
  canvas.style.height = height + 'px'
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

  const pad = { top: 55, right: 50, bottom: 70, left: 60 }
  const chartW = width - pad.left - pad.right
  const chartH = height - pad.top - pad.bottom

  // Background
  ctx.fillStyle = state.backgroundColor
  ctx.beginPath()
  roundRect(ctx, 0, 0, width, height, 12)
  ctx.fill()

  // Title
  ctx.font = `bold ${state.titleFont} ${state.fontFamily}`
  ctx.fillStyle = '#1E293B'
  ctx.textAlign = 'center'
  ctx.fillText(state.graphTitle || '资源加载柱状图', width / 2, 28)

  // Subtitle with task info
  if (state.taskName) {
    ctx.font = `${state.labelFont} ${state.fontFamily}`
    ctx.fillStyle = '#64748B'
    ctx.fillText(`${state.taskName} | 总工程量: ${state.totalCount}`, width / 2, 50)
  }

  // Max value
  const maxVal = Math.max(...periods.map(p => p.allocated), 1)
  const yMax = Math.ceil(maxVal * 1.15)

  // Axes
  ctx.strokeStyle = state.axisColor
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(pad.left, pad.top)
  ctx.lineTo(pad.left, pad.top + chartH)
  ctx.lineTo(pad.left + chartW, pad.top + chartH)
  ctx.stroke()

  // Grid
  if (state.showGrid) {
    const gridSteps = 5
    ctx.strokeStyle = state.gridColor
    ctx.lineWidth = 1
    ctx.font = `${state.labelFont} ${state.fontFamily}`
    ctx.fillStyle = '#94A3B8'
    ctx.textAlign = 'right'
    ctx.textBaseline = 'middle'

    for (let i = 0; i <= gridSteps; i++) {
      const y = pad.top + chartH - (i / gridSteps) * chartH
      ctx.beginPath()
      ctx.moveTo(pad.left, y)
      ctx.lineTo(pad.left + chartW, y)
      ctx.stroke()
      const val = Math.round((yMax / gridSteps) * i)
      ctx.fillText(val.toLocaleString(), pad.left - 10, y)
    }
  }

  // Bars
  const n = periods.length
  const barTotalW = chartW / n
  const barW = Math.max(6, Math.min(40, barTotalW * 0.6))
  const plotPoints = []

  const curve = P6_CURVES[state.selectedCurve]
  const color = curve.color

  periods.forEach((p, i) => {
    const x = pad.left + i * barTotalW + barTotalW / 2
    const barH = (p.allocated / yMax) * chartH * state.animProgress
    const barTop = pad.top + chartH - barH
    const barX = x - barW / 2

    // Gradient
    if (state.gradientFill) {
      const gradient = ctx.createLinearGradient(0, pad.top + chartH, 0, barTop)
      gradient.addColorStop(0, color + '44')
      gradient.addColorStop(1, color + 'cc')
      ctx.fillStyle = gradient
    } else {
      ctx.fillStyle = color
    }

    // Rounded bar
    if (state.barShape === 'rounded') {
      const r = Math.min(4, barW / 2)
      ctx.beginPath()
      ctx.moveTo(barX, pad.top + chartH)
      ctx.lineTo(barX, barTop + r)
      ctx.quadraticCurveTo(barX, barTop, barX + r, barTop)
      ctx.lineTo(barX + barW - r, barTop)
      ctx.quadraticCurveTo(barX + barW, barTop, barX + barW, barTop + r)
      ctx.lineTo(barX + barW, pad.top + chartH)
      ctx.closePath()
      ctx.fill()
    } else {
      ctx.fillRect(barX, barTop, barW, barH)
    }

    // X label
    ctx.font = `${state.labelFont} ${state.fontFamily}`
    ctx.fillStyle = '#475569'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    // Rotate if too long
    if (barTotalW < 50) {
      ctx.save()
      ctx.translate(x, pad.top + chartH + 10)
      ctx.rotate(-Math.PI / 4)
      ctx.textAlign = 'right'
      ctx.fillText(p.label, 0, 0)
      ctx.restore()
    } else {
      ctx.fillText(p.label, x, pad.top + chartH + 10)
    }

    // Value label on top of bar
    if (p.allocated > 0) {
      ctx.font = `bold ${state.valueFont} ${state.fontFamily}`
      ctx.fillStyle = '#1E293B'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'bottom'
      ctx.fillText(p.allocated.toLocaleString(), x, barTop - 6)
    }

    // Data points
    if (state.showDataPoints) {
      ctx.beginPath()
      ctx.arc(x, barTop, 3, 0, Math.PI * 2)
      ctx.fillStyle = color
      ctx.fill()
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 1.5
      ctx.stroke()
    }

    plotPoints.push({ x: x + barW / 2, y: barTop + barH / 2, label: p.label, allocated: p.allocated, percentage: p.percentage, color })
  })

  canvas._plotPoints = plotPoints

  // Sum verification
  const totalAllocated = periods.reduce((a, b) => a + b.allocated, 0)
  if (totalAllocated !== state.totalCount) {
    ctx.font = `${state.valueFont} ${state.fontFamily}`
    ctx.fillStyle = '#EF4444'
    ctx.textAlign = 'right'
    ctx.textBaseline = 'bottom'
    ctx.fillText(`合计: ${totalAllocated} (误差: ${totalAllocated - state.totalCount})`, width - pad.right, pad.top + chartH - 5)
  } else {
    ctx.font = `${state.valueFont} ${state.fontFamily}`
    ctx.fillStyle = '#10B981'
    ctx.textAlign = 'right'
    ctx.textBaseline = 'bottom'
    ctx.fillText(`合计: ${totalAllocated} ✓`, width - pad.right, pad.top + chartH - 5)
  }

  canvas._plotPoints = plotPoints
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
}

// ==================== ANIMATION ====================
let animFrame = null
let animStart = null

function animate(timestamp) {
  if (!state.animating || !state.periods.length) { draw(); return }
  if (!animStart) animStart = timestamp
  const elapsed = timestamp - animStart
  const duration = 800
  state.animProgress = Math.min(1, elapsed / duration)
  const eased = 1 - Math.pow(1 - state.animProgress, 3)
  draw()
  if (state.animProgress < 1) {
    animFrame = requestAnimationFrame(animate)
  } else {
    state.animProgress = 1
  }
}

function startAnimation() {
  state.animProgress = 0
  animStart = null
  if (animFrame) cancelAnimationFrame(animFrame)
  animFrame = requestAnimationFrame(animate)
}

// ==================== TOOLTIP ====================
canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect()
  const mx = e.clientX - rect.left
  const my = e.clientY - rect.top
  const pts = canvas._plotPoints || []

  let closest = null
  let minDist = 20

  for (const pt of pts) {
    const dist = Math.hypot(pt.x - mx, pt.y - my)
    if (dist < minDist) { minDist = dist; closest = pt }
  }

  if (closest) {
    tooltip.innerHTML = `<strong>${closest.label}</strong><br/>分配: ${closest.allocated.toLocaleString()}<br/>占比: ${closest.percentage}%`
    tooltip.classList.add('visible')
    let tx = e.clientX - rect.left + 16
    let ty = e.clientY - rect.top - 10
    if (tx + 160 > rect.width) tx = e.clientX - rect.left - 170
    if (ty < 0) ty = 10
    tooltip.style.left = tx + 'px'
    tooltip.style.top = ty + 'px'
    canvas.style.cursor = 'pointer'
  } else {
    tooltip.classList.remove('visible')
    canvas.style.cursor = 'default'
  }
})

canvas.addEventListener('mouseleave', () => {
  tooltip.classList.remove('visible')
})

// ==================== BUILD CONTROLS ====================
function buildControls() {
  const container = document.getElementById('controls')
  container.innerHTML = ''

  if (state.step === 'input') {
    buildStep1Form(container)
  } else if (state.step === 'result') {
    buildStep3Result(container)
  }
}

// ========== STEP 1: INPUT FORM ==========
function buildStep1Form(container) {
  const form = document.createElement('div')
  form.className = 'wizard-step'
  form.style.padding = '10px'

  form.appendChild(createGroup('第一步：输入任务参数', [
    createTextRow('任务名称', 'taskName', state.taskName, true),
    createNumberRow('工期计划单位数量', 'durationCount', 1, 50, state.durationCount),
    createSelectRow('工期计划单位', 'durationUnit', [
      { value: '天', label: '天' },
      { value: '周', label: '周' },
      { value: '月', label: '月' },
      { value: '季', label: '季' },
      { value: '年', label: '年' },
    ], state.durationUnit),
    createNumberRow('总工程量（总资源量）', 'totalCount', 1, 10000000, state.totalCount),
  ]))

  // Region toggle
  const regionDiv = document.createElement('div')
  regionDiv.className = 'control-group'
  regionDiv.innerHTML = '<h3>区域设置</h3>'
  const row = document.createElement('div')
  row.className = 'checkbox-row'
  row.innerHTML = `<input type="checkbox" ${state.domestic ? 'checked' : ''} id="domestic" /><label for="domestic">国内（周末日=周日）/ 境外（周末日=周五）</label>`
  row.querySelector('input').addEventListener('change', (e) => { state.domestic = e.target.checked; scheduleDraw() })
  regionDiv.appendChild(row)
  form.appendChild(regionDiv)

  // Curve selector
  const curveDiv = document.createElement('div')
  curveDiv.className = 'control-group'
  curveDiv.innerHTML = '<h3>选择曲线类型</h3>'
  const previewDiv = document.createElement('div')
  previewDiv.style.maxHeight = '260px'
  previewDiv.style.overflow = 'auto'
  const table = document.createElement('table')
  table.style.width = '100%'
  table.style.borderCollapse = 'separate'
  table.style.borderSpacing = '0'
  table.style.borderRadius = '8px'
  table.style.overflow = 'hidden'
  table.style.border = '1px solid var(--border)'
  let html = '<tr style="background:#F1F5F9"><th style="padding:6px 10px;text-align:left;font-size:10px;font-weight:600;color:var(--text-secondary);text-transform:uppercase;letter-spacing:0.02em;border-bottom:1px solid var(--border);cursor:default">曲线名称</th><th style="padding:6px 10px;text-align:center;font-size:10px;font-weight:600;color:var(--text-secondary);text-transform:uppercase;letter-spacing:0.02em;border-bottom:1px solid var(--border);cursor:default">预览</th></tr>'
  P6_CURVES.forEach((c, i) => {
    const mini = Array.from({length: 21}, (_, j) => {
      const h = c.values[j] / Math.max(...c.values)
      return `<span style="display:inline-block;width:4px;height:${Math.max(3, h * 50)}px;background:${c.color};border-radius:1px;vertical-align:bottom;margin:0 0.5px"></span>`
    }).join('')
    html += `<tr style="cursor:pointer;transition:background-color 0.1s ease-out" data-curve-index="${i}"><td style="padding:5px 10px;font-size:12px;border-bottom:1px solid #F1F5F9">${c.shortName}</td><td style="text-align:center;padding:5px 10px;border-bottom:1px solid #F1F5F9">${mini}</td></tr>`
  })
  table.innerHTML = html
  previewDiv.appendChild(table)
  curveDiv.appendChild(previewDiv)
  form.appendChild(curveDiv)

  // Attach click handlers to curve rows
  table.querySelectorAll('tr[data-curve-index]').forEach(tr => {
    tr.addEventListener('mouseenter', () => { tr.style.backgroundColor = 'var(--primary-light)' })
    tr.addEventListener('mouseleave', () => { tr.style.backgroundColor = '' })
    tr.addEventListener('click', () => {
      const idx = Number(tr.dataset.curveIndex)
      state.selectedCurve = idx
    })
  })

  // Highlight selected curve row
  function highlightSelectedCurve() {
    table.querySelectorAll('tr[data-curve-index]').forEach(tr => {
      const idx = Number(tr.dataset.curveIndex)
      tr.style.backgroundColor = idx === state.selectedCurve ? 'var(--primary-light)' : ''
    })
  }
  highlightSelectedCurve()
  const origSelCurve = Object.getOwnPropertyDescriptor(state, 'selectedCurve')

  // Start button
  const btn = document.createElement('button')
  btn.className = 'btn btn-primary'
  btn.style.width = '100%'
  btn.style.marginTop = 'var(--space-3)'
  btn.style.padding = '10px'
  btn.textContent = '生成图表 →'
  btn.addEventListener('click', () => {
    if (!state.taskName.trim()) { alert('请输入任务名称'); return }
    if (state.durationCount < 1) { alert('工期数量必须大于0'); return }
    if (state.totalCount <= 0) { alert('总工程量必须大于0'); return }
    state.step = 'result'
    computeResult()
    buildControls()
    startAnimation()
  })
  form.appendChild(btn)

  container.appendChild(form)
}

// ========== STEP 3: RESULT ==========
function buildStep3Result(container) {
  const tabsEl = document.createElement('div')
  tabsEl.className = 'tab-bar'

  const dataTab = document.createElement('button')
  dataTab.className = 'tab-btn' + (state.hideResult ? ' active' : '')
  dataTab.textContent = '数据表格'
  dataTab.addEventListener('click', () => { state.hideResult = true; buildControls() })

  const chartTab = document.createElement('button')
  chartTab.className = 'tab-btn' + (state.hideResult ? '' : ' active')
  chartTab.textContent = '柱状图'
  chartTab.addEventListener('click', () => { state.hideResult = false; buildControls(); startAnimation() })

  tabsEl.appendChild(dataTab)
  tabsEl.appendChild(chartTab)
  container.appendChild(tabsEl)

  // Data panel
  if (state.hideResult) {
    buildDataPanel(container)
    const resetBtn = document.createElement('button')
    resetBtn.className = 'btn'
    resetBtn.textContent = '重新计算'
    resetBtn.addEventListener('click', () => { state.step = 'input'; state.periods = []; buildControls() })
    container.appendChild(resetBtn)
  } else {
    buildChartPanel(container)
    const div = createGroup('图形设置', [
      createCheckboxRow('显示网格线', 'showGrid', state.showGrid),
      createCheckboxRow('显示数据点', 'showDataPoints', state.showDataPoints),
      createCheckboxRow('渐变填充', 'gradientFill', state.gradientFill),
      createCheckboxRow('圆角柱形', 'barShape', 'rounded', 'rounded'),
      createCheckboxRow('播放动画', 'animating', state.animating),
      createTextRow('图表标题', 'graphTitle', state.graphTitle),
    ])
    container.appendChild(div)

    const resetBtn = document.createElement('button')
    resetBtn.className = 'btn'
    resetBtn.textContent = '重新计算'
    resetBtn.addEventListener('click', () => { state.step = 'input'; state.periods = []; buildControls() })
    container.appendChild(resetBtn)
  }

  // Header export buttons
  const headerPngBtn = document.getElementById('header-export-png')
  if (headerPngBtn) {
    headerPngBtn.addEventListener('click', () => {
      const link = document.createElement('a')
      link.download = (state.taskName || 'p6') + '.png'
      link.href = canvas.toDataURL('image/png')
      link.click()
    })
  }
  const headerCsvBtn = document.getElementById('header-export-csv')
  if (headerCsvBtn) {
    headerCsvBtn.addEventListener('click', exportCSV)
  }
  const headerCopyBtn = document.getElementById('header-copy-data')
  if (headerCopyBtn) {
    headerCopyBtn.addEventListener('click', copyData)
  }

function buildDataPanel(container) {
  const div = document.createElement('div')
  div.className = 'control-group'
  div.innerHTML = '<h3>资源分配表</h3>'

  const curve = P6_CURVES[state.selectedCurve]
  const viewer = document.createElement('div')
  viewer.className = 'data-viewer'

  const table = document.createElement('table')
  let html = '<thead><tr><th style="width:60px">工期计划单位</th><th style="color:' + curve.color + '">分配值</th><th style="width:70px">占比(%)</th></tr></thead>'
  html += '<tbody>'
  state.periods.forEach((p, i) => {
    html += `<tr><td style="text-align:left">${p.label}</td><td style="text-align:right">${p.allocated.toLocaleString()}</td><td style="text-align:right">${p.percentage}</td></tr>`
  })
  html += `<tr style="font-weight:bold;background:var(--bg)"><td style="text-align:left">合计</td><td style="text-align:right">${state.periods.reduce((a, b) => a + b.allocated, 0).toLocaleString()}</td><td style="text-align:right">100.00</td></tr>`
  html += '</tbody>'
  table.innerHTML = html
  viewer.appendChild(table)
  div.appendChild(viewer)
  container.appendChild(div)
}
}

function buildChartPanel(container) {
  // Canvas is already in the page, just need to trigger draw
  scheduleDraw()
}

function exportCSV() {
  const curve = P6_CURVES[state.selectedCurve]
  let csv = '\uFEFF工期计划单位,分配值,占比(%)\n'
  state.periods.forEach(p => {
    csv += `${p.label},${p.allocated},${p.percentage}\n`
  })
  const total = state.periods.reduce((a, b) => a + b.allocated, 0)
  csv += `合计,${total},100\n`
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const link = document.createElement('a')
  link.download = (state.taskName || 'p6') + '.csv'
  link.href = URL.createObjectURL(blob)
  link.click()
  URL.revokeObjectURL(link.href)
}

function copyData() {
  let text = '工期计划单位\t分配值\t占比(%)\n'
  state.periods.forEach(p => {
    text += `${p.label}\t${p.allocated}\t${p.percentage}\n`
  })
  navigator.clipboard.writeText(text).then(() => {
    alert('数据已复制到剪贴板')
  })
}

// ========== HELPERS ==========
function computeResult() {
  const curve = P6_CURVES[state.selectedCurve]
  const periods = generatePeriods('2026-01-01') // Use a fixed start date; could be made configurable

  // Adjust curve to match the number of periods
  const allocated = allocateQuantity(curve.values, state.totalCount)

  // Merge
  periods.forEach((p, i) => {
    p.percentage = allocated[i] ? allocated[i].percentage || 0 : 0
    p.allocated = allocated[i] ? allocated[i].allocated : 0
    if (allocated[i]) {
      p.percentage = allocated[i].percentage
      p.allocated = allocated[i].allocated
    }
  })

  state.periods = periods
  state.chartTitle = `${state.taskName} - ${curve.shortName}`
}

function createTextRow(label, key, value, required) {
  const row = document.createElement('div')
  row.className = 'control-row'
  row.innerHTML = `<label>${required ? '<span style="color:var(--red)">*</span> ' : ''}${label}</label><input type="text" value="${escapeHtml(value)}" />`
  row.querySelector('input').addEventListener('input', (e) => { state[key] = e.target.value })
  return row
}

function createNumberRow(label, key, min, max, value) {
  const row = document.createElement('div')
  row.className = 'control-row'
  row.innerHTML = `<label>${label}</label><input type="number" min="${min}" max="${max}" value="${value}" />`
  row.querySelector('input').addEventListener('input', (e) => { state[key] = Number(e.target.value) || 0 })
  return row
}

function createSelectRow(label, key, options, value) {
  const row = document.createElement('div')
  row.className = 'control-row'
  const opts = options.map(o => `<option value="${o.value}" ${o.value === value ? 'selected' : ''}>${o.label}</option>`).join('')
  row.innerHTML = `<label>${label}</label><select>${opts}</select>`
  row.querySelector('select').addEventListener('change', (e) => { state[key] = e.target.value })
  return row
}

function createCheckboxRow(label, key, value, value2) {
  const checked = value === 'rounded' ? state.barShape === 'rounded' : state[key]
  const row = document.createElement('div')
  row.className = 'checkbox-row'
  row.innerHTML = `<input type="checkbox" ${checked ? 'checked' : ''} />
    <label>${label}</label>`
  row.querySelector('input').addEventListener('change', (e) => {
    if (key === 'barShape') state.barShape = e.target.checked ? 'rounded' : 'square'
    else state[key] = e.target.checked
    scheduleDraw()
  })
  return row
}

function createGroup(title, rows) {
  const div = document.createElement('div')
  div.className = 'control-group'
  const h3 = document.createElement('h3')
  h3.textContent = title
  div.appendChild(h3)
  rows.forEach(r => div.appendChild(r))
  return div
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

// ==================== INIT ====================
buildControls()

window.addEventListener('resize', scheduleDraw)
