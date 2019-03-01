(function($){
    $.ajax({
        url: calendar_var.ajaxurl,
        type: 'get',
        data: {
            action: 'reservas',
            // data: {},
        },
        success: function (result) {
            let monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
            let monthNamesCa = ["Gener", "Febrer", "Març", "Abril", "Maig", "Juny", "juliol", "Agost", "Setembre", "Octubre", "Novembre", "Decembre"];
            let currentDate = new Date();
            let currentDay = currentDate.getDate();
            let monthNumber = currentDate.getMonth();
            let currentYear = currentDate.getFullYear();
            let date = document.getElementById('dates');
            let month = document.getElementById('month');
            let month_ca = document.getElementById("month-ca");
            let year = document.getElementById('year');
            let prevMonthDOM = document.getElementById('prev-month');
            let nextMonthDOM = document.getElementById('next-month');
            if (month !== null){
                month.textContent = monthNames[monthNumber];
            } else {
                month_ca.textContent = monthNamesCa[monthNumber];
            }
            year.textContent = currentYear.toString();
            prevMonthDOM.addEventListener('click', () => lastMonth());
            nextMonthDOM.addEventListener('click', () => nextMonth());
            let reserva =  [];
            let reserva_fecha = result.filter(f => {
                if (f.meta_key === '_sln_booking_date'){
                    return f;
                }
            });
            let reserva_hora = result.filter(h => {
                if (h.meta_key === '_sln_booking_duration') {
                    return h;
                }
            });
            for (let i=0; i<reserva_fecha.length; i++){
                let newReserva = {
                    id: reserva_fecha[i].post_id,
                    fecha: reserva_fecha[i].meta_value.split('-'),
                    hora: reserva_hora[i].meta_value.split(':')
                };
                if (reserva_fecha[i].id === reserva_hora[i].id){
                    reserva.push(newReserva);
                }
            }
            let diaMeshoraReserva = reserva.map((d) => {
                totalMin = parseInt((d.hora[0]*60)) + (parseInt(d.hora[1]));
                // return [parseInt(d.fecha[1]-1), parseInt(d.fecha[2]), totalMin];
                return {anio:parseInt(d.fecha[0]),mes:parseInt(d.fecha[1]-1), dia:parseInt(d.fecha[2]), totalM:totalMin};
            });
            function convertMinsToHrsMins(mins) {
                min= 960 - mins;
                let h = Math.floor(min / 60);
                let m = min % 60;
                h = h < 10 ? '0' + h : h;
                m = m < 10 ? '0' + m : m;
                return `${h}:${m}`;
            }
            writeMonth(monthNumber);
            /*
             * Escribimos los dia del mes actual
             * los dias del mes anterior y del mes siguiente
             */
            function writeMonth(month) {
                for (let i = startDay(); i>0; i--){
                    date.innerHTML += `<div class="calendar-date calendar-item calendar-last-day">${getTotalDay(monthNumber-1)-(i-1)}</div>`;
                }
                /* dias del mes actual con reserva*/
                let diasConResrvas= diaMeshoraReserva.map(f => {
                    if (f.mes === month && currentYear === f.anio) {
                        return f.dia;
                    }
                });
                 /*pintar los dia del mes*/
                for (let i=1; i<=getTotalDay(month); i++) {
                    if (diasConResrvas.includes(i)) {
                        let tiempo = 0;
                        let duracion = diaMeshoraReserva.map(f => {
                            if ((currentYear === f.anio) && (f.dia === i) && (month === f.mes)) {
                                return tiempo += f.totalM;
                            }
                        });
                        if (tiempo < 780) {
                            date.innerHTML += `<div class="calendar-date calendar-item calendar-reserva">
                                                <span>${i}</span>
                                                <p>${convertMinsToHrsMins(tiempo)}                                              
                                                h. disponibles</p>
                                                </div>`;
                        }
                        if (tiempo >= 780) {
                            date.innerHTML += `<div class="calendar-date calendar-item calendar-reserva-completa">${i}</div>`;
                        }
                    } else {
                        date.innerHTML += `<div class="calendar-date calendar-item">${i}</div>`;
                    }
                }
            }
            /*
             * Obtener el total de dias
             */
            function getTotalDay(month) {
                if (month === -1) month = 11;
                if (month == 0 || month == 2 || month == 4 || month == 6 || month == 7 || month == 9 || month == 11) {
                    return 31;
                } else if (month == 3 || month == 5 | month == 8 || month == 10) {
                    return 30;
                }else {
                    return isLeap() ? 29 : 28;
                }
            }
            /*
             * Comprobar si el año es bisiesto
             * return true
             */
            function isLeap() {
                return ((currentYear % 100 !== 0) && (currentYear % 4 === 0) || (currentYear % 400 === 0));
            }
            /*
             * Iniciar el dia actual
             * return 1 si es lunes 6 si es domingo
             */
            function startDay() {
                let start = new Date(currentYear, monthNumber, 1);
                return ((start.getDay()-1) === -1) ? 6 : start.getDay()-1;
            }
            /*
             * Pasar al mes anterior
             */
            function lastMonth() {
                let mes = new Date();
                if (monthNumber-1 === mes.getMonth() && currentYear === mes.getFullYear()){
                    $("#prev-month").attr("hidden", "hidden");
                }
                if (monthNumber !== 0) {
                    monthNumber--;
                }else {
                    monthNumber = 11;
                    currentYear--;
                }
                setNewDate();
            }
            /*
             * Pasar al mes siguiente
             */
            function nextMonth() {
                $("#prev-month").removeAttr("hidden", "hidden");
                if (monthNumber !== 11) {
                    monthNumber++;
                }else {
                    monthNumber = 0;
                    currentYear++;
                }
                setNewDate();
            }
            /*
             * Establecemos los dias, los meses y el año actual a devolver
             */
            function setNewDate() {
                currentDate.setFullYear(currentYear, monthNumber, currentDay);
                if (month !== null){
                    month.textContent = monthNames[monthNumber];
                } else {
                    month_ca.textContent = monthNamesCa[monthNumber];
                }
                year.textContent = currentYear.toString();
                date.textContent = '';
                writeMonth(monthNumber);
            }

        }
    })
})(jQuery);