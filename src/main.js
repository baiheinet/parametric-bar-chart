import './style.css'

// ==================== PRIMAVERA P6 12 CURVE DATA ====================
const P6_CURVES = [
  {
    name: 'Linear 线性/均匀',
    shortName: '线性',
    color: '#4F46E5',
    values: [4.76, 4.76, 4.76, 4.76, 4.76, 4.76, 4.76, 4.76, 4.76, 4.76, 4.76, 4.76, 4.76, 4.76, 4.76, 4.76, 4.76, 4.76, 4.76, 4.76, 4.76],
  },
  {
    name: 'Front Loaded 前加载',
    shortName: '前加载',
    color: '#8B5CF6',
    values: [39.60, 24.75, 14.85, 9.90, 4.95, 2.47, 0.99, 0.74, 0.49, 0.40, 0.30, 0.20, 0.15, 0.10, 0.05, 0.03, 0.02, 0.01, 0.00, 0.00, 0.00],
  },
  {
    name: 'Back Loaded 后加载',
    shortName: '后加载',
    color: '#EC4899',
    values: [0.00, 0.00, 0.00, 0.01, 0.02, 0.03, 0.05, 0.10, 0.15, 0.20, 0.30, 0.40, 0.49, 0.74, 0.99, 2.47, 4.95, 9.90, 14.85, 24.75, 39.60],
  },
  {
    name: 'Early Peak 早期峰值',
    shortName: '早期峰值',
    color: '#14B8A6',
    values: [16.26, 13.01, 10.84, 8.67, 7.59, 6.50, 5.96, 5.42, 4.88, 4.34, 3.79, 3.25, 2.71, 2.17, 1.63, 1.08, 0.87, 0.54, 0.33, 0.16, 0.00],
  },
  {
    name: 'Late Peak 晚期峰值',
    shortName: '晚期峰值',
    color: '#F59E0B',
    values: [0.00, 0.16, 0.33, 0.54, 0.87, 1.08, 1.63, 2.17, 2.71, 3.25, 3.79, 4.34, 4.88, 5.42, 5.96, 6.50, 7.59, 8.67, 10.84, 13.01, 16.26],
  },
  {
    name: 'Bell Shaped 钟形',
    shortName: '钟形',
    color: '#10B981',
    values: [0.59, 1.18, 2.37, 4.14, 5.92, 8.28, 10.06, 11.24, 11.83, 11.24, 10.06, 8.28, 5.92, 4.14, 2.37, 1.18, 0.59, 0.37, 0.18, 0.06, 0.00],
  },
  {
    name: 'Triangular 三角形',
    shortName: '三角形',
    color: '#EF4444',
    values: [0.00, 1.00, 2.00, 3.00, 4.00, 5.00, 6.00, 7.00, 8.00, 9.00, 10.00, 9.00, 8.00, 7.00, 6.00, 5.00, 4.00, 3.00, 2.00, 1.00, 0.00],
  },
  {
    name: 'Trapezoidal 梯形',
    shortName: '梯形',
    color: '#3B82F6',
    values: [1.25, 2.50, 3.75, 5.00, 6.25, 6.25, 6.25, 6.25, 6.25, 6.25, 6.25, 6.25, 6.25, 6.25, 6.25, 6.25, 5.00, 3.75, 2.50, 1.25, 0.00],
  },
  {
    name: 'At Start 在开始',
    shortName: '在开始',
    color: '#F97316',
    values: [100.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00],
  },
  {
    name: 'At Finish 在结束',
    shortName: '在结束',
    color: '#06B6D4',
    values: [0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 100.00],
  },
  {
    name: 'Double Peak 双峰值',
    shortName: '双峰值',
    color: '#A855F7',
    values: [10.39, 7.79, 5.20, 2.60, 1.30, 0.65, 1.30, 2.60, 5.19, 7.79, 10.39, 7.79, 5.19, 2.60, 1.30, 0.65, 1.30, 2.60, 5.19, 7.79, 10.39],
  },
  {
    name: 'Skewed Left 左偏/上升',
    shortName: '左偏上升',
    color: '#14B8A6',
    values: [0.43, 0.87, 1.30, 1.73, 2.16, 2.60, 3.03, 3.46, 3.90, 4.33, 4.76, 5.19, 5.63, 6.06, 6.49, 6.93, 7.36, 7.79, 8.23, 8.66, 9.09],
  },
]

// Compute cumulative values for S-curves
function cumulative(arr) {
  const result = []
  let sum = 0
  for (const v of arr) { sum += v; result.push(sum) }
  return result
}

// ==================== STATE ====================
const state = {
  mode: 'single', // 'single' | 'multi'
  selectedCurve: 0, // index for single mode
  selectedCurves: new Set([0]), // set of indices for multi mode
  chartTitle: 'Primavera P6 资源加载柱状图（累计百分比）',
  xAxisTitle: '工期百分比（Duration %）',
  yAxisTitle: '累计百分比（%）',
  showGrid: true,
  showDataPoints: false,
  gradientFill: true,
  barWidth: 25,
  gridColor: '#F1F5F9',
  axisColor: '#CBD5E1',
  backgroundColor: '#FFFFFF',
  fontFamily: '-apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif',
  titleFont: '20px',
  labelFont: '12px',
  valueFont: '11px',
  animProgress: 0,
  animating: true,
  hiddenCurves: new Set(), // curves hidden from view
}

// ==================== CANVAS ====================
const canvas = document.getElementById('chart')
const ctx = canvas.getContext('2d')
const tooltip = document.getElementById('tooltip')

const DURATIONS = Array.from({ length: 21 }, (_, i) => i * 5) // 0, 5, 10, ..., 100

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
  const { width, height } = getChartSize()
  const dpr = window.devicePixelRatio || 1
  canvas.width = width * dpr
  canvas.height = height * dpr
  canvas.style.width = width + 'px'
  canvas.style.height = height + 'px'
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

  const pad = { top: 55, right: 50, bottom: 65, left: 60 }
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
  ctx.fillText(state.chartTitle, width / 2, 28)

  // Determine which curves to show
  const visibleCurves = P6_CURVES.filter((_, i) => {
    if (state.mode === 'single') return i === state.selectedCurve
    return state.selectedCurves.has(i)
  }).filter((_, i, arr) => {
    // filter out hidden
    const origIdx = state.mode === 'single'
      ? state.selectedCurve
      : [...state.selectedCurves][i]
    return !state.hiddenCurves.has(origIdx)
  })

  // Map visible curve data back to original indices
  const visibleOrigIndices = state.mode === 'single'
    ? [state.selectedCurve].filter(i => !state.hiddenCurves.has(i))
    : [...state.selectedCurves].filter(i => !state.hiddenCurves.has(i))

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
    const gridSteps = 10
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
      ctx.fillText((i * 10).toString(), pad.left - 10, y)
    }
  }

  // X-axis labels
  ctx.font = `${state.labelFont} ${state.fontFamily}`
  ctx.fillStyle = '#475569'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'

  DURATIONS.forEach((d, i) => {
    const x = pad.left + (i / 20) * chartW
    ctx.fillText(d + '%', x, pad.top + chartH + 10)
  })

  // X axis title
  ctx.font = `${state.labelFont} ${state.fontFamily}`
  ctx.fillStyle = '#64748B'
  ctx.textAlign = 'center'
  ctx.fillText(state.xAxisTitle, pad.left + chartW / 2, height - 12)

  // Y axis title
  ctx.save()
  ctx.font = `${state.labelFont} ${state.fontFamily}`
  ctx.fillStyle = '#64748B'
  ctx.textAlign = 'center'
  ctx.translate(16, pad.top + chartH / 2)
  ctx.rotate(-Math.PI / 2)
  ctx.fillText(state.yAxisTitle, 0, 0)
  ctx.restore()

  // Draw bars
  const plotPoints = []
  const barWidth = Math.max(8, Math.min(40, chartW / 20 * 0.6))

  visibleOrigIndices.forEach((origIdx) => {
    const curve = P6_CURVES[origIdx]
    const cumValues = cumulative(curve.values)
    const progress = state.animProgress
    const color = curve.color

    // Gradient fill for bars
    const gradient = ctx.createLinearGradient(0, pad.top + chartH, 0, pad.top)
    gradient.addColorStop(0, color + '44')
    gradient.addColorStop(1, color + 'cc')

    cumValues.forEach((v, j) => {
      const x = pad.left + (j / 20) * chartW
      const barH = (v / 100) * chartH * progress
      const barTop = pad.top + chartH - barH
      const barX = x - barWidth / 2

      // Bar fill
      if (state.gradientFill) {
        ctx.fillStyle = gradient
      } else {
        ctx.fillStyle = color
      }
      ctx.fillRect(barX, barTop, barWidth, barH)

      // Bar border
      if (!state.gradientFill) {
        ctx.strokeStyle = color
        ctx.lineWidth = 1
        ctx.strokeRect(barX, barTop, barWidth, barH)
      }

      // Data point markers
      if (state.showDataPoints) {
        ctx.beginPath()
        ctx.arc(x, barTop, 3, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.fill()
        ctx.strokeStyle = '#fff'
        ctx.lineWidth = 1.5
        ctx.stroke()
      }

      // Store for tooltip
      plotPoints.push({ x: x, y: barTop, curveName: curve.name, duration: DURATIONS[j], value: v.toFixed(2), color })
    })
  })

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
  if (!state.animating) { draw(); return }
  if (!animStart) animStart = timestamp
  const elapsed = timestamp - animStart
  const duration = 1200
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
  let minDist = 20 // pixel threshold

  for (const pt of pts) {
    const dist = Math.hypot(pt.x - mx, pt.y - my)
    if (dist < minDist) {
      minDist = dist
      closest = pt
    }
  }

  if (closest) {
    tooltip.innerHTML = `<strong>${closest.curveName}</strong><br/>工期: ${closest.duration}%<br/>累计: ${closest.value}%`
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

// ==================== TAB STATE ====================
let activeTab = 'curve' // 'curve' | 'graphic'

// ==================== BUILD CONTROLS ====================
function buildControls() {
  const container = document.getElementById('controls')
  container.innerHTML = ''

  // Tab bar
  const tabBar = document.createElement('div')
  tabBar.className = 'tab-bar'

  const curveTab = document.createElement('button')
  curveTab.className = 'tab-btn' + (activeTab === 'curve' ? ' active' : '')
  curveTab.textContent = '柱状图设置'
  curveTab.addEventListener('click', () => { activeTab = 'curve'; buildControls() })

  const graphicTab = document.createElement('button')
  graphicTab.className = 'tab-btn' + (activeTab === 'graphic' ? ' active' : '')
  graphicTab.textContent = '图形设置'
  graphicTab.addEventListener('click', () => { activeTab = 'graphic'; buildControls() })

  tabBar.appendChild(curveTab)
  tabBar.appendChild(graphicTab)
  container.appendChild(tabBar)

  // Tab panels
  const curvePanel = document.createElement('div')
  curvePanel.className = 'tab-panel' + (activeTab === 'curve' ? ' active' : '')

  const graphicPanel = document.createElement('div')
  graphicPanel.className = 'tab-panel' + (activeTab === 'graphic' ? ' active' : '')

  // === CURVE TAB ===
  curvePanel.appendChild(createGroup('显示模式', [
    createModeButtons(),
  ]))

  curvePanel.appendChild(createGroup('柱状图设置', [
    createSingleCurveSelector(),
  ]))

  if (state.mode === 'multi') {
    curvePanel.appendChild(createGroup('快速选择（多选）', [
      createMultiCurveSelector(),
    ]))
  }

  curvePanel.appendChild(buildDataViewer())

  // === GRAPHIC TAB ===
  graphicPanel.appendChild(createGroup('图表设置', [
    createTextRow('标题', 'chartTitle', state.chartTitle),
    createTextRow('X 轴标题', 'xAxisTitle', state.xAxisTitle),
    createTextRow('Y 轴标题', 'yAxisTitle', state.yAxisTitle),
  ]))

  graphicPanel.appendChild(createGroup('显示选项', [
    createCheckboxRow('显示网格线', 'showGrid', state.showGrid),
    createCheckboxRow('显示数据点', 'showDataPoints', state.showDataPoints),
    createCheckboxRow('渐变填充', 'gradientFill', state.gradientFill),
    createCheckboxRow('播放动画', 'animating', state.animating),
  ]))

  graphicPanel.appendChild(createGroup('样式设置', [
    createRangeRow('柱宽', 'barWidth', 8, 50, state.barWidth),
    createColorRow('背景色', 'backgroundColor', state.backgroundColor),
    createColorRow('网格线', 'gridColor', state.gridColor),
    createColorRow('坐标轴', 'axisColor', state.axisColor),
  ]))

  container.appendChild(curvePanel)
  container.appendChild(graphicPanel)
}

function createModeButtons() {
  const div = document.createElement('div')
  div.style.display = 'flex'
  div.style.gap = '6px'

  const singleBtn = document.createElement('button')
  singleBtn.className = 'curve-btn' + (state.mode === 'single' ? ' active' : '')
  singleBtn.textContent = '单曲线'
  singleBtn.addEventListener('click', () => {
    state.mode = 'single'
    buildControls()
    startAnimation()
  })

  const multiBtn = document.createElement('button')
  multiBtn.className = 'curve-btn' + (state.mode === 'multi' ? ' active' : '')
  multiBtn.textContent = '多曲线对比'
  multiBtn.addEventListener('click', () => {
    state.mode = 'multi'
    if (state.selectedCurves.size === 0) {
      state.selectedCurves = new Set([0])
    }
    buildControls()
    startAnimation()
  })

  div.appendChild(singleBtn)
  div.appendChild(multiBtn)
  return div
}

function createSingleCurveSelector() {
  const div = document.createElement('div')
  div.className = 'curve-selector'

  P6_CURVES.forEach((curve, i) => {
    const btn = document.createElement('button')
    btn.className = 'curve-btn' + (state.selectedCurve === i ? ' active' : '')
    btn.innerHTML = `<span class="color-dot" style="background:${curve.color}"></span>${curve.shortName}`
    btn.addEventListener('click', () => {
      state.selectedCurve = i
      state.hiddenCurves.clear()
      buildControls()
      startAnimation()
    })
    div.appendChild(btn)
  })

  return div
}

function createMultiCurveSelector() {
  const div = document.createElement('div')
  div.className = 'multi-selector'

  P6_CURVES.forEach((curve, i) => {
    const btn = document.createElement('button')
    btn.className = 'curve-btn' + (state.selectedCurves.has(i) ? ' active' : '')
    btn.textContent = curve.shortName
    btn.addEventListener('click', () => {
      if (state.selectedCurves.has(i)) {
        if (state.selectedCurves.size > 1) state.selectedCurves.delete(i)
      } else {
        state.selectedCurves.add(i)
      }
      buildControls()
      startAnimation()
    })
    div.appendChild(btn)
  })

  // Select all / deselect all
  const row = document.createElement('div')
  row.style.marginTop = '8px'
  row.style.display = 'flex'
  row.style.gap = '6px'

  const selectAll = document.createElement('button')
  selectAll.className = 'btn'
  selectAll.style.fontSize = '10px'
  selectAll.style.padding = '3px 8px'
  selectAll.textContent = '全选'
  selectAll.addEventListener('click', () => {
    state.selectedCurves = new Set(P6_CURVES.map((_, i) => i))
    buildControls()
    startAnimation()
  })

  const deselectAll = document.createElement('button')
  deselectAll.className = 'btn'
  deselectAll.style.fontSize = '10px'
  deselectAll.style.padding = '3px 8px'
  deselectAll.textContent = '清空'
  deselectAll.addEventListener('click', () => {
    state.selectedCurves = new Set()
    buildControls()
    startAnimation()
  })

  row.appendChild(selectAll)
  row.appendChild(deselectAll)
  div.appendChild(row)

  return div
}

function createTextRow(label, key, value) {
  const row = document.createElement('div')
  row.className = 'control-row'
  row.innerHTML = `<label>${label}</label><input type="text" value="${escapeHtml(value)}" />`
  row.querySelector('input').addEventListener('input', (e) => { state[key] = e.target.value; scheduleDraw() })
  return row
}

function createRangeRow(label, key, min, max, value) {
  const row = document.createElement('div')
  row.className = 'control-row'
  row.innerHTML = `<label>${label}</label><input type="range" min="${min}" max="${max}" step="0.5" value="${value}" /><span class="range-value">${value}</span>`
  const input = row.querySelector('input')
  const span = row.querySelector('.range-value')
  input.addEventListener('input', (e) => {
    const v = Number(e.target.value)
    state[key] = v
    span.textContent = v
    scheduleDraw()
  })
  return row
}

function createColorRow(label, key, value) {
  const row = document.createElement('div')
  row.className = 'control-row'
  row.innerHTML = `<label>${label}</label><input type="color" value="${value}" />`
  row.querySelector('input').addEventListener('input', (e) => { state[key] = e.target.value; scheduleDraw() })
  return row
}

function createCheckboxRow(label, key, value) {
  const row = document.createElement('div')
  row.className = 'checkbox-row'
  row.innerHTML = `<input type="checkbox" ${value ? 'checked' : ''} /><label>${label}</label>`
  row.querySelector('input').addEventListener('change', (e) => {
    state[key] = e.target.checked
    if (key === 'animating' && e.target.checked) startAnimation()
    else if (key === 'animating' && !e.target.checked) { state.animProgress = 1; draw() }
    else scheduleDraw()
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

function buildDataViewer() {
  const div = document.createElement('div')
  div.className = 'control-group'
  div.innerHTML = '<h3>原始数据表</h3>'

  const viewer = document.createElement('div')
  viewer.className = 'data-viewer'

  const table = document.createElement('table')
  let theadHTML = '<thead><tr><th style="width:50px">工期%</th>'
  P6_CURVES.forEach(c => { theadHTML += `<th style="color:${c.color}">${c.shortName}</th>` })
  theadHTML += '</tr></thead>'
  table.innerHTML = theadHTML

  const tbody = document.createElement('tbody')
  DURATIONS.forEach((d, i) => {
    const tr = document.createElement('tr')
    let html = `<td>${d}%</td>`
    P6_CURVES.forEach(c => { html += `<td>${c.values[i].toFixed(2)}</td>` })
    tr.innerHTML = html
    tbody.appendChild(tr)
  })

  table.appendChild(tbody)
  viewer.appendChild(table)
  div.appendChild(viewer)
  return div
}

// ==================== EXPORT ====================
document.getElementById('export-png').addEventListener('click', () => {
  const link = document.createElement('a')
  link.download = 'p6-resource-bar.png'
  link.href = canvas.toDataURL('image/png')
  link.click()
})

document.getElementById('export-csv').addEventListener('click', () => {
  let csv = '工期%,' + P6_CURVES.map(c => c.name).join(',') + '\n'
  DURATIONS.forEach((d, i) => {
    csv += `${d}%`
    P6_CURVES.forEach(c => { csv += `,${c.values[i].toFixed(2)}` })
    csv += '\n'
  })
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' })
  const link = document.createElement('a')
  link.download = 'p6-resource-bar.csv'
  link.href = URL.createObjectURL(blob)
  link.click()
  URL.revokeObjectURL(link.href)
})

document.getElementById('print-data').addEventListener('click', () => {
  let text = '工期%'
  P6_CURVES.forEach(c => { text += '\t' + c.shortName })
  text += '\n'
  DURATIONS.forEach((d, i) => {
    text += `${d}%`
    P6_CURVES.forEach(c => { text += '\t' + c.values[i].toFixed(2) })
    text += '\n'
  })
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById('print-data')
    btn.textContent = '已复制!'
    setTimeout(() => { btn.textContent = '复制数据' }, 1500)
  }).catch(() => {
    prompt('复制以下内容:', text)
  })
})

// ==================== UTILS ====================
function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

// ==================== INIT ====================
buildControls()
animate(performance.now())

window.addEventListener('resize', scheduleDraw)
