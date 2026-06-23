import {
    jsx as _jsx
} from "react/jsx-runtime";
import {
    addPropertyControls,
    ControlType
} from "framer";
const currentYear = new Date().getFullYear();
/**
 * @framerDisableUnlink
 *
 * @framerSupportedLayoutWidth any-prefer-auto
 * @framerSupportedLayoutHeight any-prefer-auto
 */
export default function AutoCopyright(props) {
    const {
        name,
        statement,
        dateRange,
        startYear,
        font,
        color,
        fontSize
    } = props;
    const yearDisplay = dateRange ? `${startYear}-${currentYear}` : currentYear;
    let displayText = `\xa9 ${yearDisplay} ${name.trim()}`;
    if (statement.trim()) {
        displayText += ` ${statement.trim()}`;
    }
    const textStyle = {
        fontSize: `${fontSize}px`,
        color: color,
        ...font
    };
    return /*#__PURE__*/ _jsx("div", {
        style: textStyle,
        children: displayText
    });
}
AutoCopyright.defaultProps = {
    name: "Your Name",
    statement: "All rights reserved.",
    dateRange: false,
    startYear: currentYear - 1,
    color: "#999999",
    fontSize: 14,
    font: {
        family: "Inter"
    }
};
AutoCopyright.displayName = "Auto Copyright";
addPropertyControls(AutoCopyright, {
    font: {
        type: ControlType.Font,
        title: "Font",
        defaultValue: "Inter",
        controls: "extended"
    },
    color: {
        type: ControlType.Color,
        title: "Color",
        defaultValue: "#999999"
    },
    dateRange: {
        type: ControlType.Boolean,
        title: "Date Range",
        defaultValue: false,
        enabledTitle: "Yes",
        disabledTitle: "No"
    },
    startYear: {
        type: ControlType.Number,
        title: "Start Year",
        min: 1e3,
        max: currentYear,
        defaultValue: currentYear - 2,
        displayStepper: true,
        hidden: ({
            dateRange
        }) => !dateRange
    },
    name: {
        type: ControlType.String,
        title: "Name",
        defaultValue: "Your Name"
    },
    statement: {
        type: ControlType.String,
        title: "Statement",
        defaultValue: "All rights reserved.",
        description: "More components at [Framer University](https://frameruni.link/cc)."
    }
});
export const __FramerMetadata__ = {
    "exports": {
        "default": {
            "type": "reactComponent",
            "name": "AutoCopyright",
            "slots": [],
            "annotations": {
                "framerContractVersion": "1",
                "framerSupportedLayoutHeight": "any-prefer-auto",
                "framerSupportedLayoutWidth": "any-prefer-auto",
                "framerDisableUnlink": "*"
            }
        },
        "__FramerMetadata__": {
            "type": "variable"
        }
    }
}
//# sourceMappingURL=./AutoCopyright_Prod.map