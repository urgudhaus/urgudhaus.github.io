var calendar = {
    WEEKDAYS: [ "So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
    MONTHS: [ "Januar", "Februar", "Maerz", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember" ],
    colorNode: null,
    nextSibling: function(elem) {
        var next = elem.nextSibling;
        if (!next) {
            next = elem.parentNode.firstChild;
        }
        return next;
    },
    nextSiblingNode: function(elem) {
        var next = this.nextSibling(elem);
        while (next.nodeType != 1) {
            next = this.nextSibling(next);
        }
        return next;
    },
    firstColor: function() {
        this.colorNode = document.getElementById("legend").firstChild.nextSibling.firstChild.nextSibling.firstChild;
    },
    nextColor: function() {
        if (this.colorNode == null) {
            this.firstColor();
        } else {
            // alert(this.nextSiblingNode(this.colorNode).outerHTML);
            // alert(this.nextSiblingNode(this.colorNode.parent).outerHTML);
            this.colorNode = this.nextSiblingNode(this.colorNode.parentNode).firstChild;
        }        
    },
    color: function() {
        if (this.colorNode == null) {
            this.firstColor();
        }
        return this.colorNode.getAttribute("class");
    },
    append: function(parent, className, text) {
        var elem = document.createElement("div");
        if (className) {
            elem.setAttribute("class", className);
        }
        if (text) {
            elem.innerHTML = text;
        }
        parent.appendChild(elem);
        return elem;
    },
    label: function(elem, text) {
        elem.innerHTML = text;
        return elem;
    },
    createWeekDay: function(index) {
        return null;
    },
    appendWeekDays: function(parent) {
        var row = this.append(parent, "weekdays");
        var idx = 0;
        for (idx = 0; idx < this.WEEKDAYS.length; idx++) {
            this.append(row, null, this.WEEKDAYS[idx])
        }
        return row;
    },
    appendWeek: function(parent, year, month, day) {
        var maxDay = this.daysInMonth(year, month);
        var row = this.append(parent, "week");
        var weekDayIdx = 0;
        var date = new Date(year, month, day, 0, 1, 0, 0);
        while (weekDayIdx < date.getDay()) {
            this.append(row, "blank", "&nbsp;");
            weekDayIdx++;
        }
        while (weekDayIdx < this.WEEKDAYS.length) {
            if (date.getDay() == 0) {
                this.nextColor();
            }
            var el = this.append(row, this.color(), date.getDate());
            day++;
            if (day > maxDay) {
                return -1;
            }
            date = new Date(year, month, day, 0, 1, 0, 0);
            weekDayIdx++;
        }
        if (day > maxDay) {
            return -1;
        }
        return day;
    },
    daysInMonth: function(year, month) {
        if (month == this.MONTHS.length - 1) {
            year++;
            month = 1;
        } else {
            month++;
        }
        var date = new Date(year, month, 1, 0, 1, 0, 0);
        var millis = date.getTime();
        millis = millis - (1000 * 60 * 60 * 24);
        date = new Date(millis);
        return date.getDate();
    },
    appendMonth: function(parent, monthIndex) {
        var fullmonth = this.append(parent, "fullmonth");
        this.append(fullmonth, "label", this.MONTHS[monthIndex]);
        var month = this.append(fullmonth, "month");
        this.appendWeekDays(month);
        var day = 1;
        while (day != -1) {
            day = this.appendWeek(month, document.getElementById("year").innerHTML, monthIndex, day);
        }
        return fullmonth;
    }
};

window.onload = function() {
    var idx = 0;
    for (idx = 0; idx < 12; idx++) {
        calendar.appendMonth(document.getElementById("calendar"), idx);
    }
};