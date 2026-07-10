import StatsSection from '../components/layout/StatsSection';
import AboutPage from './AboutPage';
import NewsPage from './NewsPage';
import FiliersPage from './FiliersPage';
import HeroBanner from '../components/layout/HeroBanner';
import PresidentMessageSection from '../components/layout/PresidentMessageSection';

export default function HomPages() {
  return (
    <>
      <HeroBanner />
      <StatsSection />
      <div className="w-full px-12 py-5">
        <AboutPage />
        <PresidentMessageSection />
        <NewsPage />
        <FiliersPage />
      </div>
    </>
  );
}


