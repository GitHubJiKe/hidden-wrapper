# HiddenWrapper

> 在真实的业务场景下，面对不同客户的不同的定制化需求，在最初的时候使用简单的判断皆可以轻松解决。
> 但是随着业务的增长，客户量的增加，定制化需求的扩增，在同一个项目内使用大量的判断去解决定制化需求，就有点不合适了。
> 为此，在原有代码的基础上，最低限度的修改代码实现定制化需求，就成了一个棘手的问题。
> 为解决此问题，特做了以下组件式的探索。

**注：** 此方案仅解决 UI 层面上的定制化。大致场景就是不同权限和或者公司的用户登录系统需要看到不同的 UI 展示或者不同的模块的视图。

## 最初的套路

```typescript
function App(){
  const children = null;

  if（id===companyAId）{
    children = <CompanyA/>
  }

  if（id===companyBId）{
    children = <CompanyB/>
  }

  if（id===companyCId）{
    children = <CompanyC/>
  }

  return <div>{children}</div>
}
```

简单粗暴，逻辑清晰直接，一目了然。但是当公司量多的时候，大量的判断就显得不那么优雅了，以及如果不同公司之间的视图再有重用的部分，并不是完全的割裂和不同，那就面临着更加复杂的条件判断和布局写法。

而且当有新的公司加入的时候，需要改动的代码较多，对于已经成型且线上运行的项目而言，维护起来比较麻烦。

## 组件化的解决方案

```typescript
import React from "react";

interface IHiddenWrapperProps {
  hidde: boolean;
  children: React.ReactNode;
  showPlaceholder?: boolean;
  placeholder?: React.ReactNode;
}

export default function HiddenWrapper({
  hidde,
  children,
  showPlaceholder = false,
  placeholder,
}: IHiddenWrapperProps) {
  return hidde ? showPlaceholder ? <>{placeholder}</> : null : <>{children}</>;
}
```

可以看到，HiddenWrapper 是一个非常简单的逻辑性组件，接收 hidde 和 children 属性，当 hidde 为 true 的时候，隐藏 children。

以及基于 HiddenWrapper 的高阶组件 withHiddenWrapper:

```typescript
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
```

具体代码中使用：

```typescript
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
```

未处理的 CompanyC:

```typescript
import React from "react";
export default function CompanyC() {
  return <h2>公司C的视图</h2>;
}
```

高阶组件处理 CompanyC:

```typescript
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
```

可以看出，只需要对定制化的模块或者组件通过 HiddenWrapper 包裹，或者使用高阶组件预处理模块或组件，也可以通过传入条件来实现是否隐藏目标 UI 的效果。

## 结语

此处代码仅作为思路的具象化，具体业务中使用的代码，可根据需要定制。

对于已经上线运行的项目而言，随着业务量的扩张，定制化需求的激增带来了近乎无穷尽的定制化开发的反复性工作，频繁的更改代码和发版部署，给项目的稳定性带来了风险，也给项目引入 bug 提供了机会，为此，最低限度的更改代码、非入侵式的改动代码就是后期更新项目，满足定制化需求的目标和方向。

组件化方案恰恰满足于该场景，通过组件的包裹，将展示与否的逻辑内联到容器组件内，甚至通过高阶组件对已存在的组件或模块预处理后，仅仅传入条件值即可实现定制化，从源头上解决了改动代码带来的不可控风险。
