package comm.gis.gdm.module.file.util;

import com.alibaba.fastjson.JSONObject;

import comm.gis.gdm.module.file.domain.FileInfo;

import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.entity.mime.content.FileBody;
import org.apache.http.entity.mime.content.StringBody;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.text.DecimalFormat;
import java.util.*;

/**
 * @author virgil
 * @datetime 2021/8/20 16:46
 */
public class FileUtils {

    // 上传到门户文件上传系统
    public static List<FileInfo> uploadFilePortal(File file, String user, String serverIp) {
        // return new List<FileInfo>();
        CloseableHttpClient httpclient = HttpClients.createDefault();
        try {
            String uri = serverIp + "/fastdfs/upload_file";
            HttpPost httppost = new HttpPost(uri);

            // 上传人（必填）
            String uploadUser = user != null ? user : "admin";
            // 上传系统（必填)
            String uploadSystem = "zhjmxf";
            // 上传ip地址（必填）
            String srcIpAddr = "127.0.0.1";
            // 需要进行音频转换添加此项，可选
            // String transter="wav";
            // 需要进行視頻截图添加此项，可选
            // String screenshots="jpg";
            // File file1 = transferToFile(file);
            FileBody bin = new FileBody(file);
            StringBody user2 = new StringBody(uploadUser, ContentType.TEXT_PLAIN);
            StringBody uploadSystem2 = new StringBody(uploadSystem, ContentType.TEXT_PLAIN);
            StringBody srcIpAddr2 = new StringBody(srcIpAddr, ContentType.TEXT_PLAIN);
            HttpEntity reqEntity = MultipartEntityBuilder.create().addPart("files", bin).addPart("uploadUser", user2)
                    .addPart("uploadSystem", uploadSystem2).addPart("srcIpAddr", srcIpAddr2).build();

            httppost.setEntity(reqEntity);
            CloseableHttpResponse response = httpclient.execute(httppost);
            HttpEntity resEntity = response.getEntity();
            if (resEntity != null) {
                String a = EntityUtils.toString(resEntity);
                // 转换为对象返回
                JSONObject fileResult = JSONObject.parseObject(a);
                List<FileInfo> fileInfos = JSONObject.parseArray(fileResult.getString("dataStore"), FileInfo.class);
                return fileInfos;
            }
        } catch (Exception ex) {
            System.out.println("exception occurs uploadFile" + ex.getMessage());
        } finally {
            if (httpclient != null) {
                try {
                    httpclient.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
        return null;
    }

    public static File transferToFile(MultipartFile multipartFile) throws IOException {
        // 选择用缓冲区来实现这个转换即使用java 创建的临时文件 使用 MultipartFile.transferto()方法,
        // createTempFile方法文件名长度需要大于3，所以增加了gis前缀

        String originalFilename = multipartFile.getOriginalFilename();
        String[] filename = originalFilename.split("\\.");
        File file = File.createTempFile("gis" + filename[0], "." + filename[filename.length - 1]);
        multipartFile.transferTo(file);
        file.deleteOnExit();

        return file;
    }

    public static byte[] readByByteArrayOutputStream(File file) throws IOException {
        checkFileExists(file);
        // 传统IO方式
        // 1、定义一个Byte字节数组输出流，设置大小为文件大小
        // 2、将打开的文件输入流转换为Buffer输入流，循环 读取buffer输入流到buffer[]缓冲，并
        // 3、将目标输出流转换为字节数组。
        ByteArrayOutputStream bos = new ByteArrayOutputStream((int) file.length());
        BufferedInputStream bin = null;
        try {
            bin = new BufferedInputStream(new FileInputStream(file));
            byte[] buffer = new byte[1024];
            while (bin.read(buffer) > 0) {
                bos.write(buffer);
            }
            return bos.toByteArray();
        } finally {
            closeInputStream(bin);
            closeOutputStream(bos);
        }
    }

    private static void checkFileExists(File file) throws FileNotFoundException {
        if (file == null || !file.exists()) {
            System.err.println("file is not null or exist !");
            throw new FileNotFoundException(file.getName());
        }
    }

    private static void closeInputStream(InputStream bos) {
        try {
            bos.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static void closeOutputStream(OutputStream bos) {
        try {
            bos.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * base64转MultipartFile
     *
     * @param base64
     * @return
     */
    public static MultipartFile base64ToMultipart(String base64) {
        String[] baseStrs = base64.split(",");
        // BASE64Decoder decoder = new BASE64Decoder();
        byte[] b;
        b = Base64.getDecoder().decode(baseStrs[1]);
        for (int i = 0; i < b.length; ++i) {
            if (b[i] < 0) {
                b[i] += 256;
            }
        }
        return new Base64DecodedMultipartFile(b, baseStrs[0]);
    }

    /**
     * url文件保存至本地
     *
     * @param urlStr
     * @param path
     * @return
     * @throws Exception
     */
    public static Boolean urlSaveToFile(String urlStr, String path) throws IOException, Exception {

        URL url = new URL(urlStr);
        // 打开链接
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        // 设置请求方式为"GET"
        conn.setRequestMethod("GET");
        // 超时响应时间为5秒
        conn.setConnectTimeout(5 * 1000);
        // 通过输入流获取图片数据
        InputStream inStream = conn.getInputStream();
        // 得到图片的二进制数据，以二进制封装得到数据，具有通用性
        byte[] data = readInputStream(inStream);
        // new一个文件对象用来保存图片，默认保存当前工程根目录
        File imageFile = new File(path);
        // 创建输出流
        FileOutputStream outStream = new FileOutputStream(imageFile);
        // 写入数据
        outStream.write(data);
        // 关闭输出流
        outStream.close();

        return true;
    }

    private static byte[] readInputStream(InputStream inStream) throws Exception {
        ByteArrayOutputStream outStream = new ByteArrayOutputStream();
        // 创建一个Buffer字符串
        byte[] buffer = new byte[1024];
        // 每次读取的字符串长度，如果为-1，代表全部读取完毕
        int len = 0;
        // 使用一个输入流从buffer里把数据读取出来
        while ((len = inStream.read(buffer)) != -1) {
            // 用输出流往buffer里写入数据，中间参数代表从哪个位置开始读，len代表读取的长度
            outStream.write(buffer, 0, len);
        }
        // 关闭输入流
        inStream.close();
        // 把outStream里的数据写入内存
        return outStream.toByteArray();
    }

    /**
     * 文件转base64
     *
     * @param file
     * @return
     */
    public static String fileToBase64(File file) {
        byte[] fileBytes = null;
        FileInputStream fis = null;
        try {
            fis = new FileInputStream(file);
            fileBytes = new byte[(int) file.length()];
            fis.read(fileBytes);
            fis.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return Base64.getEncoder().encodeToString(fileBytes);
    }

    /**
     * 根据路径删除指定的目录，无论存在与否
     *
     * @param sPath 要删除的目录path
     * @return 删除成功返回 true，否则返回 false。
     */
    public static boolean DeleteFolder(String sPath) {
        boolean flag = false;
        File file = new File(sPath);
        // 判断目录或文件是否存在
        if (!file.exists()) { // 不存在返回 false
            return flag;
        } else {
            // 判断是否为文件
            if (file.isFile()) { // 为文件时调用删除文件方法
                return deleteFile(sPath);
            } else { // 为目录时调用删除目录方法
                return deleteDirectory(sPath);
            }
        }
    }

    /**
     * 删除单个文件
     *
     * @param sPath 被删除文件path
     * @return 删除成功返回true，否则返回false
     */
    public static boolean deleteFile(String sPath) {
        boolean flag = false;
        File file = new File(sPath);
        // 路径为文件且不为空则进行删除
        if (file.isFile() && file.exists()) {
            file.delete();
            flag = true;
        }
        return flag;
    }

    /**
     * 删除目录以及目录下的文件
     *
     * @param sPath 被删除目录的路径
     * @return 目录删除成功返回true，否则返回false
     */
    public static boolean deleteDirectory(String sPath) {
        // 如果sPath不以文件分隔符结尾，自动添加文件分隔符
        if (!sPath.endsWith(File.separator)) {
            sPath = sPath + File.separator;
        }
        File dirFile = new File(sPath);
        // 如果dir对应的文件不存在，或者不是一个目录，则退出
        if (!dirFile.exists() || !dirFile.isDirectory()) {
            return false;
        }
        boolean flag = true;
        // 删除文件夹下的所有文件(包括子目录)
        File[] files = dirFile.listFiles();
        for (int i = 0; i < files.length; i++) {
            // 删除子文件
            if (files[i].isFile()) {
                flag = deleteFile(files[i].getAbsolutePath());
                if (!flag)
                    break;
            } // 删除子目录
            else {
                flag = deleteDirectory(files[i].getAbsolutePath());
                if (!flag)
                    break;
            }
        }
        if (!flag)
            return false;
        // 删除当前目录
        if (dirFile.delete()) {
            return true;
        } else {
            return false;
        }
    }

    public static String formatFileSize(long fileS) {
        DecimalFormat df = new DecimalFormat("#.00");

        String fileSizeString = "";

        String wrongSize = "0B";
        if (fileS == 0) {
            return wrongSize;

        }
        if (fileS < 1024) {
            fileSizeString = df.format((double) fileS) + "B";

        } else if (fileS < 1048576) {
            fileSizeString = df.format((double) fileS / 1024) + "KB";

        } else if (fileS < 1073741824) {
            fileSizeString = df.format((double) fileS / 1048576) + "MB";

        } else {
            fileSizeString = df.format((double) fileS / 1073741824) + "GB";

        }
        return fileSizeString;

    }
}
