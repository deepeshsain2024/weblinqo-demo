import React from "react";
import {
  DgCardOne,
  DgCardTwo,
  DgCardThree,
  DgCardFour,
} from "../../../../pages/user/digital-card/downloadable-templates";
import useUserStore from "../../../../stores/userStore";

const DownloadableTemplateSection = () => {
  const { userDcProfile } = useUserStore();
  return (
    // download template section in digital card tab
    <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 lg:gap-6 md:gap-6 gap-5 sm:p-4">
      {/* bussiness card templates */}
      <DgCardOne userDcProfile={userDcProfile} />
      <DgCardTwo userDcProfile={userDcProfile} />
      <DgCardThree userDcProfile={userDcProfile} />
      <DgCardFour userDcProfile={userDcProfile} />
    </div>
  );
};

export default DownloadableTemplateSection;
