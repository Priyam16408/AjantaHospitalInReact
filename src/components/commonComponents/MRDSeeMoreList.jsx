import React, { Suspense } from "react";


const importComponent = (path) => {
  return React.lazy(() =>
    import(`../FrameMenu/MRD/${path}.jsx`)
      .then((module) => ({ default: module.default }))
      .catch(() => ({ default: () => <div>Component not found: {path}</div> }))
  );
};

export default function MRDSeeMoreList(BindFrameMenuByRoleIDS, data) {
  let seeMore = [];
  for (let i = 0; i < BindFrameMenuByRoleIDS?.length; i++) {
    const { URL, FileName } = BindFrameMenuByRoleIDS[i];

    const Component = importComponent(URL);
    const Obj = {
      name: FileName,
      component: (
        <div key={i}>
          <Suspense fallback={<div>Loading...</div>}>
            <Component data={data} FileName ={FileName} />
          </Suspense>
        </div>
      ),
    };

    seeMore.push(Obj);
  }

  return seeMore;
}
