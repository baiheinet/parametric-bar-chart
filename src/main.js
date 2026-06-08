import './style.css'

// ==================== DEFAULT DATA ====================
const defaultData = [
  { label: '一月', value: 120 },
  { label: '二月', value: 200 },
  { label: '三月', value: 150 },
  { label: '四月', value: 280 },
  { label: '五月', value: 230 },
  { label: '六月', value: 310 },
]

const defaultColors = ['#4F46E5', '#8B5CF6', '#EC4899', '#14B8A6', '#F59E0B', '#3B82F6']

// ==================== STATE ====================
const state = {
  data: JSON.parse(JSON.stringify(defaultData)),
  colors: [...defaultColors],
  chartTitle: '月度销售数据',
  yAxisTitle: '销售额 (万元)',
  barWidth: 50,
  barGap: 20,
  chartPadding: { top: 60, right: 40, bottom: 80, left: 70 },
  maxValue: null,
  gridLines: 5,
  barRadius: 4,
  showValue: true,
  showGrid: true,
  showTooltip: true,
  animation: true,
  fontFamily: '-apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif',
  titleFont: '22px',
  labelFont: '13px',
  valueFont: '12px',
  legendPosition: 'top',
  gradient: false,
  barShape: 'rounded',
  backgroundColor: '#FFFFFF',
  gridColor: '#F1F5F9',
  axisColor: '#CBD5E1',
}

// ==================== CANVAS SETUP ====================
const canvas = document.getElementById('chart')
const ctx = canvas.getContext('2d')
const tooltip = document.getElementById('tooltip')

function getChartSize() {
  const container = document.getElementById('chart-container')
  const cw = container.clientWidth - 60
  const ch = container.clientHeight - 60
  const minWidth = 600
  const minHeight = 450
  return {
    width: Math.max(minWidth, Math.min(cw, 1000)),
    height: Math.max(minHeight, Math.min(ch, 700)),
  }
}

// ==================== DRAWING ====================
let animProgress = 1
let animFrame = null

function draw(progress = 1) {
  const { width, height } = getChartSize()
  const dpr = window.devicePixelRatio || 1

  canvas.width = width * dpr
  canvas.height = height * dpr
  canvas.style.width = width + 'px'
  canvas.style.height = height + 'px'
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

  // Background
  ctx.fillStyle = state.backgroundColor
  ctx.beginPath()
  roundRect(ctx, 0, 0, width, height, 12)
  ctx.fill()

  const p = state.chartPadding
  const chartW = width - p.left - p.right
  const chartH = height - p.top - p.bottom

  // Title
  if (state.chartTitle) {
    ctx.font = `bold ${state.titleFont} ${state.fontFamily}`
    ctx.fillStyle = '#1E293B'
    ctx.textAlign = 'center'
    ctx.fillText(state.chartTitle, width / 2, 32)
  }

  // Y-axis title
  if (state.yAxisTitle) {
    ctx.save()
    ctx.font = `${state.labelFont} ${state.fontFamily}`
    ctx.fillStyle = '#64748B'
    ctx.textAlign = 'center'
    ctx.translate(18, p.top + chartH / 2)
    ctx.rotate(-Math.PI / 2)
    ctx.fillText(state.yAxisTitle, 0, 0)
    ctx.restore()
  }

  // Legend
  if (state.legendPosition === 'top' && state.data.length > 0) {
    let lx = width / 2 - (state.data.length * 80) / 2
    ctx.font = `${state.labelFont} ${state.fontFamily}`
    for (let i = 0; i < state.data.length; i++) {
      ctx.fillStyle = state.colors[i % state.colors.length]
      ctx.beginPath()
      roundRect(ctx, lx, 14, 12, 12, 3)
      ctx.fill()
      ctx.fillStyle = '#475569'
      ctx.textAlign = 'left'
      ctx.fillText(state.data[i].label, lx + 16, 24)
      lx += 80
    }
  } else if (state.legendPosition === 'bottom') {
    let lx = width / 2 - (state.data.length * 80) / 2
    ctx.font = `${state.labelFont} ${state.fontFamily}`
    for (let i = 0; i < state.data.length; i++) {
      ctx.fillStyle = state.colors[i % state.colors.length]
      ctx.beginPath()
      roundRect(ctx, lx, height - 30, 12, 12, 3)
      ctx.fill()
      ctx.fillStyle = '#475569'
      ctx.textAlign = 'left'
      ctx.fillText(state.data[i].label, lx + 16, height - 20)
      lx += 80
    }
  }

  // Calculate max value
  const rawMax = Math.max(...state.data.map(d => d.value))
  const maxVal = state.maxValue || Math.ceil(rawMax * 1.15)
  const step = maxVal / state.gridLines

  // Grid lines
  if (state.showGrid) {
    ctx.strokeStyle = state.gridColor
    ctx.lineWidth = 1
    ctx.font = `${state.labelFont} ${state.fontFamily}`
    ctx.fillStyle = '#94A3B8'
    ctx.textAlign = 'right'

    for (let i = 0; i <= state.gridLines; i++) {
      const y = p.top + chartH - (i / state.gridLines) * chartH
      ctx.beginPath()
      ctx.moveTo(p.left, y)
      ctx.lineTo(p.left + chartW, y)
      ctx.stroke()
      const val = Math.round(step * i)
      ctx.fillText(formatNumber(val), p.left - 10, y + 4)
    }
  }

  // Axes
  ctx.strokeStyle = state.axisColor
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(p.left, p.top)
  ctx.lineTo(p.left, p.top + chartH)
  ctx.lineTo(p.left + chartW, p.top + chartH)
  ctx.stroke()

  // X-axis labels
  ctx.font = `${state.labelFont} ${state.fontFamily}`
  ctx.fillStyle = '#475569'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'

  const barTotal = state.barWidth + state.barGap
  const totalWidth = state.data.length * barTotal - state.barGap
  const startX = p.left + (chartW - totalWidth) / 2 + state.barWidth / 2

  state.data.forEach((d, i) => {
    const x = startX + i * barTotal - state.barWidth / 2
    const y = p.top + chartH
    ctx.textBaseline = 'top'
    ctx.fillText(d.label, x + state.barWidth / 2, y + 8)
  })

  // Bars
  ctx.textBaseline = 'bottom'
  state.data.forEach((d, i) => {
    const x = startX + i * barTotal - state.barWidth / 2
    const barH = (d.value / maxVal) * chartH * progress
    const y = p.top + chartH - barH

    const color = state.colors[i % state.colors.length]

    // Gradient
    if (state.gradient) {
      const grad = ctx.createLinearGradient(0, p.top + chartH, 0, y)
      grad.addColorStop(0, color + '88')
      grad.addColorStop(1, color)
      ctx.fillStyle = grad
    } else {
      ctx.fillStyle = color
    }

    // Bar shape
    if (state.barShape === 'rounded') {
      const r = Math.min(state.barRadius, state.barWidth / 2)
      ctx.beginPath()
      ctx.moveTo(x, p.top + chartH)
      ctx.lineTo(x, y + r)
      ctx.quadraticCurveTo(x, y, x + r, y)
      ctx.lineTo(x + state.barWidth - r, y)
      ctx.quadraticCurveTo(x + state.barWidth, y, x + state.barWidth, y + r)
      ctx.lineTo(x + state.barWidth, p.top + chartH)
      ctx.closePath()
      ctx.fill()
    } else {
      ctx.fillRect(x, y, state.barWidth, barH)
    }

    // Value label
    if (state.showValue) {
      ctx.font = `bold ${state.valueFont} ${state.fontFamily}`
      ctx.fillStyle = '#1E293B'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'bottom'
      ctx.fillText(formatNumber(d.value), x + state.barWidth / 2, y - 6)
    }
  })

  // Store bar rects for hover
  canvas._bars = state.data.map((d, i) => {
    const x = startX + i * barTotal - state.barWidth / 2
    const barH = (d.value / maxVal) * chartH * progress
    const y = p.top + chartH - barH
    return { x, y, width: state.barWidth, height: barH, data: d, color: state.colors[i % state.colors.length] }
  })
}

function formatNumber(n) {
  if (n >= 10000) return (n / 10000).toFixed(1).replace(/\.0$/, '') + '万'
  return n.toLocaleString()
}

function roundRect(ctx, x, y, w, h, r) {
  if (typeof r === 'number') r = { tl: r, tr: r, br: r, bl: r }
  ctx.moveTo(x + r.tl, y)
  ctx.lineTo(x + w - r.tr, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r.tr)
  ctx.lineTo(x + w, y + h - r.br)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r.br, y + h)
  ctx.lineTo(x + r.bl, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r.bl)
  ctx.lineTo(x, y + r.tl)
  ctx.quadraticCurveTo(x, y, x + r.tl, y)
}

function animate() {
  if (!state.animation) {
    draw(1)
    return
  }
  animProgress = 0
  if (animFrame) cancelAnimationFrame(animFrame)
  const duration = 800
  const start = performance.now()
  function step(now) {
    animProgress = Math.min(1, (now - start) / duration)
    const eased = 1 - Math.pow(1 - animProgress, 3)
    draw(eased)
    if (animProgress < 1) animFrame = requestAnimationFrame(step)
  }
  animFrame = requestAnimationFrame(step)
}

// ==================== HOVER / TOOLTIP ====================
canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect()
  const mx = e.clientX - rect.left
  const my = e.clientY - rect.top
  const bars = canvas._bars || []

  let found = false
  for (const bar of bars) {
    if (mx >= bar.x && mx <= bar.x + bar.width && my >= bar.y && my <= bar.y + bar.height) {
      tooltip.innerHTML = `<strong>${bar.data.label}</strong><br/>${bar.data.value}`
      tooltip.classList.add('visible')
      let tx = e.clientX - rect.left + 16
      let ty = e.clientY - rect.top - 10
      if (tx + 120 > rect.width) tx = e.clientX - rect.left - 130
      if (ty < 0) ty = 10
      tooltip.style.left = tx + 'px'
      tooltip.style.top = ty + 'px'
      canvas.style.cursor = 'pointer'
      found = true
      break
    }
  }
  if (!found) {
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

  // Chart settings
  container.appendChild(createGroup('图表设置', [
    createTextRow('标题', 'chartTitle', state.chartTitle),
    createTextRow('Y轴标题', 'yAxisTitle', state.yAxisTitle),
    createSelectRow('图例位置', 'legendPosition', [
      { value: 'top', label: '顶部' },
      { value: 'bottom', label: '底部' },
      { value: 'none', label: '不显示' },
    ], state.legendPosition),
  ]))

  // Bar settings
  container.appendChild(createGroup('柱状图设置', [
    createRangeRow('柱宽', 'barWidth', 20, 120, state.barWidth),
    createRangeRow('柱间距', 'barGap', 5, 60, state.barGap),
    createRangeRow('圆角', 'barRadius', 0, 25, state.barRadius),
    createSelectRow('柱形样式', 'barShape', [
      { value: 'rounded', label: '圆角' },
      { value: 'square', label: '方形' },
    ], state.barShape),
    createColorRow('背景色', 'backgroundColor', state.backgroundColor),
  ]))

  // Colors
  container.appendChild(createGroup('颜色设置', [
    createCheckboxRow('使用渐变', 'gradient', state.gradient),
    createColorRow('网格线', 'gridColor', state.gridColor),
    createColorRow('坐标轴', 'axisColor', state.axisColor),
  ]))

  // Display
  container.appendChild(createGroup('显示选项', [
    createCheckboxRow('显示数值标签', 'showValue', state.showValue),
    createCheckboxRow('显示网格线', 'showGrid', state.showGrid),
    createCheckboxRow('动画效果', 'animation', state.animation),
    createRangeRow('网格线数', 'gridLines', 2, 10, state.gridLines),
    createNumberRow('最大值 (空=自动)', 'maxValue', state.maxValue),
  ]))

  // Font
  container.appendChild(createGroup('字体设置', [
    createRangeRow('标题字号', 'titleFont', 14, 36, parseInt(state.titleFont)),
    createRangeRow('标签字号', 'labelFont', 10, 20, parseInt(state.labelFont)),
    createRangeRow('数值字号', 'valueFont', 10, 20, parseInt(state.valueFont)),
  ]))

  // Data
  buildDataSection(container)
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

function createTextRow(label, key, value) {
  const row = document.createElement('div')
  row.className = 'control-row'
  row.innerHTML = `<label>${label}</label><input type="text" value="${escapeHtml(value)}" />`
  row.querySelector('input').addEventListener('input', (e) => { state[key] = e.target.value; scheduleDraw() })
  return row
}

function createNumberRow(label, key, value) {
  const row = document.createElement('div')
  row.className = 'control-row'
  row.innerHTML = `<label>${label}</label><input type="number" value="${value ?? ''}" placeholder="自动" />`
  row.querySelector('input').addEventListener('input', (e) => {
    const v = e.target.value
    state[key] = v === '' ? null : Number(v)
    scheduleDraw()
  })
  return row
}

function createSelectRow(label, key, options, value) {
  const row = document.createElement('div')
  row.className = 'control-row'
  const opts = options.map(o => `<option value="${o.value}" ${o.value === value ? 'selected' : ''}>${o.label}</option>`).join('')
  row.innerHTML = `<label>${label}</label><select>${opts}</select>`
  row.querySelector('select').addEventListener('change', (e) => { state[key] = e.target.value; scheduleDraw() })
  return row
}

function createRangeRow(label, key, min, max, value) {
  const row = document.createElement('div')
  row.className = 'control-row'
  row.innerHTML = `<label>${label}</label><input type="range" min="${min}" max="${max}" value="${value}" /><span class="range-value">${value}</span>`
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
  row.querySelector('input').addEventListener('change', (e) => { state[key] = e.target.checked; scheduleDraw() })
  return row
}

function buildDataSection(container) {
  const div = document.createElement('div')
  div.className = 'control-group'
  div.innerHTML = '<h3>数据编辑</h3>'

  const table = document.createElement('table')
  table.className = 'data-table'
  table.innerHTML = `
    <thead>
      <tr>
        <th style="width:40%">标签</th>
        <th style="width:30%">值</th>
        <th style="width:25%">颜色</th>
        <th style="width:5%"></th>
      </tr>
    </thead>
    <tbody></tbody>
  `
  const tbody = table.querySelector('tbody')

  state.data.forEach((d, i) => {
    const tr = document.createElement('tr')
    const color = state.colors[i % state.colors.length]
    tr.innerHTML = `
      <td><input type="text" value="${escapeHtml(d.label)}" /></td>
      <td><input type="number" value="${d.value}" /></td>
      <td><input type="color" class="color-input" value="${color}" /></td>
      <td><button class="btn-remove" title="删除">×</button></td>
    `
    tr.querySelector('input[type="text"]').addEventListener('input', (e) => {
      state.data[i].label = e.target.value
      scheduleDraw()
    })
    tr.querySelector('input[type="number"]').addEventListener('input', (e) => {
      state.data[i].value = Number(e.target.value) || 0
      scheduleDraw()
    })
    tr.querySelector('.color-input').addEventListener('input', (e) => {
      state.colors[i] = e.target.value
      scheduleDraw()
    })
    tr.querySelector('.btn-remove').addEventListener('click', () => {
      if (state.data.length <= 1) return
      state.data.splice(i, 1)
      state.colors.splice(i, 1)
      buildDataSection(container)
      scheduleDraw()
    })
    tbody.appendChild(tr)
  })

  div.appendChild(table)

  const addBtn = document.createElement('button')
  addBtn.className = 'btn btn-add'
  addBtn.textContent = '+ 添加数据项'
  addBtn.addEventListener('click', () => {
    const idx = state.data.length
    state.data.push({ label: `项目${idx + 1}`, value: 100 })
    const hue = (idx * 360 / 12) % 360
    state.colors.push(hslToHex(hue, 70, 55))
    buildDataSection(container)
    scheduleDraw()
  })
  div.appendChild(addBtn)

  // Presets
  const presetDiv = document.createElement('div')
  presetDiv.style.marginTop = '16px'
  presetDiv.innerHTML = '<h3 style="margin-bottom:10px">快速预设</h3>'

  const presetRow = document.createElement('div')
  presetRow.style.display = 'flex'
  presetRow.style.gap = '6px'
  presetRow.style.flexWrap = 'wrap'

  const presets = [
    { name: '销售数据', data: [
      { label: '一月', value: 120 }, { label: '二月', value: 200 }, { label: '三月', value: 150 },
      { label: '四月', value: 280 }, { label: '五月', value: 230 }, { label: '六月', value: 310 },
    ]},
    { name: '季度数据', data: [
      { label: 'Q1', value: 450 }, { label: 'Q2', value: 620 }, { label: 'Q3', value: 580 }, { label: 'Q4', value: 710 },
    ]},
    { name: '排名数据', data: [
      { label: '产品A', value: 95 }, { label: '产品B', value: 82 }, { label: '产品C', value: 74 },
      { label: '产品D', value: 68 }, { label: '产品E', value: 55 }, { label: '产品F', value: 43 },
    ]},
  ]

  presets.forEach(p => {
    const btn = document.createElement('button')
    btn.className = 'btn'
    btn.textContent = p.name
    btn.style.fontSize = '12px'
    btn.style.padding = '5px 10px'
    btn.addEventListener('click', () => {
      state.data = JSON.parse(JSON.stringify(p.data))
      state.colors = []
      p.data.forEach((_, i) => {
        const hue = (i * 360 / Math.max(p.data.length, 1)) % 360
        state.colors.push(hslToHex(hue, 70, 55))
      })
      buildDataSection(container)
      scheduleDraw()
    })
    presetRow.appendChild(btn)
  })

  presetDiv.appendChild(presetRow)
  div.appendChild(presetDiv)

  container.appendChild(div)
}

function hslToHex(h, s, l) {
  s /= 100
  l /= 100
  const a = s * Math.min(l, 1 - l)
  const f = n => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color).toString(16).padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

// ==================== EXPORT ====================
let drawTimer = null
function scheduleDraw() {
  if (drawTimer) clearTimeout(drawTimer)
  drawTimer = setTimeout(animate, 30)
}

document.getElementById('export-png').addEventListener('click', () => {
  const link = document.createElement('a')
  link.download = 'bar-chart.png'
  link.href = canvas.toDataURL('image/png')
  link.click()
})

document.getElementById('export-svg').addEventListener('click', () => {
  const svg = canvasToSVG()
  const blob = new Blob([svg], { type: 'image/svg+xml' })
  const link = document.createElement('a')
  link.download = 'bar-chart.svg'
  link.href = URL.createObjectURL(blob)
  link.click()
  URL.revokeObjectURL(link.href)
})

document.getElementById('print-data').addEventListener('click', () => {
  const text = state.data.map(d => `${d.label}: ${d.value}`).join('\n')
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById('print-data')
    btn.textContent = '已复制!'
    setTimeout(() => { btn.textContent = '复制数据' }, 1500)
  }).catch(() => {
    prompt('复制以下内容:', text)
  })
})

function canvasToSVG() {
  const { width, height } = getChartSize()
  const p = state.chartPadding
  const chartW = width - p.left - p.right
  const chartH = height - p.top - p.bottom
  const rawMax = Math.max(...state.data.map(d => d.value))
  const maxVal = state.maxValue || Math.ceil(rawMax * 1.15)
  const barTotal = state.barWidth + state.barGap
  const totalWidth = state.data.length * barTotal - state.barGap
  const startX = p.left + (chartW - totalWidth) / 2 + state.barWidth / 2

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`
  svg += `<rect width="${width}" height="${height}" fill="${state.backgroundColor}" rx="12"/>`

  if (state.chartTitle) {
    svg += `<text x="${width/2}" y="32" text-anchor="middle" font-size="22" font-weight="bold" font-family="${state.fontFamily}" fill="#1E293B">${escapeXml(state.chartTitle)}</text>`
  }

  const step = maxVal / state.gridLines
  for (let i = 0; i <= state.gridLines; i++) {
    const y = p.top + chartH - (i / state.gridLines) * chartH
    svg += `<line x1="${p.left}" y1="${y}" x2="${p.left + chartW}" y2="${y}" stroke="${state.gridColor}" stroke-width="1"/>`
    svg += `<text x="${p.left - 10}" y="${y + 4}" text-anchor="end" font-size="13" font-family="${state.fontFamily}" fill="#94A3B8">${formatNumber(Math.round(step * i))}</text>`
  }

  svg += `<line x1="${p.left}" y1="${p.top}" x2="${p.left}" y2="${p.top + chartH}" stroke="${state.axisColor}" stroke-width="2"/>`
  svg += `<line x1="${p.left}" y1="${p.top + chartH}" x2="${p.left + chartW}" y2="${p.top + chartH}" stroke="${state.axisColor}" stroke-width="2"/>`

  state.data.forEach((d, i) => {
    const x = startX + i * barTotal - state.barWidth / 2
    const barH = (d.value / maxVal) * chartH
    const y = p.top + chartH - barH
    const color = state.colors[i % state.colors.length]

    if (state.barShape === 'rounded') {
      const r = Math.min(state.barRadius, state.barWidth / 2)
      svg += `<path d="M${x},${p.top + chartH} L${x},${y + r} Q${x},${y} ${x + r},${y} L${x + state.barWidth - r},${y} Q${x + state.barWidth},${y} ${x + state.barWidth},${y + r} L${x + state.barWidth},${p.top + chartH} Z" fill="${color}"/>`
    } else {
      svg += `<rect x="${x}" y="${y}" width="${state.barWidth}" height="${barH}" fill="${color}"/>`
    }

    if (state.showValue) {
      svg += `<text x="${x + state.barWidth / 2}" y="${y - 6}" text-anchor="middle" font-size="12" font-weight="bold" font-family="${state.fontFamily}" fill="#1E293B">${formatNumber(d.value)}</text>`
    }
    svg += `<text x="${x + state.barWidth / 2}" y="${p.top + chartH + 20}" text-anchor="middle" font-size="13" font-family="${state.fontFamily}" fill="#475569">${escapeXml(d.label)}</text>`
  })

  svg += '</svg>'
  return svg
}

function escapeXml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

// ==================== INIT ====================
buildControls()
animate()

window.addEventListener('resize', scheduleDraw)
