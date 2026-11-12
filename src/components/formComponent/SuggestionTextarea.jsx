import React, { useState, useRef, useEffect } from "react";

const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), delay);
    };
};

const SuggestionTextarea = ({
    value,
    onChange,
    suggestions = [],
    placeholder = "Type here...",
    className = "",
    name,
    onFocus,
    ...rest
}) => {
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [inputValue, setInputValue] = useState(value || "");

    const textareaRef = useRef(null);
    const wrapperRef = useRef(null);

    useEffect(() => {
        setInputValue(value || "");
    }, [value]);

    function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

    const filterSuggestions = debounce((term) => {
        const normalizedValue = inputValue.toLowerCase();

        const filtered = suggestions.filter((item) => {
            const normalizedItem = item.toLowerCase().trim();
            const safeItem = escapeRegex(normalizedItem); // ✅ Escape here
            const regex = new RegExp(`\\b${safeItem}\\b`, "i");

            return (
                normalizedItem.includes(term.toLowerCase()) &&
                !regex.test(normalizedValue)
            );
        });

        setFilteredSuggestions(filtered.slice(0, 10));
    }, 200);



    const handleFocus = () => {
        const word = getCurrentWord(inputValue);
        filterSuggestions(word);
        setShowDropdown(true);
    };

    const handleInputChange = (e) => {
        const val = e.target.value;
        setInputValue(val);
        onChange({
            target: {
                name,
                value: val,
            },
        });

        const word = getCurrentWord(val);
        filterSuggestions(word);
    };

    const getCurrentWord = (text) => {
        const position = textareaRef.current?.selectionStart || 0;
        const textUntilCursor = text.slice(0, position);
        const words = textUntilCursor.split(/\s/);
        return words[words.length - 1];
    };
    const insertAtCursor = (text) => {
        const normalizedText = text.toLowerCase().trim();
        const safeText = escapeRegex(normalizedText);
        const regex = new RegExp(`\\b${safeText}\\b`, "i");

        if (regex.test(inputValue.toLowerCase())) {
            console.log("⛔ Duplicate value detected, not inserting:", text);
            setShowDropdown(false);
            return;
        }

        const textarea = textareaRef.current;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        const valueBefore = inputValue.substring(0, start);
        const valueAfter = inputValue.substring(end);

        const newValue =
            valueBefore.replace(/\S+$/, "") + text + " " + valueAfter;

        setInputValue(newValue);
        onChange({
            target: {
                name,
                value: newValue,
            },
        });

        setShowDropdown(false);

        setTimeout(() => {
            textarea.focus();
            const newPos = valueBefore.length - (valueBefore.match(/\S+$/)?.[0]?.length || 0) + text.length + 1;
            textarea.setSelectionRange(newPos, newPos);
        }, 0);
    };




    useEffect(() => {
        const handleClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("pointerdown", handleClickOutside);
        return () => {
            document.removeEventListener("pointerdown", handleClickOutside);
        };
    }, []);

    return (
        <div className={'custom-textarea-wrapper'} ref={wrapperRef}>
            <textarea
                ref={textareaRef}
                className={`custom-suggestion-textarea ${className}`}
                value={inputValue}
                onChange={handleInputChange}
                // onFocus={handleFocus}
                onFocus={(e) => {
                    handleFocus();
                    if (onFocus) onFocus(e);
                }}
                placeholder={placeholder}
                name={name}
                {...rest}
            />
            <div
                className={`custom-suggestion-dropdown ${showDropdown && filteredSuggestions.length ? "" : "hidden"
                    }`}
            >
                {filteredSuggestions.map((sugg, idx) => (
                    <div
                        key={idx}
                        className="custom-suggestion-item"
                        onClick={() => insertAtCursor(sugg)}
                    >
                        {sugg}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SuggestionTextarea;
