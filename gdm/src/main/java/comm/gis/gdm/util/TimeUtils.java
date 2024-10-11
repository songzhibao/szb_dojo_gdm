package comm.gis.gdm.util;

import lombok.extern.slf4j.Slf4j;

import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

/**
 * 时间转换工具类
 *
 * @author DLG
 */
@Slf4j
public class TimeUtils {

    final static SimpleDateFormat idFormat = new SimpleDateFormat("yyyyMMddHHmmss");
    final static SimpleDateFormat sdfDate = new SimpleDateFormat("yyyy-MM-dd");
    private static Integer num = 1000;
    private static Object lockObj = new Object();

    public static String getTimeId() {
        synchronized (lockObj) {
            if (num >= 9999) {
                num = 0;
            } else {
                num++;
            }
            return idFormat.format(currentDateTime()) + num;
        }
    }

    public static Long getIntegerId() {
        synchronized (lockObj) {
            if (num >= 9999) {
                num = 0;
            } else {
                num++;
            }
            return Long.valueOf(idFormat.format(currentDateTime())) + num;
        }
    }

    public static Timestamp currentTimestamp() {
        return new Timestamp(new Date().getTime());
    }

    public static Date currentDateTime() {
        return new Date();
    }

    public static String currentDateTimeString() {
        return convertDate2String(new Date());
    }

    public static String currentDateString() {
        return formatDate(new Date());
    }

    public static String formatDate(Date date) {
        return sdfDate.format(date);
    }

    /**
     * unix时间戳转日期格式
     *
     * @return String
     */
    public static String convertUnixtime2Date(Long time) {
        Date date = new Date(time);
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        return format.format(date);
    }

    /**
     * 日期格式转unix时间戳
     *
     * @param time
     * @return Long
     */
    public static Long convertDate2Unixtime(Date time) {
        return time.getTime();
    }

    /**
     * 日期字符串转unix时间
     *
     * @param time
     * @return Long
     */
    public static Long convertDate2Unixtime(String time) {
        try {
            String str;
            SimpleDateFormat date_time = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            date_time.setTimeZone(TimeZone.getTimeZone("GMT+8:00"));
            Date date = date_time.parse(time);
            long ts = date.getTime();
            str = String.valueOf(ts);
            return Long.parseLong(str);
        } catch (Exception e) {

            log.error(e.getLocalizedMessage(), e);
        }
        return null;
    }

    public static Long getUnixTimestamp(String time) {
        return convertDate2Unixtime(time);
    }

    /**
     * 字符串转时间
     *
     * @param time 时间字符串
     * @return 时间
     */
    public static Date convertString2Date(String time) {
        try {
            SimpleDateFormat date_time = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            return date_time.parse(time);
        } catch (Exception e) {
            log.error(e.getLocalizedMessage(), e);
        }
        return null;
    }

    /**
     * 字符串转时间
     *
     * @param time 时间字符串
     * @return 时间
     */
    public static String convertDate2String(Date time) {
        try {
            SimpleDateFormat date_time = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            return date_time.format(time);
        } catch (Exception e) {
            log.error(e.getLocalizedMessage(), e);
        }
        return null;
    }

    /**
     * 返回时间
     *
     * @param time        时间点
     * @param compareType 对比模式 1：同比 ； 2：环比；
     * @param flag        时间标记 是开始 还是结束 1 开始 2 结束
     * @param otherTime   另一个时间点
     * @return 返回时间
     */
    public static Long getCompareTime(Long time, Long otherTime, String compareUnit, String compareType, String flag) {
        try {
            int period = 1;
            Calendar calstart = Calendar.getInstance();
            calstart.setFirstDayOfWeek(Calendar.MONDAY);
            calstart.setMinimalDaysInFirstWeek(7);
            calstart.set(Calendar.DAY_OF_WEEK, Calendar.MONDAY);
            calstart.setTimeInMillis(time);
            Long newTime = calstart.getTimeInMillis();
            if (period == (long) 0) {
                return time;
            }
            if (compareType.equals("1")) { // 同比
                switch (compareUnit) {
                    case "4": // 年
                        calstart.add(Calendar.YEAR, -1 * period);
                        break;
                    case "3": // 月
                        calstart.add(Calendar.YEAR, -1 * period);
                        break;
                    case "2": // 周
                        if (flag.equals("1")) {
                            calstart.add(Calendar.YEAR, 1);
                        } else {
                            calstart.add(Calendar.YEAR, -1);
                        }
                        int weekNo = calstart.get(Calendar.WEEK_OF_YEAR);
                        calstart.add(Calendar.YEAR, -1 * period);
                        calstart.setWeekDate(calstart.get(Calendar.YEAR), weekNo, 2);// 获得指定年的第几周的开始日期

                        calstart.set(Calendar.HOUR_OF_DAY, 0);
                        calstart.set(Calendar.MINUTE, 0);
                        calstart.set(Calendar.SECOND, 0);
                        calstart.set(Calendar.MILLISECOND, 0);
                        long rtime = 0;
                        if (flag.equals("1")) {
                            rtime = calstart.getTimeInMillis(); // .getTime().getTime();//创建日期的时间该周的第一天，
                        } else {
                            calstart.add(Calendar.DAY_OF_MONTH, 7);
                            rtime = calstart.getTimeInMillis();
                        }
                        return rtime;
                    case "1": // 天
                        calstart.add(Calendar.DAY_OF_MONTH, -1 * period);
                        break;
                    default: // 自定义
                        calstart.add(Calendar.YEAR, -1 * period);
                        break;
                }
            } else { // 环比
                switch (compareUnit) {
                    case "4": // 年
                        calstart.add(Calendar.YEAR, -1 * period);
                        break;
                    case "3": // 月
                        calstart.add(Calendar.MONTH, -1 * period);
                        break;
                    case "2": // 周
                        calstart.add(Calendar.DAY_OF_MONTH, -7);
                        break;
                    case "1": // 天
                        calstart.add(Calendar.DAY_OF_MONTH, -1 * period);
                        break;
                    default: // 自定义
                        if (time > otherTime) {
                            long days = (time - otherTime) / (1000 * 3600 * 24);
                            if (days < 1) {
                                days = 1;
                            }
                            calstart.add(Calendar.DAY_OF_MONTH, (int) (-1 * days * period));
                        } else {
                            long days = (otherTime - time) / (1000 * 3600 * 24);
                            if (days < 1) {
                                days = 1;
                            }
                            calstart.add(Calendar.DAY_OF_MONTH, (int) (-1 * days * period));
                        }
                        break;
                }
            }
            newTime = calstart.getTimeInMillis();
            return newTime;
        } catch (Exception e) {
            log.error(e.getLocalizedMessage(), e);
        }
        return time;
    }

    /**
     * 计算同环比时间
     *
     * @param startTime
     * @param endTime
     * @param compareUnit (1-年，2-月，3-周，4-自定义)
     * @param compareType
     */
    public static List<String> getCompareTime(String startTime, String endTime, String compareUnit,
            String compareType) {
        try {
            SimpleDateFormat date_time = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            Calendar calendar1 = Calendar.getInstance();
            Calendar calendar2 = Calendar.getInstance();
            List<String> result = new ArrayList<>();
            switch (compareUnit) {
                case "1":
                    SimpleDateFormat date_year = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                    Date year_date = date_year.parse(startTime);
                    Calendar caleYear = Calendar.getInstance();
                    caleYear.setTime(year_date);
                    caleYear.add(Calendar.YEAR, -1);
                    caleYear.set(Calendar.DAY_OF_YEAR, 1);// 获取开始时间当年的第一天
                    String startTimeYear = date_year.format(caleYear.getTime());

                    year_date = date_year.parse(endTime);
                    caleYear = Calendar.getInstance();
                    caleYear.setTime(year_date);
                    caleYear.add(Calendar.YEAR, -1);

                    String endTimeYear = date_year.format(caleYear.getTime());
                    result.add(startTimeYear);
                    result.add(endTimeYear);
                    break;
                case "2":
                    SimpleDateFormat date_month = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                    Date month_date = date_month.parse(startTime);
                    Calendar caleMonth = Calendar.getInstance();
                    caleMonth.setTime(month_date);
                    caleMonth.set(Calendar.DAY_OF_MONTH, 1);// 获取开始时间当月的第一天

                    if ("1".equals(compareType)) {
                        caleMonth.add(Calendar.YEAR, -1);
                        String startTimeMonth = date_month.format(caleMonth.getTime());

                        month_date = date_month.parse(endTime);
                        caleMonth.setTime(month_date);
                        String endTimeMonth = date_month.format(caleMonth.getTime());
                        result.add(startTimeMonth);
                        result.add(endTimeMonth);
                    } else if ("2".equals(compareType)) {
                        caleMonth.add(Calendar.MONTH, -1);
                        String startTimeMonth = date_month.format(caleMonth.getTime());

                        month_date = date_month.parse(endTime);
                        caleMonth.setTime(month_date);
                        caleMonth.add(Calendar.MONTH, -1);
                        String endTimeMonth = date_month.format(caleMonth.getTime());
                        result.add(startTimeMonth);
                        result.add(endTimeMonth);
                    }
                    break;
                case "3":
                    Date fromDate1 = date_time.parse(startTime);
                    Date toDate1 = date_time.parse(endTime);
                    calendar1.setTime(fromDate1);
                    calendar2.setTime(toDate1);
                    if ("1".equals(compareType)) {
                        calendar1.add(Calendar.YEAR, -1);
                        calendar2.add(Calendar.YEAR, -1);
                    } else if ("2".equals(compareType)) {
                        calendar1.add(Calendar.WEEK_OF_YEAR, -1);
                        calendar2.add(Calendar.WEEK_OF_YEAR, -1);
                    }
                    String dateCur1 = date_time.format(calendar1.getTime());
                    String dateCur2 = date_time.format(calendar2.getTime());
                    result.add(dateCur1);
                    result.add(dateCur2);
                    break;
                case "4":
                    Date fromDate2 = date_time.parse(startTime);
                    Date toDate2 = date_time.parse(endTime);
                    calendar1.setTime(fromDate2);
                    calendar2.setTime(toDate2);
                    if ("1".equals(compareType)) {
                        calendar1.add(Calendar.YEAR, -1);
                        calendar2.add(Calendar.YEAR, -1);
                    } else if ("2".equals(compareType)) {
                        long from = fromDate2.getTime();
                        long to = toDate2.getTime();
                        int mins = (int) ((to - from) / (1000 * 60));
                        calendar1.add(Calendar.MINUTE, -1 * mins);
                        calendar2.add(Calendar.MINUTE, -1 * mins);
                    }
                    String dateCur3 = date_time.format(calendar1.getTime());
                    String dateCur4 = date_time.format(calendar2.getTime());
                    result.add(dateCur3);
                    result.add(dateCur4);
                    break;
                default:
                    break;
            }
            return result;
        } catch (Exception e) {
            log.error(e + "@" + e.getStackTrace()[0]);
        }
        return null;
    }

    /**
     * 计算时间差
     *
     * @param startTime
     * @param endTime
     * @param type      时间类型（1-时，2-天）
     */
    public static Integer calTimeRange(String startTime, String endTime, String type) {
        try {
            SimpleDateFormat date_time = new SimpleDateFormat("yyyy-MM-dd HH");
            Date fromDate = date_time.parse(startTime);
            Date toDate = date_time.parse(endTime);
            long from = fromDate.getTime();
            long to = toDate.getTime();
            switch (type) {
                case "1":
                    return (int) ((to - from) / (1000 * 60 * 60)) + 1;
                case "2":
                    return (int) ((to - from) / (1000 * 60 * 60 * 24));
            }
        } catch (Exception e) {
            log.error(e.getLocalizedMessage(), e);
        }
        return null;
    }

    /**
     * 计算(昨日)同比时间
     *
     * @param time     当前时间
     * @param amount   偏移量
     * @param timeUnit 时间维度（1-分，2-时，3，天）
     */
    public static String calTime(String time, String timeUnit, Integer amount) {
        try {
            SimpleDateFormat date_time = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            Date date = date_time.parse(time);
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(date);
            switch (timeUnit) {
                case "1":
                    calendar.add(Calendar.MINUTE, amount);
                    break;
                case "2":
                    calendar.add(Calendar.HOUR, amount);
                    break;
                case "3":
                    calendar.add(Calendar.DAY_OF_MONTH, amount);
                    break;
            }
            Date curTime = calendar.getTime();
            return date_time.format(curTime);

        } catch (Exception e) {
            log.error(e.getLocalizedMessage(), e);
        }
        return null;
    }

    /**
     * 计算同比时间
     *
     * @param time
     * @param compareType 1-同比，2-环比
     */
    public static String calCompareTime(String time, String compareType) {
        try {
            SimpleDateFormat date_time = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            Date date = date_time.parse(time);
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(date);
            switch (compareType) {
                case "1":
                    calendar.add(Calendar.YEAR, -1);
                    break;
                case "2":
                    calendar.add(Calendar.MONTH, -1);
                    break;
                default:
                    break;
            }
            Date curTime = calendar.getTime();
            return date_time.format(curTime);
        } catch (Exception e) {
            log.error(e.getLocalizedMessage(), e);
        }
        return null;
    }

    /**
     * 计算环比时间
     * 
     * @param time 当前时间
     * 
     */
    // public static List<String> calTime2(String startTime,String endTime){
    // try {
    // SimpleDateFormat start_time=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    // Date start=start_time.parse(startTime);
    // Calendar calendarStart = Calendar.getInstance();
    // calendarStart.setTime(start);
    //
    // SimpleDateFormat end_time=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    // Date end=end_time.parse(endTime);
    //
    // long startMin=start.getTime();
    // long endMin=end.getTime();
    // int aLong=(int) ((endMin-startMin)/(1000*60));
    // calendarStart.add(Calendar.MINUTE, aLong*(-1));
    // Date newStart=calendarStart.getTime();
    // Date newEnd=start;
    // List<String> result=new ArrayList<String>();
    // result.add(start_time.format(newStart));
    // result.add(start_time.format(newEnd));
    //
    // return result;
    //
    // } catch (Exception e) {
    // log.error(e.getLocalizedMessage(),e);
    // }
    // return null;
    // }

    /**
     * 获取小时索引
     */
    public static Integer getHourIndex(String time) {
        try {
            SimpleDateFormat date_time = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            Date date = date_time.parse(time);
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(date);
            return calendar.get(Calendar.HOUR_OF_DAY);
        } catch (Exception e) {
            log.error(e.getLocalizedMessage(), e);
        }
        return null;
    }

    /**
     * 根据起始小时获取小时索引
     */
    public static Integer getHourIndexBy(Integer startHourIndex, Integer index) {
        if (startHourIndex + index < 24) {
            return startHourIndex + index;
        } else {
            return startHourIndex + index - 24;
        }

    }

    /**
     * String 以"yyyy-MM-dd HH:mm:ss" 转换为 LocalDateTime
     *
     * @param time 字符串时间
     * @return LocalDateTime
     */
    public static LocalDateTime getLocalDateTime(String time) {
        DateTimeFormatter df = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        LocalDateTime ldt = LocalDateTime.parse(time, df);
        return ldt;
    }

    /**
     * LocalDateTime 以"yyyy-MM-dd HH:mm:ss" 转换为 String
     *
     * @param time LocalDateTime
     * @return String
     */
    public static String getStringTime(LocalDateTime time) {
        DateTimeFormatter df = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        String localTimeStr = df.format(time);
        return localTimeStr;
    }

    /**
     * 计算专题总周期数
     * 
     * @param periodType 周期类型
     * @param year       年份配置
     * @param date       日期配置
     * @return
     */
    public static int getTotalPeriodCount(String periodType, String year, String date) {
        int periodTotal = 0;
        String[] yearArray = year.split("-");
        if (yearArray.length > 0) {
            int yearCount = (Integer.parseInt(yearArray[1]) - Integer.parseInt(yearArray[0]) + 1);
            switch (periodType) {
                case "1":// 年
                    periodTotal = yearCount;
                    break;
                case "2":// 季度
                    periodTotal = yearCount * 4;
                    break;
                case "3":// 月度
                    periodTotal = yearCount * 12;
                    break;
                case "4":// 周
                    periodTotal = yearCount * 52;
                    break;
                case "5":// 日
                    periodTotal = yearCount * 365;
                    break;
            }
            return periodTotal;
        } else {
            return 0;
        }

    }

    /**
     * 获取时间差
     *
     * @param smallTime 小时间
     * @param bigTime   大时间
     * @param unit      单位：second、minute、hour、day 默认返回毫秒
     * @return 时间差
     */
    public static Long getTimeDifference(String smallTime, String bigTime, String unit) throws ParseException {
        Long difference = null;
        SimpleDateFormat sf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

        Date smallDate = sf.parse(smallTime);
        Date bigDate = sf.parse(bigTime);
        long millisecond = bigDate.getTime() - smallDate.getTime();
        switch (unit) {
            case "second":// 秒
                difference = millisecond / 1000;
                break;
            case "minute":// 分
                difference = millisecond / (1000 * 60);
                break;
            case "hour":// 时
                difference = millisecond / (1000 * 3600);
                break;
            case "day":// 天
                difference = millisecond / (1000 * 3600 * 24);
                break;
            default:
                difference = millisecond;
                break;
        }
        return difference;
    }

    public static Date dateAddSubtract(String date, int amount, String unit) throws ParseException {
        SimpleDateFormat sf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        return dateAddSubtract(sf.parse(date), amount, unit);
    }

    /**
     * 日期加减
     *
     * @param date   日期
     * @param amount 数量
     * @param unit   单位 例如：day、hour、min、second
     * @return 日期
     */
    public static Date dateAddSubtract(Date date, int amount, String unit) {
        Calendar cal = new GregorianCalendar();
        cal.setTime(date);
        switch (unit) {
            case "day":
                cal.add(Calendar.DAY_OF_MONTH, amount);
                break;
            case "hour":
                cal.add(Calendar.HOUR_OF_DAY, amount);
                break;
            case "min":
                cal.add(Calendar.MINUTE, amount);
                break;
            case "second":
                cal.add(Calendar.SECOND, amount);
                break;
            default:
                break;
        }
        return cal.getTime();
    }

}
