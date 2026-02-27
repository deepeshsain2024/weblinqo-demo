import { useLocation } from "react-router-dom";
import TemplateSlider from "../../../components/slider/template-slider";
import DigitalCardSlider from "../../../components/slider/digital-card-slider";

const Templates = () => {
  const location = useLocation();

  return (
    
    <>
    <div className="bg-offWhite">
      {/* Displaying Template Card Slider */}
      <TemplateSlider />
      <hr className=" mt-10 md:mt-16"/>

      {/* Displaying Digitial Card Slider */}
      {location.pathname === "/templates" && <DigitalCardSlider />}
    </div>
    </>
  );
};

export default Templates;
