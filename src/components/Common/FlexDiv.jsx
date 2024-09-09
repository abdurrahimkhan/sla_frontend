import React from 'react';


// type FlexDirection = "column" | "inherit" | "-moz-initial" | "initial" | "revert" | "unset" | "column-reverse" | "row" | "row-reverse" | undefined;


export default function FlexDiv({
    children,
    direction = "row",
    justify = "center",
    alignment = "center",
    onClick,
    gapX = 0,
    gapY = 0,
    classes = '',
}) {
    return (
        <div
            onClick={onClick}
            className={`flex ${classes} w-full`} style={{ rowGap: gapY + 'px', columnGap: gapX + 'px', justifyContent: justify, alignItems: alignment, flexDirection: direction }}>
            {children}
        </div>
    )
}