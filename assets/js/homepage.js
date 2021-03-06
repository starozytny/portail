import '../css/homepage.scss';

import { Calendar }     from '@fullcalendar/core';
import dayGridPlugin    from '@fullcalendar/daygrid';
import timeGridPlugin   from '@fullcalendar/timegrid';
import listPlugin       from '@fullcalendar/list';
import frLocale         from '@fullcalendar/core/locales/fr'

function addZero (data) {
    return data > 9 ? data : "0" + data;
}

function createStart (start) {
    return start.getFullYear() + "-" + addZero(start.getMonth() + 1) + "-" + addZero(start.getUTCDate()) + "T"
        + addZero(start.getHours()) + ":" + addZero(start.getMinutes()) + ":00"
}

let calendarEl = document.getElementById("calendar");
if(calendarEl){
    let events = [];
    let data = JSON.parse(calendarEl.dataset.donnees);
    if(data){
        data.forEach(el => {
            if(el.inventory.date !== 0){
                let start = new Date(el.inventory.date * 1000);
                events.push({
                    id: el.inventory.id,
                    title: el.property.addr1,
                    start: createStart(start),
                    allDay : false,
                    extendedProps: {
                        start: addZero(start.getHours()) + "h" + addZero(start.getMinutes()),
                        type: parseInt(el.inventory.type) === 0 ? "Sortant" : "Entrant",
                        addr2: el.property.addr2,
                        addr3: el.property.addr3,
                        where: el.property.zipcode + ', ' + el.property.city,
                    },
                    classNames: parseInt(el.inventory.type) === 0 ? "sortant" : "entrant"
                })
            }
        })
    }
    document.addEventListener('DOMContentLoaded', function() {
        let calendar = new Calendar(calendarEl, {
            locale: frLocale,
            plugins: [ dayGridPlugin, timeGridPlugin, listPlugin ],
            initialView: 'listWeek',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'timeGridWeek,listWeek'
            },
            allDayText: '',
            slotMinTime: "07:00:00",
            slotMaxTime: "23:00:00",
            events: events,
            eventMinHeight: 60,
            eventDidMount: function(info) {
                let bloc = info.el;
                bloc.innerHTML = "";

                bloc.insertAdjacentHTML('beforeend', '<div class="title">'+ info.event.extendedProps.start + " - " + info.event.extendedProps.type +'</div>')
                bloc.insertAdjacentHTML('beforeend', '<div class="sub">' + info.event.title + '</div>')
                bloc.insertAdjacentHTML('beforeend', '<div class="sub">' + info.event.extendedProps.addr2 + '</div>')
                bloc.insertAdjacentHTML('beforeend', '<div class="sub">' + info.event.extendedProps.addr3 + '</div>')
                bloc.insertAdjacentHTML('beforeend', '<div class="sub">'+ info.event.extendedProps.where +'</div>')
            },
        });
        calendar.render();
    });

}