import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import {
  FaLinkedinIn,
  FaGlobe,
  FaEnvelope,
  FaPhone,
  FaFacebookF,
  FaYoutube,
  FaHome,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import api from "../../services/api";
import Avatar from "../../assets/avatar.jpg";
import logo from "../../assets/images/logos/logo-icon.png";
import useUserStore from "../../stores/userStore";
import SectionTitle from "../../pages/user/landing-page/section-title";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

// Custom Swiper styles
const swiperStyles = `
  .digital-card-swiper {
    padding: 0 60px;
  }
  
  .digital-card-swiper-button-prev,
  .digital-card-swiper-button-next {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: #2848f0;
    color: white;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .digital-card-swiper-button-prev:hover,
  .digital-card-swiper-button-next:hover {
    background: #2848d5;
    transform: translateY(-50%) scale(1.05);
  }
  
  .digital-card-swiper-button-prev {
    left: 16px;
  }
  
  .digital-card-swiper-button-next {
    right: 16px;
  }
  
  .digital-card-swiper-button-prev.swiper-button-disabled,
  .digital-card-swiper-button-next.swiper-button-disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  
  @media (max-width: 640px) {
    .digital-card-swiper {
      padding: 0 20px;
    }
    
    .digital-card-swiper-button-prev,
    .digital-card-swiper-button-next {
      width: 40px;
      height: 40px;
    }
    
    .digital-card-swiper-button-prev {
      left: 8px;
    }
    
    .digital-card-swiper-button-next {
      right: 8px;
    }
  }
`;

const DigitalCardSlider = () => {
  const [templates, setTemplates] = useState([]);
  const { isAuthenticated } = useUserStore();

  // Fetch templates
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await api.get("/api/v1/template/card");
        setTemplates(res.data.data);
      } catch (err) {
        console.error("Error fetching templates", err);
      }
    };
    fetchTemplates();
  }, []);

  return (
    <>
      <style>{swiperStyles}</style>
      <section className="bg-offWhite py-20 w-full max-w-7xl mx-auto px-4">
        <SectionTitle title={"Digital Cards"} style={"mt-[20px] mb-6"} color={"text-primary"} />

        {/* Swiper slider container */}    
        <div className="w-full relative">
          <Swiper
            modules={[Navigation]}
            spaceBetween={16}
            slidesPerView={1}
            navigation={{
              nextEl: ".digital-card-swiper-button-next",
              prevEl: ".digital-card-swiper-button-prev",
            }}
            breakpoints={{
              640: {
                slidesPerView: 1,
                spaceBetween: 16,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 24,
              },
              1280: {
                slidesPerView: 4,
                spaceBetween: 24,
              },
            }}
            className={`${window.innerWidth < 640 ? "digital-card-swiper" : ""}`}
          >
            {/* Map over templates to create Swiper slides */}
            {templates.map((template, idx) => (
              <SwiperSlide key={idx} className="px-0">
                <div className="rounded-xl relative overflow-hidden h-[500px]">
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 flex items-center justify-center rounded-xl transition-opacity z-10">
                    <a
                      href={isAuthenticated ? "/dashboard" : "/signup"}
                      className="bg-primary hover:bg-white text-white hover:text-primary border-2 border-primary font-semibold px-6 py-2.5 rounded-full transition-all duration-200 hover:scale-105"
                    >
                      Choose Template
                    </a>
                  </div>

                  {/* Card */}
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    {/* Top Section */}
                    <div
                      style={{ background: template.upperBgColor }}
                      className="text-center flex flex-col items-center p-6 py-8 rounded-t-xl relative"
                    >
                      <img
                        src={Avatar}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-white"
                      />
                      <h2
                        style={{ color: template.textColor }}
                        className="font-semibold text-lg mt-3"
                      >
                        {"Livia Schleifer"}
                      </h2>

                      {/* Social Links */}
                      <div className="absolute flex justify-center gap-4 bottom-[-15px]">
                        <a href={template.facebookUrl || "#"} className="bg-white p-2 rounded-full shadow hover:scale-105 transition">
                          <FaFacebookF className="text-blue-600" />
                        </a>
                        <a href={template.linkedinUrl || "#"} className="bg-white p-2 rounded-full shadow hover:scale-105 transition">
                          <FaLinkedinIn className="text-blue-700" />
                        </a>
                        <a href={template.twitterUrl || "#"} className="bg-white p-2 rounded-full shadow hover:scale-105 transition">
                          <FaXTwitter className="text-black" />
                        </a>
                        <a href={template.youtubeUrl || "#"} className="bg-white p-2 rounded-full shadow hover:scale-105 transition">
                          <FaYoutube className="text-red-600" />
                        </a>
                      </div>
                    </div>

                    {/* Bottom Section */}
                    <div style={{ background: template.bottomBgColor }}>
                      <div className="py-8 pb-2 px-4 space-y-3">
                        <div className="flex items-start gap-3 bg-white p-3 rounded-lg shadow">
                          <FaHome className="text-blue-600 text-size-14" />
                          <span className="text-size-12 text-gray-700">{template.address || "Address"}</span>
                        </div>
                        <div className="flex items-center gap-3 bg-white p-3 rounded-lg shadow">
                          <FaEnvelope className="text-blue-600 text-size-14" />
                          <span className="text-size-12 text-gray-700">{template.email || "Email"}</span>
                        </div>
                        <div className="flex items-center gap-3 bg-white p-3 rounded-lg shadow">
                          <FaPhone className="text-blue-600 text-size-14" />
                          <span className="text-size-12 text-gray-700">{template.phone || "Phone"}</span>
                        </div>
                        <div className="flex items-center gap-3 bg-white p-3 rounded-lg shadow">
                          <FaGlobe className="text-blue-600 text-size-14" />
                          <span className="text-size-12 text-gray-700">{template.website || "Website"}</span>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="py-2 px-4 flex justify-center items-center">
                        <img src={logo} alt="logo" className="h-10 object-contain" />
                        {/* <h1 className="text-2xl font-bold text-gray-900">Weblinqo</h1> */}
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <button className="digital-card-swiper-button-prev absolute -translate-y-1/2 left-0 z-10 bg-[#2848f0] text-white hover:bg-[#2848d5] hover:text-[#fff] rounded-full p-3 shadow-md transition cursor-pointer">
            <FaArrowLeft />
          </button>
          <button className="digital-card-swiper-button-next absolute -translate-y-1/2 right-0 md:-right-4 z-10 bg-[#2848f0] text-white hover:bg-[#2848d5] hover:text-[#fff] rounded-full p-3 shadow-md transition cursor-pointer">
            <FaArrowRight />
          </button>

        </div>
      </section>
    </>
  );
};

export default DigitalCardSlider;
