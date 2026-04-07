export const styles = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  background: #0a0a0a;
  color: #f0f0f0;
  font-family: 'Inter', sans-serif;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
}
@media print {
  body * { display: none !important; }
  body::after {
    display: block !important;
    content: "This document is protected and cannot be printed.";
    font-size: 24px;
    text-align: center;
    padding: 100px;
    color: #111;
  }
}
.hhd-viewer-shell { min-height: 100vh; background: #0d0d0d; display: flex; flex-direction: column; }
.hhd-topbar { position: sticky; top: 0; z-index: 100; background: #111; border-bottom: 1px solid #222; padding: 12px 20px; display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.hhd-topbar-brand { display: flex; align-items: center; gap: 10px; }
.hhd-topbar-logo { font-weight: 700; font-size: 16px; letter-spacing: -0.3px; color: #fff; }
.hhd-topbar-logo span { color: #f5c518; }
.hhd-badge { background: #1a1a1a; border: 1px solid #2a2a2a; color: #888; font-size: 11px; font-weight: 500; padding: 3px 8px; border-radius: 20px; letter-spacing: 0.5px; text-transform: uppercase; }
.hhd-page-counter { font-size: 13px; color: #666; font-weight: 500; }
.hhd-page-counter strong { color: #f5c518; }
.hhd-watermark-bar { background: linear-gradient(90deg, #f5c518 0%, #e6b800 100%); color: #000; text-align: center; font-size: 11px; font-weight: 600; padding: 6px 20px; letter-spacing: 1px; text-transform: uppercase; }
.hhd-canvas-scroll { flex: 1; overflow-y: auto; overflow-x: hidden; padding: 24px 0 40px; display: flex; flex-direction: column; align-items: center; gap: 16px; scroll-behavior: smooth; -webkit-overflow-scrolling: touch; }
.hhd-page-wrapper { position: relative; display: flex; flex-direction: column; align-items: center; }
.hhd-canvas-frame { position: relative; box-shadow: 0 4px 40px rgba(0,0,0,0.6); border-radius: 4px; overflow: hidden; max-width: 95vw; }
.hhd-canvas-frame canvas { display: block; max-width: 100%; height: auto; pointer-events: none; }
.hhd-canvas-shield { position: absolute; inset: 0; z-index: 10; cursor: default; }
.hhd-page-watermark { position: absolute; inset: 0; z-index: 11; display: flex; align-items: center; justify-content: center; pointer-events: none; opacity: 0.06; transform: rotate(-30deg); font-size: clamp(18px, 4vw, 36px); font-weight: 900; color: #f5c518; letter-spacing: 4px; text-transform: uppercase; white-space: nowrap; text-align: center; }
.hhd-page-number-tag { margin-top: 8px; font-size: 11px; color: #444; font-weight: 500; letter-spacing: 0.5px; }
.hhd-state-screen { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; text-align: center; padding: 40px 20px; gap: 16px; }
.hhd-state-icon { font-size: 48px; margin-bottom: 8px; }
.hhd-state-title { font-size: 20px; font-weight: 600; color: #f0f0f0; }
.hhd-state-sub { font-size: 14px; color: #555; max-width: 320px; line-height: 1.6; }
.hhd-progress-bar { width: 200px; height: 3px; background: #222; border-radius: 99px; overflow: hidden; margin-top: 12px; }
.hhd-progress-fill { height: 100%; background: linear-gradient(90deg, #f5c518, #e6b800); border-radius: 99px; transition: width 0.3s ease; }
.hhd-footer { text-align: center; padding: 20px; font-size: 11px; color: #333; border-top: 1px solid #1a1a1a; letter-spacing: 0.5px; }
`;
