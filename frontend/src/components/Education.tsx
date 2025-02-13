import "../styles/education.scss";

const Education = () => {


  return (
    <div id="education">
      <div>
        <div className="between-lines">
          <div>
            <h1 className="education-header">Education</h1>
          </div>
        </div>
        <h1 className="second-header">
          Education and Training:<br />Building My Knowledge Foundation
        </h1>

        {/* Parent Container */}
        <div className="cards-wrapper">
          {/* First Card */}
          <div
            className="card education-card front"

          >
            <div className="card-content">
            <h2>Software Development</h2>
              <p>Sep 2023 - Dec 2023</p>
              <p>Saudi Digital Academy x Integrify. Software Development Bootcamp, MERN.</p>
            </div>
          </div>

          {/* Second Card */}
          <div
            className="card education-card behind"

          >
            <div className="card-content">
              <h2>Bachelor of Software Engineering</h2>
              <p>2018 - 2023</p>
              <p>University of Hail, Major in Software Engineering</p>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default Education;
