import React, { Suspense } from "react";
import PersonalDetailsOfPatient from "../FrameMenu/PersonalDetailsOfPatient";
import BillCloseUI from "./BillCloseUI";

const importComponent = (path) => {
  return React.lazy(() =>
    import(`../FrameMenu/${path}.jsx`)
      .then((module) => ({ default: module.default }))
      .catch(() => ({ default: () => <div>Component not found: {path}</div> }))
  );
};

export default function BillingSeeMoreList(BindFrameMenuByRoleIDS, data) {
  let seeMore = [];
  for (let i = 0; i < BindFrameMenuByRoleIDS?.length; i++) {
    const { URL, FileName } = BindFrameMenuByRoleIDS[i];

    const Component = importComponent(URL);
    const Obj = {
      name: FileName,
      component: (
        <div key={i}>
          <Suspense fallback={<div>Loading...</div>}>
            <PersonalDetailsOfPatient data={data} />
            {data?.isBilledClosed === "1" ?
              <BillCloseUI/>:
              <Component data={data} />}
          </Suspense>
        </div>
      ),
    };

    seeMore.push(Obj);
  }

  return seeMore;
}
