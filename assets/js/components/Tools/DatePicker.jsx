import "react-datepicker/dist/react-datepicker.css";

import React from 'react';

import DatePicker                           from "react-datepicker";
import { registerLocale, setDefaultLocale } from  "react-datepicker";
import fr                                   from 'date-fns/locale/fr';

import { ClassiqueStructure }               from "@dashboardComponents/Tools/Fields";

registerLocale('fr', fr)

export function DatePick(props){
    const { identifiant, valeur, onChange, format="dd/MM/yyyy", children, minDate="", maxDate="", placeholder="DD/MM/YYYY", excludeDates=[]} = props

    let content = <DatePicker
        locale="fr"
        autoComplete="off"
        id={identifiant}
        selected={valeur}
        onChange={onChange}
        dateFormat={format}
        peekNextMonth
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        excludeDates={excludeDates}
        placeholderText={placeholder}
        minDate={minDate}
        maxDate={maxDate}
    />
    return (<ClassiqueStructure {...props} content={content} label={children} classForm="form-group-date " />)
}

export function DateTimePick(props){
    const { identifiant, valeur, onChange, format="dd/MM/yyyy HH:mm", children, minDate="", maxDate="",
            placeholder="DD/MM/YYYY HH:MM", timeFormat="HH:mm", timeIntervals=15, excludeDates=[], excludeTimes=[] } = props;

    let content = <DatePicker
        locale="fr"
        autoComplete="off"
        id={identifiant}
        selected={valeur}
        onChange={onChange}
        dateFormat={format}
        timeFormat={timeFormat}
        timeIntervals={timeIntervals}
        peekNextMonth
        showMonthDropdown
        showYearDropdown
        showTimeSelect
        dropdownMode="select"
        excludeDates={excludeDates}
        excludeTimes={excludeTimes}
        placeholderText={placeholder}
        minDate={minDate}
        maxDate={maxDate}
    />
    return (<ClassiqueStructure {...props} content={content} label={children} classForm="form-group-date " />)
}

export function TimePick(props){
    const { identifiant, valeur, onChange, format="HH:mm", children, placeholder="HH:MM", timeFormat="HH:mm",
            timeIntervals=15, caption="Temps", excludeTimes=[] } = props;

    let content = <DatePicker
        locale="fr"
        autoComplete="off"
        id={identifiant}
        selected={valeur}
        onChange={onChange}
        dateFormat={timeFormat}
        timeIntervals={timeIntervals}
        showTimeSelect
        showTimeSelectOnly
        timeCaption={caption}
        dropdownMode="select"
        excludeTimes={excludeTimes}
        placeholderText={placeholder}
    />
    return (<ClassiqueStructure {...props} content={content} label={children} classForm="form-group-date " />)
}
