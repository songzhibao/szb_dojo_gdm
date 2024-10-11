package comm.gis.gdm.module.file.domain;

import lombok.Data;

/**
 * @author: qihui date: 2021/02/02
 *          desc: 上传fastDFS文件参数
 */
@Data
public class FileInfo {

    /**
     * 文件id
     */
    private String id;

    /**
     * 文件名称
     */
    private String fileName;

    /**
     * 文件大小
     */
    private String fileSize;

    /**
     * fastDFS文件下载路径
     */
    private String fileId;

    /**
     * 视频和图片路径缩略图路径
     */
    private String imagepath;

    /**
     * 内网下载地址
     */
    private String indownloadaddr;

    /**
     * 外网下载地址
     */
    private String outdownloadaddr;

    /**
     * 文件下载次数
     */
    private int fileDownLoadCount;

    /**
     * 创建时间
     */
    private String createTime;

    /**
     * 文件下载全地址
     */
    private String path;

    /**
     * 视频旋转角度
     */
    private String rotate;

    /**
     * 二维码地址
     */
    private String qrpath;

    /**
     * 上传ip地址
     */
    private String srcIpAddr;

    /**
     * 文件类型
     */
    private String type;

    /**
     * 上传系统
     */
    private String uploadSystem;

    /**
     * 上传用户
     */
    private String uploadUser;

}
