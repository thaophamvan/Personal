import Modal from "../Modal/Modal";

export default class MaintenanceModal {
  constructor(selector) {
    this.component = selector;
    this.modal = new Modal(selector, () => this.countDownInterval && clearInterval(this.countDownInterval));
    this.countDownDaysHoursMinutes = this.component.querySelector('.js_maintenance-modal_countdown-days-hours-minutes');
    this.countDownMinutesSeconds = this.component.querySelector('.js_maintenance-modal_countdown-minutes-seconds');

    this.startCountDown();
  }

  startCountDown = () => {
    const maintenanceMillisecond = this.component.dataset.maintenanceStartTimeInMillisecond;

    if (!maintenanceMillisecond) {
      return;
    }

    const second = 1000,
          minute = second * 60,
          hour = minute * 60,
          day = hour * 24;

    this.countDownInterval = setInterval(() => {
      const remainingMillisecond = maintenanceMillisecond - new Date().getTime();

      if (remainingMillisecond < 0) {
        clearInterval(this.countDownInterval);
        return;
      }

      const remainingDays = Math.floor(remainingMillisecond / day),
            remainingHours = Math.floor((remainingMillisecond % (day)) / (hour)),
            remainingMinutes = Math.floor((remainingMillisecond % (hour)) / (minute)),
            remainingSeconds = Math.floor((remainingMillisecond % (minute)) / second);

      this.countDownMinutesSeconds.innerText = `${remainingHours > 0 ? `${remainingHours.toLocaleString([], { minimumIntegerDigits: 2 })}:` : ""}${remainingMinutes.toLocaleString([], { minimumIntegerDigits: 2 })}:${remainingSeconds.toLocaleString([], { minimumIntegerDigits: 2 })}`;

      if (this.countDownDaysHoursMinutes.innerText) {
        return;
      }

      let remainingLabel = "";

      if (remainingDays > 0) {
        remainingLabel = `${remainingDays} day(s)`;
      } else if (remainingHours > 0) {
        remainingLabel = `${remainingHours} hour(s)`;
      } else {
        remainingLabel = `${remainingMinutes} minute(s)`;
      }

      this.countDownDaysHoursMinutes.innerText = remainingLabel;

      this.modal.openModal();
    }, 1000);
  }
}