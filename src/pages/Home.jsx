import Navbar from '../components/Navbar.jsx'
import Hero from '../components/Hero.jsx'
import Timeline from '../components/Timeline.jsx'
import Certifications from '../components/Certifications.jsx'
import Courses from '../components/Courses.jsx'
import Projects from '../components/Projects.jsx'
import Skills from '../components/Skills.jsx'
import Gallery from '../components/Gallery.jsx'
import Contact from '../components/Contact.jsx'
import Footer from '../components/Footer.jsx'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Timeline />
        <Certifications />
        <Courses />
        <Projects />
        <Skills />
        <Gallery />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
