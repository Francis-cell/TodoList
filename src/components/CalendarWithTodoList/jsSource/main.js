import moment from "./moment.min.js";
import Utils from "../../../Utils/common.js";

const today = moment();

class Calendar {
    /**
     * 构造方法(要求：当前的年月信息格式必须为：'2023-5')
     * @param selector 选择器，用于绑定页面的div元素
     * @param todoData todoList列表中的记录数据
     * @param currentYearAndMonth 当前的年和月的数据(来自外部传输)
     */
    constructor(selector, todoData, currentYearAndMonth) {
        debugger;
        this.el = document.querySelector(selector);
        // 获取当月的记录(eg: 2023-5)
        todoData.forEach(item => {
           if (item.todoDate === currentYearAndMonth) {
               this.events = item.todoRecord;
           }
        });

        if (!this.current) {
            this.current = [];
        }


        this.current = moment().date(1);
        this.draw();
        let current = document.querySelector('.today');
        if(current) {
            let self = this;
            window.setTimeout(function() {
                self.openDay(current);
            }, 500);
        }
    }

    draw() {
        //Create Header
        this.drawHeader();

        //Draw Month
        this.drawMonth();

        this.drawLegend();
    }

    drawHeader() {
        let self = this;
        if(!this.header) {
            //Create the header elements
            this.header = window.createElements('div', 'header');
            this.header.className = 'header';

            this.title = window.createElements('h1');

            let right = window.createElements('div', 'right');
            right.addEventListener('click', function() { self.nextMonth(); });

            let left = window.createElements('div', 'left');
            left.addEventListener('click', function() { self.prevMonth(); });

            //Append the Elements
            this.header.appendChild(this.title);
            this.header.appendChild(right);
            this.header.appendChild(left);
            this.el.appendChild(this.header);
        }

        this.title.innerHTML = this.current.format('MMMM YYYY');
    }

    drawMonth() {
        let self = this;

        this.events.forEach(item => {
            // 先获取传输过来的日期的值
            if (item.date && Utils.typeOf(item.date) === 'number') {
                let date = item.date;
                item.date = self.current.clone().date(date);
            } else {
                item.date = self.current.clone();
            }
        })

        // this.events.forEach(function(ev) {
        //     ev.date = self.current.clone().date(Math.random() * (29 - 1) + 1);
        // });


        if(this.month) {
            this.oldMonth = this.month;
            this.oldMonth.className = 'month out ' + (self.next ? 'next' : 'prev');
            this.oldMonth.addEventListener('webkitAnimationEnd', function() {
                self.oldMonth.parentNode.removeChild(self.oldMonth);
                self.month = window.createElements('div', 'month');
                self.backFill();
                self.currentMonth();
                self.fowardFill();
                self.el.appendChild(self.month);
                window.setTimeout(function() {
                    self.month.className = 'month in ' + (self.next ? 'next' : 'prev');
                }, 16);
            });
        } else {
            this.month = window.createElements('div', 'month');
            this.el.appendChild(this.month);
            this.backFill();
            this.currentMonth();
            this.fowardFill();
            this.month.className = 'month new';
        }
    }

    backFill() {
        let clone = this.current.clone();
        let dayOfWeek = clone.day();

        if(!dayOfWeek) { return; }

        clone.subtract('days', dayOfWeek+1);

        for(let i = dayOfWeek; i > 0 ; i--) {
            this.drawDay(clone.add('days', 1));
        }
    }

    fowardFill() {
        let clone = this.current.clone().add('months', 1).subtract('days', 1);
        let dayOfWeek = clone.day();

        if(dayOfWeek === 6) { return; }

        for(let i = dayOfWeek; i < 6 ; i++) {
            this.drawDay(clone.add('days', 1));
        }
    }

    currentMonth() {
        let clone = this.current.clone();

        while(clone.month() === this.current.month()) {
            this.drawDay(clone);
            clone.add('days', 1);
        }
    }

    getWeek(day) {
        if(!this.week || day.day() === 0) {
            this.week = window.createElements('div', 'week');
            this.month.appendChild(this.week);
        }
    }

    drawDay(day) {
        let self = this;
        this.getWeek(day);

        //Outer Day
        let outer = window.createElements('div', this.getDayClass(day));
        outer.addEventListener('click', function() {
            self.openDay(this);
        });

        //Day Name
        let name = window.createElements('div', 'day-name', day.format('ddd'));

        //Day Number
        let number = window.createElements('div', 'day-number', day.format('DD'));


        //Events
        let events = window.createElements('div', 'day-events');
        this.drawEvents(day, events);

        outer.appendChild(name);
        outer.appendChild(number);
        outer.appendChild(events);
        this.week.appendChild(outer);
    }

    drawEvents(day, element) {
        if(day.month() === this.current.month()) {
            let todaysEvents = this.events.reduce(function(memo, ev) {
                if(ev.date.isSame(day, 'day')) {
                    memo.push(ev);
                }
                return memo;
            }, []);

            todaysEvents.forEach(function(ev) {
                let evSpan = window.createElements('span', ev.color);
                element.appendChild(evSpan);
            });
        }
    }

    getDayClass(day) {
        let classes = ['day'];
        if(day.month() !== this.current.month()) {
            classes.push('other');
        } else if (today.isSame(day, 'day')) {
            classes.push('today');
        }
        return classes.join(' ');
    }

    openDay(el) {
        let details, arrow;
        let dayNumber = +el.querySelectorAll('.day-number')[0].innerText || +el.querySelectorAll('.day-number')[0].textContent;
        let day = this.current.clone().date(dayNumber);

        let currentOpened = document.querySelector('.details');

        //Check to see if there is an open detais box on the current row
        if(currentOpened && currentOpened.parentNode === el.parentNode) {
            details = currentOpened;
            arrow = document.querySelector('.arrow');
        } else {
            //Close the open events on differnt week row
            //currentOpened && currentOpened.parentNode.removeChild(currentOpened);
            if(currentOpened) {
                currentOpened.addEventListener('webkitAnimationEnd', function() {
                    currentOpened.parentNode.removeChild(currentOpened);
                });
                currentOpened.addEventListener('oanimationend', function() {
                    currentOpened.parentNode.removeChild(currentOpened);
                });
                currentOpened.addEventListener('msAnimationEnd', function() {
                    currentOpened.parentNode.removeChild(currentOpened);
                });
                currentOpened.addEventListener('animationend', function() {
                    currentOpened.parentNode.removeChild(currentOpened);
                });
                currentOpened.className = 'details out';
            }

            //Create the Details Container
            details = window.createElements('div', 'details in');

            //Create the arrow
            arrow = window.createElements('div', 'arrow');

            //Create the event wrapper

            details.appendChild(arrow);
            el.parentNode.appendChild(details);
        }

        let todaysEvents = this.events.reduce(function(memo, ev) {
            if(ev.date.isSame(day, 'day')) {
                memo.push(ev);
            }
            return memo;
        }, []);

        this.renderEvents(todaysEvents, details);

        arrow.style.left = el.offsetLeft - el.parentNode.offsetLeft + 19 + 'px';
    }

    renderEvents(events, ele) {
        //Remove any events in the current details element
        let currentWrapper = ele.querySelector('.events');
        let wrapper = window.createElements('div', 'events in' + (currentWrapper ? ' new' : ''));

        events.forEach(function(ev) {
            let div = window.createElements('div', 'event');
            let square = window.createElements('div', 'event-category ' + ev.color);
            let span = window.createElements('span', '', ev.eventName);

            div.appendChild(square);
            div.appendChild(span);
            wrapper.appendChild(div);
        });

        if(!events.length) {
            let div = window.createElements('div', 'event empty');
            let span = window.createElements('span', '', 'No Events');

            div.appendChild(span);
            wrapper.appendChild(div);
        }

        if(currentWrapper) {
            currentWrapper.className = 'events out';
            currentWrapper.addEventListener('webkitAnimationEnd', function() {
                currentWrapper.parentNode.removeChild(currentWrapper);
                ele.appendChild(wrapper);
            });
            currentWrapper.addEventListener('oanimationend', function() {
                currentWrapper.parentNode.removeChild(currentWrapper);
                ele.appendChild(wrapper);
            });
            currentWrapper.addEventListener('msAnimationEnd', function() {
                currentWrapper.parentNode.removeChild(currentWrapper);
                ele.appendChild(wrapper);
            });
            currentWrapper.addEventListener('animationend', function() {
                currentWrapper.parentNode.removeChild(currentWrapper);
                ele.appendChild(wrapper);
            });
        } else {
            ele.appendChild(wrapper);
        }
    }

    drawLegend() {
        let legend = window.createElements('div', 'legend');
        let calendars = this.events.map(function(e) {
            return e.calendar + '|' + e.color;
        }).reduce(function(memo, e) {
            if(memo.indexOf(e) === -1) {
                memo.push(e);
            }
            return memo;
        }, []).forEach(function(e) {
            let parts = e.split('|');
            let entry = window.createElements('span', 'entry ' +  parts[1], parts[0]);
            legend.appendChild(entry);
        });
        this.el.appendChild(legend);
    }

    // 获取下个月的信息
    nextMonth() {
        this.current.add('months', 1);
        this.next = true;

        // 将“currentYearAndMonth”调整成上个月


        this.draw();
    }

    // 获取上个月的信息
    prevMonth() {
        this.current.subtract('months', 1);
        this.next = false;

        // 将“currentYearAndMonth”调整成下个月


        this.draw();
    }
}

export default {
    // 生成一个Calendar示例
    calendar(id, data, currentYearAndMonth) {
        window.Calendar = Calendar;
        
        window.createElements = this.createElement;

        new Calendar(id, data, currentYearAndMonth);
    },

    createElement(tagName, className, innerText) {
        let ele = document.createElement(tagName);
        if(className) {
            ele.className = className;
        }
        if(innerText) {
            ele.innderText = ele.textContent = innerText;
        }
        return ele;
    }
}