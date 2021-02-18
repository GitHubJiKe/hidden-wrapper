import React, { useState } from "react";
import HiddenWrapper from "./components/HiddenWrapper";
import CompanyC from "./CompanyC";

import "./App.css";

export const hideCompanyIds = [1, 2, 5, 8, 12];

function App() {
  const [companyAId, setCompanyAId] = useState<number>(0);
  const [companyBId, setCompanyBId] = useState<number>(0);

  return (
    <div className="App">
      <header>
        <h1>HiddenWrapper</h1>
      </header>

      <div>需要隐藏的公司Id: {hideCompanyIds.join(",")}</div>
      <div>companyAId: {companyAId}</div>
      <div>companyBId: {companyBId}</div>

      <HiddenWrapper hidde={hideCompanyIds.includes(companyAId)}>
        <h2>公司A的视图</h2>
      </HiddenWrapper>
      <HiddenWrapper hidde={hideCompanyIds.includes(companyBId)}>
        <h2>公司B的视图</h2>
      </HiddenWrapper>
      <CompanyC />

      <button
        onClick={() => {
          setCompanyAId(2);
          setCompanyBId(0);
        }}
      >
        设置公司A Id
      </button>
      <button
        onClick={() => {
          setCompanyAId(0);
          setCompanyBId(2);
        }}
      >
        设置公司B Id
      </button>
    </div>
  );
}

export default App;
