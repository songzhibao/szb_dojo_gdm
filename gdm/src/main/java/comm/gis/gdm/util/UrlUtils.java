package comm.gis.gdm.util;

import java.util.*;
import org.apache.commons.lang3.StringUtils;

import com.alibaba.fastjson.*;

public class UrlUtils {

    /*
     * 字符串参数转为 Map对象
     */
    public static Map<String, String> getParamsMap(String param) {
        if (JSON.isValid(param)) {
            return JSON.parseObject(param, new TypeReference<Map<String, String>>() {
            });
        } else {
            return getUrlParams(param);
        }
    }

    /*
     * 将url参数转换成map
     */
    public static Map<String, String> getUrlParams(String param) {
        Map<String, String> map = new HashMap<String, String>();

        if (StringUtils.isBlank(param)) {
            return map;
        }
        String[] params = param.split("&");
        for (int i = 0; i < params.length; i++) {
            String[] p = params[i].split("=");
            if (p.length == 2) {
                map.put(p[0], p[1]);
            }
        }
        return map;
    }

    /*
     * 将map转换成url
     */
    public static String getUrlParamsByMap(Map<String, String> map) {
        if (map == null) {
            return "";
        }
        StringBuffer sb = new StringBuffer();
        for (Map.Entry<String, String> entry : map.entrySet()) {
            sb.append(entry.getKey() + "=" + entry.getValue());
            sb.append("&");
        }
        String s = sb.toString();
        if (s.endsWith("&")) {
            s = StringUtils.substringBeforeLast(s, "&");
        }
        return s;
    }

}
