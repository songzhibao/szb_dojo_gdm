package comm.gis.gdm.module.file.service;

import java.util.*;
import comm.gis.gdm.module.file.domain.*;

public interface FileService {
    /*
     * 根据附件ids获取附件列表
     */
    List<FileInfoEntity> getAttachmentListByIds(List<String> ids);

    /*
     * 根据关联id获取附件列表
     */
    List<FileInfoEntity> getAttachmentListByRelationId(String relationId);

    /*
     * 根据文件ID删除文件
     */
    Boolean deleteFileById(String fileId);

    /*
     * 保存附件信息
     */
    Boolean saveAttachmentInfo(FileInfoEntity param);
}
