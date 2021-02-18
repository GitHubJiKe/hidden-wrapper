import React, { useState } from "react";
import withHiddenWrapper from "./components/withHiddenWrapper";

function CompanyCView() {
  return <h2>公司C的视图</h2>;
}

const HigerCompanyC = withHiddenWrapper(CompanyCView);

const CompanyC = () => {
  const [companyCIds, setCompanyCIds] = useState<number[]>([]);

  return (
    <>
      <div>companyCIds: {companyCIds.join(",")}</div>
      <HigerCompanyC ids={companyCIds} />
      <button
        onClick={() => {
          if (companyCIds.length === 0) {
            setCompanyCIds([0, 1, 2]);
          } else {
            setCompanyCIds([]);
          }
        }}
      >
        设置公司C Ids
      </button>
    </>
  );
};

export default CompanyC;
