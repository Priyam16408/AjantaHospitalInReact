import React, { useState, useRef, useEffect, useLayoutEffect } from "react";

const ChipAutocomplete = ({
  chips = [],
  inputValue = "",
  suggestions = [],
  onInputChange,
  onSearch,
  onSelect,
  onRemove,
  onUpdate,
  onFocus,
  placeholder = "Type and Press Enter",
  disabled = false,
  name,
  id,
  maxLength,
  itemTemplate,
}) => {
  // debugger
  const [isFocused, setIsFocused] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [dropdownLeft, setDropdownLeft] = useState(0);

  const inputRef = useRef(null);
  const editInputRef = useRef(null);
  const dropdownRef = useRef(null);
  const containerRef = useRef(null);
  // debugger
  // Styles
  const styles = {
    container: {
      width: "70%",
      position: "relative",
    },
    wrapper: {
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      gap: "4px",
      padding: "4px",
      background: disabled ? "#e9ecef" : "white",
      border: isFocused ? "1px solid #66afe9" : "1px solid #ccc",
      borderRadius: "3px",
      minHeight: "38px",
      cursor: disabled ? "not-allowed" : "text",
      boxShadow: isFocused
        ? "inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102, 175, 233, .6)"
        : "inset 0 1px 2px rgba(0,0,0,0.05)",
      transition: "border-color ease-in-out .15s, box-shadow ease-in-out .15s",
    },
    input: {
      //   flex: 1,
      border: "none",
      outline: "none",
      fontSize: "14px",
      padding: "6px 4px",
      // minWidth: "80px",
      color: "#333",
      background: isFocused ? "#FFFFC5" : "white",
      height: "auto",
    },
    chip: {
      display: "inline-flex",
      alignItems: "center",
      backgroundColor: "#ffffd0", // Yellow sticky note
      color: "#000",
      border: "1px solid #d0d090",
      borderRadius: "0",
      padding: "2px 6px",
      fontSize: "13px",
      fontWeight: "600",
      height: "auto",
      cursor: "default",
      boxShadow: "1px 1px 2px rgba(0,0,0,0.1)",
      userSelect: "none",
      maxWidth: "100%",
    },
    chipEditing: {
      backgroundColor: "#fff",
      border: "1px dashed #666",
      boxShadow: "none",
      padding: "2px 6px",
    },
    chipText: {
      marginRight: "5px",
      cursor: "text",
      whiteSpace: "normal",
      overflow: "hidden",
      textOverflow: "ellipsis",
      maxWidth: "100%",
    },
    chipRemove: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      color: "#999900",
      fontSize: "16px",
      fontWeight: "bold",
      lineHeight: "1",
      marginLeft: "2px",
    },
    dropdown: {
      listStyle: "none",
      padding: "0",
      margin: "1px 0 0 0",
      background: "white",
      border: "1px solid #aaa",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
      position: "absolute",
      top: "100%",
      left: `${dropdownLeft}px`, // Dynamic Left Position
      minWidth: "200px",
      maxWidth: "400px",
      maxHeight: "300px",
      overflowY: "auto",
      zIndex: 9999,
    },
    item: {
      padding: "8px 12px",
      fontSize: "13px",
      color: "#333",
      cursor: "pointer",
      minHeight: "10px",
      display: "flex",
      alignItems: "center",
    },
    itemSelected: {
      backgroundColor: "#e6f7ff",
      color: "#000",
    },
  };

  // --- FIX: Dynamic Positioning ---
  useLayoutEffect(() => {
    // Determine which input is active (the main one or an edit one)
    const activeInput =
      editingIndex !== null ? editInputRef.current : inputRef.current;

    if (activeInput && containerRef.current) {
      const inputRect = activeInput.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      const relativeLeft = inputRect.left - containerRect.left;

      // Ensure it doesn't go off-screen (basic check)
      setDropdownLeft(Math.max(0, relativeLeft));
    }
  }, [inputValue, editingIndex, isFocused, chips, editValue]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsFocused(false);
        if (editingIndex !== null) {
          setEditingIndex(null);
          setEditValue("");
          if (onSearch) onSearch({ query: "" });
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [editingIndex, editValue, chips, onSearch]);

  useEffect(() => {
    if (editingIndex !== null && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingIndex]);
  // const handleKeyDown = (e) => {
  //   if (e.key === "ArrowDown") {
  //     e.preventDefault();
  //     setFocusedIndex((prev) =>
  //       prev < suggestions.length - 1 ? prev + 1 : prev
  //   );
  // } else if (e.key === "ArrowUp") {
  //   e.preventDefault();
  //   setFocusedIndex((prev) => (prev > 0 ? prev - 1 : -1));
  // } else if (e.key === "Enter") {
  //     // debugger
  //     e.preventDefault();
  //     if (focusedIndex >= 0 || suggestions[focusedIndex]) {
  //       handleSelect(suggestions[focusedIndex]);
  //     } else if (inputValue.trim() !== "") {
  //       handleSelect({ ValueField: inputValue.trim() });
  //     }
  //   } else if (e.key === "Escape") {
  //     setIsFocused(false);
  //     if (onSearch) onSearch({ query: "" });
  //   }
  // };

  // priyam
  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter") {
      e.preventDefault();

      if (focusedIndex >= 0 && suggestions[focusedIndex]) {
        handleSelect(suggestions[focusedIndex]);
      } else if (inputValue.trim() !== "") {
        handleSelect({
          ValueField: inputValue.trim(),
          isCustom: true,
        });
      }
    } else if (e.key === "Escape") {
      setIsFocused(false);
      if (onSearch) onSearch({ query: "" });
    }
  };

  // const handleKeyDown = (e) => {

  //   // if (e.key === "Backspace" && inputValue === "" && chips.length > 0) {
  //   //   onRemove(chips.length - 1);
  //   // } else
  //   if (e.key === "ArrowDown") {
  //     e.preventDefault();
  //     setFocusedIndex((prev) =>
  //       prev < suggestions.length - 1 ? prev + 1 : prev
  //     );
  //   } else if (e.key === "ArrowUp") {
  //     e.preventDefault();
  //     setFocusedIndex((prev) => (prev > 0 ? prev - 1 : -1));
  //   } else if (e.key === "Enter" || e.key === "Tab") {
  //       debugger;
  //     e.preventDefault();
  //     if (focusedIndex >= 0 && suggestions[focusedIndex]) {
  //       handleSelect(suggestions[focusedIndex]);
  //     } else if (inputValue.trim() !== "") {
  //       handleSelect({ ValueField: inputValue.trim() });
  //     }
  //     if (inputRef.current) inputRef.current.focus();
  //   } else if (e.key === "Escape") {
  //     setIsFocused(false);
  //     if (onSearch) onSearch({ query: "" });
  //   }
  // };

  const startEditing = (index, e) => {
    e.stopPropagation();
    if (disabled) return;
    setEditingIndex(index);
    const val = chips[index]?.ValueField || chips[index]?.TypeName || "";
    setEditValue(val);
    if (onSearch) onSearch({ query: val });
  };

  const finishEditing = (index, overrideValue = null) => {
    const val = overrideValue !== null ? overrideValue : editValue;
    if (val && (typeof val === "object" || val.trim() !== "")) {
      onUpdate(index, typeof val === "string" ? val.trim() : val);
    }
    setEditingIndex(null);
    setEditValue("");
    if (onSearch) onSearch({ query: "" });
  };

  const handleEditKeyDown = (e, index) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (focusedIndex >= 0 && suggestions[focusedIndex]) {
        const selectedItem = suggestions[focusedIndex];
        finishEditing(index, selectedItem);
        if (inputRef.current) inputRef.current.focus();
      } else {
        finishEditing(index);
        if (inputRef.current) inputRef.current.focus();
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Escape") {
      setEditingIndex(null);
      if (onSearch) onSearch({ query: "" });
      if (inputRef.current) inputRef.current.focus();
    }
  };

  const handleInputChange = (e) => {
    onInputChange(e);
    if (onSearch) {
      onSearch({ query: e.target.value });
    }
    setIsFocused(true);
  };

  const handleEditInputChange = (e) => {
    setEditValue(e.target.value);
    if (onSearch) {
      onSearch({ query: e.target.value });
    }
  };

  const handleMainInputFocus = (e) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleSelect = (item) => {
    onSelect({ value: item });
    setFocusedIndex(-1);
    if (onSearch) onSearch({ query: "" });
  };
  //  const handleBlur = () => {
  //   setTimeout(() => {
  //     setIsFocused(false);
  //     if (onSearch) onSearch({ query: "" });
  //   }, 120);
  // };
  const handleBlur = (e) => {
    setTimeout(() => {
      // if (focusedIndex >= 0 || suggestions[focusedIndex]) {
      //   handleSelect(suggestions[focusedIndex]);

      // }
      // else if (inputValue.trim() !== "") {
      //   handleSelect({ ValueField: inputValue.trim() });
      // }
      if (inputValue.trim() !== "") {
        handleSelect({ ValueField: inputValue.trim() });
      }
      setIsFocused(false);
      if (onSearch) onSearch({ query: "" });
    }, 100);
  };
  return (
    <div style={styles.container} ref={containerRef}>
      <div
        style={styles.wrapper}
        onClick={() => {
          if (!disabled && editingIndex === null) inputRef.current?.focus();
        }}
      >
        {chips.map((chip, index) => (
          <div
            key={index}
            style={{
              ...styles.chip,
              ...(editingIndex === index ? styles.chipEditing : {}),
            }}
          >
            {editingIndex === index ? (
              <input
                ref={editInputRef}
                type="text"
                value={editValue}
                onChange={handleEditInputChange}
                onKeyDown={(e) => handleEditKeyDown(e, index)}
                onBlur={() => finishEditing(index)}
                style={{
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontSize: "13px",
                  fontWeight: "600",
                  padding: 0,
                  minWidth: "20px",
                  width: `${Math.max(editValue.length, 1) + 2}ch`,
                }}
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span
                style={styles.chipText}
                onClick={(e) => startEditing(index, e)}
                title="Click to edit"
              >
                {chip?.ValueField || chip?.TypeName}
              </span>
            )}

            {editingIndex !== index && !disabled && (
              <div
                style={styles.chipRemove}
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(index);
                }}
              >
                ×
              </div>
            )}
          </div>
        ))}

        <input
          ref={inputRef}
          id={id}
          name={name}
          type="text"
          style={styles.input}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleMainInputFocus}
          placeholder={chips.length === 0 ? placeholder : ""}
          disabled={disabled}
          maxLength={maxLength}
          autoComplete="off"
          onBlur={handleBlur}
        />
      </div>

      {((isFocused && suggestions.length > 0) ||
        (editingIndex !== null && suggestions.length > 0)) && (
        <ul style={styles.dropdown} ref={dropdownRef}>
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              style={{
                ...styles.item,
                ...(index === focusedIndex ? styles.itemSelected : {}),
              }}
              onMouseDown={(e) => {
                e.preventDefault(); // Prevent blur

                if (editingIndex !== null) {
                  // FIX: Update existing chip with FULL object
                  finishEditing(editingIndex, suggestion);
                } else {
                  // Add new chip
                  handleSelect(suggestion);
                  setTimeout(() => inputRef.current?.focus(), 10);
                }
              }}
              onMouseEnter={() => setFocusedIndex(index)}
            >
              {itemTemplate
                ? itemTemplate(suggestion)
                : suggestion.TemplateName || suggestion.TypeName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChipAutocomplete;
