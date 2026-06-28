const DateUtil = {
  ShortFormat: (date) => {
    if (!date) return;

    return new Intl.DateTimeFormat("id-ID", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  },
};

export default DateUtil;
