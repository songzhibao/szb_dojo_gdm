package comm.gis.gdm.module.file.util;

import org.springframework.web.multipart.MultipartFile;

import java.io.*;

/**
 * Base64DecodedMultipartFile
 *
 * @author YuanKaiHui
 * @datetime 2022/2/13 11:37
 */
public class Base64DecodedMultipartFile implements MultipartFile {

    private final byte[] imgContent;
    private final String header;

    public Base64DecodedMultipartFile(byte[] imgContent, String header) {
        this.imgContent = imgContent;
        this.header = header.split(";")[0];
    }

    @Override
    public String getName() {
        return System.currentTimeMillis() + Math.random() + "." + header.split("/")[1];
    }

    @Override
    public String getOriginalFilename() {
        return System.currentTimeMillis() + (int) Math.random() * 10000 + "." + header.split("/")[1];
    }

    @Override
    public String getContentType() {
        return header.split(":")[1];
    }

    @Override
    public boolean isEmpty() {
        return imgContent == null || imgContent.length == 0;
    }

    @Override
    public long getSize() {
        return imgContent.length;
    }

    @Override
    public byte[] getBytes() {
        return imgContent;
    }

    @Override
    public InputStream getInputStream() {
        return new ByteArrayInputStream(imgContent);
    }

    @Override
    public void transferTo(File dest) throws IOException, IllegalStateException {
        (new FileOutputStream(dest)).write(imgContent);
    }

}