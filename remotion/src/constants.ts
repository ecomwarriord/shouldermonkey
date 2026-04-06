export const FPS = 30
export const DURATION_SECS = 120
export const TOTAL_FRAMES = FPS * DURATION_SECS

// Brand colours
export const COLORS = {
  void:        '#030108',
  deep:        '#0a0612',
  purple:      '#844bfe',
  purpleDeep:  '#4623d3',
  purpleLight: '#a673ff',
  cyan:        '#00ebc1',
  pink:        '#ff0199',
  gold:        '#fec871',
  white:       '#ffffff',
  offWhite:    '#f0edff',
  muted:       'rgba(240,237,255,0.45)',
  subtle:      'rgba(240,237,255,0.15)',
}

// Scene boundaries (frames)
export const SCENES = {
  intro:       { start: 0,    end: 180  },  // 0:00–0:06  — logo + hook
  problem:     { start: 180,  end: 600  },  // 0:06–0:20  — 7 tools chaos
  solution:    { start: 600,  end: 960  },  // 0:20–0:32  — one platform reveal
  leadCapture: { start: 960,  end: 1560 },  // 0:32–0:52  — live lead + auto-reply
  automation:  { start: 1560, end: 2280 },  // 0:52–1:16  — workflow fires
  result:      { start: 2280, end: 3000 },  // 1:16–1:40  — pipeline + reviews
  cta:         { start: 3000, end: 3600 },  // 1:40–2:00  — CTA
}
