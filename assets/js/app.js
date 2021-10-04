import '../css/app.scss';

import toastr from 'toastr';
import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import frLocale from '@fullcalendar/core/locales/fr'

toastr.options = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": true,
    "progressBar": true,
    "positionClass": "toast-top-right",
    "preventDuplicates": true,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut",
    "escapeHtml": false,
}

function addZero (data){
    return data > 9 ? data : "0" + data;
}

function createStart (start)
{
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
            initialView: 'timeGridWeek',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,listWeek'
            },
            slotMinTime: "08:30:00",
            slotMaxTime: "21:30:00",
            events: events,
            eventMinHeight: 60,
            eventDidMount: function(info) {
                let bloc = info.el;
                bloc.innerHTML = "";

                bloc.insertAdjacentHTML('beforeend', '<div class="title">'+ info.event.extendedProps.start + " - " + info.event.extendedProps.type +'</div>')
                bloc.insertAdjacentHTML('beforeend', '<div class="sub">' + info.event.title + '</div>')
                bloc.insertAdjacentHTML('beforeend', '<div class="sub">'+ info.event.extendedProps.where +'</div>')
            },
        });
        calendar.render();
    });

}