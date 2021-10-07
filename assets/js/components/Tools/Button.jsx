import React from "react";

export function ButtonIcon(props){
    const { icon, children, text, onClick, element="button", target="_self", tooltipWidth=null } = props;

    let divStyle = tooltipWidth ? { width: tooltipWidth + "px" } : null;

    if(element === "button"){
        return <button className="btn-icon" onClick={onClick}>
            <span className={`icon-${icon}`} />
            {text && <span>{text}</span>}
            {children && <span className="tooltip" style={divStyle}>{children}</span>}
        </button>
    }else{
        return <a className="btn-icon" target={target} href={onClick}>
            <span className={`icon-${icon}`} />
            {text && <span>{text}</span>}
            {children && <span className="tooltip" style={divStyle}>{children}</span>}
        </a>
    }
}

export function Button(props){
    const { icon, type="primary", isSubmit=false, outline=false, children, onClick, element="button", target="_self" } = props;

    if(element === "button"){
        return <button className={`btn btn-${outline ? "outline-" : ""}${type}`} type={isSubmit ? "submit" : ""} onClick={onClick}>
            {icon && <span className={`icon-${icon}`} />}
            <span>{children}</span>
        </button>
    }else{
        return <a className={`btn btn-${outline ? "outline-" : ""}${type}`} target={target} href={onClick}>
            {icon && <span className={`icon-${icon}`} />}
            <span>{children}</span>
        </a>
    }
}

