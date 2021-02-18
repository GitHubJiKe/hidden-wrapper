import React from "react";
import { hideCompanyIds } from "../../App";
import HiddenWrapper from "../HiddenWrapper";

export default function withHiddenWrapper(Comp: React.FunctionComponent) {
  return function ({ ids }: { ids: number[] }) {
    return (
      <HiddenWrapper
        hidde={!!hideCompanyIds.filter((v) => ids.includes(v)).length}
      >
        <Comp />
      </HiddenWrapper>
    );
  };
}
