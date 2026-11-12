export const sleep = (time) => new Promise((res) => setTimeout(res, time));

export const calculateWindowSize = (windowWidth) => {
  if (windowWidth >= 1200) {
    return "lg";
  }
  if (windowWidth >= 992) {
    return "md";
  }
  if (windowWidth >= 768) {
    return "sm";
  }
  return "xs";
};

export const setWindowClass = (classList) => {
  const window = document && document.getElementById("root");
  if (window) {
    // @ts-ignore
    window.classList = classList;
  }
};
export const addWindowClass = (classList) => {
  const window = document && document.getElementById("root");
  if (window) {
    // @ts-ignore
    window.classList.add(classList);
  }
};

export const removeWindowClass = (classList) => {
  const window = document && document.getElementById("root");
  if (window) {
    // @ts-ignore
    window.classList.remove(classList);
  }
};

export const toggleFullScreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
};







export const Tabfunctionality = (event) => {
  if (event.key === "Tab") {
    const currentInput = event.target;
    const inputs = Array.from(document.querySelectorAll("input[required]"));
    const currentIndex = inputs.findIndex((input) => input === currentInput);

    if (currentIndex !== -1) {
      const nextIndex = (currentIndex + 1) % inputs.length; // Get the index of the next required input
      inputs[nextIndex].focus(); // Focus on the next required input
      event.preventDefault(); // Prevent the default tab behavior
    }
  }
};

export const TruncatedLabel = (lable, length) => {
  if (typeof lable === "string" || typeof lable === "number") {
    const labelAsString = typeof lable === "number" ? lable.toString() : lable;
    if (length === undefined) {
      return labelAsString.length > 15
        ? labelAsString.substring(0, 15) + "..."
        : labelAsString;
    } else {
      return labelAsString.length > 8
        ? labelAsString.substring(0, 8) + "..."
        : labelAsString;
    }
  }
};
