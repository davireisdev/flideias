import BackgroundGlow from './components/layout/BackgroundGlow'
import CursorGlow from './components/layout/CursorGlow'
import Navbar from './components/layout/Navbar'
import ClosingSection from './sections/ClosingSection'
import FormSection from './sections/FormSection'
import IntroSection from './sections/IntroSection'

export default function App() {
  return (
    <>
      <BackgroundGlow />
      <CursorGlow />
      <Navbar />
      <main>
        <IntroSection />
        <FormSection />
        <ClosingSection />
      </main>
    </>
  )
}
