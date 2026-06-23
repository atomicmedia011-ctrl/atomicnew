import {
    jsx as _jsx
} from "react/jsx-runtime";
import {
    addPropertyControls,
    ControlType
} from "framer";
/**
 * @framerDisableUnlink
 */
function TagsOrganizer({
    words = "Demo, Framer, Pixco, Component",
    links = "",
    borderWidth = 1,
    borderRadius = 4,
    borderColor = "#000000",
    paddingTop = 8,
    paddingRight = 8,
    paddingBottom = 8,
    paddingLeft = 8,
    gap = 8,
    textColor = "rgb(255, 255, 255)",
    fillColor = "transparent",
    font = {
        fontFamily: "Inter",
        fontSize: 16
    },
    alignment = "left",
    innerStrokeColor = null
}) {
    const wordArray = words.split(",").map(word => word.trim()); // Split links using comma and trim spaces
    const linkArray = links ? links.split(",").map(link => link.trim()) : []; // Function to get word item style
    function getWordItemStyle() {
        return {
            border: `${borderWidth}px solid ${borderColor}`,
            borderRadius: `${borderRadius}px`,
            padding: `${paddingTop}px ${paddingRight}px ${paddingBottom}px ${paddingLeft}px`,
            color: textColor,
            backgroundColor: fillColor,
            boxShadow: innerStrokeColor ? `inset 0 0 0 1px ${innerStrokeColor}` : "none",
            fontFamily: font ? .fontFamily || "Inter",
            fontSize: font ? .fontSize || "16px",
            fontWeight: font ? .fontWeight || 400,
            lineHeight: font ? .lineHeight || "1.2",
            letterSpacing: font ? .letterSpacing || "normal",
            textAlign: font ? .textAlign || "left",
            fontStyle: font ? .fontStyle || "normal",
            display: "inline-flex",
            alignItems: "center",
            whiteSpace: "nowrap",
            boxSizing: "border-box"
        };
    }
    return /*#__PURE__*/ _jsx("div", {
        style: {
            display: "flex",
            flexWrap: "wrap",
            gap: `${gap}px`,
            width: "100%",
            justifyContent: alignment === "left" ? "flex-start" : alignment === "right" ? "flex-end" : "center"
        },
        children: wordArray.map((word, index) => {
            const link = linkArray[index];
            return link ? /*#__PURE__*/ _jsx("a", {
                href: link,
                style: {
                    textDecoration: "none"
                },
                target: "_blank",
                rel: "noopener noreferrer",
                children: /*#__PURE__*/ _jsx("div", {
                    style: getWordItemStyle(),
                    children: word
                })
            }, index) : /*#__PURE__*/ _jsx("div", {
                style: getWordItemStyle(),
                children: word
            }, index);
        })
    });
}
export {
    TagsOrganizer
};
export default TagsOrganizer;
addPropertyControls(TagsOrganizer, {
    words: {
        type: ControlType.String,
        title: "Tags",
        defaultValue: "Demo, Framer, Pixco, Component"
    },
    links: {
        type: ControlType.String,
        title: "Links",
        defaultValue: "",
        placeholder: "https://pixcodrops.com, https://google.com"
    },
    alignment: {
        type: ControlType.Enum,
        title: "Alignment",
        options: ["left", "center", "right"],
        optionTitles: ["Left", "Center", "Right"],
        defaultValue: "center"
    },
    gap: {
        type: ControlType.Number,
        title: "Gap",
        defaultValue: 12,
        min: 0,
        max: 50
    },
    fillColor: {
        type: ControlType.Color,
        title: "Fill Color",
        defaultValue: "#31134D"
    },
    borderWidth: {
        type: ControlType.Number,
        title: "Border Width",
        defaultValue: 1,
        min: 0,
        max: 10,
        displayStepper: true
    },
    borderRadius: {
        type: ControlType.Number,
        title: "Border Radius",
        defaultValue: 10,
        min: 0,
        max: 50
    },
    borderColor: {
        type: ControlType.Color,
        title: "Border Color",
        defaultValue: "#000000"
    },
    innerStrokeColor: {
        type: ControlType.Color,
        title: "Inner Stroke",
        defaultValue: "#702FAD"
    },
    paddingTop: {
        type: ControlType.Number,
        title: "Padding Top",
        defaultValue: 8,
        min: 0,
        max: 50,
        displayStepper: true
    },
    paddingRight: {
        type: ControlType.Number,
        title: "Padding Right",
        defaultValue: 10,
        min: 0,
        max: 50,
        displayStepper: true
    },
    paddingBottom: {
        type: ControlType.Number,
        title: "Padding Bottom",
        defaultValue: 8,
        min: 0,
        max: 50,
        displayStepper: true
    },
    paddingLeft: {
        type: ControlType.Number,
        title: "Padding Left",
        defaultValue: 10,
        min: 0,
        max: 50,
        displayStepper: true
    },
    font: {
        type: ControlType.Font,
        title: "Font",
        controls: "extended",
        displayFontSize: true,
        displayTextAlignment: true,
        defaultFontType: "sans-serif",
        defaultValue: {
            fontFamily: "Inter",
            fontSize: 16,
            fontWeight: 400,
            lineHeight: "1",
            letterSpacing: "normal",
            textAlign: "left",
            fontStyle: "normal"
        }
    },
    textColor: {
        type: ControlType.Color,
        title: "Text Color",
        defaultValue: "#E3C4FF",
        description: "Discover more Framer resources at [Pixco](https://pixcodrops.com/resources)"
    }
});
export const __FramerMetadata__ = {
    "exports": {
        "default": {
            "type": "reactComponent",
            "name": "TagsOrganizer",
            "slots": [],
            "annotations": {
                "framerDisableUnlink": "",
                "framerContractVersion": "1"
            }
        },
        "TagsOrganizer": {
            "type": "reactComponent",
            "name": "TagsOrganizer",
            "slots": [],
            "annotations": {
                "framerContractVersion": "1",
                "framerDisableUnlink": ""
            }
        },
        "__FramerMetadata__": {
            "type": "variable"
        }
    }
}
//# sourceMappingURL=./TagsOrganizer.map