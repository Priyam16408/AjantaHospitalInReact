import React from "react";

const IconsColor = ({ ColorCode }) => {
  const ColorCodeIcon = (ColorCode) => {
    const icons = {
      0: (
        <svg
          width="20px"
          height="20px"
          viewBox="-2.4 -2.4 28.80 28.80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          stroke="#e1ff00"
        >
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            strokeLinecap="round"
            stroke-linejoin="round"
            stroke="#CCCCCC"
            stroke-width="4.8"
          >
            <path
              d="M6 12L18 12"
              stroke="#fff700"
              stroke-width="2.4"
              strokeLinecap="round"
              stroke-linejoin="round"
            ></path>
          </g>
          <g id="SVGRepo_iconCarrier">
            <path
              d="M6 12L18 12"
              stroke="#fff700"
              stroke-width="2.4"
              strokeLinecap="round"
              stroke-linejoin="round"
            ></path>
          </g>
        </svg>
      ),
      1: (
        <svg
          fill="#00a85f"
          version="1.1"
          id="Capa_1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          width="20px"
          height="20px"
          viewBox="-77 -77 504.00 504.00"
          xmlSpace="preserve"
          stroke="#00a85f"
          stroke-width="9.45"
          transform="matrix(1, 0, 0, 1, 0, 0)rotate(0)"
        >
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            strokeLinecap="round"
            stroke-linejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            {" "}
            <g>
              {" "}
              <g>
                {" "}
                <polygon points="40,310 40,0 0,0 0,350 350,350 350,310 "></polygon>{" "}
                <polygon points="218.623,195.004 271.438,119.425 253.165,106.656 322.534,74.229 315.939,150.522 297.668,137.755 227.994,237.459 153.407,194.118 97.979,266.002 72.639,246.461 145.21,152.345 "></polygon>{" "}
              </g>{" "}
            </g>{" "}
          </g>
        </svg>
      ),
      2: (
        <svg
          fill="#ff0000"
          version="1.1"
          id="Capa_1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          width="20px"
          height="20px"
          viewBox="-52.5 -52.5 455.00 455.00"
          xmlSpace="preserve"
          stroke="#ff0000"
          stroke-width="9.45"
        >
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            strokeLinecap="round"
            stroke-linejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            {" "}
            <g>
              {" "}
              <g>
                {" "}
                <polygon points="40,310 40,0 0,0 0,350 350,350 350,310 "></polygon>{" "}
                <polygon points="211.232,145.228 264.046,220.807 245.774,233.575 315.143,266.002 308.548,189.709 290.276,202.477 220.604,102.772 146.016,146.113 90.588,74.229 65.247,93.771 137.819,187.887 "></polygon>{" "}
              </g>{" "}
            </g>{" "}
          </g>
        </svg>
      ),
      Excel: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          width="30"
          height="30"
          viewBox="0 0 48 48"
        >
          <path
            fill="#169154"
            d="M29,6H15.744C14.781,6,14,6.781,14,7.744v7.259h15V6z"
          ></path>
          <path
            fill="#18482a"
            d="M14,33.054v7.202C14,41.219,14.781,42,15.743,42H29v-8.946H14z"
          ></path>
          <path fill="#0c8045" d="M14 15.003H29V24.005000000000003H14z"></path>
          <path fill="#17472a" d="M14 24.005H29V33.055H14z"></path>
          <g>
            <path
              fill="#29c27f"
              d="M42.256,6H29v9.003h15V7.744C44,6.781,43.219,6,42.256,6z"
            ></path>
            <path
              fill="#27663f"
              d="M29,33.054V42h13.257C43.219,42,44,41.219,44,40.257v-7.202H29z"
            ></path>
            <path
              fill="#19ac65"
              d="M29 15.003H44V24.005000000000003H29z"
            ></path>
            <path fill="#129652" d="M29 24.005H44V33.055H29z"></path>
          </g>
          <path
            fill="#0c7238"
            d="M22.319,34H5.681C4.753,34,4,33.247,4,32.319V15.681C4,14.753,4.753,14,5.681,14h16.638 C23.247,14,24,14.753,24,15.681v16.638C24,33.247,23.247,34,22.319,34z"
          ></path>
          <path
            fill="#fff"
            d="M9.807 19L12.193 19 14.129 22.754 16.175 19 18.404 19 15.333 24 18.474 29 16.123 29 14.013 25.07 11.912 29 9.526 29 12.719 23.982z"
          ></path>
        </svg>
      ),

      PDF: (
        <svg width="30" height="30" viewBox="0 0 24 24" fill="red">
          
          <path d="M8.267 14.68c-.184 0-.308.018-.372.036v1.178c.076.018.171.023.302.023.479 0 .774-.242.774-.651 0-.366-.254-.586-.704-.586zm3.487.012c-.2 0-.33.018-.407.036v2.61c.077.018.201.018.313.018.817.006 1.349-.444 1.349-1.396.006-.83-.479-1.268-1.255-1.268z" />
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM9.498 16.19c-.309.29-.765.42-1.296.42a2.23 2.23 0 01-.308-.018v1.426H7v-3.936A7.558 7.558 0 018.219 14c.557 0 .953.106 1.22.319.254.202.426.533.426.923-.001.392-.131.723-.367.948zm3.807 1.355c-.42.349-1.059.515-1.84.515-.468 0-.799-.03-1.024-.06v-3.917A7.947 7.947 0 0111.66 14c.757 0 1.249.136 1.633.426.415.308.675.799.675 1.504 0 .763-.279 1.29-.663 1.615zM17 14.77h-1.532v.911H16.9v.734h-1.432v1.604h-.906V14.03H17v.74zM14 9h-1V4l5 5h-4z" />
        </svg>
      ),
    };

    return icons[ColorCode];
  };
  return ColorCodeIcon(ColorCode);
};

export default IconsColor;
