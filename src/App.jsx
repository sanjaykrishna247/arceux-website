import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import MeetRobot from './components/MeetRobot.jsx';
import MissionDemo from './components/MissionDemo.jsx';
import ExplodedView from './components/ExplodedView.jsx';
import ComponentGrid from './components/ComponentGrid.jsx';
import Engineering from './components/Engineering.jsx';
import ArmPlayground from './components/ArmPlayground.jsx';
import NodeGraph from './components/NodeGraph.jsx';
import OperatorConsole from './components/OperatorConsole.jsx';
import Specs from './components/Specs.jsx';
import WhyItMatters from './components/WhyItMatters.jsx';
import Gallery from './components/Gallery.jsx';
import Roadmap from './components/Roadmap.jsx';
import Team from './components/Team.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <MeetRobot />
        <MissionDemo />
        <section id="hardware" aria-labelledby="hardware-title">
          <ExplodedView />
          <ComponentGrid />
        </section>
        <Engineering />
        <ArmPlayground />
        <NodeGraph />
        <OperatorConsole />
        <Specs />
        <WhyItMatters />
        <Gallery />
        <Roadmap />
        <Team />
      </main>
      <Footer />
    </>
  );
}
