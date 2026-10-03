// Fixed decorative gradient blobs shared by the whole page.
export default function BackgroundGlow() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-base-950"
    >
      <div className="absolute -top-40 left-1/2 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-accent-600/25 blur-[120px]" />
      <div className="absolute top-1/3 -right-32 h-[26rem] w-[26rem] rounded-full bg-glow-400/10 blur-[120px]" />
      <div className="absolute bottom-0 -left-32 h-[26rem] w-[26rem] rounded-full bg-accent-500/15 blur-[120px]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,var(--color-base-950))]" />
    </div>
  )
}
