import { useEffect, useState } from "react";
import "../styles/dashboard.scss";

const Dashboard = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="dashboard">
      <div className="header__container">
        <h1 className="dashboard__title">
          Code with Passion Build with Precision
        </h1>
      </div>

      <div className="dashboard__container">
        <aside className="dashboard__sidebar">
          <div>
            <img
              className="logo-white"
              src="/logo-white.svg"
              alt="Logo in white"
            />
            <ul>
              <li>
                <img src="/recently.svg" alt="Recently icon" /> Recently
              </li>
              <li>
                <img src="/repo.svg" alt="Repository icon" /> Repositories
              </li>
              <li>
                <img src="/component.svg" alt="Components icon" /> Components
              </li>
              <li>
                <img src="/social-media.svg" alt="Social Media icon" /> Social
                Media News
              </li>
            </ul>
          </div>

          <div className="dashboard__user">Shahad Athawa</div>
        </aside>
        <main className="dashboard__content">
          {[...Array(isMobile ? 3 : 9)].map((_, index) => (
            <div key={index} className="dashboard__card">
              <div className="image-container"></div>
              <div className="dashboard__card-content">
                <p>Card Title Here</p>
              </div>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
};
export default Dashboard;
