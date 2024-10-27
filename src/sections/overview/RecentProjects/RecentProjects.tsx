import React, { useState } from 'react';
import './RecentProjects.css';

export default function RecentProjects() {
  const [activeIndex, setActiveIndex] = useState(null); // State để theo dõi item đang được nhấn

  // @ts-ignore
  const handleClick = (index) => {
    setActiveIndex(index); // Cập nhật index của item được nhấn
  };

  return (
      <div className="main-container">
        <div className="head">
          <span className="recent-projects-1">Recent Projects</span>
          <div className="icon">
            <div className="icon-2" />
          </div>
        </div>
        <div className="content">
          {[ // Mảng chứa thông tin dự án
            { name: 'Twitter App', iconClass: 'icon-4' },
            { name: 'Web Application Development', iconClass: 'icon-8' },
            { name: 'City Advertising Campaign', iconClass: 'icon-b' },
            { name: 'Facebook Application', iconClass: 'icon-e' },
          ].map((project, index) => (
              // eslint-disable-next-line react/button-has-type
              <button
                  key={index}
                  className={`item ${activeIndex === index ? 'active' : ''}`} // Thêm class 'active' nếu item đang được nhấn
                  onClick={() => handleClick(index)} // Gọi hàm khi item được nhấn
              >
                <span className="project-name">{project.name}</span>
                <div className="icon-3">
                  <div className={project.iconClass} />
                </div>
              </button>
          ))}
        </div>
      </div>
  );
}
