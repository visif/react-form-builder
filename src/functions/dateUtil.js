
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import buddhistEra from 'dayjs/plugin/buddhistEra';

dayjs.extend(utc);
dayjs.extend(buddhistEra);

const keyDateFormat = "setting_date_format";
const keyCalendarType = "setting_calendar_type";

const dateFormatList = {
  "dd MMMM yyyy": "DD MMMM YYYY",
  "dd-MMM-yyyy": "DD-MMM-YYYY",
  "dd-MMM-yy": "DD-MMM-YY",
  "yyyy-MM-dd": "YYYY-MM-DD",
  "MM/dd/yyyy": "MM/DD/YYYY",
  "dd/MM/yyyy": "DD/MM/YYYY",
  "MMM dd, yyyy": "MMM DD, YYYY",
};

export const getDateFormat = () => {
  const key = dateFormatList[localStorage.getItem(keyDateFormat)];
  return key || "DD MMMM YYYY";
};

export const getCalendarType = () => {
  var key = localStorage.getItem(keyCalendarType);
  return key || "EN";
};

export const formatDate = (date) => {
  if (!date) return "";;
  
  if (getCalendarType() === "EN") {
    return dayjs(date).utc(true).format(getDateFormat());
  } else {
    // Convert to Buddhist calendar (add 543 years)
    return dayjs(date).utc(true).getDateFormat().replace('YYYY', 'BBBB');
  }
}
