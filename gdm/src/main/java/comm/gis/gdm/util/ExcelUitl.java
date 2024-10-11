package comm.gis.gdm.util;

import jxl.Sheet;
import jxl.Workbook;
import jxl.format.Alignment;
import jxl.format.UnderlineStyle;
import jxl.format.VerticalAlignment;
import jxl.read.biff.BiffException;
import jxl.write.Label;
import jxl.write.WritableCellFormat;
import jxl.write.WritableFont;
import jxl.write.WritableSheet;
import jxl.write.WritableWorkbook;
import jxl.write.WriteException;

import java.io.*;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletResponse;

public class ExcelUitl {

    /**
     * 查询指定目录中电子表格中所有的数据
     *
     * @param file 文件完整路径
     * @return
     */
    public static List<HashMap<Integer, String>> getAllByExcel(String file) throws IOException, BiffException {
        List<HashMap<Integer, String>> list = new ArrayList<HashMap<Integer, String>>();

        Workbook rwb = Workbook.getWorkbook(new File(file));
        Sheet rs = rwb.getSheet(0);// 或者rwb.getSheet("Test Shee 1")
        int clos = rs.getColumns();// 得到所有的列
        int rows = rs.getRows();// 得到所有的行

        for (int i = 1; i < rows; i++) {
            boolean isEmpty = true;
            HashMap<Integer, String> ht = new HashMap<>();
            for (int j = 0; j < clos; j++) {
                String content = rs.getCell(j, i).getContents();
                if (content != null && !"".equals(content)) {
                    isEmpty = false;
                }
                ht.put(j, content);
            }
            if (!isEmpty) {
                list.add(ht);
            }
        }

        return list;

    }

    /**
     * 读取数据到EXCEL
     *
     * @param fileName
     * @return
     */
    public static boolean writeToExcel(String title, String fileName, List<HashMap<Integer, String>> list,
            List<String> colNameList) throws IOException, WriteException {

        WritableWorkbook wwb = null;

        // 创建可写入的Excel工作簿
        File file = new File(fileName);
        if (!file.exists()) {
            file.createNewFile();
        }
        // 以fileName为文件名来创建一个Workbook
        wwb = Workbook.createWorkbook(file);
        // 创建工作表
        WritableSheet ws = wwb.createSheet("sheet1", 0);
        Integer beginRow = 0;
        if (title != null && !"".equals(title)) {
            WritableFont font1 = new WritableFont(WritableFont.ARIAL, 18, WritableFont.BOLD, false,
                    UnderlineStyle.NO_UNDERLINE, jxl.format.Colour.BLACK);
            WritableCellFormat wf = new WritableCellFormat(font1);

            wf.setAlignment(Alignment.CENTRE); // 水平方向的
            wf.setVerticalAlignment(VerticalAlignment.CENTRE);

            Label titleLable = new Label(0, 0, title, wf);// title显示
            ws.addCell(titleLable);
            ws.mergeCells(0, 0, colNameList.size() - 1, 0);
            beginRow++;
        }

        for (int i = 0; i < colNameList.size(); i++) {
            // 要插入到的Excel表格的行号，默认从0开始
            Label label = new Label(i, beginRow, colNameList.get(i));// 表示第
            ws.addCell(label);
        }

        for (int i = 0; i < list.size(); i++) {

            for (int j = 0; j < list.get(i).size(); j++) {
                Label label_i = new Label(j, i + beginRow + 1, list.get(i).get(j) + "");
                ws.addCell(label_i);
            }
        }

        // 写进文档
        wwb.write();
        // 关闭Excel工作簿对象
        wwb.close();

        return true;

    }

    /**
     * hashMap转excel 并下载
     * 
     * @param response
     * @param list
     * @param colNameList
     */
    public static void downloadExcel(HttpServletResponse response, List<HashMap<Integer, String>> list,
            List<String> colNameList, String title) throws FileNotFoundException, IOException, WriteException {

        // 创建文件名称
        String fileName = UUID.randomUUID() + ".xls";
        // 获取到文件的路径信息
        RequestAttributes requestAttributes = RequestContextHolder.getRequestAttributes();
        ServletRequestAttributes servletRequestAttributes = (ServletRequestAttributes) requestAttributes;
        assert servletRequestAttributes != null;
        String downExcelFile = servletRequestAttributes.getRequest().getServletContext().getRealPath("/")
                + fileName;
        // 写入excel
        boolean isOk = ExcelUitl.writeToExcel(title, downExcelFile, list, colNameList);
        if (isOk) {
            // path是指想要下载的文件的路径
            File file = new File(downExcelFile);

            // 将文件写入输入流
            FileInputStream fileInputStream = null;
            fileInputStream = new FileInputStream(file);

            InputStream fis = new BufferedInputStream(fileInputStream);
            byte[] buffer = new byte[fis.available()];
            fis.read(buffer);
            fis.close();

            // 清空response
            response.reset();
            // 设置response的Header
            response.setCharacterEncoding("UTF-8");
            // Content-Disposition的作用：告知浏览器以何种方式显示响应返回的文件，用浏览器打开还是以附件的形式下载到本地保存
            // attachment表示以附件方式下载 inline表示在线打开 "Content-Disposition: inline;
            // filename=文件名.mp3"
            // filename表示文件的默认名称，因为网络传输只支持URL编码的相关支付，因此需要将文件名URL编码后进行传输,前端收到后需要反编码才能获取到真正的名称
            response.addHeader("Content-Disposition",
                    "attachment;filename=" + URLEncoder.encode(fileName, "UTF-8"));
            // 告知浏览器文件的大小
            response.addHeader("Content-Length", "" + file.length());
            OutputStream outputStream = new BufferedOutputStream(response.getOutputStream());
            // response.setContentType("application/octet-stream");
            response.setContentType("application/vnd.ms-excel;charset=gb2312");
            outputStream.write(buffer);
            outputStream.flush();
        }

    }
}
