import AboutPage from './AboutPage';
import NewsPage from './NewsPage';
import FiliersPage from './FiliersPage';
import HeroBanner from '../components/layout/HeroBanner';

export default function HomPages() {
  return (
    <>
      <HeroBanner />
      {/*<StatsSection />*/}
      <div className="w-full">
        <AboutPage compact />
        <NewsPage />
        <FiliersPage showMission />
      </div>
    </>
  );
}
