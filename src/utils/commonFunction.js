
export const validateDecimalInput = (
  value,
  maxDigitsBeforeDot = 13,
  maxDigitsAfterDot = 2
) => {
  const regex = new RegExp(
    `^\\d{0,${maxDigitsBeforeDot}}(\\.\\d{0,${maxDigitsAfterDot}})?$`
  );
  return regex.test(value) || value === "";
};

export const handleDecimalKeyDown = (e, maxDigitsAfterDot = 2) => {
  const allowedKeys = [
    "Backspace",
    "Tab",
    "ArrowLeft",
    "ArrowRight",
    "Delete",
    "Home",
    "End",
  ];

  if (
    allowedKeys.includes(e.key) ||
    /^[0-9.]$/.test(e.key)
  ) {
    const value = e.currentTarget.value;
    const selectionStart = e.currentTarget.selectionStart;
    const decimalIndex = value.indexOf(".");

    // Prevent multiple dots
    if (e.key === "." && value.includes(".")) {
      e.preventDefault();
    }

    // Prevent more than allowed decimal places
    if (
      decimalIndex !== -1 &&
      selectionStart > decimalIndex &&
      value.split(".")[1]?.length >= maxDigitsAfterDot &&
      !["Backspace", "Delete"].includes(e.key)
    ) {
      e.preventDefault();
    }
  } else {
    e.preventDefault(); // block everything else
  }
};
