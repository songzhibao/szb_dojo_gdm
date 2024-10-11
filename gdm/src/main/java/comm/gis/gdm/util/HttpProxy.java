package comm.gis.gdm.util;

import org.apache.commons.codec.binary.Base64;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;

/**
 * @author dailingang @since 2018-07-11 17:00
 *         desc: rest请求通用方法
 */
public class HttpProxy {

    /**
     * http请求POST方法
     *
     * @param url  地址
     * @param para 请求
     * @return 返回
     * @throws IOException 错误
     */
    public static String post(String url, String para) throws IOException {
        HttpURLConnection conn = (HttpURLConnection) new URL(url).openConnection();
        conn.setRequestMethod("POST");
        conn.setDoOutput(true);
        conn.setAllowUserInteraction(false);
        conn.setRequestProperty("Content-Type", "application/json");

        OutputStream outputStream = conn.getOutputStream();
        outputStream.write(para.getBytes(StandardCharsets.UTF_8));
        outputStream.flush();

        BufferedReader bReader = new BufferedReader(new InputStreamReader(conn.getInputStream()));
        String line;
        StringBuilder resultStr = new StringBuilder();
        while (null != (line = bReader.readLine())) {
            resultStr.append("\n").append(line);
        }
        bReader.close();
        conn.disconnect();

        return new String(resultStr.toString().getBytes(), StandardCharsets.UTF_8);

    }

    /**
     * http请求GET方法
     *
     * @param url 地址
     * @return 返回
     * @throws IOException 错误
     */
    public static String UploadData(String url) throws IOException {

        URL restURL = new URL(url);
        HttpURLConnection conn = (HttpURLConnection) restURL.openConnection();
        conn.setRequestMethod("GET");
        conn.setDoOutput(true);
        conn.setAllowUserInteraction(false);
        conn.setRequestProperty("Content-Type", "application/json");

        BufferedReader bReader = new BufferedReader(new InputStreamReader(conn.getInputStream()));
        String line;
        StringBuilder resultStr = new StringBuilder();
        while (null != (line = bReader.readLine())) {
            resultStr.append(line);
        }
        bReader.close();
        conn.disconnect();

        return new String(resultStr.toString().getBytes(), StandardCharsets.UTF_8);
    }

    /**
     * http请求POST方法
     *
     * @param url  地址
     * @param para 请求
     * @return 返回
     * @throws IOException 错误
     */
    public String UploadData_Post(String url, String para) throws IOException {

        URL restURL = new URL(url);
        HttpURLConnection conn = (HttpURLConnection) restURL.openConnection();
        conn.setRequestMethod("POST");
        conn.setDoOutput(true);
        conn.setAllowUserInteraction(false);
        conn.setRequestProperty("Content-Type", "application/json");

        OutputStream outputStream = conn.getOutputStream();
        outputStream.write(para.getBytes(StandardCharsets.UTF_8));
        outputStream.flush();

        BufferedReader bReader = new BufferedReader(new InputStreamReader(conn.getInputStream()));
        String line;
        StringBuilder resultStr = new StringBuilder();
        while (null != (line = bReader.readLine())) {
            resultStr.append("\n").append(line);
        }
        bReader.close();
        conn.disconnect();

        return new String(resultStr.toString().getBytes(), StandardCharsets.UTF_8);

    }

    public String UploadData_Post_ES_Autorization(String url, String para, String esUsername, String esPassword)
            throws IOException {

        URL restURL = new URL(url);
        HttpURLConnection conn = (HttpURLConnection) restURL.openConnection();
        conn.setRequestMethod("POST");
        conn.setDoOutput(true);
        conn.setAllowUserInteraction(false);
        conn.setRequestProperty("Content-Type", "application/json");

        byte[] key = (esUsername + ":" + esPassword).getBytes();
        conn.setRequestProperty("authorization", "Basic " + new String(Base64.encodeBase64(key)));

        OutputStream outputStream = conn.getOutputStream();
        outputStream.write(para.getBytes(StandardCharsets.UTF_8));
        outputStream.flush();

        BufferedReader bReader = new BufferedReader(new InputStreamReader(conn.getInputStream()));
        String line;
        StringBuilder resultStr = new StringBuilder();
        while (null != (line = bReader.readLine())) {
            resultStr.append("\n").append(line);
        }
        bReader.close();
        conn.disconnect();

        return new String(resultStr.toString().getBytes(), StandardCharsets.UTF_8);

    }

    /**
     * http请求DELETE方法
     *
     * @param url 地址
     * @return 返回
     * @throws IOException 错误
     */
    public String UploadData_Delete(String url) throws IOException {

        URL restURL = new URL(url);
        HttpURLConnection conn = (HttpURLConnection) restURL.openConnection();
        conn.setRequestMethod("DELETE");
        conn.setDoOutput(true);
        conn.setAllowUserInteraction(false);
        conn.setRequestProperty("Content-Type", "application/json");

        BufferedReader bReader = new BufferedReader(new InputStreamReader(conn.getInputStream()));
        String line;
        StringBuilder resultStr = new StringBuilder();
        while (null != (line = bReader.readLine())) {
            resultStr.append(line);
        }
        bReader.close();
        conn.disconnect();
        return new String(resultStr.toString().getBytes(), StandardCharsets.UTF_8);

    }

    public static boolean CheckSqlInjection(Object queryVO) {
        return false;
        // try {
        // Method[] methods = queryVO.getClass().getDeclaredMethods();
        // for (int i = 0; i < methods.length; i++) {
        // String name = methods[i].getName(); //获取属性的名字
        // String type = methods[i].getGenericReturnType().toString(); //获取属性的类型
        // if (methods[i].getParameterCount() == 0 &&
        // methods[0].toString().indexOf("public") == 0) {
        // if (type.equals("class java.lang.String")) {
        // Method m = queryVO.getClass().getMethod(methods[i].getName());
        // String value = (String) m.invoke(queryVO);
        // if (value != null) {
        // if (CheckSqlInjectionForString(value)) {
        // return true;
        // }
        // }
        // } else if (type.equals("java.util.List<java.lang.String>")) {
        // Method m = queryVO.getClass().getMethod(methods[i].getName());
        // List<String> value = (List<String>) m.invoke(queryVO);
        // if (value != null) {
        // if (CheckSqlInjectionForStringList(value)) {
        // return true;
        // }
        // }
        // }
        // }
        //
        //
        // }
        // } catch (Exception ex) {
        // String s = ex.getMessage();
        // }
        // return false;
    }
}
